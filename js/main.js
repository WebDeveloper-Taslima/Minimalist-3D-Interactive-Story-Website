/* 
 * Convalt Energy - Main Application Entry Point: js/main.js
 * Bootstraps WebGL Engine, Story Controller, Audio & UI
 */

import { SceneManager } from './3d/SceneManager.js';
import { ChapterManager } from './3d/ChapterManager.js';
import { FallbackScene } from './3d/FallbackScene.js';
import { AudioSynthesizer } from './ui/AudioSynthesizer.js';
import { Navigation } from './ui/Navigation.js';
import { StoryUI } from './ui/StoryUI.js';

// Prevent browser from restoring scroll position on reload to ensure consistent top chapter start
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0);

  const canvas = document.getElementById('webgl-canvas');
  const fallbackCanvas = document.getElementById('fallback-canvas');

  // Initialize Global UI Controllers
  const nav = new Navigation();
  const audio = new AudioSynthesizer();

  let sceneManager = null;
  let chapterManager = null;
  let fallbackEngine = null;
  let storyUI = null;

  // Initialize 3D Engine or Fallback Engine
  sceneManager = new SceneManager(canvas);

  if (sceneManager.isWebGLAvailable) {
    chapterManager = new ChapterManager(sceneManager);
    storyUI = new StoryUI(chapterManager, audio);

    // Main 60 FPS WebGL Render Loop
    function animate() {
      requestAnimationFrame(animate);
      sceneManager.render((elapsedTime) => {
        if (chapterManager) {
          chapterManager.update(elapsedTime);
          storyUI.updateHUD(chapterManager.currentChapterIndex);
        }
      });
    }
    animate();
  } else {
    // Show 2D Canvas Fallback for low-spec/non-WebGL devices
    if (fallbackCanvas) {
      fallbackCanvas.style.display = 'block';
      fallbackEngine = new FallbackScene(fallbackCanvas);

      function animateFallback(time) {
        requestAnimationFrame(animateFallback);
        fallbackEngine.render(time * 0.001);
      }
      animateFallback(0);
    }
  }

  console.log("Convalt Energy 3D Experience Initialized Successfully.");
});
