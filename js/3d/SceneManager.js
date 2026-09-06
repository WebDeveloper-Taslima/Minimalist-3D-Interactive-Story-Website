/* 
 * Convalt Energy - 3D Engine: SceneManager.js
 * Core Three.js WebGL Renderer, Dynamic Mouse Parallax & High-Impact Lighting
 */

export class SceneManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;

    this.isWebGLAvailable = this.checkWebGLSupport();

    if (!this.isWebGLAvailable) {
      console.warn("WebGL not supported or disabled. Falling back to 2D Canvas engine.");
      return;
    }

    this.initThree();
    this.initLights();
    this.initParticles();
    this.bindEvents();
  }

  checkWebGLSupport() {
    try {
      const testCanvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && 
        (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  initThree() {
    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0A0D12, 0.03);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);
    this.camera.position.set(0, 2, 8.5);
    this.camera.lookAt(0, 0, 0);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Clock
    this.clock = new THREE.Clock();
  }

  initLights() {
    // Key Sun Light (Warm Amber)
    this.sunLight = new THREE.DirectionalLight(0xFFF4E0, 3.0);
    this.sunLight.position.set(10, 20, 15);
    this.sunLight.castShadow = true;
    this.scene.add(this.sunLight);

    // Ambient Fill Light (Slate Teal/Cyan)
    this.ambientLight = new THREE.AmbientLight(0x1B263B, 2.0);
    this.scene.add(this.ambientLight);

    // Rim/Accent Light (Amber Gold Glow)
    this.accentLight = new THREE.PointLight(0xE29938, 5.0, 40);
    this.accentLight.position.set(-8, 6, -4);
    this.scene.add(this.accentLight);

    // Cyan Secondary Glow
    this.cyanLight = new THREE.PointLight(0x2DB7A1, 4.0, 35);
    this.cyanLight.position.set(8, -2, -3);
    this.scene.add(this.cyanLight);
  }

  initParticles() {
    const particleCount = 800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 45;
      positions[i + 1] = (Math.random() - 0.5) * 45;
      positions[i + 2] = (Math.random() - 0.5) * 45;
      scales[i / 3] = Math.random() * 0.08 + 0.02;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    const material = new THREE.PointsMaterial({
      color: 0xE29938,
      size: 0.1,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  bindEvents() {
    window.addEventListener('resize', () => this.onWindowResize());
    window.addEventListener('mousemove', (e) => {
      this.targetMouseX = (e.clientX / this.width - 0.5) * 1.5;
      this.targetMouseY = (e.clientY / this.height - 0.5) * 1.5;
    });
  }

  onWindowResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    if (this.camera && this.renderer) {
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
  }

  render(customUpdateCallback) {
    if (!this.isWebGLAvailable) return;

    const elapsedTime = this.clock.getElapsedTime();

    // Lerp mouse parallax offset
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    // Apply mouse parallax shift to camera
    this.camera.position.x += (this.mouseX - this.camera.position.x * 0.1) * 0.05;
    this.camera.position.y += (-this.mouseY - (this.camera.position.y - 1.8) * 0.1) * 0.05;

    // Rotate ambient particles
    if (this.particles) {
      this.particles.rotation.y = elapsedTime * 0.04;
      this.particles.rotation.x = Math.sin(elapsedTime * 0.02) * 0.08;
    }

    if (customUpdateCallback) {
      customUpdateCallback(elapsedTime);
    }

    this.renderer.render(this.scene, this.camera);
  }
}
