/* 
 * Convalt Energy - Subpage Interactive Hero Canvas Engine: SubpageHeroCanvas.js
 * Renders live 3D geometric nodes and ambient floating particle arrays behind sub-page hero banners.
 */

export class SubpageHeroCanvas {
  constructor(containerId, themeType = 'default') {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.width = this.container.clientWidth || window.innerWidth;
    this.height = this.container.clientHeight || 300;
    this.themeType = themeType;

    this.initCanvas();
    this.initParticles();
    this.bindEvents();
    this.animate(0);
  }

  initCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '0';
    this.container.style.position = 'relative';
    this.container.style.overflow = 'hidden';
    this.container.prepend(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.resize();
  }

  resize() {
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());
    this.mouseX = 0;
    this.mouseY = 0;
    window.addEventListener('mousemove', (e) => {
      this.mouseX = (e.clientX / window.innerWidth - 0.5) * 40;
      this.mouseY = (e.clientY / window.innerHeight - 0.5) * 40;
    });
  }

  initParticles() {
    this.nodes = [];
    const count = 45;

    const colors = {
      default: ['#E29938', '#2DB7A1', '#38BDF8'],
      projects: ['#E29938', '#F59E0B', '#38BDF8'],
      team: ['#2DB7A1', '#10B981', '#6366F1'],
      media: ['#38BDF8', '#818CF8', '#E29938'],
      resources: ['#2DB7A1', '#E29938', '#34D399'],
      contact: ['#E29938', '#F43F5E', '#38BDF8']
    };

    const palette = colors[this.themeType] || colors.default;

    for (let i = 0; i < count; i++) {
      this.nodes.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 2.5 + 1,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        color: palette[i % palette.length],
        alpha: Math.random() * 0.6 + 0.25
      });
    }
  }

  animate(time) {
    requestAnimationFrame((t) => this.animate(t));
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    const timeSec = time * 0.001;

    // Draw connecting geometry constellation lines
    for (let i = 0; i < this.nodes.length; i++) {
      const n1 = this.nodes[i];
      for (let j = i + 1; j < this.nodes.length; j++) {
        const n2 = this.nodes[j];
        const dx = n1.x - n2.x;
        const dy = n1.y - n2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          this.ctx.beginPath();
          this.ctx.moveTo(n1.x + (this.mouseX || 0) * 0.2, n1.y + (this.mouseY || 0) * 0.2);
          this.ctx.lineTo(n2.x + (this.mouseX || 0) * 0.2, n2.y + (this.mouseY || 0) * 0.2);
          const lineAlpha = (1 - dist / 130) * 0.25;
          this.ctx.strokeStyle = `rgba(226, 153, 56, ${lineAlpha})`;
          this.ctx.lineWidth = 0.8;
          this.ctx.stroke();
        }
      }
    }

    // Draw glowing node points
    this.nodes.forEach((node) => {
      node.x += node.vx + Math.sin(timeSec + node.y * 0.02) * 0.15;
      node.y += node.vy + Math.cos(timeSec + node.x * 0.02) * 0.15;

      if (node.x < 0) node.x = this.width;
      if (node.x > this.width) node.x = 0;
      if (node.y < 0) node.y = this.height;
      if (node.y > this.height) node.y = 0;

      const px = node.x + (this.mouseX || 0) * 0.2;
      const py = node.y + (this.mouseY || 0) * 0.2;

      this.ctx.beginPath();
      this.ctx.arc(px, py, node.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = node.color;
      this.ctx.globalAlpha = node.alpha;
      this.ctx.fill();
    });
    this.ctx.globalAlpha = 1.0;
  }
}
