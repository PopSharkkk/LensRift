/* ============================================
   STUDIO PORTFOLIO — main.js
   Gallery · Carousel · Upload · Lightbox
============================================ */

'use strict';

// ─── State ───────────────────────────────────
const S = {
  photos: [],
  activeFilter: 'all',
  lightbox: { items: [], index: 0 },
  carousel: { index: 0, timer: null },
};

function load() {
  try {
    S.photos = JSON.parse(localStorage.getItem('portfolio_v2') || '[]');
  } catch { S.photos = []; }
}

function save() {
  localStorage.setItem('portfolio_v2', JSON.stringify(S.photos));
}

// ─── Helpers ─────────────────────────────────
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

// ─── Nav scroll ──────────────────────────────
function initNav() {
  // Sidebar active link
  $$('.sidebar__nav a[data-filter]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const f = a.dataset.filter;
      setFilter(f);
      $$('.sidebar__nav a').forEach(x => x.classList.remove('active'));
      a.classList.add('active');
      document.querySelector('.main').scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// ─── Filter ───────────────────────────────────
function setFilter(f) {
  S.activeFilter = f;

  // Update pill buttons
  $$('.filter-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.filter === f);
  });

  // Show/hide grid items
  $$('.masonry-item:not(.masonry-item--placeholder)').forEach(item => {
    const cat = item.dataset.category || '';
    const show = f === 'all' || cat === f;
    item.style.display = show ? '' : 'none';
  });

  updateCount();
}

function initFilters() {
  $$('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => setFilter(btn.dataset.filter));
  });
}

// ─── Gallery render ───────────────────────────
function renderGallery() {
  const grid = $('gallery');
  if (!grid) return;

  // Remove real photo items (keep placeholders)
  grid.querySelectorAll('.masonry-item:not(.masonry-item--placeholder)').forEach(el => el.remove());

  // Hide placeholders if we have photos
  const placeholders = grid.querySelectorAll('.masonry-item--placeholder');
  placeholders.forEach(p => p.style.display = S.photos.length > 0 ? 'none' : '');

  S.photos.forEach((photo, i) => {
    const el = document.createElement('div');
    el.className = 'masonry-item';
    el.dataset.category = photo.category;
    el.style.transitionDelay = `${(i % 12) * 0.04}s`;
    el.innerHTML = `
      <img src="${photo.src}" alt="${photo.title}" loading="lazy">
      <div class="masonry-item__overlay">
        <div>
          <div class="masonry-item__title">${photo.title}</div>
          <div class="masonry-item__cat">${photo.category} · ${photo.date}</div>
        </div>
      </div>
      <button class="masonry-item__delete" data-id="${photo.id}" title="Remove">✕</button>`;

    el.addEventListener('click', e => {
      if (e.target.closest('.masonry-item__delete')) return;
      const visible = S.photos.filter(p => S.activeFilter === 'all' || p.category === S.activeFilter);
      const idx = visible.findIndex(p => p.id === photo.id);
      openLightbox(visible, idx >= 0 ? idx : 0);
    });

    el.querySelector('.masonry-item__delete').addEventListener('click', e => {
      e.stopPropagation();
      S.photos = S.photos.filter(p => p.id !== photo.id);
      save();
      renderGallery();
      renderCarousel();
    });

    grid.appendChild(el);
  });

  // Apply current filter
  setFilter(S.activeFilter);
  initReveal();
  updateCount();
}

function updateCount() {
  const countEl = $('photoCount');
  if (!countEl) return;
  const visible = S.photos.filter(p => S.activeFilter === 'all' || p.category === S.activeFilter);
  countEl.textContent = `${visible.length} ${visible.length === 1 ? 'image' : 'images'}`;
}

// ─── Reveal on scroll ─────────────────────────
function initReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });

  $$('.masonry-item:not(.visible)').forEach(el => io.observe(el));
}

// ─── Carousel ─────────────────────────────────
function renderCarousel() {
  const track = $('carouselTrack');
  const dots = $('carouselDots');
  if (!track) return;

  track.innerHTML = '';
  if (dots) dots.innerHTML = '';

  const items = [...S.photos];

  if (items.length === 0) {
    // Show placeholder slides
    for (let i = 0; i < 5; i++) {
      const s = document.createElement('div');
      s.className = 'carousel-slide carousel-slide--placeholder';
      track.appendChild(s);
    }
    return;
  }

  items.forEach((photo, i) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.innerHTML = `
      <img src="${photo.src}" alt="${photo.title}" loading="lazy">
      <div class="carousel-slide__cap"><span>${photo.title}</span></div>`;
    slide.addEventListener('click', () => openLightbox(items, i));
    track.appendChild(slide);

    if (dots) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => carouselGoTo(i));
      dots.appendChild(dot);
    }
  });

  S.carousel.index = 0;
  carouselStartAuto();
}

function carouselGoTo(i) {
  const track = $('carouselTrack');
  if (!track) return;
  const items = S.photos;
  if (!items.length) return;

  S.carousel.index = Math.max(0, Math.min(i, items.length - 1));
  const slideW = track.children[0]?.offsetWidth + 12 || 332;
  track.style.transform = `translateX(-${S.carousel.index * slideW}px)`;

  $$('.carousel-dot').forEach((d, idx) => d.classList.toggle('active', idx === S.carousel.index));
}

function carouselNext() {
  const len = S.photos.length;
  if (!len) return;
  carouselGoTo(S.carousel.index >= len - 1 ? 0 : S.carousel.index + 1);
}

function carouselPrev() {
  const len = S.photos.length;
  if (!len) return;
  carouselGoTo(S.carousel.index <= 0 ? len - 1 : S.carousel.index - 1);
}

function carouselStartAuto() {
  clearInterval(S.carousel.timer);
  S.carousel.timer = setInterval(carouselNext, 3800);
}

function initCarouselControls() {
  $('carouselNext')?.addEventListener('click', () => { carouselNext(); carouselStartAuto(); });
  $('carouselPrev')?.addEventListener('click', () => { carouselPrev(); carouselStartAuto(); });

  // Drag / swipe
  const vp = document.querySelector('.carousel-viewport');
  if (!vp) return;
  let startX = 0;
  vp.addEventListener('mousedown', e => { startX = e.clientX; });
  vp.addEventListener('mouseup', e => {
    const d = startX - e.clientX;
    if (Math.abs(d) > 40) { d > 0 ? carouselNext() : carouselPrev(); carouselStartAuto(); }
  });
  vp.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  vp.addEventListener('touchend', e => {
    const d = startX - e.changedTouches[0].clientX;
    if (Math.abs(d) > 30) { d > 0 ? carouselNext() : carouselPrev(); carouselStartAuto(); }
  });
}

// ─── Upload Modal ─────────────────────────────
function initUpload() {
  const overlay = $('uploadOverlay');
  const zone = $('dropZone');
  const fileInput = $('fileInput');
  const previewGrid = $('previewGrid');
  const catSelect = $('catSelect');
  let pending = [];

  // Open triggers
  $$('[data-upload]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const cat = el.dataset.upload;
      if (catSelect && cat) catSelect.value = cat;
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    pending = [];
    if (previewGrid) previewGrid.innerHTML = '';
    if (fileInput) fileInput.value = '';
    const t = $('titleInput'); if (t) t.value = '';
  }

  overlay?.querySelector('.modal__x')?.addEventListener('click', close);
  overlay?.addEventListener('click', e => { if (e.target === overlay) close(); });

  zone?.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone?.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone?.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    handle(Array.from(e.dataTransfer.files));
  });
  zone?.addEventListener('click', () => fileInput?.click());
  fileInput?.addEventListener('change', e => handle(Array.from(e.target.files)));

  function handle(files) {
    pending = files.filter(f => f.type.startsWith('image/'));
    if (previewGrid) {
      previewGrid.innerHTML = '';
      pending.forEach(f => {
        const r = new FileReader();
        r.onload = ev => {
          const img = document.createElement('img');
          img.src = ev.target.result;
          previewGrid.appendChild(img);
        };
        r.readAsDataURL(f);
      });
    }
  }

  $('uploadSave')?.addEventListener('click', () => {
    if (!pending.length) { alert('Select at least one image.'); return; }
    const title = ($('titleInput')?.value.trim()) || 'Untitled';
    const cat = catSelect?.value || 'photography';
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

    let done = 0;
    pending.forEach(file => {
      const r = new FileReader();
      r.onload = ev => {
        S.photos.unshift({ id: Date.now() + Math.random(), src: ev.target.result, title, category: cat, date });
        done++;
        if (done === pending.length) { save(); renderGallery(); renderCarousel(); }
      };
      r.readAsDataURL(file);
    });
    close();
  });

  $('uploadCancel')?.addEventListener('click', close);
}

// ─── Lightbox ─────────────────────────────────
function openLightbox(items, index) {
  S.lightbox.items = items;
  S.lightbox.index = index;
  const lb = $('lightbox');
  if (!lb) return;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
  updateLightbox();
}

function updateLightbox() {
  const item = S.lightbox.items[S.lightbox.index];
  if (!item) return;
  $('lbImg').src = item.src;
  $('lbTitle').textContent = item.title;
  $('lbMeta').textContent = `${item.category} · ${item.date}`;
}

function closeLightbox() {
  $('lightbox')?.classList.remove('open');
  document.body.style.overflow = '';
}

function initLightbox() {
  const lb = $('lightbox');
  if (!lb) return;

  lb.querySelector('.lightbox__close')?.addEventListener('click', closeLightbox);
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });

  lb.querySelector('.lightbox__prev')?.addEventListener('click', () => {
    const len = S.lightbox.items.length;
    S.lightbox.index = (S.lightbox.index - 1 + len) % len;
    updateLightbox();
  });

  lb.querySelector('.lightbox__next')?.addEventListener('click', () => {
    S.lightbox.index = (S.lightbox.index + 1) % S.lightbox.items.length;
    updateLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') {
      S.lightbox.index = (S.lightbox.index - 1 + S.lightbox.items.length) % S.lightbox.items.length;
      updateLightbox();
    }
    if (e.key === 'ArrowRight') {
      S.lightbox.index = (S.lightbox.index + 1) % S.lightbox.items.length;
      updateLightbox();
    }
  });
}

// ─── Boot ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  load();
  initNav();
  initFilters();
  initCarouselControls();
  initUpload();
  initLightbox();
  renderGallery();
  renderCarousel();

  // Reveal placeholder items on load
  setTimeout(() => {
    $$('.masonry-item--placeholder').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 30);
    });
  }, 200);
});
