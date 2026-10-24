// ============================================================
// 游戏主类
// ============================================================
class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.input = new InputManager();
    this.particles = new ParticleSystem();
    this.levelManager = new LevelManager();
    this.camera = { x: 0, y: 0 };

    this.state = 'menu'; // menu, playing, gameover, victory
    this.player = null;
    this.platforms = [];
    this.enemies = [];
    this.boss = null;
    this.projectiles = [];
    this.summons = [];

    this.levelComplete = false;
    this.bossDefeated = false;

    // 统计
    this.stats = {
      kills: 0,
      damageDealt: 0,
      damageTaken: 0,
      time: 0
    };

    this.lastTime = 0;
    this.startTime = 0;

    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') {
        if (this.state === 'playing') {
          this.pause();
        }
      }
    });
  }

  start() {
    document.getElementById('startScreen').classList.add('hidden');
    this.resetGame();
    this.loadLevel(0);
    this.state = 'playing';
    this.startTime = Date.now();
    this.loop();
  }

  resetGame() {
    this.player = new Knight(100, 500);
    this.levelManager = new LevelManager();
    this.stats = { kills: 0, damageDealt: 0, damageTaken: 0, time: 0 };
  }

  loadLevel(levelIndex) {
    const levelData = this.levelManager.levels[levelIndex];
    if (!levelData) return;

    this.platforms = levelData.platforms;
    this.enemies = [];
    this.projectiles = [];
    this.summons = [];
    this.boss = null;
    this.levelComplete = false;
    this.bossDefeated = false;

    // 创建敌人
    levelData.enemies.forEach(e => {
      const Constructor = this.levelManager.getEnemyConstructor(e.type);
      this.enemies.push(new Constructor(e.x, e.y));
    });

    // 创建 Boss
    if (levelData.boss) {
      const BossConstructor = this.levelManager.getBossConstructor(levelData.boss.type);
      this.boss = new BossConstructor(levelData.boss.x, levelData.boss.y);
    }

    // 重置玩家位置
    this.player.respawn();
    this.player.x = levelData.spawnX;
    this.player.y = levelData.spawnY;
    this.player.vx = 0;
    this.player.vy = 0;
  }

  update() {
    if (this.state !== 'playing') return;

    this.stats.time = Math.floor((Date.now() - this.startTime) / 1000);
    this.input.update();

    // 更新玩家
    this.player.update(this.input, this.platforms, this.enemies);

    // 更新敌人
    this.enemies = this.enemies.filter(enemy => {
      enemy.update(this.player, this.platforms);

      // 检查玩家攻击命中
      if (enemy.hitTimer <= 0 && enemy.alive) {
        // 敌人与玩家碰撞伤害
        if (Collider.check(enemy, this.player) && !this.player.isDodging) {
          this.player.takeDamage(enemy.attack);
          this.stats.damageTaken += enemy.attack;
        }
      }

      return enemy.alive;
    });

    // 更新 Boss
    if (this.boss && this.boss.alive) {
      const result = this.boss.update(this.player, this.platforms, this.particles);
      if (result) {
        if (result.type === 'summon') {
          const Constructor = this.levelManager.getEnemyConstructor('fire_demon');
          const demon = new Constructor(result.x, result.y);
          this.enemies.push(demon);
        }
      }

      // Boss 与玩家碰撞
      if (Collider.check(this.boss, this.player) && !this.player.isDodging) {
        this.player.takeDamage(this.boss.attack);
        this.stats.damageTaken += this.boss.attack;
      }
    }

    // 更新技能投射物
    this.projectiles = this.projectiles.filter(proj => {
      proj.x += proj.vx;
      proj.y += proj.vy;
      proj.life--;

      // 检查命中敌人
      this.enemies.forEach(enemy => {
        if (enemy.alive && Collider.check(proj, enemy)) {
          enemy.takeDamage(proj.damage);
          this.stats.damageDealt += proj.damage;
          this.particles.emit(proj.x, proj.y, 5, '#F39C12', 3);
          proj.life = 0;
        }
      });

      // 检查命中 Boss
      if (this.boss && this.boss.alive && Collider.check(proj, this.boss)) {
        this.boss.takeDamage(proj.damage);
        this.stats.damageDealt += proj.damage;
        this.particles.emit(proj.x, proj.y, 5, '#F39C12', 3);
        proj.life = 0;
      }

      return proj.life > 0;
    });

    // 更新粒子
    this.particles.update();

    // 检查关卡完成
    this.checkLevelComplete();

    // 更新相机
    this.updateCamera();
  }

  checkLevelComplete() {
    // 检查是否所有敌人都被消灭且 Boss 被击败
    const allEnemiesDead = this.enemies.length === 0;
    const bossDead = !this.boss || !this.boss.alive;

    if (allEnemiesDead && bossDead && !this.levelComplete) {
      this.levelComplete = true;

      // 经验奖励
      this.player.gainExp(100);

      if (this.levelManager.nextLevel() === 'victory') {
        // 通关！
        setTimeout(() => this.showVictory(), 1000);
      } else {
        // 下一关
        setTimeout(() => this.loadLevel(this.levelManager.currentLevel), 1500);
      }
    }

    // 检查玩家死亡
    if (this.player.hp <= 0) {
      this.state = 'gameover';
      document.getElementById('deathInfo').textContent = `你倒在了 ${this.levelManager.getCurrentLevel().name}...`;
      document.getElementById('gameOverScreen').classList.remove('hidden');
    }
  }

  updateCamera() {
    // 相机跟随玩家
    const targetX = this.player.x + this.player.width / 2 - this.canvas.width / 2;
    const targetY = this.player.y + this.player.height / 2 - this.canvas.height / 2;

    this.camera.x += (targetX - this.camera.x) * 0.1;
    this.camera.y += (targetY - this.camera.y) * 0.1;

    // 限制相机范围
    this.camera.x = Math.max(0, Math.min(this.camera.x, CONFIG.CANVAS_WIDTH - this.canvas.width));
    this.camera.y = Math.max(0, Math.min(this.camera.y, CONFIG.CANVAS_HEIGHT - this.canvas.height));
  }

  draw() {
    const levelData = this.levelManager.getCurrentLevel();
    const bgColor = levelData ? levelData.background : '#0a0a0a';

    // 清空画布
    this.ctx.fillStyle = bgColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 绘制平台
    this.ctx.fillStyle = CONFIG.COLORS.PLATFORM;
    this.platforms.forEach(platform => {
      const x = platform.x - this.camera.x;
      const y = platform.y - this.camera.y;
      this.ctx.fillRect(x, y, platform.width, platform.height);

      // 平台顶部装饰
      this.ctx.fillStyle = '#4a6741';
      this.ctx.fillRect(x, y, platform.width, 5);
      this.ctx.fillStyle = CONFIG.COLORS.PLATFORM;
    });

    // 绘制敌人
    this.enemies.forEach(enemy => enemy.draw(this.ctx, this.camera));

    // 绘制 Boss
    if (this.boss && this.boss.alive) {
      this.boss.draw(this.ctx, this.camera);
    }

    // 绘制投射物
    this.ctx.fillStyle = CONFIG.COLORS.MAGIC;
    this.projectiles.forEach(proj => {
      this.ctx.beginPath();
      this.ctx.arc(proj.x - this.camera.x, proj.y - this.camera.y, 8, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // 绘制玩家
    if (this.player) {
      this.player.draw(this.ctx, this.camera);
    }

    // 绘制粒子
    this.particles.draw(this.ctx, this.camera);

    // 绘制 HUD
    this.drawHUD();
  }

  drawHUD() {
    const ctx = this.ctx;
    const player = this.player;
    if (!player) return;

    // 血条
    player.drawHpBar(ctx, 20, 20, 200, 20);

    // 等级和经验
    ctx.fillStyle = CONFIG.COLORS.TEXT;
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Lv.${player.level}`, 20, 55);
    ctx.fillText(`EXP: ${player.exp}/${player.expToNext}`, 20, 75);

    // 技能 CD
    ctx.font = '14px Arial';
    let skillY = 100;
    const skills = [
      { key: 'J', name: '攻击', cd: player.skills.attack.cd, max: player.skills.attack.maxCd },
      { key: 'K', name: '魔法', cd: player.skills.magic.cd, max: player.skills.magic.maxCd },
      { key: 'L', name: '闪避', cd: player.skills.dodge.cd, max: player.skills.dodge.maxCd },
      { key: 'U', name: '终极', cd: player.skills.ultimate.cd, max: player.skills.ultimate.maxCd }
    ];

    skills.forEach(skill => {
      const ready = skill.cd <= 0;
      ctx.fillStyle = ready ? '#2ECC71' : '#7F8C8D';
      ctx.fillText(`${skill.key}: ${skill.name}${ready ? ' ✓' : ` ${Math.ceil(skill.cd/60)}s`}`, 20, skillY);
      skillY += 20;
    });

    // 关卡信息
    ctx.textAlign = 'center';
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = CONFIG.COLORS.TEXT;
    const levelName = this.levelManager.getCurrentLevel()?.name || '';
    ctx.fillText(levelName, this.canvas.width / 2, 30);

    // 敌人数量
    const enemyCount = this.enemies.length + (this.boss && this.boss.alive ? 1 : 0);
    ctx.font = '14px Arial';
    ctx.fillText(`剩余敌人: ${enemyCount}`, this.canvas.width / 2, 55);

    // 时间
    ctx.textAlign = 'right';
    ctx.fillText(`时间: ${this.formatTime(this.stats.time)}`, this.canvas.width - 20, 30);
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  showVictory() {
    this.state = 'victory';
    document.getElementById('victoryInfo').textContent = '你击败了虚空皇帝，拯救了世界！';
    document.getElementById('statsInfo').textContent =
      `击杀: ${this.stats.kills} | 造成伤害: ${this.stats.damageDealt} | 用时: ${this.formatTime(this.stats.time)}`;
    document.getElementById('victoryScreen').classList.remove('hidden');
  }

  restart() {
    document.getElementById('gameOverScreen').classList.add('hidden');
    document.getElementById('victoryScreen').classList.add('hidden');
    this.start();
  }

  pause() {
    // 暂停功能可扩展
  }

  loop() {
    if (this.state !== 'playing') return;

    this.update();
    this.draw();

    requestAnimationFrame(() => this.loop());
  }
}

// ============================================================
// 启动游戏
// ============================================================
const game = new Game();

// 监听技能按键
document.addEventListener('keydown', (e) => {
  if (game.state !== 'playing' || !game.player) return;

  const player = game.player;

  // 魔法箭
  if (e.code === 'KeyK' || e.code === 'Digit2') {
    if (player.skills.magic.cd <= 0) {
      const proj = player.castMagic();
      game.projectiles.push(proj);
    }
  }

  // 终极技能
  if (e.code === 'KeyU' || e.code === 'Digit4') {
    if (player.skills.ultimate.cd <= 0) {
      const explosion = player.castUltimate();
      game.particles.emit(explosion.x, explosion.y, 30, '#F39C12', 8);

      // 范围伤害
      const enemies = [...game.enemies, game.boss].filter(e => e && e.alive);
      enemies.forEach(enemy => {
        const dx = (enemy.x + enemy.width/2) - explosion.x;
        const dy = (enemy.y + enemy.height/2) - explosion.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < explosion.radius) {
          enemy.takeDamage(explosion.damage);
          game.stats.damageDealt += explosion.damage;
        }
      });
    }
  }
});
