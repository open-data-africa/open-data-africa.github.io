// js/metrics.js
const EngagementTracker = {
  // Generate a safe ID from the dataset name
  getId: (name) => name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20),

  // Track an interaction (view, download, copy)
  track: (name, type) => {
    const id = EngagementTracker.getId(name);
    let data = JSON.parse(localStorage.getItem('oda_engagement') || '{}');
    if (!data[id]) data[id] = { views: 0, downloads: 0, copies: 0 };
    data[id][type] = (data[id][type] || 0) + 1;
    localStorage.setItem('oda_engagement', JSON.stringify(data));
  },

  // Get trending datasets sorted by engagement score
  getTrending: (catalog, limit = 5) => {
    const data = JSON.parse(localStorage.getItem('oda_engagement') || '{}');
    
    return catalog.map(item => {
      const id = EngagementTracker.getId(item['Dataset Name']);
      const stats = data[id] || { views: 0, downloads: 0, copies: 0 };
      
      // Calculate Score: 1 View = 1 pt, 1 Download = 3 pts, 1 Copy = 2 pts
      const score = stats.views + (stats.downloads * 3) + (stats.copies * 2);
      
      return { ...item, score, stats };
    }).sort((a, b) => b.score - a.score).slice(0, limit);
  }
};
