/* =========================================================
   BAKKERIJ PETERSE — SCRIPT.JS
   - Header en footer dynamisch laden (multi-element support)
   - Mobile menu toggle
   - Active link highlighten op basis van data-page
   - Scroll reveal animaties
   - Footer-jaartal automatisch
   ========================================================= */

(function () {
  'use strict';

  /* ---------- 1. Component laden via fetch() — ondersteunt meerdere top-level elementen ---------- */
  async function loadComponent(id, url) {
    const placeholder = document.getElementById(id);
    if (!placeholder) return;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      // DocumentFragment voor robuuste multi-element insertion
      const temp = document.createElement('div');
      temp.innerHTML = html;
      const fragment = document.createDocumentFragment();
      while (temp.firstChild) {
        fragment.appendChild(temp.firstChild);
      }
      placeholder.replaceWith(fragment);
    } catch (err) {
      console.warn(`Component ${url} kon niet geladen worden:`, err);
    }
  }

  /* ---------- 2. Mobile menu init ---------- */
  function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.mobile-menu');
    if (!toggle || !menu) return;

    const openMenu = () => {
      toggle.classList.add('open');
      menu.classList.add('open');
      document.body.classList.add('menu-open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      toggle.classList.remove('open');
      menu.classList.remove('open');
      document.body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (toggle.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Sluit menu bij link-klik
    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Sluit menu met Escape-toets
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  /* ---------- 3. Active link op basis van pagina ---------- */
  function setActiveLink() {
    const page = document.body.dataset.page;
    if (!page) return;
    document
      .querySelectorAll(`a[data-page="${page}"]`)
      .forEach((a) => a.classList.add('active'));
  }

  /* ---------- 4. Scroll reveal ---------- */
  function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    items.forEach((el) => io.observe(el));
  }

  /* ---------- 5. Footer-jaartal ---------- */
  function setYear() {
    const el = document.getElementById('footer-year');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([
      loadComponent('site-header', 'components/header.html'),
      loadComponent('site-footer', 'components/footer.html'),
    ]);
    initMobileMenu();
    setActiveLink();
    setYear();
    initReveal();
  });
})();