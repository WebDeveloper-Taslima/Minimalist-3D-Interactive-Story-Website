/* 
 * Convalt Energy - 3D Scene Chapter 02: Power Generation
 * Solar Panel Tracker Field, Grid Energy Particle Stream & Horizon Sun
 */

export class PowerGridScene {
  constructor(scene) {
    this.group = new THREE.Group();
    scene.add(this.group);

    this.initPanelField();
    this.initEnergyGridLines();
  }

  initPanelField() {
    this.panels = [];
    const panelGeo = new THREE.BoxGeometry(2.0, 0.08, 1.3);
    const panelMat = new THREE.MeshStandardMaterial({
      color: 0x0C1F33,
      metalness: 0.95,
      roughness: 0.1,
      emissive: 0x082845,
      emissiveIntensity: 0.6
    });

    const standGeo = new THREE.CylinderGeometry(0.06, 0.1, 1.4, 8);
    const standMat = new THREE.MeshStandardMaterial({ color: 0x5A687C, metalness: 0.8 });

    // 4x4 Grid Array of tracking solar panels
    for (let x = -2; x <= 2; x++) {
      for (let z = -2; z <= 2; z++) {
        if (x === 0 && z === 0) continue;

        const panelHolder = new THREE.Group();
        panelHolder.position.set(x * 2.8, -1.2, z * 2.8);

        // Stand
        const stand = new THREE.Mesh(standGeo, standMat);
        stand.position.y = 0.7;
        panelHolder.add(stand);

        // Panel Module
        const panel = new THREE.Mesh(panelGeo, panelMat);
        panel.position.y = 1.4;
        panel.rotation.x = Math.PI / 5;
        panelHolder.add(panel);

        this.group.add(panelHolder);
        this.panels.push(panel);
      }
    }
  }

  initEnergyGridLines() {
    // Glowing Grid Floor Platform
    const gridHelper = new THREE.GridHelper(22, 22, 0xE29938, 0x2A384A);
    gridHelper.position.y = -1.25;
    this.group.add(gridHelper);

    // Energy Ray Particles flowing upward
    const particleCount = 300;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 18;
      positions[i + 1] = Math.random() * 7 - 1;
      positions[i + 2] = (Math.random() - 0.5) * 18;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x2DB7A1,
      size: 0.14,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    this.energyParticles = new THREE.Points(geometry, material);
    this.group.add(this.energyParticles);
  }

  update(time, opacity = 1) {
    this.group.visible = opacity > 0.01;
    if (!this.group.visible) return;

    // Track sun: rotate panels gradually
    const sunTrackAngle = Math.sin(time * 0.8) * 0.35 + Math.PI / 5;
    this.panels.forEach((panel) => {
      panel.rotation.x = sunTrackAngle;
      panel.rotation.y = Math.cos(time * 0.5) * 0.15;
    });

    // Animate energy particles rising
    if (this.energyParticles) {
      const posArr = this.energyParticles.geometry.attributes.position.array;
      for (let i = 1; i < posArr.length; i += 3) {
        posArr[i] += 0.04;
        if (posArr[i] > 6) posArr[i] = -1;
      }
      this.energyParticles.geometry.attributes.position.needsUpdate = true;
    }

    this.group.position.y = (1 - opacity) * -2;
  }
}
