import { useBioData } from '../../context/BioDataContext';

export default function GlycolysisViewer() {
  const { bioData } = useBioData();
  if (!bioData) return <div style={{ color: 'var(--text-dim)', padding: 16 }}>加载中...</div>;

  const reactions = bioData.getGlycolysisCore();
  if (reactions.length === 0) {
    return <div style={{ color: 'var(--text-dim)', padding: 16 }}>暂无数据，请先刷新</div>;
  }

  const summary = bioData.getGlycolysisSummary();

  return (
    <div>
      <div style={{ marginBottom: 12, color: 'var(--mineral)', fontWeight: 700 }}>
        糖酵解核心反应（KEGG 数据 · 本地预加载）
      </div>

      {reactions.map(r => {
        const rateTag = r.isRateLimiting ? ' ★限速酶' : '';
        const revTag = r.isReversible ? ' ⇌ 可逆' : ' → 不可逆';
        const subs = r.substrates.map(s => `${s.emoji} ${s.name}`).join(' + ');
        const prods = r.products.map(p => `${p.emoji} ${p.name}`).join(' + ');

        return (
          <div key={r.id} style={{
            padding: 10, marginBottom: 8,
            background: 'rgba(78,205,196,0.05)',
            border: '1px solid var(--border)',
            borderRadius: 10,
          }}>
            <div style={{ color: 'var(--mineral)', fontWeight: 700 }}>
              Step {r.gameStep}: {r.enzymeName || r.name}
              {r.isRateLimiting && <span style={{ color: 'var(--danger)' }}> ★限速酶</span>}
            </div>
            <div style={{ color: 'var(--text)', margin: '4px 0' }}>
              {subs} {r.isReversible ? '⇌' : '→'} {prods}
            </div>
            <div style={{ color: 'var(--text-dim)', fontSize: 10 }}>
              KEGG: {r.keggId || r.id} | EC: {r.enzymes.join(', ') || 'N/A'} |{revTag}
            </div>
            <div style={{ color: 'var(--text-dim)', fontSize: 10 }}>
              方程式: {r.definition}
            </div>
          </div>
        );
      })}

      {summary && (
        <div style={{
          marginTop: 16, padding: 12,
          background: 'rgba(6,214,160,0.05)',
          border: '1px solid rgba(6,214,160,0.2)',
          borderRadius: 10,
        }}>
          <div style={{ color: 'var(--success)', fontWeight: 700 }}>📊 通路摘要</div>
          <div style={{ color: 'var(--text-dim)', fontSize: 11 }}>
            总步骤: {summary.totalSteps} | 限速步骤: Step {summary.rateLimitingSteps.join(', ')}<br/>
            底物: {summary.compounds.substrates.join(', ')}<br/>
            产物: {summary.compounds.products.join(', ')}
          </div>
        </div>
      )}

      <div style={{
        marginTop: 12, padding: 12,
        background: 'rgba(255,230,109,0.05)',
        border: '1px solid rgba(255,230,109,0.2)',
        borderRadius: 10,
      }}>
        <div style={{ color: 'var(--molecule)', fontWeight: 700 }}>📁 数据来源</div>
        <div style={{ color: 'var(--text-dim)', fontSize: 11 }}>
          原始数据来自 KEGG REST API<br/>
          通过 server.js 从游戏内触发刷新，或运行 <code>node scripts/preload_bio_data.js</code><br/>
          运行时零网络请求 · 零 CORS 问题 · 零延迟
        </div>
      </div>
    </div>
  );
}
