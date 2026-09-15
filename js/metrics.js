// js/metrics.js
const DatasetMetrics = {
  // Generate a safe ID from the dataset name (since CSV might not have an ID column)
  getId: (name) => name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20),

  get: () => JSON.parse(localStorage.getItem('oda_engagement') || '{}'),
  
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

  trackCopy: (name) => {
    const id = DatasetMetrics.getId(name);
    const m = DatasetMetrics.get();
    if (!m[id]) m[id] = { views: 0, downloads: 0, copies: 0 };
    m[id].copies++;
    DatasetMetrics.save(m);
    return m[id];
  },

  // Get top datasets based on a weighted engagement score
  getTopDatasets: (catalog, limit = 5) => {
    const m = DatasetMetrics.get();
    return catalog.map(d => {
      const id = DatasetMetrics.getId(d['Dataset Name']);
      const stats = m[id] || { views: 0, downloads: 0, copies: 0 };
      // Weight: 1 view = 1 pt, 1 download = 3 pts, 1 copy = 2 pts
      const score = stats.views + (stats.downloads * 3) + (stats.copies * 2);
      return { ...d, engagementScore: score, stats: stats };
    }).sort((a, b) => b.engagementScore - a.engagementScore).slice(0, limit);
  }
};
