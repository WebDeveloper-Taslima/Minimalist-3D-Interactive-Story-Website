/* 
 * Convalt Energy - 3D Narrative Engine: ChapterManager.js
 * Controls Chapter Transitions, Camera Trajectories, Smooth Scroll Interpolation & Scene Opacities
 */

import { SolarFactoryScene } from './SolarFactoryScene.js';
import { PowerGridScene } from './PowerGridScene.js';
import { DataCenterScene } from './DataCenterScene.js';
import { RecyclingScene } from './RecyclingScene.js';

export class ChapterManager {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.scene = sceneManager.scene;
    this.camera = sceneManager.camera;

    this.currentChapterIndex = 0;
    this.scrollProgress = 0; // 0 to 1
    this.targetProgress = 0;

    // Define 4 Chapter Camera Targets (Position & LookAt)
    this.cameraTargets = [
      { pos: new THREE.Vector3(0, 1.8, 8.5), look: new THREE.Vector3(0, 0, 0) },   // Ch 1: Factory
      { pos: new THREE.Vector3(0, 3.5, 11), look: new THREE.Vector3(0, -0.5, 0) }, // Ch 2: Power Grid
      { pos: new THREE.Vector3(0, 1.2, 9), look: new THREE.Vector3(0, 0, 0) },    // Ch 3: Data Center
      { pos: new THREE.Vector3(0, 2.2, 8), look: new THREE.Vector3(0, 0, 0) }     // Ch 4: Recycling
    ];

    this.initScenes();
    this.bindScroll();
  }

  initScenes() {
    this.ch1Factory = new SolarFactoryScene(this.scene);
    this.ch2PowerGrid = new PowerGridScene(this.scene);
    this.ch3DataCenter = new DataCenterScene(this.scene);
    this.ch4Recycling = new RecyclingScene(this.scene);

    this.chapters = [
      this.ch1Factory,
      this.ch2PowerGrid,
      this.ch3DataCenter,
      this.ch4Recycling
    ];
  }

  bindScroll() {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      this.targetProgress = maxScroll > 0 ? Math.min(Math.max(scrollY / maxScroll, 0), 1) : 0;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  update(time) {
    // Smooth lerp progress
    this.scrollProgress += (this.targetProgress - this.scrollProgress) * 0.08;

    // Calculate fractional chapter index (0.0 to 3.0)
    const rawChapterIndex = this.scrollProgress * (this.chapters.length - 1);
    const primaryIndex = Math.min(Math.floor(rawChapterIndex), this.chapters.length - 1);
    const nextIndex = Math.min(primaryIndex + 1, this.chapters.length - 1);
    const chapterFraction = rawChapterIndex - primaryIndex;

    this.currentChapterIndex = chapterFraction > 0.5 ? nextIndex : primaryIndex;

    // Interpolate Camera Position & LookAt
    const startCam = this.cameraTargets[primaryIndex];
    const endCam = this.cameraTargets[nextIndex];

    const currentPos = new THREE.Vector3().lerpVectors(startCam.pos, endCam.pos, chapterFraction);
    const currentLook = new THREE.Vector3().lerpVectors(startCam.look, endCam.look, chapterFraction);

    this.camera.position.lerp(currentPos, 0.1);
    this.camera.lookAt(currentLook);

    // Update each chapter with blended opacity for smooth scene cross-fades
    this.chapters.forEach((ch, idx) => {
      let opacity = 0;
      if (idx === primaryIndex) {
        opacity = 1 - chapterFraction;
      } else if (idx === nextIndex) {
        opacity = chapterFraction;
      }
      ch.update(time, opacity);
    });
  }

  jumpToChapter(index) {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetScrollY = (index / (this.chapters.length - 1)) * maxScroll;

    if (window.gsap) {
      window.gsap.to(window, {
        scrollTo: targetScrollY,
        duration: 1.2,
        ease: "power2.inOut"
      });
    } else {
      window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
    }
  }
}
