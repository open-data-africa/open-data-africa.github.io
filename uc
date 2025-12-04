<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Use Case Explorer – Open Data Africa</title>
<link rel="stylesheet" href="style.css" />
<style>
  body { font-family: Arial, sans-serif; margin: 0; background: #f9f9f9; }
  nav { background-color: #330000; padding: 1em; }
  .nav-list { display: flex; justify-content: center; list-style: none; margin: 0; padding: 0; flex-wrap: wrap; gap: 1rem; }
  .nav-list li a { color: white; text-decoration: none; font-weight: bold; }
  .nav-list li a[aria-current="page"] { color: #ffcc00; }
  
  main { max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; }
  h1 { text-align: center; color: #333; margin-bottom: 2rem; }

  .filters { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; margin-bottom: 2rem; }
  .filters input, .filters select { padding: 0.5rem; font-size: 1rem; border-radius: 6px; border: 1px solid #ccc; }

  .usecase-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
  .usecase-card { background: #fff; border: 1px solid #ddd; border-left: 5px solid #aa0000; padding: 1rem 1.5rem; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); transition: transform 0.2s; }
  .usecase-card:hover { transform: translateY(-3px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  .usecase-card h3 { margin-top: 0; font-size: 1.2rem; color: #330000; }
  .usecase-card p { font-size: 0.95rem; color: #555; margin: 0.25rem 0; }
  .dataset-link { display: block; margin-top: 0.5rem; color: #0066cc; text-decoration: none; }
  .dataset-link:hover { text-decoration: underline; }
</style>
</head>
<body>

<!-- Navigation -->
<nav>
  <ul class="nav-list">
    <li><a href="index.html">Home</a></li>
    <li><a href="about.html">About</a></li>
    <li><a href="datasets.html">Datasets</a></li>
    <li><a href="use-cases.html" aria-current="page">Use Cases</a></li>
    <li><a href="resources.html">Resources</a></li>
    <li><a href="contribute.html">Contribute</a></li>
    <li><a href="contact.html">Contact</a></li>
  </ul>
</nav>

<main>
  <h1>🌍 Use Case Explorer</h1>
  <p style="text-align:center; max-width: 800px; margin: 0 auto 2rem; color:#555;">
    Explore AI and open data use cases across Africa. Filter by country, domain, or dataset type to discover how datasets are powering innovation.
  </p>

  <!-- Filters -->
  <div class="filters">
    <input type="text" id="searchInput" placeholder="Search by use case name..." />
    <select id="countryFilter">
      <option value="">All Countries</option>
    </select>
    <select id="domainFilter">
      <option value="">All Domains</option>
    </select>
    <select id="typeFilter">
      <option value="">All Data Types</option>
    </select>
  </div>

  <!-- Use Case Cards -->
  <div class="usecase-grid" id="usecaseGrid">
    <!-- Cards will be dynamically generated here -->
  </div>
</main>

<script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>
<script>
  const usecaseGrid = document.getElementById("usecaseGrid");
  const searchInput = document.getElementById("searchInput");
  const countryFilter = document.getElementById("countryFilter");
  const domainFilter = document.getElementById("domainFilter");
  const typeFilter = document.getElementById("typeFilter");

  let usecases = [];

  // Load catalog CSV
  Papa.parse("datasets/catalog.csv", {
    download: true,
    header: true,
    complete: function(results) {
      usecases = results.data.filter(d => d["Dataset Name"]); // remove empty rows
      populateFilters();
      renderUsecases();
    }
  });

  function populateFilters() {
    const countries = [...new Set(usecases.map(u => u.Country).filter(Boolean))].sort();
    const domains = [...new Set(usecases.map(u => u.Domain).filter(Boolean))].sort();
    const types = [...new Set(usecases.map(u => u["Data Type"]).filter(Boolean))].sort();

    countries.forEach(c => countryFilter.innerHTML += `<option value="${c}">${c}</option>`);
    domains.forEach(d => domainFilter.innerHTML += `<option value="${d}">${d}</option>`);
    types.forEach(t => typeFilter.innerHTML += `<option value="${t}">${t}</option>`);
  }

  function renderUsecases() {
    const search = searchInput.value.toLowerCase();
    const country = countryFilter.value;
    const domain = domainFilter.value;
    const type = typeFilter.value;

    const filtered = usecases.filter(u => {
      return (!search || u["Dataset Name"].toLowerCase().includes(search)) &&
             (!country || u.Country === country) &&
             (!domain || u.Domain === domain) &&
             (!type || u["Data Type"] === type);
    });

    usecaseGrid.innerHTML = filtered.map(u => `
      <div class="usecase-card">
        <h3>${u["Dataset Name"]}</h3>
        <p><strong>Country:</strong> ${u.Country}</p>
        <p><strong>Domain:</strong> ${u.Domain}</p>
        <p><strong>Data Type:</strong> ${u["Data Type"]}</p>
        ${u.Link ? `<a href="${u.Link}" target="_blank" class="dataset-link">View Dataset</a>` : ""}
      </div>
    `).join("") || `<p style="text-align:center; color:#777;">No use cases found.</p>`;
  }

  searchInput.addEventListener("input", renderUsecases);
  countryFilter.addEventListener("change", renderUsecases);
  domainFilter.addEventListener("change", renderUsecases);
  typeFilter.addEventListener("change", renderUsecases);
</script>

</body>
</html>
