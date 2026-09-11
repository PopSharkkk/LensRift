// LensRift Supabase Configuration
const SUPABASE_URL = "https://haukswzimwkykhexxxnm.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhdWtzd3ppbXdreWtoZXh4eG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxMDU2MTYsImV4cCI6MjEwNDY4MTYxNn0.2avQp2MXXmTLeNDA7eH_tLxqVLsevq3sb3FODIq2j_E";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  });

  const gridElement = document.getElementById("media-grid");
  if (gridElement) {
    const filterType = gridElement.getAttribute("data-filter");
    loadMedia(gridElement, filterType);
  }
});

async function loadMedia(container, typeFilter) {
  let query = supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false });
  if (typeFilter === "photo" || typeFilter === "video")
    query = query.eq("type", typeFilter);

  const { data, error } = await query;
  if (error || !data) return;

  container.innerHTML = "";
  data.forEach((item) => {
    const itemEl = document.createElement("div");
    itemEl.className = "gallery-item";

    const mediaTag =
      item.type === "video"
        ? `<video src="${item.url}" muted loop playsinline preload="metadata"></video>`
        : `<img src="${item.url}" alt="${item.title}" loading="lazy">`;

    itemEl.innerHTML = `
      <div class="gallery-media-wrapper">${mediaTag}</div>
      <div class="gallery-info">
        <span class="gallery-title">${item.title}</span>
        <span class="gallery-type">${item.type}</span>
      </div>
    `;

    if (item.type === "video") {
      const vid = itemEl.querySelector("video");
      itemEl.addEventListener("mouseenter", () => vid.play());
      itemEl.addEventListener("mouseleave", () => {
        vid.pause();
        vid.currentTime = 0;
      });
    }

    itemEl.addEventListener("click", () => openLightbox(item.url, item.type));
    container.appendChild(itemEl);
  });
}

function openLightbox(url, type) {
  const modal = document.createElement("div");
  modal.className = "lightbox-modal";
  const mediaElement =
    type === "video"
      ? `<video src="${url}" controls autoplay></video>`
      : `<img src="${url}">`;

  modal.innerHTML = `
    <div class="lightbox-content">
      <button class="lightbox-close">&times;</button>
      ${mediaElement}
    </div>
  `;
  document.body.appendChild(modal);
  document.body.style.overflow = "hidden";

  const closeBtn = modal.querySelector(".lightbox-close");
  const closeModal = () => {
    modal.remove();
    document.body.style.overflow = "";
  };
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}
