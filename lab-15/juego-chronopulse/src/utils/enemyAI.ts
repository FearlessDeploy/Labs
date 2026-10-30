import { Blade, Enemy, Player, Projectile, Shockwave } from '../types/game';

interface AIUpdateContext {
  player: Player;
  blades: Blade[];
  projectiles: Projectile[];
  allEnemies: Enemy[];
  dt: number;
  gameTime: number;
  worldWidth: number;
  worldHeight: number;
  arenaPadding: number;
  onSpawnProjectile: (proj: Projectile) => void;
  onSpawnShockwave: (shock: Shockwave) => void;
}

export function updateEnemyTactics(enemy: Enemy, ctx: AIUpdateContext) {
  const { player: p, blades, projectiles, allEnemies, dt, gameTime, worldWidth, worldHeight, arenaPadding, onSpawnProjectile, onSpawnShockwave } = ctx;

  // Manejo de estados de congelamiento y quemadura
  if (enemy.statusEffects.freezeDuration > 0) {
    enemy.statusEffects.freezeDuration -= dt;
    return;
  }
  if (enemy.statusEffects.burnDuration > 0) {
    enemy.statusEffects.burnDuration -= dt;
    enemy.hp -= enemy.statusEffects.burnDps * dt;
  }

  enemy.behaviorTimer += dt;
  if (enemy.dodgeCooldown === undefined) enemy.dodgeCooldown = 0;
  if (enemy.dodgeCooldown > 0) enemy.dodgeCooldown -= dt;

  if (enemy.isDodging) {
    if (enemy.dodgeTimer !== undefined) {
      enemy.dodgeTimer -= dt;
      if (enemy.dodgeTimer <= 0) {
        enemy.isDodging = false;
      }
    }
  }

  const dx = p.x - enemy.x;
  const dy = p.y - enemy.y;
  const distToPlayer = Math.hypot(dx, dy);

  // --- 1. DETECCIÓN DE ESQUIVA TÁCTICA ---
  // Si una hoja u otro proyectil reflejado se aproxima, el enemigo esquiva perpendicularmente
  if (!enemy.isBoss && enemy.dodgeCooldown <= 0 && !enemy.isDodging) {
    let threat: { x: number; y: number; vx: number; vy: number } | null = null;

    // Comprueba hojas en impulso
    for (const b of blades) {
      if (b.isThrusting && b.thrustTarget) {
        const bDist = Math.hypot(b.x - enemy.x, b.y - enemy.y);
        if (bDist < 140) {
          threat = { x: b.x, y: b.y, vx: b.thrustTarget.x - b.x, vy: b.thrustTarget.y - b.y };
          break;
        }
      }
    }

    // Comprueba balas reflejadas entrantes
    if (!threat) {
      for (const proj of projectiles) {
        if (proj.type === 'reflected_bullet' || proj.type === 'player_missile') {
          const pDist = Math.hypot(proj.x - enemy.x, proj.y - enemy.y);
          if (pDist < 120) {
            threat = proj;
            break;
          }
        }
      }
    }

    // Ejecuta impulso de evasión
    if (threat) {
      const threatAngle = Math.atan2(threat.vy, threat.vx);
      const side = Math.random() < 0.5 ? 1 : -1;
      const dodgeAngle = threatAngle + (Math.PI / 2) * side;

      enemy.isDodging = true;
      enemy.dodgeTimer = 0.28;
      enemy.dodgeCooldown = enemy.type === 'swarmer' || enemy.type === 'elite_assassin' ? 1.5 : 2.8;
      const dodgeSpeed = enemy.speed * 2.2;
      enemy.vx = Math.cos(dodgeAngle) * dodgeSpeed;
      enemy.vy = Math.sin(dodgeAngle) * dodgeSpeed;
      enemy.rotation = dodgeAngle;
    }
  }

  // --- 2. LÓGICA DE MOVIMIENTO Y COMPORTAMIENTO ---
  if (!enemy.isDodging) {
    let steerX = 0;
    let steerY = 0;

    // Separación suave entre enemigos
    for (let j = 0; j < allEnemies.length; j++) {
      const other = allEnemies[j];
      if (other === enemy) continue;
      const ex = enemy.x - other.x;
      const ey = enemy.y - other.y;
      const d = Math.hypot(ex, ey);
      const minDist = enemy.radius + other.radius + 12;
      if (d > 0 && d < minDist) {
        const push = (minDist - d) / minDist;
        steerX += (ex / d) * push * 120;
        steerY += (ey / d) * push * 120;
      }
    }

    // Comportamiento por arquetipo de enemigo
    switch (enemy.type) {
      case 'chaser': {
        // Flanqueo y embestida curva
        const angleToP = Math.atan2(dy, dx);
        const flankOffset = Math.sin(enemy.behaviorTimer * 3 + enemy.x * 0.01) * 0.4;
        const finalAngle = angleToP + flankOffset;
        steerX += Math.cos(finalAngle) * enemy.speed;
        steerY += Math.sin(finalAngle) * enemy.speed;
        enemy.rotation = angleToP;
        break;
      }

      case 'swarmer': {
        // Embestida en zigzag de alta frecuencia
        const angleToP = Math.atan2(dy, dx);
        const wiggle = Math.sin(enemy.behaviorTimer * 9) * 0.8;
        steerX += Math.cos(angleToP + wiggle) * enemy.speed;
        steerY += Math.sin(angleToP + wiggle) * enemy.speed;
        enemy.rotation = angleToP + wiggle;
        break;
      }

      case 'shooter': {
        // Mantiene distancia táctica y realiza desplazamiento lateral
        const angleToP = Math.atan2(dy, dx);
        if (distToPlayer < 220) {
          steerX -= Math.cos(angleToP) * enemy.speed;
          steerY -= Math.sin(angleToP) * enemy.speed;
        } else if (distToPlayer > 350) {
          steerX += Math.cos(angleToP) * enemy.speed;
          steerY += Math.sin(angleToP) * enemy.speed;
        } else {
          const strafe = Math.sin(enemy.behaviorTimer * 2) > 0 ? Math.PI / 2 : -Math.PI / 2;
          steerX += Math.cos(angleToP + strafe) * enemy.speed;
          steerY += Math.sin(angleToP + strafe) * enemy.speed;
        }
        enemy.rotation = angleToP;

        // Disparo de proyectiles
        if (enemy.behaviorTimer - enemy.lastShootTime > enemy.shootCooldown) {
          enemy.lastShootTime = enemy.behaviorTimer;
          for (let side = -1; side <= 1; side += 2) {
            const barrelOffsetX = Math.cos(angleToP + Math.PI / 2) * (side * 8);
            const barrelOffsetY = Math.sin(angleToP + Math.PI / 2) * (side * 8);
            onSpawnProjectile({
              id: `shooter_${Date.now()}_${side}`,
              type: 'enemy_bullet',
              x: enemy.x + barrelOffsetX,
              y: enemy.y + barrelOffsetY,
              vx: Math.cos(angleToP) * 440,
              vy: Math.sin(angleToP) * 440,
              radius: 6,
              damage: 18,
              color: '#c084fc',
              life: 5.5,
              maxLife: 5.5,
              pierce: 1,
              trail: [],
            });
          }
        }
        break;
      }

      case 'sniper': {
        const angleToP = Math.atan2(dy, dx);
        enemy.rotation = angleToP;

        if (distToPlayer < 260) {
          steerX -= Math.cos(angleToP) * enemy.speed;
          steerY -= Math.sin(angleToP) * enemy.speed;
        }

        // Carga de francotirador
        if (!enemy.isCharging && enemy.behaviorTimer - enemy.lastShootTime > enemy.shootCooldown) {
          enemy.isCharging = true;
          enemy.chargeTime = 0;
          enemy.targetPos = { x: p.x, y: p.y };
        }

        if (enemy.isCharging) {
          enemy.chargeTime = (enemy.chargeTime || 0) + dt;
          enemy.targetPos = { x: p.x, y: p.y };

          if (enemy.chargeTime >= 0.75) {
            enemy.isCharging = false;
            enemy.lastShootTime = enemy.behaviorTimer;
            const shootAngle = Math.atan2(enemy.targetPos.y - enemy.y, enemy.targetPos.x - enemy.x);
            onSpawnProjectile({
              id: `snipe_${Date.now()}`,
              type: 'enemy_laser',
              x: enemy.x + Math.cos(shootAngle) * (enemy.radius * 1.4),
              y: enemy.y + Math.sin(shootAngle) * (enemy.radius * 1.4),
              vx: Math.cos(shootAngle) * 1400,
              vy: Math.sin(shootAngle) * 1400,
              radius: 9,
              damage: 42,
              color: '#ec4899',
              life: 3.5,
              maxLife: 3.5,
              pierce: 1,
              trail: [],
            });
          }
        }
        break;
      }

      case 'orbit_spitter': {
        const angleToP = Math.atan2(dy, dx);
        steerX += Math.cos(angleToP) * (enemy.speed * 0.7);
        steerY += Math.sin(angleToP) * (enemy.speed * 0.7);
        enemy.rotation = enemy.behaviorTimer * 1.5;

        // Ráfaga radial de proyectiles
        if (enemy.behaviorTimer - enemy.lastShootTime > enemy.shootCooldown) {
          enemy.lastShootTime = enemy.behaviorTimer;
          const count = 10;
          for (let b = 0; b < count; b++) {
            const rAngle = (b * 2 * Math.PI) / count + enemy.behaviorTimer;
            onSpawnProjectile({
              id: `radial_${Date.now()}_${b}`,
              type: 'enemy_bullet',
              x: enemy.x,
              y: enemy.y,
              vx: Math.cos(rAngle) * 340,
              vy: Math.sin(rAngle) * 340,
              radius: 6.5,
              damage: 18,
              color: '#facc15',
              life: 5.0,
              maxLife: 5.0,
              pierce: 1,
              trail: [],
            });
          }
        }
        break;
      }

      case 'emp_drone': {
        const angleToP = Math.atan2(dy, dx);
        const chargeSpeed = distToPlayer < 240 ? enemy.speed * 1.6 : enemy.speed;
        steerX += Math.cos(angleToP) * chargeSpeed;
        steerY += Math.sin(angleToP) * chargeSpeed;
        enemy.rotation = angleToP;
        break;
      }

      case 'pulse_colossus': {
        const angleToP = Math.atan2(dy, dx);
        steerX += Math.cos(angleToP) * (enemy.speed * 0.65);
        steerY += Math.sin(angleToP) * (enemy.speed * 0.65);
        enemy.rotation = angleToP;

        // Onda de choque periódica
        if (enemy.behaviorTimer - enemy.lastShootTime > enemy.shootCooldown) {
          enemy.lastShootTime = enemy.behaviorTimer;
          onSpawnShockwave({
            x: enemy.x,
            y: enemy.y,
            radius: 12,
            maxRadius: 190,
            color: '#38bdf8',
            width: 5,
            alpha: 1,
            speed: 400,
          });

          // Disparos dobles de pulso
          for (let side = -1; side <= 1; side += 2) {
            const spread = angleToP + side * 0.22;
            onSpawnProjectile({
              id: `pulse_cannon_${Date.now()}_${side}`,
              type: 'enemy_bullet',
              x: enemy.x + Math.cos(angleToP + (side * Math.PI) / 2) * 16,
              y: enemy.y + Math.sin(angleToP + (side * Math.PI) / 2) * 16,
              vx: Math.cos(spread) * 420,
              vy: Math.sin(spread) * 420,
              radius: 9,
              damage: 28,
              color: '#38bdf8',
              life: 4.8,
              maxLife: 4.8,
              pierce: 1,
              trail: [],
            });
          }
        }
        break;
      }

      case 'void_stalker': {
        const angleToP = Math.atan2(dy, dx);
        const isCharging = distToPlayer < 280;
        const speedMult = isCharging ? 1.55 : 1.0;
        steerX += Math.cos(angleToP) * (enemy.speed * speedMult);
        steerY += Math.sin(angleToP) * (enemy.speed * speedMult);
        enemy.rotation = angleToP;

        if (enemy.behaviorTimer - enemy.lastShootTime > enemy.shootCooldown) {
          enemy.lastShootTime = enemy.behaviorTimer;
          for (let s = -1; s <= 1; s++) {
            onSpawnProjectile({
              id: `stalker_needle_${Date.now()}_${s}`,
              type: 'enemy_bullet',
              x: enemy.x + Math.cos(angleToP) * 18,
              y: enemy.y + Math.sin(angleToP) * 18,
              vx: Math.cos(angleToP + s * 0.12) * 550,
              vy: Math.sin(angleToP + s * 0.12) * 550,
              radius: 6,
              damage: 22,
              color: '#a855f7',
              life: 4.5,
              maxLife: 4.5,
              pierce: 1,
              trail: [],
            });
          }
        }
        break;
      }

      case 'nanite_drone': {
        // Órbita y reparación a hostiles cercanos
        let targetHostile: Enemy | null = null;
        let lowestHpRatio = 1.0;
        for (const other of allEnemies) {
          if (other !== enemy && !other.isBoss) {
            const ratio = other.hp / other.maxHp;
            if (ratio < lowestHpRatio) {
              lowestHpRatio = ratio;
              targetHostile = other;
            }
          }
        }

        if (targetHostile) {
          const ex = targetHostile.x - enemy.x;
          const ey = targetHostile.y - enemy.y;
          const distToHostile = Math.hypot(ex, ey);
          const angleToHostile = Math.atan2(ey, ex);
          if (distToHostile > 70) {
            steerX += Math.cos(angleToHostile) * enemy.speed;
            steerY += Math.sin(angleToHostile) * enemy.speed;
          } else {
            steerX += Math.cos(angleToHostile + Math.PI / 2) * enemy.speed;
            steerY += Math.sin(angleToHostile + Math.PI / 2) * enemy.speed;
          }
          enemy.rotation = angleToHostile;

          // Pulso de curación
          if (enemy.behaviorTimer - enemy.lastShootTime > enemy.shootCooldown) {
            enemy.lastShootTime = enemy.behaviorTimer;
            targetHostile.hp = Math.min(targetHostile.maxHp, targetHostile.hp + 60);
            onSpawnShockwave({
              x: targetHostile.x,
              y: targetHostile.y,
              radius: 8,
              maxRadius: 55,
              color: '#10b981',
              width: 3,
              alpha: 0.8,
              speed: 200,
            });
          }
        } else {
          const angleToP = Math.atan2(dy, dx);
          steerX -= Math.cos(angleToP) * (enemy.speed * 0.8);
          steerY -= Math.sin(angleToP) * (enemy.speed * 0.8);
          enemy.rotation = enemy.behaviorTimer * 2;
        }
        break;
      }

      case 'plasma_bomber': {
        // Desplazamiento y colocación de minas de plasma
        const strafeAngle = Math.atan2(dy, dx) + Math.PI / 2;
        steerX += Math.cos(strafeAngle) * enemy.speed + Math.cos(Math.atan2(dy, dx)) * (enemy.speed * 0.35);
        steerY += Math.sin(strafeAngle) * enemy.speed + Math.sin(Math.atan2(dy, dx)) * (enemy.speed * 0.35);
        enemy.rotation = Math.atan2(enemy.vy, enemy.vx);

        if (enemy.behaviorTimer - enemy.lastShootTime > enemy.shootCooldown) {
          enemy.lastShootTime = enemy.behaviorTimer;
          onSpawnProjectile({
            id: `plasma_mine_${Date.now()}`,
            type: 'enemy_bullet',
            x: enemy.x,
            y: enemy.y,
            vx: -Math.cos(enemy.rotation) * 40,
            vy: -Math.sin(enemy.rotation) * 40,
            radius: 11,
            damage: 32,
            color: '#f43f5e',
            life: 6.0,
            maxLife: 6.0,
            pierce: 1,
            trail: [],
          });
        }
        break;
      }

      case 'elite_juggernaut': {
        const angleToP = Math.atan2(dy, dx);
        steerX += Math.cos(angleToP) * enemy.speed;
        steerY += Math.sin(angleToP) * enemy.speed;
        enemy.rotation = angleToP;

        // Ráfaga de cohetes en racimo
        if (enemy.behaviorTimer - enemy.lastShootTime > enemy.shootCooldown) {
          enemy.lastShootTime = enemy.behaviorTimer;
          for (let m = -2; m <= 2; m++) {
            const spread = angleToP + m * 0.18;
            onSpawnProjectile({
              id: `jugg_missile_${Date.now()}_${m}`,
              type: 'enemy_bullet',
              x: enemy.x,
              y: enemy.y,
              vx: Math.cos(spread) * 380,
              vy: Math.sin(spread) * 380,
              radius: 8,
              damage: 25,
              color: '#f97316',
              life: 5.0,
              maxLife: 5.0,
              pierce: 1,
              trail: [],
            });
          }
        }
        break;
      }

      case 'elite_assassin': {
        // Cambio de fase y teletransporte
        const angleToP = Math.atan2(dy, dx);
        enemy.stealthAlpha = 0.3 + Math.abs(Math.sin(enemy.behaviorTimer * 4)) * 0.7;

        if (enemy.behaviorTimer - enemy.lastShootTime > 3.2) {
          enemy.lastShootTime = enemy.behaviorTimer;
          const blinkAngle = angleToP + Math.PI + (Math.random() - 0.5) * 0.8;
          enemy.x = p.x + Math.cos(blinkAngle) * 160;
          enemy.y = p.y + Math.sin(blinkAngle) * 160;
          onSpawnShockwave({
            x: enemy.x,
            y: enemy.y,
            radius: 10,
            maxRadius: 80,
            color: '#c084fc',
            width: 3,
            alpha: 0.9,
            speed: 350,
          });
        }

        steerX += Math.cos(angleToP) * enemy.speed;
        steerY += Math.sin(angleToP) * enemy.speed;
        enemy.rotation = angleToP;
        break;
      }

      // --- PATRONES DE JEFES ---
      case 'boss_titan': {
        updateBossTitan(enemy, p, onSpawnProjectile, onSpawnShockwave, dt);
        break;
      }
      case 'boss_weaver': {
        updateBossWeaver(enemy, p, onSpawnProjectile, onSpawnShockwave, dt);
        break;
      }
      case 'boss_hexcore': {
        updateBossHexCore(enemy, p, onSpawnProjectile, onSpawnShockwave, dt);
        break;
      }
      case 'boss_valkyrie': {
        updateBossValkyrie(enemy, p, onSpawnProjectile, onSpawnShockwave, dt);
        break;
      }
      case 'boss_singularity': {
        updateBossSingularity(enemy, p, onSpawnProjectile, onSpawnShockwave, dt);
        break;
      }
    }

    // Aplica velocidad suavizada
    enemy.vx += (steerX - enemy.vx) * 0.15;
    enemy.vy += (steerY - enemy.vy) * 0.15;
  }

  enemy.x += enemy.vx * dt;
  enemy.y += enemy.vy * dt;

  // Delimita dentro del área de juego
  enemy.x = Math.max(arenaPadding + enemy.radius, Math.min(worldWidth - arenaPadding - enemy.radius, enemy.x));
  enemy.y = Math.max(arenaPadding + enemy.radius, Math.min(worldHeight - arenaPadding - enemy.radius, enemy.y));
}

// JEFE 1: TITAN PROTO-DREADNOUGHT (Sector 3)
function updateBossTitan(
  boss: Enemy,
  p: Player,
  onSpawnProjectile: (proj: Projectile) => void,
  onSpawnShockwave: (shock: Shockwave) => void,
  dt: number
) {
  const dx = p.x - boss.x;
  const dy = p.y - boss.y;
  boss.rotation = Math.atan2(dy, dx);

  boss.vx += (dx * 0.3 - boss.vx) * 0.05;
  boss.vy += ((p.y - 180 - boss.y) * 0.3 - boss.vy) * 0.05;

  // Ráfaga Gatling en espiral
  if (boss.behaviorTimer - boss.lastShootTime > 0.18) {
    boss.lastShootTime = boss.behaviorTimer;
    const bAngle = boss.rotation + Math.sin(boss.behaviorTimer * 6) * 0.45;
    onSpawnProjectile({
      id: `titan_gat_${Date.now()}_${Math.random()}`,
      type: 'enemy_bullet',
      x: boss.x + Math.cos(bAngle) * (boss.radius * 0.9),
      y: boss.y + Math.sin(bAngle) * (boss.radius * 0.9),
      vx: Math.cos(bAngle) * 440,
      vy: Math.sin(bAngle) * 440,
      radius: 8,
      damage: 22,
      color: '#ef4444',
      life: 6.0,
      maxLife: 6.0,
      pierce: 1,
      trail: [],
    });
  }

  // Anillo de onda de choque periódico
  if (Math.floor(boss.behaviorTimer * 0.5) !== Math.floor((boss.behaviorTimer - dt) * 0.5)) {
    onSpawnShockwave({
      x: boss.x,
      y: boss.y,
      radius: 15,
      maxRadius: 350,
      color: '#ef4444',
      width: 6,
      alpha: 1,
      speed: 550,
    });
  }
}

// JEFE 2: CHRONO WEAVER (Sector 6)
function updateBossWeaver(
  boss: Enemy,
  p: Player,
  onSpawnProjectile: (proj: Projectile) => void,
  onSpawnShockwave: (shock: Shockwave) => void,
  dt: number
) {
  boss.rotation = boss.behaviorTimer * 2;

  // Teletransporte cada 3.5 segundos
  if (boss.behaviorTimer - boss.lastShootTime > 3.5) {
    boss.lastShootTime = boss.behaviorTimer;
    const teleportAngle = Math.random() * Math.PI * 2;
    boss.x = p.x + Math.cos(teleportAngle) * 280;
    boss.y = p.y + Math.sin(teleportAngle) * 280;
    onSpawnShockwave({
      x: boss.x,
      y: boss.y,
      radius: 10,
      maxRadius: 200,
      color: '#38bdf8',
      width: 5,
      alpha: 1,
      speed: 600,
    });
  }

  // Anillos de agujas cuánticas
  if (Math.floor(boss.behaviorTimer * 2) !== Math.floor((boss.behaviorTimer - dt) * 2)) {
    const count = 12;
    for (let i = 0; i < count; i++) {
      const a = (i * 2 * Math.PI) / count + boss.behaviorTimer;
      onSpawnProjectile({
        id: `weaver_needle_${Date.now()}_${i}`,
        type: 'enemy_bullet',
        x: boss.x,
        y: boss.y,
        vx: Math.cos(a) * 360,
        vy: Math.sin(a) * 360,
        radius: 6,
        damage: 20,
        color: '#38bdf8',
        life: 5.5,
        maxLife: 5.5,
        pierce: 1,
        trail: [],
      });
    }
  }
}

// JEFE 3: HEX-CORE OVERLORD (Sector 9)
function updateBossHexCore(
  boss: Enemy,
  p: Player,
  onSpawnProjectile: (proj: Projectile) => void,
  onSpawnShockwave: (shock: Shockwave) => void,
  dt: number
) {
  boss.rotation = boss.behaviorTimer * 1.2;
  const dx = p.x - boss.x;
  const dy = p.y - boss.y;

  boss.vx += (dx * 0.2 - boss.vx) * 0.04;
  boss.vy += (dy * 0.2 - boss.vy) * 0.04;

  // Haz giratorio triple
  if (boss.behaviorTimer - boss.lastShootTime > 0.22) {
    boss.lastShootTime = boss.behaviorTimer;
    for (let beam = 0; beam < 3; beam++) {
      const beamAngle = boss.rotation + (beam * 2 * Math.PI) / 3;
      onSpawnProjectile({
        id: `hex_beam_${Date.now()}_${beam}`,
        type: 'enemy_laser',
        x: boss.x,
        y: boss.y,
        vx: Math.cos(beamAngle) * 620,
        vy: Math.sin(beamAngle) * 620,
        radius: 7.5,
        damage: 24,
        color: '#c084fc',
        life: 4.5,
        maxLife: 4.5,
        pierce: 1,
        trail: [],
      });
    }
  }
}

// JEFE 4: OBSIDIAN VALKYRIE (Sector 12)
function updateBossValkyrie(
  boss: Enemy,
  p: Player,
  onSpawnProjectile: (proj: Projectile) => void,
  onSpawnShockwave: (shock: Shockwave) => void,
  dt: number
) {
  const dx = p.x - boss.x;
  const dy = p.y - boss.y;
  const angleToP = Math.atan2(dy, dx);
  boss.rotation = angleToP;

  // Ataques en embestida rápida
  const phaseCycle = boss.behaviorTimer % 3;
  if (phaseCycle < 1.0) {
    boss.vx = Math.cos(angleToP) * 580;
    boss.vy = Math.sin(angleToP) * 580;
  } else {
    boss.vx = Math.cos(angleToP + Math.PI / 2) * 320;
    boss.vy = Math.sin(angleToP + Math.PI / 2) * 320;

    if (boss.behaviorTimer - boss.lastShootTime > 0.4) {
      boss.lastShootTime = boss.behaviorTimer;
      for (let s = -1; s <= 1; s += 2) {
        const bAngle = angleToP + s * 0.35;
        onSpawnProjectile({
          id: `valk_plasma_${Date.now()}_${s}`,
          type: 'enemy_bullet',
          x: boss.x,
          y: boss.y,
          vx: Math.cos(bAngle) * 500,
          vy: Math.sin(bAngle) * 500,
          radius: 9,
          damage: 28,
          color: '#f43f5e',
          life: 4.5,
          maxLife: 4.5,
          pierce: 1,
          trail: [],
        });
      }
    }
  }
}

// JEFE 5: APEX NULL-SINGULARITY (Titán gravitacional)
function updateBossSingularity(
  boss: Enemy,
  p: Player,
  onSpawnProjectile: (proj: Projectile) => void,
  onSpawnShockwave: (shock: Shockwave) => void,
  dt: number
) {
  boss.rotation += dt * 3.8;
  const dx = p.x - boss.x;
  const dy = p.y - boss.y;
  const dist = Math.hypot(dx, dy);

  // Posicionamiento dinámico
  const targetX = p.x * 0.4 + 1300 * 0.6;
  const targetY = p.y * 0.4 + 1000 * 0.6;
  boss.vx += ((targetX - boss.x) * 0.35 - boss.vx) * 0.04;
  boss.vy += ((targetY - boss.y) * 0.35 - boss.vy) * 0.04;

  // Reubicación por teletransporte si el jugador está muy lejos
  if (dist > 850 && boss.behaviorTimer - (boss.chargeTime || 0) > 6.0) {
    boss.chargeTime = boss.behaviorTimer;
    const warpAngle = Math.random() * Math.PI * 2;
    boss.x = Math.max(120, Math.min(2480, p.x + Math.cos(warpAngle) * 320));
    boss.y = Math.max(120, Math.min(1880, p.y + Math.sin(warpAngle) * 320));
    onSpawnShockwave({
      x: boss.x,
      y: boss.y,
      radius: 15,
      maxRadius: 360,
      color: '#fbbf24',
      width: 7,
      alpha: 1,
      speed: 650,
    });
  }

  // Atracción gravitacional de agujero negro
  if (dist > 45 && dist < 850) {
    const normalized = Math.max(0, 1 - dist / 850);
    const pullForce = 140 + Math.pow(normalized, 1.8) * 380;
    p.vx -= (dx / dist) * pullForce * dt;
    p.vy -= (dy / dist) * pullForce * dt;
  }

  // Ciclo de colapso y detonación supernova
  const collapseCycle = boss.behaviorTimer % 4.2;
  if (collapseCycle > 3.4) {
    boss.isCharging = true;
    boss.targetPos = { x: p.x, y: p.y };

    if (Math.floor(boss.behaviorTimer * 8) !== Math.floor((boss.behaviorTimer - dt) * 8)) {
      onSpawnShockwave({
        x: boss.x,
        y: boss.y,
        radius: 120,
        maxRadius: 15,
        color: '#f59e0b',
        width: 3,
        alpha: 0.8,
        speed: -250,
      });
    }
  } else if (boss.isCharging) {
    boss.isCharging = false;
    onSpawnShockwave({
      x: boss.x,
      y: boss.y,
      radius: 20,
      maxRadius: 520,
      color: '#fbbf24',
      width: 9,
      alpha: 1,
      speed: 750,
    });

    const novaCount = 16;
    for (let k = 0; k < novaCount; k++) {
      const novaAngle = (k * 2 * Math.PI) / novaCount + boss.rotation;
      onSpawnProjectile({
        id: `sing_nova_${Date.now()}_${k}`,
        type: 'enemy_bullet',
        x: boss.x,
        y: boss.y,
        vx: Math.cos(novaAngle) * 480,
        vy: Math.sin(novaAngle) * 480,
        radius: 9,
        damage: 32,
        color: '#f59e0b',
        life: 5.0,
        maxLife: 5.0,
        pierce: 1,
        trail: [],
      });
    }
  }

  // Ráfaga en espiral de materia oscura
  if (!boss.isCharging && boss.behaviorTimer - boss.lastShootTime > 0.11) {
    boss.lastShootTime = boss.behaviorTimer;
    for (let arm = 0; arm < 4; arm++) {
      const armAngle = boss.rotation + (arm * Math.PI) / 2;
      onSpawnProjectile({
        id: `sing_bullet_${Date.now()}_${arm}`,
        type: 'enemy_bullet',
        x: boss.x + Math.cos(armAngle) * (boss.radius * 0.85),
        y: boss.y + Math.sin(armAngle) * (boss.radius * 0.85),
        vx: Math.cos(armAngle) * 430,
        vy: Math.sin(armAngle) * 430,
        radius: 8.5,
        damage: 28,
        color: '#fbbf24',
        life: 5.5,
        maxLife: 5.5,
        pierce: 1,
        trail: [],
      });
    }
  }
}
