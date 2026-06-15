import { useState } from 'react';
import { useBioData } from '../../context/BioDataContext';

export default function CompoundSearch() {
  const { bioData } = useBioData();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);

  const handleSearch = () => {
    if (!bioData || !query.trim()) return;
    const found = bioData.searchCompounds(query.trim());
    setResults(found);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div>
      <div style={{ marginBottom: 12, color: 'var(--molecule)', fontWeight: 700 }}>🔍 化合物搜索</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入化合物名称（如 glucose、ATP、C00031）"
          style={{
            flex: 1, padding: '8px 12px',
            background: 'rgba(78,205,196,0.08)',
            border: '1px solid var(--border)',
            borderRadius: 8, color: 'var(--text)', fontSize: 13,
          }}
        />
        <button className="btn-synth secondary" onClick={handleSearch}
          style={{
            background: 'rgba(78,205,196,0.1)', color: 'var(--mineral)',
            border: '1px solid var(--border)', borderRadius: 25,
            padding: '8px 20px', cursor: 'pointer', fontSize: 14,
          }}>
          搜索
        </button>
      </div>
      {results !== null && (
        results.length === 0 ? (
          <div style={{ color: 'var(--text-dim)', padding: 8 }}>未找到匹配的化合物</div>
        ) : (
          results.map(c => (
            <div key={c.id} style={{
              padding: 8, marginBottom: 6,
              background: 'rgba(78,205,196,0.05)',
              border: '1px solid var(--border)',
              borderRadius: 8,
            }}>
              <span style={{ color: 'var(--mineral)', fontWeight: 700 }}>🧪 {c.name}</span>
              <span style={{ color: 'var(--text-dim)', fontSize: 10, marginLeft: 8 }}>
                KEGG: {c.id} | 分子式: {c.formula || 'N/A'} | 分子量: {c.molWeight || 'N/A'}
              </span>
              <div style={{ color: 'var(--text-dim)', fontSize: 10 }}>别名: {c.names.join('; ')}</div>
            </div>
          ))
        )
      )}
    </div>
  );
}
