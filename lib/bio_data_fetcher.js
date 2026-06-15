/**
 * bio_data_fetcher.js — KEGG 数据获取核心模块
 *
 * 可被以下场景复用：
 *   1. CLI: node scripts/preload_bio_data.js
 *   2. 服务器: server.js 调用 fetchAndSave()
 *
 * 零外部依赖，只用 Node.js 内置模块。
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data', 'bio');
const KEGG_BASE = 'https://rest.kegg.jp';
const REQUEST_INTERVAL = 600; // ms，尊重 KEGG 速率限制

// ─── HTTP 请求 ──────────────────────────────────

function keggGet(urlPath) {
  const url = `${KEGG_BASE}/${urlPath}`;
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'CellFactory/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', (e) => resolve(''));
    req.setTimeout(30000, () => { req.destroy(); resolve(''); });
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ─── KEGG 文本解析 ──────────────────────────────

function parseKeggFields(text) {
  const fields = {};
  let currentField = '';
  let currentValue = '';
  for (const line of text.split('\n')) {
    if (!line) continue;
    if (/^[A-Z]/.test(line)) {
      if (currentField) fields[currentField] = currentValue.trim();
      const match = line.match(/^([A-Z_]+)\s+(.*)/);
      currentField = match ? match[1] : '';
      currentValue = match ? match[2] : '';
    } else {
      currentValue += '\n' + line;
    }
  }
  if (currentField) fields[currentField] = currentValue.trim();
  return fields;
}

function parseReaction(text) {
  const fields = parseKeggFields(text);
  const entry = fields.ENTRY || '';
  const match = entry.match(/^(R\d+)/);
  if (!match) return null;
  const rid = match[1];
  const definition = (fields.DEFINITION || '').trim();
  const equation = (fields.EQUATION || '').trim();
  const name = (fields.NAME || '').trim();
  const enzymeStr = (fields.ENZYME || '').trim();
  const enzymes = enzymeStr ? enzymeStr.split(/\s+/).filter(e => /^\d/.test(e)) : [];
  const compoundIds = [...new Set(equation.match(/C\d+/g) || [])];
  const sides = equation.split('<=>');
  const substrateIds = sides[0] ? (sides[0].match(/C\d+/g) || []) : [];
  const productIds = sides[1] ? (sides[1].match(/C\d+/g) || []) : [];
  return {
    id: rid, name, definition, equation, enzymes,
    compoundIds, substrateIds, productIds,
    isReversible: equation.includes('<=>'),
  };
}

function parseCompound(text) {
  const fields = parseKeggFields(text);
  const entry = fields.ENTRY || '';
  const match = entry.match(/^(C\d+)/);
  if (!match) return null;
  const cid = match[1];
  const nameStr = (fields.NAME || '').trim().replace(/;$/, '');
  const names = nameStr.split(';').map(n => n.trim()).filter(Boolean);
  return {
    id: cid,
    name: names[0] || cid,
    names,
    formula: (fields.FORMULA || '').trim(),
    exactMass: (fields.EXACT_MASS || '').trim(),
    molWeight: (fields.MOL_WEIGHT || '').trim(),
  };
}

// ─── 批量获取 ────────────────────────────────────

async function fetchReactionsBatch(reactionIds, onProgress) {
  const results = [];
  const batchSize = 10;
  for (let i = 0; i < reactionIds.length; i += batchSize) {
    const batch = reactionIds.slice(i, i + batchSize);
    if (onProgress) onProgress(`fetch_reactions`, i, reactionIds.length, batch);
    const text = await keggGet(`get/${batch.join('+')}`);
    if (!text) continue;
    const entries = text.split('///\n');
    for (const entry of entries) {
      if (entry.trim()) {
        const r = parseReaction(entry);
        if (r) results.push(r);
      }
    }
    if (i + batchSize < reactionIds.length) await sleep(REQUEST_INTERVAL);
  }
  return results;
}

async function fetchCompoundsBatch(compoundIds, onProgress) {
  const results = [];
  const batchSize = 10;
  for (let i = 0; i < compoundIds.length; i += batchSize) {
    const batch = compoundIds.slice(i, i + batchSize);
    if (onProgress) onProgress(`fetch_compounds`, i, compoundIds.length, batch);
    const text = await keggGet(`get/${batch.join('+')}`);
    if (!text) continue;
    const entries = text.split('///\n');
    for (const entry of entries) {
      if (entry.trim()) {
        const c = parseCompound(entry);
        if (c) results.push(c);
      }
    }
    if (i + batchSize < compoundIds.length) await sleep(REQUEST_INTERVAL);
  }
  return results;
}

// ─── 游戏化辅助 ──────────────────────────────────

function compoundEmoji(name) {
  const n = name.toLowerCase();
  if (n.includes('atp')) return '💰';
  if (n.includes('adp')) return '💵';
  if (n.includes('nadh')) return '⚡';
  if (n.includes('nad+') || n.includes('nadp')) return '🔋';
  if (n.includes('glucose')) return '🍬';
  if (n.includes('pyruvate')) return '🔥';
  if (n.includes('phosphate') || n.includes('phospho')) return '💎';
  if (n.includes('water') || n.includes('h2o')) return '💧';
  if (n.includes('coenzyme') || n.includes('coa')) return '🟡';
  if (n.includes('lactate')) return '🥛';
  if (n.includes('citrate')) return '🍋';
  if (n.includes('fumarate') || n.includes('succinate')) return '🔷';
  if (n.includes('oxaloacetate')) return '🟤';
  return '🧪';
}

function compoundColor(name) {
  const n = name.toLowerCase();
  if (n.includes('atp')) return '#ff6b35';
  if (n.includes('adp')) return '#e8a838';
  if (n.includes('nadh')) return '#06d6a0';
  if (n.includes('nad+') || n.includes('nadp')) return '#4ecdc4';
  if (n.includes('glucose')) return '#f4a261';
  if (n.includes('pyruvate')) return '#e76f51';
  if (n.includes('phosphate') || n.includes('phospho')) return '#8d99ae';
  if (n.includes('water') || n.includes('h2o')) return '#5e60ce';
  if (n.includes('coenzyme') || n.includes('coa')) return '#e9c46a';
  return '#7a8ba8';
}

function buildGameReaction(reaction, compoundMap, stepConfig = {}) {
  const subs = reaction.substrateIds.map(sid => {
    const c = compoundMap[sid] || { id: sid, name: sid, formula: '' };
    return { id: c.id, name: c.name || sid, formula: c.formula || '', emoji: compoundEmoji(c.name || ''), color: compoundColor(c.name || '') };
  });
  const prods = reaction.productIds.map(pid => {
    const c = compoundMap[pid] || { id: pid, name: pid, formula: '' };
    return { id: c.id, name: c.name || pid, formula: c.formula || '', emoji: compoundEmoji(c.name || ''), color: compoundColor(c.name || '') };
  });
  return {
    id: reaction.id, keggId: reaction.id, name: reaction.name,
    definition: reaction.definition, equation: reaction.equation,
    enzymes: reaction.enzymes, substrates: subs, products: prods,
    isReversible: reaction.isReversible,
    isRateLimiting: stepConfig.isRateLimiting || false,
    gameStep: stepConfig.gameStep || null,
    enzymeName: stepConfig.enzymeName || null,
  };
}

// ============================================
//  通路配置 — 定义游戏需要哪些通路
// ============================================

const PATHWAY_CONFIG = {
  'map00010': {
    name: '糖酵解 / 糖异生',
    nameEn: 'Glycolysis / Gluconeogenesis',
    coreReactions: [
      { id: 'R00299', enzymeName: '己糖激酶 (Hexokinase)', gameStep: 1, isRateLimiting: false },
      { id: 'R00771', enzymeName: '磷酸葡萄糖异构酶 (PGI)', gameStep: 2, isRateLimiting: false },
      { id: 'R04779', enzymeName: '磷酸果糖激酶-1 (PFK-1) ★限速', gameStep: 3, isRateLimiting: true },
      { id: 'R01070', enzymeName: '醛缩酶 (Aldolase)', gameStep: 4, isRateLimiting: false },
      { id: 'R01015', enzymeName: '磷酸丙糖异构酶 (TPI)', gameStep: 5, isRateLimiting: false },
      { id: 'R01061', enzymeName: 'GAP脱氢酶 (GAPDH)', gameStep: 6, isRateLimiting: false },
      { id: 'R01512', enzymeName: '磷酸甘油酸激酶 (PGK)', gameStep: 7, isRateLimiting: false },
      { id: 'R01518', enzymeName: '磷酸甘油酸变位酶 (PGM)', gameStep: 8, isRateLimiting: false },
      { id: 'R00658', enzymeName: '烯醇化酶 (Enolase)', gameStep: 9, isRateLimiting: false },
      { id: 'R00200', enzymeName: '丙酮酸激酶 (PK) ★限速', gameStep: 10, isRateLimiting: true },
    ],
  },
  // 后续扩展：
  // 'map00020': { name: '三羧酸循环', nameEn: 'TCA Cycle', coreReactions: [...] },
  // 'map00190': { name: '氧化磷酸化', nameEn: 'Oxidative Phosphorylation', coreReactions: [...] },
};

// ─── 核心：获取并保存数据 ─────────────────────────

/**
 * 从 KEGG 获取数据并保存为本地 JSON
 *
 * @param {Object} options
 * @param {Function} [options.onProgress] - 进度回调 (event, data) => void
 *   event: 'start' | 'pathway_start' | 'fetch_reactions' | 'fetch_compounds'
 *          | 'pathway_done' | 'saving' | 'done' | 'error'
 * @param {Object} [options.pathwayConfig] - 自定义通路配置，默认用 PATHWAY_CONFIG
 * @returns {Object} 结果摘要
 */
async function fetchAndSave(options = {}) {
  const { onProgress, pathwayConfig } = options;
  const config = pathwayConfig || PATHWAY_CONFIG;

  const emit = (event, data) => {
    if (onProgress) onProgress(event, data);
  };

  try {
    emit('start', { pathwayCount: Object.keys(config).length });

    fs.mkdirSync(DATA_DIR, { recursive: true });

    const allReactions = {};
    const allCompounds = {};
    const pathwaysOutput = {};

    for (const [pathwayId, pconfig] of Object.entries(config)) {
      emit('pathway_start', { id: pathwayId, name: pconfig.name });

      // 1. 获取核心反应
      const coreConfigs = pconfig.coreReactions;
      const coreIds = coreConfigs.map(rc => rc.id);
      const reactions = await fetchReactionsBatch(coreIds, (phase, offset, total, batch) => {
        emit('fetch_reactions', { pathwayId, offset, total, batch });
      });

      // 2. 收集所有化合物ID
      const allCompoundIds = new Set();
      for (const r of reactions) {
        for (const cid of r.compoundIds) allCompoundIds.add(cid);
      }

      // 3. 获取化合物信息
      const compounds = await fetchCompoundsBatch([...allCompoundIds], (phase, offset, total, batch) => {
        emit('fetch_compounds', { pathwayId, offset, total, batch });
      });
      const compoundMap = {};
      for (const c of compounds) compoundMap[c.id] = c;

      // 4. 存入总数据
      for (const r of reactions) allReactions[r.id] = r;
      for (const c of compounds) allCompounds[c.id] = c;

      // 5. 构建游戏格式
      const gameReactions = [];
      for (const rc of coreConfigs) {
        const raw = allReactions[rc.id];
        if (raw) {
          gameReactions.push(buildGameReaction(raw, compoundMap, rc));
        }
      }

      pathwaysOutput[pathwayId] = {
        id: pathwayId, name: pconfig.name, nameEn: pconfig.nameEn,
        reactions: gameReactions,
      };

      emit('pathway_done', { id: pathwayId, name: pconfig.name, reactionCount: gameReactions.length });
    }

    // 6. 保存 JSON
    emit('saving', { files: ['pathways.json', 'reactions.json', 'compounds.json', 'glycolysis.json'] });

    const files = {
      'pathways.json': pathwaysOutput,
      'reactions.json': allReactions,
      'compounds.json': allCompounds,
      'glycolysis.json': pathwaysOutput['map00010'] || {},
    };

    for (const [filename, data] of Object.entries(files)) {
      const filepath = path.join(DATA_DIR, filename);
      fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
    }

    const summary = {
      pathways: Object.keys(pathwaysOutput).length,
      reactions: Object.keys(allReactions).length,
      compounds: Object.keys(allCompounds).length,
    };

    emit('done', summary);
    return summary;

  } catch (e) {
    emit('error', { message: e.message });
    throw e;
  }
}

/**
 * 读取当前本地数据的摘要信息（不触发网络请求）
 */
function getLocalStatus() {
  try {
    const status = { available: false, pathways: 0, reactions: 0, compounds: 0, files: {} };

    const filesToCheck = ['pathways.json', 'reactions.json', 'compounds.json', 'glycolysis.json'];
    for (const f of filesToCheck) {
      const fp = path.join(DATA_DIR, f);
      if (fs.existsSync(fp)) {
        const stat = fs.statSync(fp);
        const data = JSON.parse(fs.readFileSync(fp, 'utf-8'));
        status.files[f] = {
          size: stat.size,
          modified: stat.mtime.toISOString(),
        };
        if (f === 'pathways.json') status.pathways = Object.keys(data).length;
        if (f === 'reactions.json') status.reactions = Object.keys(data).length;
        if (f === 'compounds.json') status.compounds = Object.keys(data).length;
      }
    }

    status.available = status.pathways > 0;
    return status;
  } catch (e) {
    return { available: false, error: e.message };
  }
}

// ─── 导出 ──────────────────────────────────────

module.exports = {
  fetchAndSave,
  getLocalStatus,
  PATHWAY_CONFIG,
  DATA_DIR,
};
