// ============================================================
// 关卡数据
// ============================================================
const LEVELS = [
  {
    name: "第一关：森林迷宫",
    background: '#1a472a',
    platforms: [
      // 地面
      { x: 0, y: 650, width: 1280, height: 70 },
      // 平台
      { x: 200, y: 520, width: 150, height: 20 },
      { x: 450, y: 450, width: 150, height: 20 },
      { x: 700, y: 380, width: 150, height: 20 },
      { x: 950, y: 450, width: 150, height: 20 },
      { x: 150, y: 320, width: 100, height: 20 },
      { x: 1000, y: 300, width: 100, height: 20 },
    ],
    enemies: [
      { type: 'slime', x: 300, y: 500 },
      { type: 'slime', x: 500, y: 500 },
      { type: 'slime', x: 700, y: 500 },
      { type: 'slime', x: 900, y: 500 },
      { type: 'slime', x: 1100, y: 500 },
      { type: 'slime', x: 400, y: 400 },
      { type: 'slime', x: 800, y: 400 },
      { type: 'slime', x: 600, y: 300 },
    ],
    boss: { type: 'forest_giant', x: 1100, y: 550 },
    spawnX: 100,
    spawnY: 550
  },
  {
    name: "第二关：冰雪洞穴",
    background: '#1a3a5c',
    platforms: [
      { x: 0, y: 650, width: 500, height: 70 },
      { x: 600, y: 650, width: 680, height: 70 },
      { x: 200, y: 500, width: 120, height: 20 },
      { x: 400, y: 420, width: 120, height: 20 },
      { x: 600, y: 500, width: 120, height: 20 },
      { x: 800, y: 420, width: 120, height: 20 },
      { x: 1000, y: 500, width: 120, height: 20 },
      { x: 300, y: 300, width: 100, height: 20 },
      { x: 900, y: 300, width: 100, height: 20 },
    ],
    enemies: [
      { type: 'skeleton', x: 250, y: 500 },
      { type: 'skeleton', x: 450, y: 500 },
      { type: 'skeleton', x: 650, y: 500 },
      { type: 'skeleton', x: 850, y: 500 },
      { type: 'skeleton', x: 1050, y: 500 },
      { type: 'skeleton', x: 350, y: 380 },
      { type: 'skeleton', x: 750, y: 380 },
      { type: 'skeleton', x: 100, y: 400 },
      { type: 'skeleton', x: 550, y: 400 },
      { type: 'skeleton', x: 950, y: 400 },
      { type: 'skeleton', x: 1200, y: 400 },
    ],
    boss: { type: 'ice_dragon', x: 1100, y: 550 },
    spawnX: 100,
    spawnY: 550
  },
  {
    name: "第三关：火山遗迹",
    background: '#4a1a1a',
    platforms: [
      { x: 0, y: 650, width: 300, height: 70 },
      { x: 400, y: 650, width: 200, height: 70 },
      { x: 700, y: 650, width: 580, height: 70 },
      { x: 150, y: 500, width: 100, height: 20 },
      { x: 350, y: 420, width: 100, height: 20 },
      { x: 550, y: 500, width: 100, height: 20 },
      { x: 750, y: 420, width: 100, height: 20 },
      { x: 950, y: 500, width: 100, height: 20 },
      { x: 1100, y: 350, width: 150, height: 20 },
      { x: 500, y: 300, width: 100, height: 20 },
    ],
    enemies: [
      { type: 'fire_demon', x: 200, y: 500 },
      { type: 'fire_demon', x: 450, y: 500 },
      { type: 'fire_demon', x: 750, y: 500 },
      { type: 'fire_demon', x: 1000, y: 500 },
      { type: 'fire_demon', x: 1200, y: 500 },
      { type: 'fire_demon', x: 300, y: 380 },
      { type: 'fire_demon', x: 800, y: 380 },
      { type: 'fire_demon', x: 1100, y: 300 },
      { type: 'skeleton', x: 600, y: 500 },
      { type: 'skeleton', x: 900, y: 500 },
      { type: 'slime', x: 150, y: 450 },
      { type: 'slime', x: 1050, y: 450 },
    ],
    boss: { type: 'flame_lord', x: 1100, y: 550 },
    spawnX: 100,
    spawnY: 550
  },
  {
    name: "第四关：暗黑城堡",
    background: '#0a0a1a',
    platforms: [
      { x: 0, y: 650, width: 1280, height: 70 },
      { x: 200, y: 500, width: 100, height: 20 },
      { x: 400, y: 420, width: 100, height: 20 },
      { x: 600, y: 500, width: 100, height: 20 },
      { x: 800, y: 420, width: 100, height: 20 },
      { x: 1000, y: 500, width: 100, height: 20 },
      { x: 300, y: 300, width: 80, height: 20 },
      { x: 900, y: 300, width: 80, height: 20 },
      { x: 600, y: 200, width: 200, height: 20 },
    ],
    enemies: [
      { type: 'skeleton', x: 300, y: 500 },
      { type: 'skeleton', x: 500, y: 500 },
      { type: 'skeleton', x: 700, y: 500 },
      { type: 'skeleton', x: 900, y: 500 },
      { type: 'skeleton', x: 1100, y: 500 },
      { type: 'fire_demon', x: 200, y: 450 },
      { type: 'fire_demon', x: 800, y: 450 },
      { type: 'slime', x: 400, y: 380 },
      { type: 'slime', x: 600, y: 380 },
      { type: 'slime', x: 1000, y: 380 },
      { type: 'skeleton', x: 100, y: 400 },
      { type: 'skeleton', x: 1200, y: 400 },
      { type: 'fire_demon', x: 350, y: 280 },
      { type: 'fire_demon', x: 950, y: 280 },
      { type: 'slime', x: 650, y: 280 },
    ],
    boss: { type: 'dark_mage', x: 1100, y: 550 },
    spawnX: 100,
    spawnY: 550
  },
  {
    name: "第五关：虚空王座",
    background: '#1a0a2e',
    platforms: [
      { x: 0, y: 650, width: 200, height: 70 },
      { x: 300, y: 650, width: 150, height: 70 },
      { x: 550, y: 650, width: 150, height: 70 },
      { x: 800, y: 650, width: 150, height: 70 },
      { x: 1050, y: 650, width: 230, height: 70 },
      { x: 150, y: 500, width: 80, height: 20 },
      { x: 350, y: 420, width: 80, height: 20 },
      { x: 550, y: 500, width: 80, height: 20 },
      { x: 750, y: 420, width: 80, height: 20 },
      { x: 950, y: 500, width: 80, height: 20 },
      { x: 1150, y: 420, width: 80, height: 20 },
      { x: 250, y: 300, width: 100, height: 20 },
      { x: 600, y: 250, width: 100, height: 20 },
      { x: 900, y: 300, width: 100, height: 20 },
    ],
    enemies: [
      { type: 'skeleton', x: 250, y: 500 },
      { type: 'skeleton', x: 450, y: 500 },
      { type: 'skeleton', x: 650, y: 500 },
      { type: 'skeleton', x: 850, y: 500 },
      { type: 'skeleton', x: 1050, y: 500 },
      { type: 'fire_demon', x: 150, y: 450 },
      { type: 'fire_demon', x: 750, y: 450 },
      { type: 'fire_demon', x: 1150, y: 450 },
      { type: 'slime', x: 350, y: 380 },
      { type: 'slime', x: 550, y: 380 },
      { type: 'slime', x: 950, y: 380 },
      { type: 'skeleton', x: 100, y: 400 },
      { type: 'skeleton', x: 500, y: 400 },
      { type: 'skeleton', x: 1200, y: 400 },
      { type: 'fire_demon', x: 300, y: 280 },
      { type: 'fire_demon', x: 700, y: 280 },
      { type: 'slime', x: 900, y: 280 },
      { type: 'skeleton', x: 200, y: 250 },
      { type: 'skeleton', x: 800, y: 250 },
      { type: 'slime', x: 1100, y: 380 },
    ],
    boss: { type: 'void_emperor', x: 1100, y: 550 },
    spawnX: 100,
    spawnY: 550
  }
];

// ============================================================
// Boss 定义
// ============================================================
class ForestGiant extends Boss {
  constructor(x, y) {
    super(x, y, '🌿 森林巨人', 200, 15);
    this.speed = 1.5;
    this.stompCooldown = 0;
  }

  update(player, platforms, particles) {
    super.update(player, platforms, particles);

    // 跺地震波
    this.stompCooldown++;
    if (this.stompCooldown > 120 && Math.abs(player.x - this.x) < 300) {
      this.stompCooldown = 0;
      particles.emit(this.x + this.width/2, this.y + this.height, 10, '#8B4513', 5);
      // 震波伤害
      if (Math.abs(player.x - this.x) < 100 && player.y > this.y) {
        player.takeDamage(this.attack);
      }
    }
  }

  draw(ctx, camera) {
    if (!this.alive) return;
    const x = this.x - camera.x;
    const y = this.y - camera.y;

    ctx.fillStyle = this.hitTimer > 0 ? '#FFF' : '#8B4513';
    ctx.fillRect(x, y, this.width, this.height);

    // 树干手臂
    ctx.fillStyle = '#654321';
    ctx.fillRect(x - 20, y + 20, 20, 40);
    ctx.fillRect(x + this.width, y + 20, 20, 40);

    // 眼睛
    ctx.fillStyle = '#2ECC71';
    ctx.fillRect(x + 15, y + 25, 15, 15);
    ctx.fillRect(x + 50, y + 25, 15, 15);

    this.drawBossHpBar(ctx, x, y - 30, this.width, 10);
  }
}

class IceDragon extends Boss {
  constructor(x, y) {
    super(x, y, '❄️ 冰龙', 350, 20);
    this.speed = 2;
    this.flying = false;
    this.diveCooldown = 0;
  }

  update(player, platforms, particles) {
    if (!this.alive) return;

    // 飞行模式
    if (this.phase >= 2) {
      this.flying = true;
      this.y = 300 + Math.sin(Date.now() / 500) * 50;
    }

    const dx = player.x - this.x;
    this.facing = dx > 0 ? 1 : -1;

    if (!this.flying) {
      this.vx = this.facing * this.speed;
    } else {
      // 俯冲攻击
      this.diveCooldown++;
      if (this.diveCooldown > 100) {
        this.diveCooldown = 0;
        this.vy = -15;
        this.vx = this.facing * 12;
      }
    }

    this.vy += CONFIG.GRAVITY * 0.5;
    this.x += this.vx;
    this.y += this.vy;

    // 边界
    this.x = Math.max(0, Math.min(CONFIG.CANVAS_WIDTH - this.width, this.x));
    if (this.y > 550) {
      this.y = 550;
      this.vy = 0;
      this.flying = false;
    }

    // 冰息攻击
    if (this.hitTimer <= 0 && Math.random() < 0.02) {
      particles.emit(this.x + this.width/2 + this.facing * 40, this.y + 20, 5, '#74B9FF', 6);
    }
  }

  draw(ctx, camera) {
    if (!this.alive) return;
    const x = this.x - camera.x;
    const y = this.y - camera.y;

    ctx.fillStyle = this.hitTimer > 0 ? '#FFF' : '#74B9FF';
    ctx.fillRect(x, y, this.width, this.height);

    // 龙翼
    ctx.fillStyle = '#A29BFE';
    ctx.fillRect(x - 30, y + 10, 30, 50);
    ctx.fillRect(x + this.width, y + 10, 30, 50);

    // 眼睛
    ctx.fillStyle = '#E74C3C';
    ctx.fillRect(x + 20, y + 25, 12, 12);
    ctx.fillRect(x + 48, y + 25, 12, 12);

    this.drawBossHpBar(ctx, x, y - 30, this.width, 10);
  }
}

class FlameLord extends Boss {
  constructor(x, y) {
    super(x, y, '🔥 炎魔领主', 500, 25);
    this.speed = 2;
    this.summonTimer = 0;
  }

  update(player, platforms, particles) {
    super.update(player, platforms, particles);

    // 召唤小怪
    this.summonTimer++;
    if (this.summonTimer > 180 && this.phase >= 2) {
      this.summonTimer = 0;
      // 在玩家附近生成火焰恶魔
      return { type: 'summon', x: player.x + (Math.random() - 0.5) * 200, y: player.y - 100 };
    }

    // 狂暴效果
    if (this.phase >= 3) {
      particles.emit(this.x + this.width/2, this.y + this.height/2, 2, '#E74C3C', 3);
    }
  }

  draw(ctx, camera) {
    if (!this.alive) return;
    const x = this.x - camera.x;
    const y = this.y - camera.y;

    ctx.fillStyle = this.hitTimer > 0 ? '#FFF' : '#E74C3C';
    ctx.fillRect(x, y, this.width, this.height);

    // 火焰效果
    if (this.phase >= 3) {
      ctx.fillStyle = '#F39C12';
      for (let i = 0; i < 5; i++) {
        const fx = x + Math.random() * this.width;
        const fy = y + Math.random() * this.height;
        ctx.fillRect(fx, fy, 8, 12);
      }
    }

    // 角
    ctx.fillStyle = '#2C3E50';
    ctx.fillRect(x + 10, y - 15, 10, 15);
    ctx.fillRect(x + 60, y - 15, 10, 15);

    this.drawBossHpBar(ctx, x, y - 30, this.width, 10);
  }
}

class DarkMage extends Boss {
  constructor(x, y) {
    super(x, y, '👻 暗黑法师', 600, 18);
    this.speed = 1.5;
    this.teleportTimer = 0;
    this.shieldActive = false;
  }

  update(player, platforms, particles) {
    if (!this.alive) return;

    // 护盾阶段
    if (this.phase >= 2 && !this.shieldActive) {
      this.shieldActive = true;
      particles.emit(this.x + this.width/2, this.y + this.height/2, 20, '#9B59B6', 5);
    }

    // 传送
    this.teleportTimer++;
    if (this.teleportTimer > 90) {
      this.teleportTimer = 0;
      this.x = 100 + Math.random() * (CONFIG.CANVAS_WIDTH - 200);
      particles.emit(this.x + this.width/2, this.y + this.height/2, 10, '#9B59B6', 4);
    }

    // 普通移动
    const dx = player.x - this.x;
    this.facing = dx > 0 ? 1 : -1;
    if (!this.shieldActive) {
      this.vx = this.facing * this.speed;
    }

    this.x += this.vx;
    this.x = Math.max(0, Math.min(CONFIG.CANVAS_WIDTH - this.width, this.x));
  }

  draw(ctx, camera) {
    if (!this.alive) return;
    const x = this.x - camera.x;
    const y = this.y - camera.y;

    ctx.fillStyle = this.hitTimer > 0 ? '#FFF' : '#9B59B6';
    ctx.fillRect(x, y, this.width, this.height);

    // 护盾
    if (this.shieldActive) {
      ctx.strokeStyle = '#E74C3C';
      ctx.lineWidth = 3;
      ctx.strokeRect(x - 5, y - 5, this.width + 10, this.height + 10);
    }

    // 法杖
    ctx.fillStyle = '#F39C12';
    ctx.fillRect(x + this.width, y + 20, 8, 50);

    this.drawBossHpBar(ctx, x, y - 30, this.width, 10);
  }
}

class VoidEmperor extends Boss {
  constructor(x, y) {
    super(x, y, '👑 虚空皇帝', 1000, 30);
    this.speed = 2;
    this.phase = 1;
    this.attackTimer = 0;
  }

  update(player, platforms, particles) {
    if (!this.alive) return;

    // 多阶段转换
    const hpPercent = this.hp / this.maxHp;
    if (hpPercent < 0.25 && this.phase < 4) this.phase = 4;
    else if (hpPercent < 0.5 && this.phase < 3) this.phase = 3;
    else if (hpPercent < 0.75 && this.phase < 2) this.phase = 2;

    // 移动
    const dx = player.x - this.x;
    this.facing = dx > 0 ? 1 : -1;
    this.vx = this.facing * (this.speed + this.phase * 0.5);

    // 攻击
    this.attackTimer++;
    if (this.attackTimer > 60 - this.phase * 10) {
      this.attackTimer = 0;
      // 发射弹幕
      for (let i = 0; i < 3 + this.phase; i++) {
        const angle = (Math.PI * 2 * i) / (3 + this.phase);
        particles.emit(
          this.x + this.width/2,
          this.y + this.height/2,
          1,
          '#E74C3C',
          5
        );
      }
    }

    this.x += this.vx;
    this.x = Math.max(0, Math.min(CONFIG.CANVAS_WIDTH - this.width, this.x));

    // 虚空粒子效果
    if (Math.random() < 0.1) {
      particles.emit(
        this.x + Math.random() * this.width,
        this.y + Math.random() * this.height,
        1,
        '#8E44AD',
        2
      );
    }
  }

  draw(ctx, camera) {
    if (!this.alive) return;
    const x = this.x - camera.x;
    const y = this.y - camera.y;

    // 渐变身体
    const gradient = ctx.createRadialGradient(
      x + this.width/2, y + this.height/2, 10,
      x + this.width/2, y + this.height/2, this.width/2
    );
    gradient.addColorStop(0, this.hitTimer > 0 ? '#FFF' : '#E74C3C');
    gradient.addColorStop(1, this.hitTimer > 0 ? '#FFF' : '#8E44AD');
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, this.width, this.height);

    // 皇冠
    ctx.fillStyle = '#F39C12';
    ctx.fillRect(x + 10, y - 20, 60, 20);
    ctx.fillRect(x + 15, y - 30, 10, 10);
    ctx.fillRect(x + 35, y - 30, 10, 10);
    ctx.fillRect(x + 55, y - 30, 10, 10);

    // 眼睛
    ctx.fillStyle = '#FFF';
    ctx.fillRect(x + 20, y + 25, 15, 15);
    ctx.fillRect(x + 45, y + 25, 15, 15);
    ctx.fillStyle = '#000';
    ctx.fillRect(x + 24, y + 29, 7, 7);
    ctx.fillRect(x + 49, y + 29, 7, 7);

    this.drawBossHpBar(ctx, x, y - 45, this.width, 12);
  }
}

// ============================================================
// 关卡管理器
// ============================================================
class LevelManager {
  constructor() {
    this.currentLevel = 0;
    this.levels = [...LEVELS];
  }

  getCurrentLevel() {
    return this.levels[this.currentLevel];
  }

  nextLevel() {
    this.currentLevel++;
    if (this.currentLevel >= this.levels.length) {
      return 'victory';
    }
    return 'next';
  }

  getBossConstructor(type) {
    const bosses = {
      'forest_giant': ForestGiant,
      'ice_dragon': IceDragon,
      'flame_lord': FlameLord,
      'dark_mage': DarkMage,
      'void_emperor': VoidEmperor
    };
    return bosses[type] || ForestGiant;
  }

  getEnemyConstructor(type) {
    const enemies = {
      'slime': Slime,
      'skeleton': Skeleton,
      'fire_demon': FireDemon
    };
    return enemies[type] || Slime;
  }
}
