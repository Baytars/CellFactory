import { useState, useEffect } from 'react';
import { useBioData } from '../../context/BioDataContext';
import ss from '../../styles/components/shared.module.css';

export default function DataSyncPanel() {
  const { bioData, loading } = useBioData();
  const [refreshing, setRefreshing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('点击"检查状态"查看当前数据情况');
  const [logs, setLogs] = useState([]);

  const addLog = (msg) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${time}] ${msg}`]);
  };

  const checkStatus = async () => {
    if (!bioData) return;
    setStatusText('⏳ 查询中...');
    try {
      const status = await bioData.getStatus();
      if (status.available) {
        setStatusText(`✅ 本地数据可用: ${status.pathways} 通路, ${status.reactions} 反应, ${status.compounds} 化合物`);
      } else {
        setStatusText('⚠️ 本地无数据，请点击"从 KEGG 刷新"获取');
      }
    } catch (e) {
      setStatusText('⚠️ 无法连接服务器 — 请使用 node server.js 启动游戏');
    }
  };

  const refreshData = async () => {
    if (!bioData || refreshing) return;
    setRefreshing(true);
    setProgress(5);
    setLogs([]);
    setStatusText('⏳ 正在启动数据刷新...');
    addLog('🚀 开始刷新');

    try {
      await bioData.refreshData({
        onProgress(event, data) {
          switch (event) {
            case 'start':
              addLog(`开始加载 ${data.pathwayCount} 个通路`);
              setProgress(10);
              break;
            case 'pathway_start':
              addLog(`加载通路: ${data.name}`);
              setStatusText(`📡 正在获取: ${data.name}`);
              setProgress(20);
              break;
            case 'fetch_reactions':
              const rPct = Math.round((data.offset / data.total) * 30) + 20;
              setProgress(rPct);
              addLog(`  获取反应 ${data.offset + 1}/${data.total}`);
              break;
            case 'fetch_compounds':
              const cPct = Math.round((data.offset / data.total) * 30) + 50;
              setProgress(cPct);
              addLog(`  获取化合物 ${data.offset + 1}/${data.total}`);
              break;
            case 'pathway_done':
              addLog(`✅ ${data.name}: ${data.reactionCount} 个反应已处理`);
              setProgress(75);
              break;
            case 'saving':
              addLog('💾 保存到本地 JSON...');
              setProgress(90);
              setStatusText('💾 保存中...');
              break;
          }
        },
        onComplete(summary) {
          setProgress(100);
          setStatusText(`✅ 刷新完成！${summary.pathways} 通路, ${summary.reactions} 反应, ${summary.compounds} 化合物`);
          addLog('✅ 全部完成！数据已重新加载');
          setRefreshing(false);
        },
        onError(error) {
          setStatusText(`❌ 刷新失败: ${error.message}`);
          addLog(`❌ 错误: ${error.message}`);
          setRefreshing(false);
        },
      });
    } catch (e) {
      setStatusText('⚠️ 无法连接服务器 — 请使用 node server.js 启动');
      addLog('⚠️ 服务器未响应');
      setRefreshing(false);
    }
  };

  return (
    <div className={ss.dataSyncPanel}>
      <div className={ss.dataSyncHeader}>
        <span className={ss.dataSyncTitle}>📡 数据同步</span>
        <div className={ss.dataSyncButtons}>
          <button
            onClick={checkStatus}
            style={{
              fontSize: 11, padding: '6px 14px',
              background: 'rgba(78,205,196,0.1)', color: 'var(--mineral)',
              border: '1px solid var(--border)', borderRadius: 25, cursor: 'pointer',
            }}>
            检查状态
          </button>
          <button
            onClick={refreshData}
            disabled={refreshing}
            style={{
              fontSize: 11, padding: '6px 14px',
              background: refreshing ? 'rgba(255,107,53,0.05)' : 'linear-gradient(135deg, var(--vent-glow), #e85d26)',
              color: refreshing ? 'var(--text-dim)' : '#fff',
              border: 'none', borderRadius: 25, cursor: refreshing ? 'not-allowed' : 'pointer',
              opacity: refreshing ? 0.5 : 1,
            }}>
            🔄 从 KEGG 刷新
          </button>
        </div>
      </div>
      <div className={ss.refreshStatusBar}>{statusText}</div>
      {refreshing && (
        <div className={ss.refreshProgressBar}>
          <div className={ss.refreshProgressFill} style={{ width: `${progress}%` }} />
        </div>
      )}
      {logs.length > 0 && (
        <div className={ss.refreshLog}>
          {logs.map((log, i) => <div key={i}>{log}</div>)}
        </div>
      )}
    </div>
  );
}
