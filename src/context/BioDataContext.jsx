// ========================================
//  BioDataContext.jsx — 生物数据 Context
//  封装 BioData 模块，提供 React Hook 接口
// ========================================

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const BioDataContext = createContext(null);

/**
 * BioData 核心类 — 从 adapter.js 迁移
 * 负责本地 JSON 加载、服务端刷新、查询接口
 */
class BioDataService {
  constructor() {
    this._cache = {
      pathways: null,
      reactions: null,
      compounds: null,
      glycolysis: null,
    };
    this._refreshState = { running: false, progress: null, lastResult: null, lastError: null };
    this._eventSource = null;
  }

  async preload() {
    try {
      const [pathways, reactions, compounds, glycolysis] = await Promise.all([
        this._loadJSON('/data/bio/pathways.json'),
        this._loadJSON('/data/bio/reactions.json'),
        this._loadJSON('/data/bio/compounds.json'),
        this._loadJSON('/data/bio/glycolysis.json'),
      ]);
      this._cache.pathways = pathways || {};
      this._cache.reactions = reactions || {};
      this._cache.compounds = compounds || {};
      this._cache.glycolysis = glycolysis || {};
      console.log(`[BioData] 本地数据加载完成: ${Object.keys(this._cache.reactions).length} 反应, ${Object.keys(this._cache.compounds).length} 化合物`);
      return true;
    } catch (e) {
      console.warn('[BioData] 本地数据加载失败:', e.message);
      return false;
    }
  }

  isAvailable() { return this._cache.glycolysis !== null; }

  getGlycolysisCore() {
    if (!this._cache.glycolysis) return [];
    return this._cache.glycolysis.reactions || [];
  }

  getGlycolysisSummary() {
    const reactions = this.getGlycolysisCore();
    if (reactions.length === 0) return null;
    const rateLimitingSteps = reactions.filter(r => r.isRateLimiting);
    const irreversibleSteps = reactions.filter(r => !r.isReversible);
    return {
      name: this._cache.glycolysis.name,
      nameEn: this._cache.glycolysis.nameEn,
      totalSteps: reactions.length,
      rateLimitingSteps: rateLimitingSteps.map(r => r.gameStep),
      irreversibleSteps: irreversibleSteps.map(r => r.gameStep),
      compounds: {
        substrates: [...new Set(reactions.flatMap(r => r.substrates.map(s => s.name)))],
        products: [...new Set(reactions.flatMap(r => r.products.map(p => p.name)))],
      }
    };
  }

  getPathway(pathwayId) { return this._cache.pathways?.[pathwayId] || null; }

  listPathways() {
    if (!this._cache.pathways) return [];
    return Object.values(this._cache.pathways).map(p => ({
      id: p.id, name: p.name, nameEn: p.nameEn,
      reactionCount: p.reactions ? p.reactions.length : 0,
    }));
  }

  getReaction(reactionId) { return this._cache.reactions?.[reactionId] || null; }

  getCompound(compoundId) { return this._cache.compounds?.[compoundId] || null; }

  searchCompounds(query) {
    if (!this._cache.compounds) return [];
    const q = query.toLowerCase();
    return Object.values(this._cache.compounds).filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.names.some(n => n.toLowerCase().includes(q)) ||
      c.formula.toLowerCase().includes(q) ||
      c.id.toLowerCase() === q
    );
  }

  searchReactions(query) {
    if (!this._cache.reactions) return [];
    const q = query.toLowerCase();
    return Object.values(this._cache.reactions).filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.definition.toLowerCase().includes(q) ||
      r.id.toLowerCase() === q
    );
  }

  async getStatus() {
    try {
      const resp = await fetch('/api/status');
      return await resp.json();
    } catch (e) {
      return { available: false, error: e.message };
    }
  }

  async refreshData(callbacks = {}) {
    if (this._refreshState.running) return { alreadyRunning: true };

    this._refreshState.running = true;
    this._connectSSE(callbacks);

    try {
      const resp = await fetch('/api/preload', { method: 'POST' });
      const data = await resp.json();
      if (resp.status === 409) return { alreadyRunning: true };
      return data;
    } catch (e) {
      this._disconnectSSE();
      if (callbacks.onError) callbacks.onError(e);
      throw e;
    }
  }

  isRefreshing() { return this._refreshState.running; }

  _connectSSE(callbacks) {
    this._disconnectSSE();
    try {
      this._eventSource = new EventSource('/api/preload/progress');
      const events = ['start', 'pathway_start', 'fetch_reactions', 'fetch_compounds', 'pathway_done', 'saving'];
      events.forEach(event => {
        this._eventSource.addEventListener(event, e => {
          const data = JSON.parse(e.data);
          this._refreshState.progress = { event, ...data };
          if (callbacks.onProgress) callbacks.onProgress(event, data);
        });
      });
      this._eventSource.addEventListener('done', e => {
        const data = JSON.parse(e.data);
        this._refreshState.running = false;
        this._refreshState.lastResult = data;
        if (callbacks.onComplete) callbacks.onComplete(data);
        this.preload().then(() => this._disconnectSSE());
      });
      this._eventSource.addEventListener('error', e => {
        if (e.data) {
          const data = JSON.parse(e.data);
          this._refreshState.running = false;
          this._refreshState.lastError = data;
          if (callbacks.onError) callbacks.onError(data);
        }
        this._disconnectSSE();
      });
      this._eventSource.onerror = () => {
        if (!this._refreshState.running) this._disconnectSSE();
      };
    } catch (_) {}
  }

  _disconnectSSE() {
    if (this._eventSource) { this._eventSource.close(); this._eventSource = null; }
  }

  async _loadJSON(url) {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`加载失败: ${url} (${resp.status})`);
    return resp.json();
  }
}

// Singleton instance
const bioDataService = new BioDataService();

export function BioDataProvider({ children }) {
  const [bioData, setBioData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bioDataService.preload().then(() => {
      setBioData(bioDataService);
      setLoading(false);
    });
  }, []);

  return (
    <BioDataContext.Provider value={{ bioData, loading }}>
      {children}
    </BioDataContext.Provider>
  );
}

export function useBioData() {
  const context = useContext(BioDataContext);
  if (!context) throw new Error('useBioData must be used within BioDataProvider');
  return context;
}
