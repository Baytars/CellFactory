#!/usr/bin/env node
/**
 * server.js — CellFactory 游戏服务器
 *
 * 功能：
 *   1. 静态文件服务（替代 http-server）
 *   2. POST /api/preload       — 触发 KEGG 数据刷新
 *   3. GET  /api/status        — 查询本地数据状态
 *   4. GET  /api/preload/progress — SSE 实时进度
 *
 * 用法:
 *   node server.js          # 默认端口 8000
 *   node server.js 3000     # 自定义端口
 *
 * 零外部依赖，只用 Node.js 内置模块。
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { fetchAndSave, getLocalStatus, PATHWAY_CONFIG } = require('./lib/bio_data_fetcher');

// ─── 配置 ─────────────────────────────────────

const PORT = parseInt(process.argv[2]) || 8000;
const ROOT_DIR = __dirname;
const INDEX_FILE = 'index.html';

// MIME 类型映射
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
};

// ─── 预加载状态管理 ──────────────────────────────

let preloadState = {
  running: false,    // 是否正在运行
  lastResult: null,  // 上次结果
  lastError: null,   // 上次错误
  startTime: null,   // 开始时间
};

// SSE 客户端列表
const sseClients = new Set();

function broadcastSSE(event, data) {
  const msg = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of sseClients) {
    try { res.write(msg); } catch (_) { sseClients.delete(res); }
  }
}

// ─── 路由处理 ────────────────────────────────────

/**
 * 处理 API 请求
 */
function handleAPI(req, res, urlPath) {
  // GET /api/status — 查询本地数据状态
  if (req.method === 'GET' && urlPath === '/api/status') {
    const status = getLocalStatus();
    const payload = {
      ...status,
      preloadRunning: preloadState.running,
      lastResult: preloadState.lastResult,
      lastError: preloadState.lastError,
      availablePathways: Object.keys(PATHWAY_CONFIG).map(id => ({
        id,
        name: PATHWAY_CONFIG[id].name,
        nameEn: PATHWAY_CONFIG[id].nameEn,
        reactionCount: PATHWAY_CONFIG[id].coreReactions.length,
      })),
    };
    return sendJSON(res, 200, payload);
  }

  // GET /api/preload/progress — SSE 实时进度
  if (req.method === 'GET' && urlPath === '/api/preload/progress') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });
    res.write(`event: connected\ndata: {"message":"SSE connected"}\n\n`);
    sseClients.add(res);
    req.on('close', () => sseClients.delete(res));
    return;
  }

  // POST /api/preload — 触发数据刷新
  if (req.method === 'POST' && urlPath === '/api/preload') {
    // 防止重复触发
    if (preloadState.running) {
      return sendJSON(res, 409, { error: '预加载正在进行中', startTime: preloadState.startTime });
    }

    preloadState.running = true;
    preloadState.startTime = new Date().toISOString();
    preloadState.lastError = null;

    // 立即返回，后台执行
    sendJSON(res, 202, { message: '预加载已启动', startTime: preloadState.startTime });

    // 后台异步执行
    fetchAndSave({
      onProgress(event, data) {
        // 通过 SSE 广播进度
        broadcastSSE(event, {
          ...data,
          timestamp: Date.now(),
        });
      },
    })
    .then(summary => {
      preloadState.running = false;
      preloadState.lastResult = { ...summary, completedAt: new Date().toISOString() };
      broadcastSSE('done', preloadState.lastResult);
    })
    .catch(err => {
      preloadState.running = false;
      preloadState.lastError = { message: err.message, at: new Date().toISOString() };
      broadcastSSE('error', preloadState.lastError);
    });

    return;
  }

  // 未知 API 路由
  sendJSON(res, 404, { error: '未知的 API 路由' });
}

/**
 * 处理静态文件请求
 */
function handleStatic(req, res, urlPath) {
  // 根路径 → index.html
  let filePath = urlPath === '/'
    ? path.join(ROOT_DIR, INDEX_FILE)
    : path.join(ROOT_DIR, urlPath);

  // 安全检查：防止路径穿越
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(ROOT_DIR)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  // 文件不存在
  if (!fs.existsSync(resolved) || fs.statSync(resolved).isDirectory()) {
    res.writeHead(404);
    return res.end('Not Found');
  }

  // 读取并发送
  const ext = path.extname(resolved).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  try {
    const content = fs.readFileSync(resolved);
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': ext === '.json' ? 'no-cache' : 'public, max-age=3600',
    });
    res.end(content);
  } catch (e) {
    res.writeHead(500);
    res.end('Internal Server Error');
  }
}

// ─── 工具函数 ────────────────────────────────────

function sendJSON(res, statusCode, data) {
  const body = JSON.stringify(data, null, 2);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(body);
}

// ─── 启动服务器 ──────────────────────────────────

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const urlPath = url.pathname;

  // CORS 预检
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  // API 路由
  if (urlPath.startsWith('/api/')) {
    return handleAPI(req, res, urlPath);
  }

  // 静态文件
  return handleStatic(req, res, urlPath);
});

server.listen(PORT, () => {
  console.log('🧬 CellFactory 游戏服务器');
  console.log('━'.repeat(50));

  // 检查数据状态
  const status = getLocalStatus();
  if (status.available) {
    console.log(`📦 本地数据: ${status.pathways} 通路, ${status.reactions} 反应, ${status.compounds} 化合物`);
  } else {
    console.log('⚠️  本地无数据 — 访问游戏后点击"刷新数据"或在游戏中触发预加载');
  }

  console.log(`\n🌐 打开浏览器访问: http://localhost:${PORT}`);
  console.log(`📡 API 端点:`);
  console.log(`   GET  /api/status            — 数据状态`);
  console.log(`   POST /api/preload           — 触发数据刷新`);
  console.log(`   GET  /api/preload/progress  — SSE 实时进度`);
  console.log('');
});
