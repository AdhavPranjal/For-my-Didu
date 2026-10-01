/**
 * Floating Hearts & Sparkles Canvas Engine
 * Creates a lightweight ambient background effect with rising hearts and twinkling stars.
 */

class FloatingHeartsEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.maxParticles = 35; // Lightweight limit
    
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    
    this.initParticles();
    this.animate();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push(this.createParticle(true));
    }
  }

  createParticle(randomY = false) {
    const types = ['heart', 'sparkle', 'dot'];
    const colors = ['#FF758F', '#FFB3C1', '#FF4D6D', '#FFD166', '#E0AFA0'];
    
    return {
      x: Math.random() * this.canvas.width,
      y: randomY ? Math.random() * this.canvas.height : this.canvas.height + 20,
      size: Math.random() * 14 + 8,
      speedY: Math.random() * 0.8 + 0.3,
      speedX: (Math.random() - 0.5) * 0.5,
      type: types[Math.floor(Math.random() * types.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.6 + 0.2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02
    };
  }

  drawHeart(x, y, size, color, opacity, rotation) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(rotation);
    this.ctx.globalAlpha = opacity;
    this.ctx.fillStyle = color;
    
    this.ctx.beginPath();
    const topCurveHeight = size * 0.3;
    this.ctx.moveTo(0, topCurveHeight);
    // Left curve
    this.ctx.bezierCurveTo(-size / 2, -topCurveHeight, -size, size / 3, 0, size);
    // Right curve
    this.ctx.bezierCurveTo(size, size / 3, size / 2, -topCurveHeight, 0, topCurveHeight);
    this.ctx.closePath();
    this.ctx.fill();
    
    this.ctx.restore();
  }

  drawSparkle(x, y, size, color, opacity) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.globalAlpha = opacity;
    this.ctx.fillStyle = color;

    this.ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      this.ctx.lineTo(0, size);
      this.ctx.quadraticCurveTo(0, 0, size, 0);
      this.ctx.rotate(Math.PI / 2);
    }
    this.ctx.fill();
    this.ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let p of this.particles) {
      p.y -= p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotationSpeed;

      // Draw particle based on type
      if (p.type === 'heart') {
        this.drawHeart(p.x, p.y, p.size, p.color, p.opacity, p.rotation);
      } else if (p.type === 'sparkle') {
        this.drawSparkle(p.x, p.y, p.size * 0.6, p.color, p.opacity);
      } else {
        this.ctx.save();
        this.ctx.globalAlpha = p.opacity;
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size * 0.25, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }

      // Reset when particle floats off top screen
      if (p.y < -30) {
        Object.assign(p, this.createParticle(false));
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Initialize engine when window loads
window.addEventListener('DOMContentLoaded', () => {
  new FloatingHeartsEngine('particle-canvas');
});
