// script.js - Master JavaScript engine for LensRift portfolio

document.addEventListener("DOMContentLoaded", function () {
  // 1. Seamless Navbar Interaction Engine
  initializeSeamlessNavbar();

  // 2. Initialize Scroll-Bound Progress Interactions if trigger targets exist (index.html & about.html)
  if (document.querySelector(".reveal-trigger")) {
    initializeScrollStoryEngine();
  }

  // 3. Photos Grid Page Router (gallery.html)
  if (document.getElementById("galleryGrid")) {
    initializeGallery();
    setupScrollAnimations(".gallery-item");
  }
});

/**
 * Monitors scroll displacement vectors to toggle fluid glass overlay adjustments
 */
function initializeSeamlessNavbar() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  function toggleNavbarState() {
    if (window.scrollY > 20) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", toggleNavbarState);
  window.addEventListener("resize", toggleNavbarState);
  toggleNavbarState();
}

/**
 * Letter-by-Letter, Image Saturation, and Multi-Frame Scroll Animation Engine
 */
function initializeScrollStoryEngine() {
  const rowBlocks = document.querySelectorAll(".reveal-trigger");

  rowBlocks.forEach((block) => {
    const textElements = block.querySelectorAll(".scroll-reveal-text");
    const targetImage = block.querySelector(".scroll-color-image");

    textElements.forEach((el) => {
      if (el.querySelector("span")) return; 
      
      const originalText = el.textContent;
      el.innerHTML = ""; 
      
      [...originalText].forEach((char) => {
        const span = document.createElement("span");
        span.textContent = char;
        el.appendChild(span);
      });
    });

    const allSpans = block.querySelectorAll(".scroll-reveal-text span");

    function processScrollCalculations() {
      const blockRect = block.getBoundingClientRect();
      const viewHeight = window.innerHeight;

      const startTrigger = viewHeight * 0.85;
      const endTrigger = viewHeight * 0.20;

      let progress = (startTrigger - blockRect.top) / (startTrigger - endTrigger);
      progress = Math.max(0, Math.min(1, progress)); 

      if (progress > 0.05) {
        block.classList.add("visible-focus");
      } else {
        block.classList.remove("visible-focus");
      }

      const litThreshold = Math.floor(progress * allSpans.length);
      allSpans.forEach((span, index) => {
        if (index < litThreshold) {
          span.classList.add("lit");
        } else {
          span.classList.remove("lit");
        }
      });

      if (targetImage) {
        const saturationValue = progress * 100; 
        const brightnessValue = 0.7 + (progress * 0.3); 
        targetImage.style.filter = `grayscale(${100 - saturationValue}%) brightness(${brightnessValue})`;
      }
    }

    window.addEventListener("scroll", processScrollCalculations);
    window.addEventListener("resize", processScrollCalculations);
    processScrollCalculations();
  });
}

/**
 * Grid Gallery Initialization (gallery.html)
 */
function initializeGallery() {
  const galleryGrid = document.getElementById("galleryGrid");
  if (!galleryGrid || !fullGalleryData) return;

  galleryGrid.innerHTML = "";
  fullGalleryData.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.className = "gallery-item";
    itemElement.innerHTML = `
      <img src="${item.url}" alt="${item.title}" loading="lazy">
      <div class="gallery-item-overlay">
        <div class="gallery-item-title">${item.title}</div>
        <div class="gallery-item-type">${item.type}</div>
      </div>
    `;
    itemElement.addEventListener("click", () => openLightbox(item.url, item.title));
    galleryGrid.appendChild(itemElement);
  });
}

function openLightbox(url, title) {
  const modal = document.createElement("div");
  modal.className = "lightbox-modal";
  modal.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close">&times;</button>
            <img src="${url}" alt="${title}">
            <div class="lightbox-info"><h3>${title}</h3></div>
        </div>
    `;

  if (!document.querySelector("style[data-lightbox]")) {
    const styleElement = document.createElement("style");
    styleElement.setAttribute("data-lightbox", "true");
    styleElement.textContent = `
            .lightbox-modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(11, 17, 30, 0.98); z-index: 1000; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.3s ease-out; padding: 20px; }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            .lightbox-content { position: relative; max-width: 90vw; max-height: 85vh; display: flex; flex-direction: column; background-color: #131b2e; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; overflow:hidden; }
            .lightbox-content img { max-width: 100%; max-height: 70vh; object-fit: contain; }
            .lightbox-close { position: absolute; top: 15px; right: 20px; background: none; border: none; color: white; font-size: 2rem; cursor: pointer; z-index: 1001; }
            .lightbox-info { padding: 20px; background-color: #131b2e; color: white; }
            .lightbox-info h3 { margin: 0; font-size: 1rem; font-weight: 500; }
        `;
    document.head.appendChild(styleElement);
  }

  document.body.appendChild(modal);
  document.body.style.overflow = "hidden";

  modal.querySelector(".lightbox-close").addEventListener("click", () => {
    modal.remove();
    document.body.style.overflow = "";
  });
}

function setupScrollAnimations(selector) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  document.querySelectorAll(selector).forEach((item) => {
    item.style.opacity = "0";
    item.style.transform = "translateY(15px)";
    item.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
    observer.observe(item);
  });
}