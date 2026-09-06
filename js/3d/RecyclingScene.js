/* 
 * Convalt Energy - 3D Scene Chapter 04: Solar Recycling & Circular Economy
 * Mobius Closed Loop Knot & Orbiting Panel Component Fragments
 */

export class RecyclingScene {
  constructor(scene) {
    this.group = new THREE.Group();
    scene.add(this.group);

    this.initCircularNode();
    this.initReclaimedFragments();
  }

  initCircularNode() {
    // Mobius / Torus Ring symbolizing Closed-Loop Circular Economy
    const torusGeo = new THREE.TorusKnotGeometry(2.4, 0.4, 128, 32);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0xE29938,
      metalness: 0.95,
      roughness: 0.1,
      emissive: 0x7A4A0A,
      emissiveIntensity: 0.6
    });
    this.knot = new THREE.Mesh(torusGeo, torusMat);
    this.knot.castShadow = true;
    this.group.add(this.knot);

    // Inner Silicon Raw Sphere
    const sphereGeo = new THREE.IcosahedronGeometry(1.2, 2);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x2DB7A1,
      wireframe: true,
      emissive: 0x2DB7A1,
      emissiveIntensity: 0.6
    });
    this.sphere = new THREE.Mesh(sphereGeo, sphereMat);
    this.group.add(this.sphere);
  }

  initReclaimedFragments() {
    this.fragments = [];
    const fragGeometries = [
      new THREE.TetrahedronGeometry(0.3),
      new THREE.BoxGeometry(0.35, 0.06, 0.35),
      new THREE.OctahedronGeometry(0.25)
    ];

    const fragMat = new THREE.MeshStandardMaterial({
      color: 0xF0F3F8,
      metalness: 0.85,
      roughness: 0.15,
      emissive: 0x2A384A,
      emissiveIntensity: 0.4
    });

    const fragmentCount = 42;
    for (let i = 0; i < fragmentCount; i++) {
      const geo = fragGeometries[i % fragGeometries.length];
      const frag = new THREE.Mesh(geo, fragMat);

      const radius = 3.8 + Math.random() * 1.8;
      const angle = (i / fragmentCount) * Math.PI * 2;
      const height = (Math.random() - 0.5) * 3.5;

      frag.position.set(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
      frag.userData = { angle, radius, height, speed: 0.4 + Math.random() * 0.5 };

      this.group.add(frag);
      this.fragments.push(frag);
    }
  }

  update(time, opacity = 1) {
    this.group.visible = opacity > 0.01;
    if (!this.group.visible) return;

    // Rotate Mobius Knot & Inner Sphere
    if (this.knot) {
      this.knot.rotation.x = time * 0.4;
      this.knot.rotation.y = time * 0.5;
    }
    if (this.sphere) {
      this.sphere.rotation.y = -time * 0.6;
      this.sphere.rotation.z = time * 0.3;
    }

    // Orbit fragments
    this.fragments.forEach((frag) => {
      frag.userData.angle += frag.userData.speed * 0.012;
      frag.position.x = Math.cos(frag.userData.angle) * frag.userData.radius;
      frag.position.z = Math.sin(frag.userData.angle) * frag.userData.radius;
      frag.position.y = frag.userData.height + Math.sin(time * 2.5 + frag.userData.angle) * 0.25;
      frag.rotation.x += 0.03;
      frag.rotation.y += 0.04;
    });

    this.group.position.y = (1 - opacity) * -2;
  }
}
