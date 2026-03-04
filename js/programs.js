document.addEventListener("DOMContentLoaded", () => {
  const projectId = "30lhaxyx";
  const dataset = "production";
  const apiVersion = "2023-01-01";

  const container = document.getElementById("all-programs");
  const loadMoreBtn = document.getElementById("load-more");

  const filterAll = document.getElementById("filter-all");
  const filterUpcoming = document.getElementById("filter-upcoming");
  const filterPast = document.getElementById("filter-past");

  let allPrograms = [];
  let filtered = [];
  let visibleCount = 9;

  function fetchPrograms(callback) {
    const query = `
      *[_type=="program"] | order(date desc){
        title,
        date,
        venue,
        description,
        registrationLink,
        "imageUrl": image.asset->url
      }
    `;

    fetch(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => callback(data.result || []))
      .catch(console.error);
  }

  function render() {
    container.innerHTML = "";

    const slice = filtered.slice(0, visibleCount);

    container.innerHTML = slice.map(p => `
      <div class="col-lg-4 col-md-6">
        <div class="program-card">
          ${p.imageUrl ? `<img src="${p.imageUrl}" alt="${p.title}" style="cursor:zoom-in;">` : ""}
          <div class="program-content">
            <span class="program-date">${new Date(p.date).toDateString()}</span>
            <h5 class="text-white mt-2">${p.title}</h5>
            <p class="text-gray mb-2">${p.venue || ""}</p>
            ${p.description ? `<p class="text-gray small">${p.description}</p>` : ""}
            ${p.registrationLink ? `
              <a href="${p.registrationLink}" class="btn-outline-gold mt-2" target="_blank">
                More Info / Register
              </a>` : ""}
          </div>
        </div>
      </div>
    `).join("") || `<p class="text-gray text-center">No programs found.</p>`;

    loadMoreBtn.style.display = filtered.length > visibleCount ? "inline-block" : "none";
  }

  function applyFilter(mode) {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (mode === "upcoming") {
      filtered = allPrograms.filter(p => new Date(p.date) >= todayStart);
    } else if (mode === "past") {
      filtered = allPrograms.filter(p => new Date(p.date) < todayStart);
    } else {
      filtered = [...allPrograms];
    }

    visibleCount = 9;
    render();
  }

  loadMoreBtn.addEventListener("click", () => {
    visibleCount += 9;
    render();
  });

  filterAll.addEventListener("click", () => applyFilter("all"));
  filterUpcoming.addEventListener("click", () => applyFilter("upcoming"));
  filterPast.addEventListener("click", () => applyFilter("past"));

  // Modal (same behavior)
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const closeModal = document.querySelector(".close-modal");

  document.body.addEventListener("click", (e) => {
    if (e.target.matches(".program-card img")) {
      modal.style.display = "flex";
      modalImg.src = e.target.src;
    }
  });

  closeModal.addEventListener("click", () => modal.style.display = "none");
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });

  // Init
  fetchPrograms((programs) => {
    allPrograms = programs;
    filtered = [...allPrograms];
    render();
  });
});