// ============================================================
// 游戏常量配置
// ============================================================
const CONFIG = {
  CANVAS_WIDTH: 1280,
  CANVAS_HEIGHT: 720,
  GRAVITY: 0.6,
  FRICTION: 0.85,
  PLAYER_SPEED: 5,
  PLAYER_JUMP: -14,
  DOUBLE_JUMP: -12,
  TILE_SIZE: 40,
  MAX_FPS: 60,
  COLORS: {
    PLAYER: '#4A90D9',
    PLAYER_ATTACK: '#FF6B6B',
    ENEMY: '#E74C3C',
    BOSS: '#9B59B6',
    PLATFORM: '#34495E',
    GROUND: '#27AE60',
    HP_BAR: '#E74C3C',
    HP_BG: '#2C3E50',
    MAGIC: '#F39C12',
    SKILL: '#9B59B6',
    TEXT: '#ECF0F1'
  }
};

// ============================================================
// 输入管理器
// ============================================================
class InputManager {
  constructor() {
    this.keys = {};
    this.justPressed = {};

    document.addEventListener('keydown', (e) => {
      if (!this.keys[e.code]) {
        this.justPressed[e.code] = true;
      }
      this.keys[e.code] = true;
    });

    document.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
  }

  isPressed(code) {
    return !!this.keys[code];
  }

  wasJustPressed(code) {
    return !!this.justPressed[code];
  }

  update() {
    // 清除 justPressed 状态
    for (const key in this.justPressed) {
      this.justPressed[key] = false;
    }
  }
}

// ============================================================
// 碰撞检测工具
// ============================================================
class Collider {
  static check(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
  }

  static getOverlap(a, b) {
    const dx = (a.x + a.width / 2) - (b.x + b.width / 2);
    const dy = (a.y + a.height / 2) - (b.y + b.height / 2);
    const width = (a.width + b.width) / 2;
    const height = (a.height + b.height) / 2;
    const crossWidth = width * Math.abs(dy);
    const crossHeight = height * Math.abs(dx);

    let axis, magnitude;
    if (crossWidth > crossHeight) {
      axis = dx > 0 ? 'left' : 'right';
      magnitude = dx > 0 ? (a.x + a.width) - b.x : b.x + b.width - a.x;
    } else {
      axis = dy > 0 ? 'top' : 'bottom';
      magnitude = dy > 0 ? (a.y + a.height) - b.y : b.y + b.height - a.y;
    }
    return { axis, magnitude };
  }
}

// ============================================================
// 粒子系统
// ============================================================
class Particle {
  constructor(x, y, color, vx, vy, life) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.vx = vx;
    this.vy = vy;
    this.life = life;
    this.maxLife = life;
    this.size = Math.random() * 4 + 2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.2; // 重力
    this.life--;
  }

  draw(ctx, camera) {
    const alpha = this.life / this.maxLife;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - camera.x, this.y - camera.y, this.size, this.size);
    ctx.globalAlpha = 1;
  }
}

class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  emit(x, y, count, color, speed = 3) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const vel = speed * (0.5 + Math.random() * 0.5);
      this.particles.push(new Particle(
        x, y, color,
        Math.cos(angle) * vel,
        Math.sin(angle) * vel,
        30 + Math.random() * 20
      ));
    }
  }

  update() {
    this.particles = this.particles.filter(p => {
      p.update();
      return p.life > 0;
    });
  }

  draw(ctx, camera) {
    this.particles.forEach(p => p.draw(ctx, camera));
  }
}
