// js/main.js
let catalogData = null;

async function fetchCatalog() {
  if (catalogData) return catalogData;
  try {
    const response = await fetch('data/datasets.json');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    catalogData = await response.json();
    return catalogData;
  } catch (error) {
    console.error('Error loading datasets:', error);
    return [];
  }
}

function getUniqueValues(data, key) {
  const values = new Set(data.map(item => item[key]).filter(val => val && val !== 'Unknown'));
  return Array.from(values).sort();
}

function countOccurrences(data, key) {
  return data.reduce((acc, item) => {
    const val = item[key];
    if (val && val !== 'Unknown') acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
}

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const navList = document.querySelector('.nav-list');
  if (toggle && navList) {
    toggle.addEventListener('click', () => navList.classList.toggle('active'));
    document.addEventListener('click', (e) => {
      if (!navList.contains(e.target) && !toggle.contains(e.target)) {
        navList.classList.remove('active');
      }
    });
  }
});
