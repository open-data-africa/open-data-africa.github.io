// js/metrics.js
const DatasetMetrics = {
  getId: (name) => name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20),
  get: () => {
    try { return JSON.parse(localStorage.getItem('oda_engagement') || '{}'); } 
    catch (e) { return {}; }
  },
  save: (data) => localStorage.setItem('oda_engagement', JSON.stringify(data)),
  trackView: (name) => {
    const id = DatasetMetrics.getId(name);
    const m = DatasetMetrics.get();
    if (!m[id]) m[id] = { views: 0, downloads: 0, copies: 0 };
    m[id].views++;
    DatasetMetrics.save(m);
    return m[id];
  },
  trackDownload: (name) => {
    const id = DatasetMetrics.getId(name);
    const m = DatasetMetrics.get();
    if (!m[id]) m[id] = { views: 0, downloads: 0, copies: 0 };
    m[id].downloads++;
    DatasetMetrics.save(m);
    return m[id];
  },
  getTopDatasets: (catalog, limit = 5) => {
    const m = DatasetMetrics.get();
    return catalog.map(d => {
      const id = DatasetMetrics.getId(d['Dataset Name']);
      const stats = m[id] || { views: 0, downloads: 0, copies: 0 };
      const score = stats.views + (stats.downloads * 3) + (stats.copies * 2);
      return { ...d, engagementScore: score, stats: stats };
    }).sort((a, b) => b.engagementScore - a.engagementScore).slice(0, limit);
  }
};
