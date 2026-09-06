/* 
 * Convalt Energy - Fallback 2D Canvas Engine
 * High-performance 2D particle wave fallback for low-power mobile & legacy browsers
 */

export class FallbackScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.particles = [];
    this.initParticles();

    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    });
  }

  initParticles() {
    const count = 120;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.6 + 0.2
      });
    }
  }

  render(time) {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw subtle particle wave
    this.particles.forEach((p) => {
      p.x += p.speedX + Math.sin(time + p.y * 0.01) * 0.2;
      p.y += p.speedY + Math.cos(time + p.x * 0.01) * 0.2;

      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(226, 153, 56, ${p.alpha})`;
      this.ctx.fill();
    });
  }
}
