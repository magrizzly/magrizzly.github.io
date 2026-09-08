/**
 * magrizzly.co.uk/weeb — Anime Hub Client JavaScript
 * Section navigation, badge modal lightbox, and filterable watched showcase.
 */

(function () {
  'use strict';

  // --- Section Navigation (Hash Routing) ---
  const navLinks = document.querySelectorAll('.weeb-nav-link:not(.hub-link)');
  const sections = document.querySelectorAll('.weeb-section');

  function switchSection(targetId) {
    if (!targetId || targetId === '#') targetId = 'home';
    targetId = targetId.replace('#', '');

    let found = false;
    sections.forEach((sec) => {
      if (sec.id === targetId) {
        sec.classList.add('active');
        found = true;
      } else {
        sec.classList.remove('active');
      }
    });

    if (!found && sections.length > 0) {
      sections[0].classList.add('active');
      targetId = sections[0].id;
    }

    navLinks.forEach((link) => {
      const href = link.getAttribute('href').replace('#', '');
      if (href === targetId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Scroll to top of content smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  window.addEventListener('hashchange', () => {
    switchSection(window.location.hash);
  });

  // --- Lightbox Modal for Badges ---
  const modal = document.getElementById('badgeModal');
  const modalImg = document.getElementById('badgeModalImg');
  const modalProofLink = document.getElementById('badgeModalProofLink');
  const modalClose = document.getElementById('badgeModalClose');

  function openBadgeModal(imgSrc, proofUrl) {
    if (!modal) return;
    modalImg.src = imgSrc;
    if (proofUrl && proofUrl.startsWith('http')) {
      modalProofLink.href = proofUrl;
      modalProofLink.style.display = 'inline-flex';
    } else {
      modalProofLink.style.display = 'none';
    }
    modal.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeBadgeModal() {
    if (!modal) return;
    modal.classList.remove('visible');
    document.body.style.overflow = '';
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeBadgeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeBadgeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeBadgeModal();
  });

  // Attach modal click events to all badges
  function initBadgeClicks() {
    document.querySelectorAll('.badge-card').forEach((card) => {
      const img = card.querySelector('.badge-thumb');
      const proofBtn = card.querySelector('.badge-link-btn');
      if (img) {
        img.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const proof = proofBtn ? proofBtn.getAttribute('href') : '';
          openBadgeModal(img.src, proof);
        });
      }
    });
  }

  // --- Watched Anime Filtering ---
  function initWatchedFilter() {
    const searchInput = document.getElementById('animeSearch');
    const filterBtns = document.querySelectorAll('.anime-filter-btn');
    const animeCards = document.querySelectorAll('.anime-card');

    let activeFilter = 'all';
    let searchQuery = '';

    function filterAnime() {
      const q = searchQuery.toLowerCase().trim();
      animeCards.forEach((card) => {
        const title = (card.getAttribute('data-title') || '').toLowerCase();
        const genres = (card.getAttribute('data-genres') || '').toLowerCase();
        const status = (card.getAttribute('data-status') || '').toLowerCase();

        const matchesQuery = !q || title.includes(q) || genres.includes(q);
        const matchesFilter = activeFilter === 'all' || status === activeFilter || genres.includes(activeFilter);

        card.style.display = (matchesQuery && matchesFilter) ? 'flex' : 'none';
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        filterAnime();
      });
    }

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.getAttribute('data-filter') || 'all';
        filterAnime();
      });
    });
  }

  // --- Initialize on DOM Load ---
  document.addEventListener('DOMContentLoaded', () => {
    // Initial hash routing
    if (window.location.hash) {
      switchSection(window.location.hash);
    } else {
      switchSection('home');
    }

    initBadgeClicks();
    initWatchedFilter();
  });
})();
