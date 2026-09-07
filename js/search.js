/**
 * magrizzly.github.io — Client-side Search & Tag Filtering
 */

(function () {
  'use strict';

  function initFilterableGrid(options) {
    const searchInput = document.getElementById(options.searchInputId);
    const filterChips = document.querySelectorAll(options.filterChipSelector);
    const items = document.querySelectorAll(options.itemSelector);
    const emptyState = document.getElementById(options.emptyStateId);

    if (!items.length) return;

    let activeTag = 'all';
    let searchQuery = '';

    function filterItems() {
      let visibleCount = 0;
      const normalizedQuery = searchQuery.trim().toLowerCase();

      items.forEach((item) => {
        const title = (item.getAttribute('data-title') || item.querySelector(options.titleSelector)?.textContent || '').toLowerCase();
        const desc = (item.getAttribute('data-desc') || item.querySelector(options.descSelector)?.textContent || '').toLowerCase();
        const tags = (item.getAttribute('data-tags') || '').toLowerCase().split(',').map(t => t.trim());

        const matchesTag = activeTag === 'all' || tags.includes(activeTag.toLowerCase());
        const matchesQuery = !normalizedQuery || title.includes(normalizedQuery) || desc.includes(normalizedQuery) || tags.some(t => t.includes(normalizedQuery));

        if (matchesTag && matchesQuery) {
          item.style.display = '';
          visibleCount++;
        } else {
          item.style.display = 'none';
        }
      });

      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        filterItems();
      });
    }

    filterChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeTag = chip.getAttribute('data-tag') || 'all';
        filterItems();
      });
    });
  }

  window.initFilterableGrid = initFilterableGrid;
})();
