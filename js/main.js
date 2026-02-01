/* RCMods Store - Main JavaScript */

document.addEventListener('DOMContentLoaded', function () {
  initSmoothScroll();
  initNavbarScroll();
  initExploreButton();
});

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
