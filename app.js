const grid = document.getElementById("grid");
const counter = document.getElementById("counter");
const filters = document.getElementById("filters");
const search = document.getElementById("search");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");
const modalClose = document.getElementById("modal-close");

let activeFilter = "all";

function renderCards() {
  const query = search.value.toLowerCase().trim();
  const filtered = theories.filter((t) => {
    const matchesFilter = activeFilter === "all" || t.category === activeFilter;
    const matchesSearch =
      !query ||
      t.title.toLowerCase().includes(query) ||
      t.summary.toLowerCase().includes(query) ||
      t.details.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  counter.textContent = `${filtered.length} ${filtered.length === 1 ? "dossier" : "dossiers"} on file`;

  if (filtered.length === 0) {
    grid.innerHTML = '<div class="empty-state">No matching files found in the archives.</div>';
    return;
  }

  grid.innerHTML = filtered
    .map(
      (t, i) => `
    <div class="card" data-index="${theories.indexOf(t)}">
      <div class="category-tag">${t.category}</div>
      <div class="card-header">
        <h2>${t.title}</h2>
        <span class="badge badge-${t.status}">${t.status}</span>
      </div>
      <p>${t.summary}</p>
      <div class="card-date">Added ${t.dateAdded}</div>
    </div>`
    )
    .join("");

  grid.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => openModal(theories[card.dataset.index]));
  });
}

function openModal(t) {
  const evidenceHtml = t.evidence && t.evidence.length
    ? `<h3>Intelligence Notes</h3>
       <ul class="evidence-list">
         ${t.evidence.map((e) => `<li>${e}</li>`).join("")}
       </ul>`
    : "";

  modalContent.innerHTML = `
    <div class="category-tag">${t.category}</div>
    <h2>${t.title}</h2>
    <div style="margin: 0.75rem 0">
      <span class="badge badge-${t.status}">${t.status}</span>
    </div>
    <div class="details">${t.details}</div>
    ${evidenceHtml}
    <div class="modal-meta">
      <span>Added ${t.dateAdded}</span>
    </div>`;

  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("open");
  document.body.style.overflow = "";
}

modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

filters.addEventListener("click", (e) => {
  if (!e.target.classList.contains("filter-btn")) return;
  filters.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
  e.target.classList.add("active");
  activeFilter = e.target.dataset.filter;
  renderCards();
});

search.addEventListener("input", renderCards);

renderCards();
