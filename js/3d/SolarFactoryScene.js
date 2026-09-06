/* 
 * Convalt Energy - 3D Scene Chapter 01: Solar Manufacturing
 * Monocrystalline Silicon Ingot, Sliced Wafers & Laser Assembly Line
 */

export class SolarFactoryScene {
  constructor(scene) {
    this.group = new THREE.Group();
    scene.add(this.group);

    this.initIngotAndWafers();
    this.initLaserGrid();
  }

  initIngotAndWafers() {
    // 1. Monocrystalline Silicon Ingot (Octagonal Cylinder)
    const ingotGeo = new THREE.CylinderGeometry(1.5, 1.5, 4.8, 8);
    const ingotMat = new THREE.MeshStandardMaterial({
      color: 0x2A3545,
      metalness: 0.9,
      roughness: 0.15,
      emissive: 0x0A1525,
      emissiveIntensity: 0.3
    });
    this.ingot = new THREE.Mesh(ingotGeo, ingotMat);
    this.ingot.position.set(-2.2, 0, 0);
    this.ingot.castShadow = true;
    this.ingot.receiveShadow = true;
    this.group.add(this.ingot);

    // Outer Glowing Crystal Frame
    const frameGeo = new THREE.CylinderGeometry(1.6, 1.6, 5.0, 8);
    const frameMat = new THREE.MeshBasicMaterial({
      color: 0xE29938,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    this.ingotFrame = new THREE.Mesh(frameGeo, frameMat);
    this.ingot.add(this.ingotFrame);

    // 2. Array of sliced Silicon Wafers (Floating along Z axis)
    this.wafersGroup = new THREE.Group();
    const waferGeo = new THREE.BoxGeometry(2.4, 0.05, 2.4);
    const waferMat = new THREE.MeshStandardMaterial({
      color: 0x1A283C,
      metalness: 0.95,
      roughness: 0.1,
      emissive: 0x102A45,
      emissiveIntensity: 0.6
    });

    this.wafers = [];
    for (let i = 0; i < 10; i++) {
      const wafer = new THREE.Mesh(waferGeo, waferMat);
      wafer.position.set(2.2, (i - 5) * 0.42, 0);
      wafer.rotation.y = i * 0.2;
      wafer.castShadow = true;
      this.wafersGroup.add(wafer);
      this.wafers.push(wafer);
    }
    this.group.add(this.wafersGroup);
  }

  initLaserGrid() {
    // Precision Laser Line (Amber Glow)
    const laserGeo = new THREE.CylinderGeometry(0.02, 0.02, 7, 8);
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0xE29938,
      transparent: true,
      opacity: 0.95
    });
    this.laser = new THREE.Mesh(laserGeo, laserMat);
    this.laser.position.set(0, 0, 0);
    this.laser.rotation.z = Math.PI / 3;
    this.group.add(this.laser);

    // Floating Grid Ring
    const ringGeo = new THREE.TorusGeometry(3.8, 0.03, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38BDF8,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    this.ring = new THREE.Mesh(ringGeo, ringMat);
    this.ring.rotation.x = Math.PI / 2;
    this.group.add(this.ring);
  }

  update(time, opacity = 1) {
    this.group.visible = opacity > 0.01;
    if (!this.group.visible) return;

    // Rotate ingot & ring
    if (this.ingot) {
      this.ingot.rotation.y = time * 0.6;
      this.ingot.rotation.x = Math.sin(time * 0.4) * 0.15;
    }
    if (this.ring) {
      this.ring.rotation.z = time * 0.3;
    }

    // Animate wafer levitation wave
    this.wafers.forEach((wafer, idx) => {
      wafer.position.y = (idx - 5) * 0.42 + Math.sin(time * 2.5 + idx * 0.4) * 0.12;
      wafer.rotation.y = idx * 0.2 + time * 0.3;
    });

    // Pulse laser opacity & position
    if (this.laser) {
      this.laser.material.opacity = 0.5 + Math.sin(time * 8) * 0.45;
      this.laser.position.y = Math.sin(time * 2) * 0.5;
    }

    // Adjust group scale/position for transition
    this.group.position.y = (1 - opacity) * -2;
  }
}
