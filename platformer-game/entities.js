// ============================================================
// 玩家类
// ============================================================
class Player {
  constructor(x, y) {
    // 基础属性
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 60;
    this.vx = 0;
    this.vy = 0;
    this.onGround = false;
    this.facing = 1; // 1=右, -1=左

    // 战斗属性
    this.maxHp = 100;
    this.hp = 100;
    this.attack = 10;
    this.defense = 5;
    this.level = 1;
    this.exp = 0;
    this.expToNext = 100;

    // 技能 CD
    this.skills = {
      attack: { cd: 0, maxCd: 18 },      // J 普通攻击
      magic: { cd: 0, maxCd: 120 },      // K 魔法箭
      dodge: { cd: 0, maxCd: 90 },       // L 闪避
      ultimate: { cd: 0, maxCd: 600 }    // U 终极技能
    };

    // 状态
    this.isAttacking = false;
    this.attackTimer = 0;
    this.attackDuration = 15;
    this.isDodging = false;
    this.dodgeTimer = 0;
    this.dodgeDuration = 20;
    this.invincible = false;
    this.invincibleTimer = 0;

    // 二段跳
    this.canDoubleJump = false;
    this.hasDoubleJumped = false;

    // 动画
    this.animFrame = 0;
    this.animTimer = 0;
  }

  update(input, platforms, enemies) {
    // 更新技能 CD
    for (const key in this.skills) {
      if (this.skills[key].cd > 0) {
        this.skills[key].cd--;
      }
    }

    // 无敌时间
    if (this.invincible) {
      this.invincibleTimer--;
      if (this.invincibleTimer <= 0) {
        this.invincible = false;
      }
    }

    // 闪避状态
    if (this.isDodging) {
      this.dodgeTimer--;
      this.vx = this.facing * 15;
      if (this.dodgeTimer <= 0) {
        this.isDodging = false;
        this.vx = 0;
      }
    } else {
      // 移动
      if (input.isPressed('ArrowLeft') || input.isPressed('KeyA')) {
        this.vx = -CONFIG.PLAYER_SPEED;
        this.facing = -1;
      } else if (input.isPressed('ArrowRight') || input.isPressed('KeyD')) {
        this.vx = CONFIG.PLAYER_SPEED;
        this.facing = 1;
      } else {
        this.vx *= CONFIG.FRICTION;
      }

      // 跳跃
      if ((input.wasJustPressed('ArrowUp') || input.wasJustPressed('KeyW') || input.wasJustPressed('Space')) && this.onGround) {
        this.vy = CONFIG.PLAYER_JUMP;
        this.onGround = false;
        this.hasDoubleJumped = false;
      } else if ((input.wasJustPressed('ArrowUp') || input.wasJustPressed('KeyW') || input.wasJustPressed('Space')) && !this.hasDoubleJumped && this.canDoubleJump && !this.onGround) {
        this.vy = CONFIG.DOUBLE_JUMP;
        this.hasDoubleJumped = true;
      }
    }

    // 重力
    this.vy += CONFIG.GRAVITY;
    if (this.vy > 15) this.vy = 15;

    // 攻击
    if ((input.wasJustPressed('KeyJ') || input.wasJustPressed('Digit1')) && this.skills.attack.cd <= 0 && !this.isDodging) {
      this.performAttack();
    }

    // 魔法箭
    if ((input.wasJustPressed('KeyK') || input.wasJustPressed('Digit2')) && this.skills.magic.cd <= 0 && !this.isDodging) {
      this.castMagic();
    }

    // 闪避
    if ((input.wasJustPressed('KeyL') || input.wasJustPressed('Digit3')) && this.skills.dodge.cd <= 0 && !this.isDodging) {
      this.performDodge();
    }

    // 终极技能
    if ((input.wasJustPressed('KeyU') || input.wasJustPressed('Digit4')) && this.skills.ultimate.cd <= 0 && !this.isDodging) {
      this.castUltimate();
    }

    // 应用速度
    this.x += this.vx;
    this.y += this.vy;

    // 碰撞检测
    this.onGround = false;
    platforms.forEach(platform => {
      const overlap = Collider.getOverlap(this, platform);
      if (overlap) {
        if (overlap.axis === 'bottom') {
          this.y = platform.y - this.height;
          this.vy = 0;
          this.onGround = true;
          this.hasDoubleJumped = false;
        } else if (overlap.axis === 'top') {
          this.y = platform.y + platform.height;
          this.vy = 0;
        } else if (overlap.axis === 'left') {
          this.x = platform.x - this.width;
          this.vx = 0;
        } else if (overlap.axis === 'right') {
          this.x = platform.x + platform.width;
          this.vx = 0;
        }
      }
    });

    // 边界限制
    if (this.x < 0) this.x = 0;
    if (this.x > CONFIG.CANVAS_WIDTH - this.width) this.x = CONFIG.CANVAS_WIDTH - this.width;
    if (this.y > CONFIG.CANVAS_HEIGHT + 100) {
      this.takeDamage(20);
      this.respawn();
    }

    // 动画
    this.animTimer++;
    if (this.animTimer > 8) {
      this.animTimer = 0;
      this.animFrame = (this.animFrame + 1) % 4;
    }

    // 攻击计时器
    if (this.isAttacking) {
      this.attackTimer--;
      if (this.attackTimer <= 0) {
        this.isAttacking = false;
      }
    }

    // 检查与敌人的碰撞（攻击判定）
    if (this.isAttacking && this.attackTimer === this.attackDuration - 5) {
      this.checkAttackHit(enemies);
    }
  }

  performAttack() {
    this.isAttacking = true;
    this.attackTimer = this.attackDuration;
    this.skills.attack.cd = this.skills.attack.maxCd;
  }

  castMagic() {
    this.skills.magic.cd = this.skills.magic.maxCd;
    // 创建魔法弹
    return {
      x: this.x + (this.facing === 1 ? this.width : 0),
      y: this.y + this.height / 2,
      vx: this.facing * 10,
      vy: 0,
      width: 20,
      height: 10,
      damage: this.attack * 2,
      life: 60
    };
  }

  performDodge() {
    this.isDodging = true;
    this.dodgeTimer = this.dodgeDuration;
    this.invincible = true;
    this.invincibleTimer = 20;
    this.skills.dodge.cd = this.skills.dodge.maxCd;
  }

  castUltimate() {
    this.skills.ultimate.cd = this.skills.ultimate.maxCd;
    // 范围爆炸效果
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
      radius: 150,
      damage: this.attack * 5,
      life: 30
    };
  }

  checkAttackHit(enemies) {
    const attackRange = {
      x: this.facing === 1 ? this.x + this.width : this.x - 50,
      y: this.y - 10,
      width: 50,
      height: this.height + 20
    };

    enemies.forEach(enemy => {
      if (enemy.alive && Collider.check(attackRange, enemy)) {
        enemy.takeDamage(this.attack);
        // 击退效果
        enemy.vx = this.facing * 8;
        enemy.vy = -3;
        enemy.hitTimer = 10;
      }
    });
  }

  takeDamage(amount) {
    if (this.invincible || this.isDodging) return;
    const actualDamage = Math.max(1, amount - this.defense);
    this.hp -= actualDamage;
    this.invincible = true;
    this.invincibleTimer = 30;

    if (this.hp <= 0) {
      this.hp = 0;
      return true; // 死亡
    }
    return false;
  }

  respawn() {
    this.hp = this.maxHp;
    this.x = 100;
    this.y = 500;
    this.vx = 0;
    this.vy = 0;
  }

  gainExp(amount) {
    this.exp += amount;
    if (this.exp >= this.expToNext) {
      this.levelUp();
    }
  }

  levelUp() {
    this.level++;
    this.exp -= this.expToNext;
    this.expToNext = Math.floor(this.expToNext * 1.5);
    this.maxHp += 20;
    this.hp = this.maxHp;
    this.attack += 3;
    this.defense += 1;
    this.canDoubleJump = this.level >= 2;
  }

  draw(ctx, camera) {
    const x = this.x - camera.x;
    const y = this.y - camera.y;

    // 闪烁效果（无敌时）
    if (this.invincible && Math.floor(Date.now() / 50) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }

    // 身体
    ctx.fillStyle = CONFIG.COLORS.PLAYER;
    ctx.fillRect(x, y, this.width, this.height);

    // 眼睛
    ctx.fillStyle = '#FFF';
    const eyeX = this.facing === 1 ? x + 25 : x + 8;
    ctx.fillRect(eyeX, y + 12, 8, 8);
    ctx.fillStyle = '#000';
    ctx.fillRect(eyeX + (this.facing === 1 ? 4 : 0), y + 14, 4, 4);

    // 攻击效果
    if (this.isAttacking) {
      ctx.fillStyle = CONFIG.COLORS.PLAYER_ATTACK;
      const attackX = this.facing === 1 ? x + this.width : x - 40;
      ctx.fillRect(attackX, y + 10, 40, 30);
    }

    // 闪避特效
    if (this.isDodging) {
      ctx.fillStyle = 'rgba(74, 144, 217, 0.5)';
      ctx.fillRect(x - 10, y - 5, this.width + 20, this.height + 10);
    }

    ctx.globalAlpha = 1;

    // 血条
    this.drawHpBar(ctx, x, y - 10, this.width, 6);
  }

  drawHpBar(ctx, x, y, width, height) {
    // 背景
    ctx.fillStyle = CONFIG.COLORS.HP_BG;
    ctx.fillRect(x, y, width, height);
    // 当前血量
    const hpPercent = this.hp / this.maxHp;
    ctx.fillStyle = hpPercent > 0.5 ? '#2ECC71' : hpPercent > 0.25 ? '#F39C12' : '#E74C3C';
    ctx.fillRect(x, y, width * hpPercent, height);
    // 边框
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);
  }
}

// ============================================================
// 敌人基类
// ============================================================
class Enemy {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.vx = 0;
    this.vy = 0;
    this.type = type;
    this.alive = true;
    this.facing = -1;
    this.hitTimer = 0;

    // 基础属性
    this.maxHp = 30;
    this.hp = 30;
    this.attack = 5;
    this.speed = 1.5;
    this.expValue = 20;

    // 状态
    this.state = 'idle'; // idle, chase, attack, hurt
    this.stateTimer = 0;
    this.attackCooldown = 0;
  }

  update(player, platforms) {
    if (!this.alive) return;

    if (this.hitTimer > 0) {
      this.hitTimer--;
      return;
    }

    // 简单 AI
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.abs(dx);

    this.facing = dx > 0 ? 1 : -1;

    // 状态机
    if (dist < 300) {
      this.state = 'chase';
    } else {
      this.state = 'idle';
    }

    if (this.state === 'chase') {
      this.vx = this.facing * this.speed;
    } else {
      this.vx *= 0.8;
    }

    // 攻击检测
    if (dist < 50 && this.attackCooldown <= 0) {
      this.attackPlayer(player);
      this.attackCooldown = 60;
    }
    if (this.attackCooldown > 0) this.attackCooldown--;

    // 重力
    this.vy += CONFIG.GRAVITY;
    if (this.vy > 12) this.vy = 12;

    // 移动
    this.x += this.vx;
    this.y += this.vy;

    // 平台碰撞
    this.onGround = false;
    platforms.forEach(platform => {
      if (Collider.check(this, platform)) {
        const overlap = Collider.getOverlap(this, platform);
        if (overlap.axis === 'bottom') {
          this.y = platform.y - this.height;
          this.vy = 0;
          this.onGround = true;
        } else if (overlap.axis === 'top') {
          this.y = platform.y + platform.height;
          this.vy = 0;
        } else if (overlap.axis === 'left') {
          this.x = platform.x - this.width;
          this.vx = 0;
        } else if (overlap.axis === 'right') {
          this.x = platform.x + platform.width;
          this.vx = 0;
        }
      }
    });

    // 边界
    if (this.x < 0) { this.x = 0; this.vx = 0; }
    if (this.x > CONFIG.CANVAS_WIDTH - this.width) { this.x = CONFIG.CANVAS_WIDTH - this.width; this.vx = 0; }
  }

  attackPlayer(player) {
    const died = player.takeDamage(this.attack);
    if (died) {
      // 玩家死亡处理
    }
  }

  takeDamage(amount) {
    this.hp -= amount;
    this.hitTimer = 8;
    this.state = 'hurt';
    this.stateTimer = 15;

    if (this.hp <= 0) {
      this.hp = 0;
      this.alive = false;
      return true;
    }
    return false;
  }

  draw(ctx, camera) {
    if (!this.alive) return;

    const x = this.x - camera.x;
    const y = this.y - camera.y;

    // 受击闪烁
    if (this.hitTimer > 0) {
      ctx.fillStyle = '#FFF';
    } else {
      ctx.fillStyle = CONFIG.COLORS.ENEMY;
    }
    ctx.fillRect(x, y, this.width, this.height);

    // 眼睛
    ctx.fillStyle = '#FFF';
    const eyeX = this.facing === 1 ? x + 25 : x + 8;
    ctx.fillRect(eyeX, y + 10, 8, 8);
    ctx.fillStyle = '#000';
    ctx.fillRect(eyeX + (this.facing === 1 ? 4 : 0), y + 12, 4, 4);

    // 血条
    this.drawHpBar(ctx, x, y - 8, this.width, 4);
  }

  drawHpBar(ctx, x, y, width, height) {
    const hpPercent = this.hp / this.maxHp;
    ctx.fillStyle = CONFIG.COLORS.HP_BG;
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = '#E74C3C';
    ctx.fillRect(x, y, width * hpPercent, height);
  }
}

// ============================================================
// Boss 基类
// ============================================================
class Boss extends Enemy {
  constructor(x, y, name, maxHp, attack) {
    super(x, y, 'boss');
    this.name = name;
    this.maxHp = maxHp;
    this.hp = maxHp;
    this.attack = attack;
    this.width = 80;
    this.height = 80;
    this.phase = 1;
    this.skillCooldown = 0;
    this.patternIndex = 0;
  }

  update(player, platforms, particles) {
    if (!this.alive) return;

    if (this.hitTimer > 0) {
      this.hitTimer--;
      return;
    }

    // 阶段检查
    const hpPercent = this.hp / this.maxHp;
    if (hpPercent < 0.3 && this.phase < 3) this.phase = 3;
    else if (hpPercent < 0.6 && this.phase < 2) this.phase = 2;

    const dx = player.x - this.x;
    this.facing = dx > 0 ? 1 : -1;

    // 移动
    if (Math.abs(dx) > 100) {
      this.vx = this.facing * (this.speed + this.phase);
    } else {
      this.vx *= 0.5;
    }

    // 技能
    if (this.skillCooldown <= 0) {
      this.useSkill(player, platforms, particles);
      this.skillCooldown = 120 - this.phase * 20;
    }
    this.skillCooldown--;

    // 重力
    this.vy += CONFIG.GRAVITY;
    this.x += this.vx;
    this.y += this.vy;

    // 平台碰撞
    platforms.forEach(platform => {
      if (Collider.check(this, platform)) {
        const overlap = Collider.getOverlap(this, platform);
        if (overlap.axis === 'bottom') {
          this.y = platform.y - this.height;
          this.vy = 0;
        }
      }
    });

    // 边界
    this.x = Math.max(0, Math.min(CONFIG.CANVAS_WIDTH - this.width, this.x));
  }

  useSkill(player, platforms, particles) {
    // Boss 技能模板
  }

  takeDamage(amount) {
    const died = super.takeDamage(amount);
    if (died) {
      // Boss 死亡特效
      particles.emit(this.x + this.width/2, this.y + this.height/2, 30, '#9B59B6', 8);
    }
    return died;
  }

  draw(ctx, camera) {
    if (!this.alive) return;

    const x = this.x - camera.x;
    const y = this.y - camera.y;

    // Boss 身体
    if (this.hitTimer > 0) {
      ctx.fillStyle = '#FFF';
    } else {
      const gradient = ctx.createLinearGradient(x, y, x, y + this.height);
      gradient.addColorStop(0, '#9B59B6');
      gradient.addColorStop(1, '#6C3483');
      ctx.fillStyle = gradient;
    }
    ctx.fillRect(x, y, this.width, this.height);

    // Boss 眼睛
    ctx.fillStyle = '#E74C3C';
    ctx.fillRect(x + 15, y + 20, 15, 15);
    ctx.fillRect(x + 50, y + 20, 15, 15);
    ctx.fillStyle = '#FFF';
    ctx.fillRect(x + 18, y + 23, 8, 8);
    ctx.fillRect(x + 53, y + 23, 8, 8);

    // Boss 名称
    ctx.fillStyle = CONFIG.COLORS.TEXT;
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(this.name, x + this.width/2, y - 10);

    // Boss 血条
    this.drawBossHpBar(ctx, x, y - 30, this.width, 10);
  }

  drawBossHpBar(ctx, x, y, width, height) {
    ctx.fillStyle = CONFIG.COLORS.HP_BG;
    ctx.fillRect(x, y, width, height);
    const hpPercent = this.hp / this.maxHp;
    ctx.fillStyle = hpPercent > 0.5 ? '#9B59B6' : '#E74C3C';
    ctx.fillRect(x, y, width * hpPercent, height);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
  }
}

// ============================================================
// 特定敌人类型
// ============================================================
class Slime extends Enemy {
  constructor(x, y) {
    super(x, y, 'slime');
    this.maxHp = 30;
    this.hp = 30;
    this.attack = 5;
    this.speed = 1;
    this.expValue = 15;
    this.jumpTimer = 0;
  }

  update(player, platforms) {
    super.update(player, platforms);

    // 史莱姆跳跃
    this.jumpTimer++;
    if (this.jumpTimer > 60 && this.onGround) {
      this.vy = -8;
      this.jumpTimer = 0;
    }
  }

  draw(ctx, camera) {
    if (!this.alive) return;
    const x = this.x - camera.x;
    const y = this.y - camera.y;

    // 史莱姆形状（圆形）
    ctx.fillStyle = this.hitTimer > 0 ? '#FFF' : '#2ECC71';
    ctx.beginPath();
    ctx.ellipse(x + this.width/2, y + this.height/2, this.width/2, this.height/2.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 眼睛
    ctx.fillStyle = '#000';
    ctx.fillRect(x + 10, y + 12, 6, 6);
    ctx.fillRect(x + 24, y + 12, 6, 6);

    this.drawHpBar(ctx, x, y - 8, this.width, 4);
  }
}

class Skeleton extends Enemy {
  constructor(x, y) {
    super(x, y, 'skeleton');
    this.maxHp = 40;
    this.hp = 40;
    this.attack = 8;
    this.speed = 1.5;
    this.expValue = 25;
    this.shootTimer = 0;
  }

  update(player, platforms) {
    super.update(player, platforms);

    // 远程攻击
    this.shootTimer++;
    if (this.shootTimer > 90 && Math.abs(player.x - this.x) < 400) {
      this.shootTimer = 0;
      // 创建箭矢
      return { x: this.x + this.width/2, y: this.y + 10, vx: this.facing * 6, vy: 0, damage: this.attack, life: 60 };
    }
    return null;
  }

  draw(ctx, camera) {
    if (!this.alive) return;
    const x = this.x - camera.x;
    const y = this.y - camera.y;

    ctx.fillStyle = this.hitTimer > 0 ? '#FFF' : '#E8DAEF';
    ctx.fillRect(x, y, this.width, this.height);

    // 骷髅特征
    ctx.fillStyle = '#000';
    ctx.fillRect(x + 8, y + 10, 8, 8);
    ctx.fillRect(x + 24, y + 10, 8, 8);
    ctx.fillRect(x + 12, y + 25, 16, 4);

    this.drawHpBar(ctx, x, y - 8, this.width, 4);
  }
}

class FireDemon extends Enemy {
  constructor(x, y) {
    super(x, y, 'fire_demon');
    this.maxHp = 60;
    this.hp = 60;
    this.attack = 12;
    this.speed = 2.5;
    this.expValue = 35;
    this.explodeTimer = 0;
  }

  update(player, platforms) {
    super.update(player, platforms);

    // 接近玩家后自爆
    if (Math.abs(player.x - this.x) < 50) {
      this.explodeTimer++;
      if (this.explodeTimer > 30) {
        // 自爆
        player.takeDamage(this.attack * 2);
        this.alive = false;
        return { type: 'explode', x: this.x + this.width/2, y: this.y + this.height/2 };
      }
    }
    return null;
  }

  draw(ctx, camera) {
    if (!this.alive) return;
    const x = this.x - camera.x;
    const y = this.y - camera.y;

    ctx.fillStyle = this.hitTimer > 0 ? '#FFF' : '#E74C3C';
    ctx.fillRect(x, y, this.width, this.height);

    // 火焰效果
    if (this.explodeTimer > 0) {
      ctx.fillStyle = '#F39C12';
      ctx.fillRect(x - 5, y - 5, this.width + 10, this.height + 10);
    }

    this.drawHpBar(ctx, x, y - 8, this.width, 4);
  }
}
