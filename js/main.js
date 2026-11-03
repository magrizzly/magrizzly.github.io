/**
 * magrizzly.github.io — Main JavaScript
 * Handles Theme Toggling, Mobile Navigation, and Shared UX behaviors.
 */

(function () {
  'use strict';

  // --- Theme Management ---
  const THEME_KEY = 'magrizzly_theme';
  const htmlElement = document.documentElement;
  const themeToggleBtn = document.getElementById('themeToggleBtn');

  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    if (theme === 'light') {
      htmlElement.setAttribute('data-theme', 'light');
    } else {
      htmlElement.removeAttribute('data-theme');
    }
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
    }
  }

  function toggleTheme() {
    const isLight = htmlElement.getAttribute('data-theme') === 'light';
    const newTheme = isLight ? 'dark' : 'light';
    localStorage.setItem(THEME_KEY, newTheme);
    applyTheme(newTheme);
  }

  // Apply immediately upon script parse
  applyTheme(getPreferredTheme());

  // Listen to OS theme changes if user hasn't explicitly set a preference
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme(e.matches ? 'light' : 'dark');
    }
  });

  // --- DOM Content Loaded Setup ---
  document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle button click
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // Mobile Navigation Drawer Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuBtn && navLinks) {
      mobileMenuBtn.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        mobileMenuBtn.setAttribute('aria-expanded', isOpen);
      });

      // Close mobile menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Close mobile menu on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Active Navigation Link Highlighter
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const allNavLinks = document.querySelectorAll('.nav-links a');

    allNavLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Auto-update year in footer
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }

    // Interactive Clipboard Copy Helper (.copy-btn)
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach((btn) => {
      btn.addEventListener('click', async () => {
        const textToCopy = btn.getAttribute('data-copy');
        if (!textToCopy) return;

        try {
          await navigator.clipboard.writeText(textToCopy);
          const originalContent = btn.innerHTML;
          btn.classList.add('copied');
          btn.innerHTML = `<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Copied!`;
          setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.classList.remove('copied');
          }, 2000);
        } catch (err) {
          // Fallback if clipboard API is restricted
          const tempInput = document.createElement('input');
          tempInput.value = textToCopy;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
          btn.classList.add('copied');
          setTimeout(() => btn.classList.remove('copied'), 2000);
        }
      });
    });
  });
})();
