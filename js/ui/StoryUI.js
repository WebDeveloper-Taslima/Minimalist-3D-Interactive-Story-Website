/* 
 * Convalt Energy - UI Story Overlay Controller: StoryUI.js
 * Chapter HUD Dot Tracking, Content Card Fading & Inspection Modals
 */

export class StoryUI {
  constructor(chapterManager, audioSynthesizer) {
    this.chapterManager = chapterManager;
    this.audioSynthesizer = audioSynthesizer;

    this.hudDots = document.querySelectorAll('.hud-dot-item');
    this.cards = document.querySelectorAll('.chapter-content-card');
    this.audioBtn = document.getElementById('audio-toggle');
    this.tooltip = document.getElementById('3d-tooltip');

    this.bindEvents();
  }

  bindEvents() {
    // HUD Dot click -> Jump to Chapter
    this.hudDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        this.chapterManager.jumpToChapter(index);
      });
    });

    // Audio Toggle Button
    if (this.audioBtn && this.audioSynthesizer) {
      this.audioBtn.addEventListener('click', () => {
        const isMuted = this.audioSynthesizer.toggle();
        if (isMuted) {
          this.audioBtn.classList.add('muted');
          this.audioBtn.querySelector('.audio-label').textContent = 'AUDIO OFF';
        } else {
          this.audioBtn.classList.remove('muted');
          this.audioBtn.querySelector('.audio-label').textContent = 'AUDIO AMBIENCE';
        }
      });
    }

    // Modal Trigger Buttons
    document.querySelectorAll('.inspect-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const title = e.currentTarget.dataset.title;
        const details = e.currentTarget.dataset.details;
        this.showModal(title, details);
      });
    });
  }

  updateHUD(activeChapterIndex) {
    // Update active HUD dot
    this.hudDots.forEach((dot, idx) => {
      if (idx === activeChapterIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Update active chapter content card
    this.cards.forEach((card, idx) => {
      if (idx === activeChapterIndex) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  }

  showModal(title, details) {
    const backdrop = document.getElementById('global-modal-backdrop');
    if (!backdrop) return;

    backdrop.querySelector('.modal-title').textContent = title;
    backdrop.querySelector('.modal-body-text').textContent = details;
    backdrop.classList.add('active');

    const closeBtn = backdrop.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.onclick = () => backdrop.classList.remove('active');
    }
    backdrop.onclick = (e) => {
      if (e.target === backdrop) backdrop.classList.remove('active');
    };
  }
}
