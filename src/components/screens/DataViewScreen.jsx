import { useState } from 'react';
import GlycolysisViewer from '../dataview/GlycolysisViewer';
import CompoundSearch from '../dataview/CompoundSearch';
import DataSyncPanel from '../dataview/DataSyncPanel';
import s from '../../styles/components/screens.module.css';
import ss from '../../styles/components/shared.module.css';

export default function DataViewScreen({ onNavigate }) {
  const [view, setView] = useState('glycolysis');

  return (
    <div className={s.dataViewScreen}>
      <div className={s.dataViewInner}>
        <h2 className={s.dataViewTitle}>🧪 化学反应数据库</h2>
        <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>
          数据由 KEGG API 预加载到本地 JSON，零网络依赖
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            className="btn-synth primary"
            onClick={() => setView('glycolysis')}
            style={{
              padding: '10px 28px', fontSize: 14, fontWeight: 700,
              background: view === 'glycolysis' ? 'linear-gradient(135deg, var(--vent-glow), #e85d26)' : 'rgba(78,205,196,0.1)',
              color: view === 'glycolysis' ? '#fff' : 'var(--mineral)',
              border: view === 'glycolysis' ? 'none' : '1px solid var(--border)',
              borderRadius: 25, cursor: 'pointer',
            }}>
            查看糖酵解通路
          </button>
          <button
            onClick={() => setView('search')}
            style={{
              padding: '10px 28px', fontSize: 14, fontWeight: 700,
              background: view === 'search' ? 'linear-gradient(135deg, var(--vent-glow), #e85d26)' : 'rgba(78,205,196,0.1)',
              color: view === 'search' ? '#fff' : 'var(--mineral)',
              border: view === 'search' ? 'none' : '1px solid var(--border)',
              borderRadius: 25, cursor: 'pointer',
            }}>
            化合物搜索
          </button>
        </div>

        <DataSyncPanel />

        <button className={ss.btnBack} onClick={() => onNavigate('title')}>← 返回</button>

        <div className={s.dataViewResults}>
          {view === 'glycolysis' && <GlycolysisViewer />}
          {view === 'search' && <CompoundSearch />}
        </div>
      </div>
    </div>
  );
}
