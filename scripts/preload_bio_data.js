#!/usr/bin/env node
/**
 * preload_bio_data.js — CLI 入口
 *
 * 用法:
 *   node scripts/preload_bio_data.js
 *
 * 核心逻辑在 lib/bio_data_fetcher.js，本文件只负责 CLI 输出格式化。
 */

const { fetchAndSave, getLocalStatus } = require('../lib/bio_data_fetcher');

async function main() {
  console.log('🧬 CellFactory 数据预加载工具');
  console.log('━'.repeat(50));

  // 显示当前数据状态
  const before = getLocalStatus();
  if (before.available) {
    console.log(`📦 当前数据: ${before.pathways} 通路, ${before.reactions} 反应, ${before.compounds} 化合物`);
  } else {
    console.log('📦 当前无本地数据');
  }

  console.log('\n📡 开始从 KEGG 获取数据...\n');

  const summary = await fetchAndSave({
    onProgress(event, data) {
      switch (event) {
        case 'start':
          console.log(`${'='.repeat(50)}`);
          console.log(`🚀 开始加载 ${data.pathwayCount} 个通路`);
          console.log('='.repeat(50));
          break;

        case 'pathway_start':
          console.log(`\n📡 加载通路: ${data.id} — ${data.name}`);
          break;

        case 'fetch_reactions':
          console.log(`  获取反应 ${data.offset + 1}-${Math.min(data.offset + data.batch.length, data.total)} / ${data.total}`);
          break;

        case 'fetch_compounds':
          console.log(`  获取化合物 ${data.offset + 1}-${Math.min(data.offset + data.batch.length, data.total)} / ${data.total}`);
          break;

        case 'pathway_done':
          console.log(`  ✅ ${data.name}: ${data.reactionCount} 个反应已处理`);
          break;

        case 'saving':
          console.log(`\n💾 保存文件: ${data.files.join(', ')}`);
          break;

        case 'done':
          console.log(`\n${'='.repeat(50)}`);
          console.log('📊 数据摘要');
          console.log('='.repeat(50));
          console.log(`  通路数: ${data.pathways}`);
          console.log(`  反应数: ${data.reactions}`);
          console.log(`  化合物数: ${data.compounds}`);
          break;

        case 'error':
          console.error(`  ❌ 错误: ${data.message}`);
          break;
      }
    },
  });

  console.log('\n✅ 全部完成！运行 `node server.js` 即可启动游戏。');
}

main().catch(e => { console.error('❌ 运行失败:', e); process.exit(1); });
