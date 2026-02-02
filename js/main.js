/* RCMods Store - Main JavaScript */

document.addEventListener('DOMContentLoaded', function () {
  initSmoothScroll();
  initNavbarScroll();
  initExploreButton();
  initCardVersions();
});

function initCardVersions() {
  if (typeof CONFIG === 'undefined') return;

  const rcwhatsappCard = document.getElementById('rcwhatsappCardTitle');
  const rcgramCard = document.getElementById('rcgramCardTitle');

  if (rcwhatsappCard && CONFIG.products.rcwhatsapp) {
    rcwhatsappCard.textContent = CONFIG.products.rcwhatsapp.name + ' v' + CONFIG.products.rcwhatsapp.version;
  }

  if (rcgramCard && CONFIG.products.rcgram) {
    rcgramCard.textContent = CONFIG.products.rcgram.name + ' v' + CONFIG.products.rcgram.version;
  }
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  let ticking = false;

  function updateNavbar() {
    const currentScrollY = window.scrollY;
    if (currentScrollY > 100) {
      navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.5)';
      navbar.style.background = 'linear-gradient(135deg, rgba(124, 77, 255, 0.35), rgba(33, 150, 243, 0.35))';
    } else {
      navbar.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.4)';
      navbar.style.background = 'linear-gradient(135deg, rgba(124, 77, 255, 0.22), rgba(33, 150, 243, 0.22))';
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }, { passive: true });
}

function initExploreButton() {
  const exploreBtn = document.querySelector('[data-action="explore"]');
  if (!exploreBtn) return;
  exploreBtn.addEventListener('click', function (e) {
    e.preventDefault();
    const appsSection = document.querySelector('#apps');
    if (appsSection) {
      appsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

function scrollToPackages() {
  const packagesSection = document.querySelector('#packages');
  if (packagesSection) {
    packagesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function scrollToFeatures() {
  const featuresSection = document.querySelector('#features');
  if (featuresSection) {
    featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function initGallerySlider() {
  const slider = document.querySelector('.gallery-slider');
  if (!slider) return;

  const track = slider.querySelector('.gallery-slider__track');
  const slides = track.querySelectorAll('.gallery-slider__slide');
  const prevBtn = slider.querySelector('.gallery-slider__arrow--prev');
  const nextBtn = slider.querySelector('.gallery-slider__arrow--next');

  if (slides.length === 0) return;

  let currentIndex = 0;
  let slidesToShow = window.innerWidth <= 480 ? 1 : 2;

  const originalSlides = Array.from(slides);
  originalSlides.forEach(slide => {
    const clone = slide.cloneNode(true);
    track.appendChild(clone);
  });
  originalSlides.forEach(slide => {
    const clone = slide.cloneNode(true);
    track.insertBefore(clone, track.firstChild);
  });

  const allSlides = track.querySelectorAll('.gallery-slider__slide');
  const totalOriginal = originalSlides.length;
  currentIndex = totalOriginal;

  function updateSlider(animate = true) {
    const slideWidth = allSlides[0].offsetWidth + 20;
    if (!animate) track.style.transition = 'none';
    else track.style.transition = 'transform 0.5s ease-in-out';
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
  }

  function handleTransitionEnd() {
    if (currentIndex >= totalOriginal * 2) {
      currentIndex = totalOriginal;
      updateSlider(false);
    } else if (currentIndex < totalOriginal) {
      currentIndex = totalOriginal * 2 - 1;
      updateSlider(false);
    }
  }

  nextBtn.addEventListener('click', () => {
    currentIndex++;
    updateSlider();
  });

  prevBtn.addEventListener('click', () => {
    currentIndex--;
    updateSlider();
  });

  track.addEventListener('transitionend', handleTransitionEnd);

  window.addEventListener('resize', () => {
    slidesToShow = window.innerWidth <= 480 ? 1 : 2;
    updateSlider(false);
  });

  setTimeout(() => updateSlider(false), 100);

  initLightbox();
}

function initLightbox() {
  let lightbox = document.querySelector('.lightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <button class="lightbox__close" aria-label="Close">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div class="lightbox__content">
        <img src="" alt="Preview">
      </div>
    `;
    document.body.appendChild(lightbox);
  }

  const closeBtn = lightbox.querySelector('.lightbox__close');
  const lightboxImg = lightbox.querySelector('.lightbox__content img');

  document.querySelectorAll('.gallery-slider__slide').forEach(slide => {
    slide.addEventListener('click', () => {
      const img = slide.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  initGallerySlider();
});
