/* 
 * Convalt Energy - UI Navigation Controller: Navigation.js
 * Header Navigation, Theme Switcher (Dark/Light) & Mobile Drawer
 */

export class Navigation {
  constructor() {
    this.header = document.querySelector('.site-header');
    this.themeBtn = document.getElementById('theme-toggle');
    this.mobileToggle = document.getElementById('mobile-toggle');
    this.mobileDrawer = document.getElementById('mobile-drawer');

    this.initTheme();
    this.bindEvents();
  }

  initTheme() {
    const savedTheme = localStorage.getItem('convalt_theme') || 'dark';
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
      this.updateThemeIcon('light');
    }
  }

  bindEvents() {
    // Theme Toggle
    if (this.themeBtn) {
      this.themeBtn.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('light-theme');
        const newTheme = isLight ? 'light' : 'dark';
        localStorage.setItem('convalt_theme', newTheme);
        this.updateThemeIcon(newTheme);
      });
    }

    // Mobile Drawer Toggle
    if (this.mobileToggle && this.mobileDrawer) {
      this.mobileToggle.addEventListener('click', () => {
        this.mobileDrawer.classList.toggle('active');
        const isOpen = this.mobileDrawer.classList.contains('active');
        this.mobileToggle.innerHTML = isOpen ? '✕' : '☰';
      });
    }
  }

  updateThemeIcon(theme) {
    if (this.themeBtn) {
      this.themeBtn.innerHTML = theme === 'light' ? '🌙' : '☀️';
    }
  }
}
