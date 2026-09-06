/* 
 * Convalt Energy - 3D Scene Chapter 03: Sustainable Data Centers
 * Zero-Carbon Server Monoliths, Fiber Optics & Liquid Cooling Flow
 */

export class DataCenterScene {
  constructor(scene) {
    this.group = new THREE.Group();
    scene.add(this.group);

    this.initServerMonoliths();
    this.initFiberPipes();
  }

  initServerMonoliths() {
    this.racks = [];
    const rackGeo = new THREE.BoxGeometry(1.4, 5.0, 1.4);
    const rackMat = new THREE.MeshStandardMaterial({
      color: 0x0C121D,
      metalness: 0.95,
      roughness: 0.1,
      emissive: 0x050C16,
      emissiveIntensity: 0.4
    });

    const lightStripGeo = new THREE.BoxGeometry(0.05, 4.8, 0.05);
    const lightStripMat = new THREE.MeshBasicMaterial({
      color: 0x38BDF8,
      transparent: true,
      opacity: 0.95
    });

    // Ring of 6 server towers
    const count = 6;
    const radius = 3.8;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const rackGroup = new THREE.Group();
      rackGroup.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
      rackGroup.rotation.y = -angle + Math.PI / 2;

      // Tower
      const rack = new THREE.Mesh(rackGeo, rackMat);
      rack.castShadow = true;
      rackGroup.add(rack);

      // Fiber Light Strips
      const stripLeft = new THREE.Mesh(lightStripGeo, lightStripMat);
      stripLeft.position.set(-0.65, 0, 0.68);
      rackGroup.add(stripLeft);

      const stripRight = new THREE.Mesh(lightStripGeo, lightStripMat);
      stripRight.position.set(0.65, 0, 0.68);
      rackGroup.add(stripRight);

      this.group.add(rackGroup);
      this.racks.push({ group: rackGroup, stripLeft, stripRight });
    }
  }

  initFiberPipes() {
    // Central glowing core energy conduit
    const coreGeo = new THREE.CylinderGeometry(0.9, 0.9, 6.5, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x2DB7A1,
      metalness: 0.3,
      roughness: 0.1,
      emissive: 0x2DB7A1,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.8
    });
    this.centralCore = new THREE.Mesh(coreGeo, coreMat);
    this.group.add(this.centralCore);

    // Glowing Fiber Ring Connections
    const ringGeo = new THREE.TorusGeometry(3.8, 0.05, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38BDF8,
      wireframe: true
    });
    this.topRing = new THREE.Mesh(ringGeo, ringMat);
    this.topRing.position.y = 2.2;
    this.topRing.rotation.x = Math.PI / 2;
    this.group.add(this.topRing);
  }

  update(time, opacity = 1) {
    this.group.visible = opacity > 0.01;
    if (!this.group.visible) return;

    // Rotate group & core
    this.group.rotation.y = time * 0.2;
    if (this.centralCore) {
      this.centralCore.rotation.y = -time * 0.5;
    }
    if (this.topRing) {
      this.topRing.rotation.z = time * 0.4;
    }

    // Pulse rack light strips
    this.racks.forEach((rack, idx) => {
      const pulse = Math.sin(time * 6 + idx * 1.2) * 0.4 + 0.6;
      rack.stripLeft.material.opacity = pulse;
      rack.stripRight.material.opacity = pulse;
    });

    this.group.position.y = (1 - opacity) * -2;
  }
}
