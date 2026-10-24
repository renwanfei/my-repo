// ============================================================
// 精灵动画系统
// ============================================================
class SpriteAnimator {
  constructor(frameWidth, frameHeight) {
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.frames = {};
    this.currentAnimation = 'idle';
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.frameSpeed = 10; // 帧速度（每10帧切换）
    this.loop = true;
  }

  addFrame(name, frame) {
    if (!this.frames[name]) {
      this.frames[name] = [];
    }
    this.frames[name].push(frame);
  }

  addAnimation(name, frames) {
    this.frames[name] = frames;
  }

  setAnimation(name) {
    if (this.frames[name]) {
      this.currentAnimation = name;
      this.frameIndex = 0;
      this.frameTimer = 0;
    }
  }

  update() {
    this.frameTimer++;
    if (this.frameTimer >= this.frameSpeed) {
      this.frameTimer = 0;
      this.frameIndex++;
      if (this.frameIndex >= this.frames[this.currentAnimation].length) {
        if (this.loop) {
          this.frameIndex = 0;
        } else {
          this.frameIndex = Math.max(0, this.frameIndex - 1);
        }
      }
    }
  }

  getFrame() {
    const anim = this.frames[this.currentAnimation];
    if (!anim || anim.length === 0) return null;
    return anim[this.frameIndex] || null;
  }
}

// ============================================================
// 骑士类（带精灵动画）
// ============================================================
class Knight extends SpriteAnimator {
  constructor(x, y) {
    super(32, 48);
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 48;
    this.vx = 0;
    this.vy = 0;
    this.onGround = false;
    this.facing = 1;

    // 属性
    this.maxHp = 100;
    this.hp = 100;
    this.attack = 10;
    this.defense = 5;
    this.speed = 4;
    this.jumpForce = -12;

    // 状态
    this.isAttacking = false;
    this.attackTimer = 0;
    this.attackDuration = 20;
    this.isHurt = false;
    this.hurtTimer = 0;

    // 创建精灵帧
    this.createSprites();
  }

  createSprites() {
    // 待机动画 - 4帧
    this.addAnimation('idle', [
      this.createSpriteFrame([
        [0,0,0,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,0,0],
        [0,0,1,2,2,2,1,0,0],
        [0,0,0,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,1,0],
        [0,1,0,1,1,1,0,1,0],
        [0,1,0,1,1,1,0,1,0],
        [0,0,0,1,0,1,0,0,0],
        [0,0,1,1,0,1,1,0,0],
      ]),
      this.createSpriteFrame([
        [0,0,0,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,0,0],
        [0,0,1,2,2,2,1,0,0],
        [0,0,0,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,1,0],
        [0,1,0,1,1,1,0,1,0],
        [0,1,0,1,1,1,0,1,0],
        [0,0,0,1,0,1,0,0,0],
        [0,0,1,1,0,1,1,0,0],
      ]),
      this.createSpriteFrame([
        [0,0,0,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,0,0],
        [0,0,1,2,2,2,1,0,0],
        [0,0,0,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,1,0],
        [0,1,0,1,1,1,0,1,0],
        [0,1,0,1,1,1,0,1,0],
        [0,0,0,1,0,1,0,0,0],
        [0,0,1,1,0,1,1,0,0],
      ]),
      this.createSpriteFrame([
        [0,0,0,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,0,0],
        [0,0,1,2,2,2,1,0,0],
        [0,0,0,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,1,0],
        [0,1,0,1,1,1,0,1,0],
        [0,1,0,1,1,1,0,1,0],
        [0,0,0,1,0,1,0,0,0],
        [0,0,1,1,0,1,1,0,0],
      ]),
    ]);

    // 跑步动画 - 6帧
    this.addAnimation('run', [
      this.createSpriteFrame([
        [0,0,0,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,0,0],
        [0,0,1,2,2,2,1,0,0],
        [0,0,0,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,1,0],
        [0,1,0,1,1,1,0,1,0],
        [0,0,0,1,1,1,0,0,0],
        [0,0,1,1,0,0,0,0,0],
      ]),
      this.createSpriteFrame([
        [0,0,0,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,0,0],
        [0,0,1,2,2,2,1,0,0],
        [0,0,0,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,1,0],
        [0,0,0,1,1,1,0,1,0],
        [0,0,1,1,1,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
      ]),
      this.createSpriteFrame([
        [0,0,0,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,0,0],
        [0,0,1,2,2,2,1,0,0],
        [0,0,0,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,1,0],
        [0,1,0,1,1,1,0,0,0],
        [0,0,0,0,1,1,0,0,0],
        [0,0,0,0,0,0,0,0,0],
      ]),
      this.createSpriteFrame([
        [0,0,0,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,0,0],
        [0,0,1,2,2,2,1,0,0],
        [0,0,0,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,1,0],
        [0,0,1,1,1,0,0,0,0],
        [0,0,0,0,0,1,1,0,0],
        [0,0,0,0,0,0,0,0,0],
      ]),
      this.createSpriteFrame([
        [0,0,0,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,0,0],
        [0,0,1,2,2,2,1,0,0],
        [0,0,0,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,1,0],
        [0,1,0,1,1,1,0,1,0],
        [0,0,0,1,1,1,0,0,0],
        [0,0,1,1,0,0,0,0,0],
      ]),
      this.createSpriteFrame([
        [0,0,0,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,0,0],
        [0,0,1,2,2,2,1,0,0],
        [0,0,0,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,1,0],
        [0,0,0,1,1,1,0,1,0],
        [0,0,1,1,1,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
      ]),
    ]);

    // 跳跃动画 - 2帧
    this.addAnimation('jump', [
      this.createSpriteFrame([
        [0,0,0,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,0,0],
        [0,0,1,2,2,2,1,0,0],
        [0,0,0,1,1,1,0,0,0],
        [0,1,1,1,1,1,1,1,0],
        [0,1,0,0,1,0,0,1,0],
        [0,0,0,0,1,0,0,0,0],
        [0,0,1,0,1,0,1,0,0],
        [0,1,0,0,0,0,0,1,0],
      ]),
      this.createSpriteFrame([
        [0,0,0,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,0,0],
        [0,0,1,2,2,2,1,0,0],
        [0,0,0,1,1,1,0,0,0],
        [0,1,1,1,1,1,1,1,0],
        [0,0,1,0,1,0,0,1,0],
        [0,0,0,0,1,0,0,0,0],
        [0,0,1,0,1,0,1,0,0],
        [0,1,0,0,0,0,0,1,0],
      ]),
    ]);

    // 攻击动画 - 4帧
    this.addAnimation('attack', [
      this.createSpriteFrame([
        [0,0,0,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,0,0],
        [0,0,1,2,2,2,1,0,0],
        [0,0,0,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,1,0],
        [0,1,0,1,1,1,0,1,0],
        [0,0,0,1,1,1,0,0,0],
        [1,1,1,1,0,0,0,0,0],
        [1,1,0,0,0,0,0,0,0],
      ]),
      this.createSpriteFrame([
        [0,0,0,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,0,0],
        [0,0,1,2,2,2,1,0,0],
        [0,0,0,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,1,0],
        [0,1,0,1,1,1,0,1,0],
        [1,1,1,1,1,0,0,0,0],
        [1,1,1,1,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
      ]),
      this.createSpriteFrame([
        [0,0,0,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,0,0],
        [0,0,1,2,2,2,1,0,0],
        [0,0,0,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,1,0],
        [1,1,0,1,1,1,0,0,0],
        [0,0,0,1,1,1,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
      ]),
      this.createSpriteFrame([
        [0,0,0,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,0,0],
        [0,0,1,2,2,2,1,0,0],
        [0,0,0,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,1,0],
        [0,1,0,1,1,1,0,1,0],
        [0,0,0,1,1,1,0,0,0],
        [0,0,0,1,0,0,0,0,0],
        [0,0,1,0,0,0,0,0,0],
      ]),
    ]);

    // 受伤动画 - 2帧
    this.addAnimation('hurt', [
      this.createSpriteFrame([
        [0,0,0,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,0,0],
        [0,0,1,2,2,2,1,0,0],
        [0,0,0,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,1,0],
        [0,1,0,1,1,1,0,1,0],
        [0,0,0,1,0,1,0,0,0],
        [0,0,1,0,0,0,1,0,0],
      ]),
      this.createSpriteFrame([
        [0,0,0,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,0,0],
        [0,0,1,2,2,2,1,0,0],
        [0,0,0,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,1,0],
        [0,1,0,1,1,1,0,1,0],
        [0,0,0,1,0,1,0,0,0],
        [0,0,1,0,0,0,1,0,0],
      ]),
    ]);

    // 冲刺动画 - 4帧
    this.addAnimation('dash', [
      this.createSpriteFrame([
        [0,0,0,0,1,1,1,0,0],
        [0,0,0,1,1,1,1,0,0],
        [0,0,0,1,2,2,1,0,0],
        [0,0,0,0,1,1,1,0,0],
        [0,0,1,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,1,0],
        [1,1,0,1,1,1,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
      ]),
      this.createSpriteFrame([
        [0,0,0,0,1,1,1,0,0],
        [0,0,0,1,1,1,1,0,0],
        [0,0,0,1,2,2,1,0,0],
        [0,0,0,0,1,1,1,0,0],
        [0,0,1,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,1,0],
        [1,1,1,0,1,1,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
      ]),
      this.createSpriteFrame([
        [0,0,0,0,1,1,1,0,0],
        [0,0,0,1,1,1,1,0,0],
        [0,0,0,1,2,2,1,0,0],
        [0,0,0,0,1,1,1,0,0],
        [0,0,1,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,1,0],
        [0,0,0,1,1,1,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
      ]),
      this.createSpriteFrame([
        [0,0,0,0,1,1,1,0,0],
        [0,0,0,1,1,1,1,0,0],
        [0,0,0,1,2,2,1,0,0],
        [0,0,0,0,1,1,1,0,0],
        [0,0,1,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,1,0],
        [1,1,0,1,1,1,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
      ]),
    ]);
  }

  createSpriteFrame(grid) {
    const canvas = document.createElement('canvas');
    canvas.width = grid[0].length * 8;
    canvas.height = grid.length * 8;
    const ctx = canvas.getContext('2d');

    grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === 1) {
          ctx.fillStyle = '#4A90D9'; // 蓝色盔甲
        } else if (cell === 2) {
          ctx.fillStyle = '#F5D6A8'; // 肤色
        }
        ctx.fillRect(x * 8, y * 8, 8, 8);
      });
    });

    return canvas;
  }

  update(input, platforms) {
    // 更新动画
    this.updateAnimation(input);

    // 移动
    if (!this.isAttacking && !this.isHurt) {
      if (input.isPressed('ArrowLeft') || input.isPressed('KeyA')) {
        this.vx = -this.speed;
        this.facing = -1;
      } else if (input.isPressed('ArrowRight') || input.isPressed('KeyD')) {
        this.vx = this.speed;
        this.facing = 1;
      } else {
        this.vx *= 0.8;
      }

      // 跳跃
      if ((input.wasJustPressed('ArrowUp') || input.wasJustPressed('KeyW') || input.wasJustPressed('Space')) && this.onGround) {
        this.vy = this.jumpForce;
        this.onGround = false;
      }

      // 攻击
      if (input.wasJustPressed('KeyJ') || input.wasJustPressed('Digit1')) {
        this.startAttack();
      }

      // 冲刺
      if (input.wasJustPressed('KeyL') || input.wasJustPressed('Digit3')) {
        this.startDash();
      }
    }

    // 重力
    this.vy += 0.6;
    if (this.vy > 12) this.vy = 12;

    // 应用速度
    this.x += this.vx;
    this.y += this.vy;

    // 碰撞检测
    this.onGround = false;
    platforms.forEach(platform => {
      if (this.checkCollision(platform)) {
        if (this.vy > 0 && this.y < platform.y) {
          this.y = platform.y - this.height;
          this.vy = 0;
          this.onGround = true;
        }
      }
    });

    // 边界
    this.x = Math.max(0, Math.min(this.x, 1280 - this.width));
    if (this.y > 800) {
      this.hp -= 20;
      this.respawn();
    }

    // 状态计时器
    if (this.isAttacking) {
      this.attackTimer--;
      if (this.attackTimer <= 0) {
        this.isAttacking = false;
      }
    }

    if (this.isHurt) {
      this.hurtTimer--;
      if (this.hurtTimer <= 0) {
        this.isHurt = false;
      }
    }
  }

  updateAnimation(input) {
    if (this.isHurt) {
      this.setAnimation('hurt');
    } else if (this.isAttacking) {
      this.setAnimation('attack');
    } else if (this.isDashing) {
      this.setAnimation('dash');
    } else if (!this.onGround) {
      this.setAnimation('jump');
    } else if (Math.abs(this.vx) > 0.5) {
      this.setAnimation('run');
    } else {
      this.setAnimation('idle');
    }
  }

  startAttack() {
    this.isAttacking = true;
    this.attackTimer = this.attackDuration;
    this.setAnimation('attack');
  }

  startDash() {
    this.isDashing = true;
    this.vx = this.facing * 12;
    this.vy = -3;
    setTimeout(() => { this.isDashing = false; }, 200);
  }

  checkCollision(rect) {
    return this.x < rect.x + rect.width &&
           this.x + this.width > rect.x &&
           this.y < rect.y + rect.height &&
           this.y + this.height > rect.y;
  }

  takeDamage(amount) {
    if (this.isHurt) return;
    this.hp -= amount;
    this.isHurt = true;
    this.hurtTimer = 20;
    this.setAnimation('hurt');
  }

  respawn() {
    this.x = 100;
    this.y = 500;
    this.vx = 0;
    this.vy = 0;
    this.hp = Math.min(this.hp + 50, this.maxHp);
  }

  draw(ctx, camera) {
    const frame = this.getFrame();
    if (frame) {
      const x = this.x - camera.x;
      const y = this.y - camera.y;

      // 翻转
      ctx.save();
      if (this.facing === -1) {
        ctx.translate(x + this.width, y);
        ctx.scale(-1, 1);
        ctx.drawImage(frame, 0, 0);
      } else {
        ctx.drawImage(frame, x, y);
      }
      ctx.restore();
    }

    // 血条
    this.drawHpBar(ctx, this.x - camera.x, this.y - camera.y - 10, this.width, 6);
  }

  drawHpBar(ctx, x, y, width, height) {
    ctx.fillStyle = '#2C3E50';
    ctx.fillRect(x, y, width, height);
    const hpPercent = this.hp / this.maxHp;
    ctx.fillStyle = hpPercent > 0.5 ? '#2ECC71' : hpPercent > 0.25 ? '#F39C12' : '#E74C3C';
    ctx.fillRect(x, y, width * hpPercent, height);
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
    this.state = 'idle';
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
    this.vy += 0.6;
    if (this.vy > 12) this.vy = 12;

    // 移动
    this.x += this.vx;
    this.y += this.vy;

    // 平台碰撞
    this.onGround = false;
    platforms.forEach(platform => {
      if (this.checkCollision(platform)) {
        if (this.vy > 0 && this.y < platform.y) {
          this.y = platform.y - this.height;
          this.vy = 0;
          this.onGround = true;
        }
      }
    });

    // 边界
    if (this.x < 0) { this.x = 0; this.vx = 0; }
    if (this.x > 1280 - this.width) { this.x = 1280 - this.width; this.vx = 0; }
  }

  attackPlayer(player) {
    player.takeDamage(this.attack);
  }

  takeDamage(amount) {
    this.hp -= amount;
    this.hitTimer = 8;
    if (this.hp <= 0) {
      this.hp = 0;
      this.alive = false;
      return true;
    }
    return false;
  }

  checkCollision(rect) {
    return this.x < rect.x + rect.width &&
           this.x + this.width > rect.x &&
           this.y < rect.y + rect.height &&
           this.y + this.height > rect.y;
  }

  draw(ctx, camera) {
    if (!this.alive) return;

    const x = this.x - camera.x;
    const y = this.y - camera.y;

    // 敌人身体
    ctx.fillStyle = this.hitTimer > 0 ? '#FFF' : '#E74C3C';
    ctx.fillRect(x, y, this.width, this.height);

    // 眼睛
    ctx.fillStyle = '#000';
    const eyeX = this.facing === 1 ? x + 25 : x + 8;
    ctx.fillRect(eyeX, y + 10, 8, 8);

    // 血条
    this.drawHpBar(ctx, x, y - 8, this.width, 4);
  }

  drawHpBar(ctx, x, y, width, height) {
    const hpPercent = this.hp / this.maxHp;
    ctx.fillStyle = '#2C3E50';
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
  }

  update(player, platforms) {
    super.update(player, platforms);

    // 阶段检查
    const hpPercent = this.hp / this.maxHp;
    if (hpPercent < 0.3 && this.phase < 3) this.phase = 3;
    else if (hpPercent < 0.6 && this.phase < 2) this.phase = 2;

    // 技能冷却
    if (this.skillCooldown > 0) this.skillCooldown--;
  }

  draw(ctx, camera) {
    if (!this.alive) return;

    const x = this.x - camera.x;
    const y = this.y - camera.y;

    // Boss 身体
    ctx.fillStyle = this.hitTimer > 0 ? '#FFF' : '#9B59B6';
    ctx.fillRect(x, y, this.width, this.height);

    // Boss 眼睛
    ctx.fillStyle = '#E74C3C';
    ctx.fillRect(x + 15, y + 20, 15, 15);
    ctx.fillRect(x + 50, y + 20, 15, 15);
    ctx.fillStyle = '#FFF';
    ctx.fillRect(x + 18, y + 23, 8, 8);
    ctx.fillRect(x + 53, y + 23, 8, 8);

    // Boss 名称
    ctx.fillStyle = '#ECF0F1';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(this.name, x + this.width/2, y - 10);

    // Boss 血条
    this.drawBossHpBar(ctx, x, y - 30, this.width, 10);
  }

  drawBossHpBar(ctx, x, y, width, height) {
    ctx.fillStyle = '#2C3E50';
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
