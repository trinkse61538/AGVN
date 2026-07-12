(() => {
  'use strict';

  const header = document.querySelector('.agvn-site-header');
  if (!header) return;

  const menuButton = header.querySelector('.agvn-menu-toggle');
  const nav = header.querySelector('.agvn-primary-nav');
  const dropdownItem = header.querySelector('.agvn-nav-item--products');
  const dropdownButton = header.querySelector('.agvn-dropdown-button');

  const closeMenu = () => {
    header.classList.remove('is-menu-open');
    if (menuButton) menuButton.setAttribute('aria-expanded', 'false');
    if (dropdownItem) dropdownItem.classList.remove('is-open');
    if (dropdownButton) dropdownButton.setAttribute('aria-expanded', 'false');
  };

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const isOpen = header.classList.toggle('is-menu-open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
    });
  }

  if (dropdownButton && dropdownItem) {
    dropdownButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const isOpen = dropdownItem.classList.toggle('is-open');
      dropdownButton.setAttribute('aria-expanded', String(isOpen));
    });
  }

  header.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.matchMedia('(max-width: 1060px)').matches) closeMenu();
    });
  });

  document.addEventListener('click', (event) => {
    if (!header.contains(event.target) && dropdownItem) {
      dropdownItem.classList.remove('is-open');
      if (dropdownButton) dropdownButton.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (!window.matchMedia('(max-width: 1060px)').matches) closeMenu();
  });

  const path = window.location.pathname.toLowerCase();
  let active = 'home';
  if (path.includes('aboutus')) active = 'about';
  else if (path.includes('quytrinhcanhtaclua') || path.includes('quytrinh2')) active = 'process';
  else if (path.includes('tintuc') || path.includes('/tin-tuc/')) active = 'news';
  else if (path.includes('/san-pham/') || path.includes('product')) active = 'products';

  const activeLink = header.querySelector(`[data-nav="${active}"]`);
  if (activeLink) {
    activeLink.classList.add('is-active');
    activeLink.setAttribute('aria-current', 'page');
  }
})();
