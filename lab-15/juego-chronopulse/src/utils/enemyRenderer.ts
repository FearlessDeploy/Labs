import { Enemy } from '../types/game';

/**
 * Renderizador personalizado en Canvas para todos los arquetipos de enemigos, élites y jefes.
 */
export function drawEnemy(ctx: CanvasRenderingContext2D, enemy: Enemy, now: number) {
  ctx.save();
  ctx.translate(enemy.x, enemy.y);

  // Aplica la rotación según dirección u orientación
  const angle = enemy.rotation ?? Math.atan2(enemy.vy, enemy.vx);
  ctx.rotate(angle);

  // Transparencia de fase sigilosa para el Asesino de Fase
  if (enemy.stealthAlpha !== undefined) {
    ctx.globalAlpha = Math.max(0.15, enemy.stealthAlpha);
  }

  // Tinte visual de congelamiento o quemadura
  if (enemy.statusEffects.freezeDuration > 0) {
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 12;
  } else if (enemy.statusEffects.burnDuration > 0) {
    ctx.shadowColor = '#f97316';
    ctx.shadowBlur = 12;
  }

  const r = Math.max(1, enemy.radius);
  const pulse = Math.sin(now * 0.008 + enemy.id.length) * 0.15;

  switch (enemy.type) {
    // 1. CHASER / DRON CAZADOR: Casco en flecha aerodinámico
    case 'chaser': {
      // Llama de propulsor
      ctx.fillStyle = enemy.isDodging ? '#38bdf8' : '#ef4444';
      ctx.beginPath();
      ctx.moveTo(-r * 0.9, -r * 0.3);
      ctx.lineTo(-r * 1.5 - Math.random() * 6, 0);
      ctx.lineTo(-r * 0.9, r * 0.3);
      ctx.fill();

      // Casco principal
      ctx.beginPath();
      ctx.moveTo(r * 1.3, 0);
      ctx.lineTo(-r * 0.9, -r * 0.85);
      ctx.lineTo(-r * 0.45, 0);
      ctx.lineTo(-r * 0.9, r * 0.85);
      ctx.closePath();
      ctx.fillStyle = '#140c0c';
      ctx.fill();
      ctx.strokeStyle = enemy.color;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Ojo central
      ctx.beginPath();
      ctx.arc(r * 0.2, 0, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#f87171';
      ctx.fill();
      break;
    }

    // 2. SHOOTER / FRAGATA DE ASALTO: Cañones de plasma dobles y placas de blindaje
    case 'shooter': {
      // Escape de motores dobles
      ctx.fillStyle = '#c084fc';
      ctx.fillRect(-r * 1.1, -r * 0.6, r * 0.4, 3);
      ctx.fillRect(-r * 1.1, r * 0.4, r * 0.4, 3);

      // Cañones
      ctx.fillStyle = '#581c87';
      ctx.fillRect(0, -r * 0.7, r * 1.2, 3.5);
      ctx.fillRect(0, r * 0.4, r * 1.2, 3.5);

      // Cuerpo del crucero
      ctx.beginPath();
      ctx.moveTo(r * 0.8, 0);
      ctx.lineTo(r * 0.2, -r * 0.9);
      ctx.lineTo(-r * 0.9, -r * 0.7);
      ctx.lineTo(-r * 0.6, 0);
      ctx.lineTo(-r * 0.9, r * 0.7);
      ctx.lineTo(r * 0.2, r * 0.9);
      ctx.closePath();
      ctx.fillStyle = '#120b1e';
      ctx.fill();
      ctx.strokeStyle = enemy.color;
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Núcleo capacitador de plasma
      ctx.beginPath();
      ctx.arc(-r * 0.1, 0, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#e9d5ff';
      ctx.fill();
      break;
    }

    // 3. SNIPER / FRANCOTIRADOR DE RIEL IÓNICO: Cañón largo de precisión
    case 'sniper': {
      // Cañón del riel
      ctx.fillStyle = '#831843';
      ctx.fillRect(-r * 0.4, -2, r * 1.8, 4);

      // Anillos aceleradores del riel
      ctx.strokeStyle = enemy.isCharging ? '#f43f5e' : '#fbcfe8';
      ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        const rx = r * 0.2 + i * (r * 0.4);
        ctx.beginPath();
        ctx.arc(rx, 0, Math.max(1, 4 + pulse * 2), 0, Math.PI * 2);
        ctx.stroke();
      }

      // Alas estabilizadoras
      ctx.beginPath();
      ctx.moveTo(-r * 0.3, 0);
      ctx.lineTo(-r * 0.9, -r * 0.9);
      ctx.lineTo(-r * 0.6, 0);
      ctx.lineTo(-r * 0.9, r * 0.9);
      ctx.closePath();
      ctx.fillStyle = '#1a0b16';
      ctx.fill();
      ctx.strokeStyle = enemy.color;
      ctx.lineWidth = 2;
      ctx.stroke();
      break;
    }

    // 4. ORBIT SPITTER / PORTADOR DE MINAS HEXAGONALES: Jaula hexagonal giratoria
    case 'orbit_spitter': {
      const rot = enemy.behaviorTimer * 1.8;
      // Anillo hexagonal exterior giratorio
      ctx.save();
      ctx.rotate(rot);
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        const hx = Math.cos(a) * r;
        const hy = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.strokeStyle = enemy.color;
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Nodos en vértices
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * r, Math.sin(a) * r, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#fef08a';
        ctx.fill();
      }
      ctx.restore();

      // Reactor interior en contrarrotación
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = '#261b0c';
      ctx.fill();
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      break;
    }

    // 5. SWARMER / MICRO-VÍBORA: Dardo triangular compacto
    case 'swarmer': {
      ctx.beginPath();
      ctx.moveTo(r * 1.4, 0);
      ctx.lineTo(-r * 0.8, -r * 0.7);
      ctx.lineTo(-r * 0.3, 0);
      ctx.lineTo(-r * 0.8, r * 0.7);
      ctx.closePath();
      ctx.fillStyle = '#272008';
      ctx.fill();
      ctx.strokeStyle = enemy.color;
      ctx.lineWidth = 1.8;
      ctx.stroke();

      ctx.fillStyle = '#fef08a';
      ctx.fillRect(-r * 0.9, -1.5, 3, 3);
      break;
    }

    // 6. EMP DRONE / DRON ANULADOR EMP: Anillos giroscópicos y aura eléctrica
    case 'emp_drone': {
      ctx.save();
      // Anillo giroscópico orbital 1
      ctx.rotate(now * 0.003);
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 1.15, r * 0.5, 0, 0, Math.PI * 2);
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Anillo giroscópico orbital 2
      ctx.rotate(Math.PI / 3);
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 1.15, r * 0.5, 0, 0, Math.PI * 2);
      ctx.strokeStyle = '#67e8f9';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();

      // Esfera del núcleo
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.55, 0, Math.PI * 2);
      ctx.fillStyle = '#082f49';
      ctx.fill();
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2;
      ctx.stroke();
      break;
    }

    // 7. PULSE COLOSSUS: Fortaleza octagonal blindada
    case 'pulse_colossus': {
      // Placas de blindaje octagonal
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = '#082f49';
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.8;
      ctx.stroke();

      // Núcleo gravitacional oscilante
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(1, r * 0.45 + Math.sin(now * 0.01) * 2), 0, Math.PI * 2);
      ctx.fillStyle = '#0284c7';
      ctx.fill();
      ctx.strokeStyle = '#bae6fd';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      break;
    }

    // 8. VOID STALKER: Ala de daga oscura predadora con escudo cinético
    case 'void_stalker': {
      // Arco del escudo cinético frontal
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.3, -Math.PI / 2.5, Math.PI / 2.5);
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 3.5;
      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.restore();

      // Casco principal de daga oscura
      ctx.beginPath();
      ctx.moveTo(r * 1.2, 0);
      ctx.lineTo(-r * 0.9, -r * 0.75);
      ctx.lineTo(-r * 0.4, 0);
      ctx.lineTo(-r * 0.9, r * 0.75);
      ctx.closePath();
      ctx.fillStyle = '#1e102e';
      ctx.fill();
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2;
      ctx.stroke();
      break;
    }

    // 9. NANITE DRONE: Dron de soporte en forma de cruz de restauración
    case 'nanite_drone': {
      ctx.save();
      ctx.rotate(now * 0.002);
      // Geometría de cruz médica
      const armW = r * 0.4;
      const armL = r * 0.95;
      ctx.beginPath();
      ctx.rect(-armW / 2, -armL, armW, armL * 2);
      ctx.rect(-armL, -armW / 2, armL * 2, armW);
      ctx.fillStyle = '#064e3b';
      ctx.fill();
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.8;
      ctx.shadowColor = '#34d399';
      ctx.shadowBlur = 8;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, r * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = '#6ee7b7';
      ctx.fill();
      ctx.restore();
      break;
    }

    // 10. PLASMA BOMBER: Bombardero pesado de alas en flecha
    case 'plasma_bomber': {
      // Alas en flecha
      ctx.beginPath();
      ctx.moveTo(r * 0.9, 0);
      ctx.lineTo(r * 0.2, -r * 1.1);
      ctx.lineTo(-r * 0.8, -r * 0.8);
      ctx.lineTo(-r * 0.5, 0);
      ctx.lineTo(-r * 0.8, r * 0.8);
      ctx.lineTo(r * 0.2, r * 1.1);
      ctx.closePath();
      ctx.fillStyle = '#2b0c15';
      ctx.fill();
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Bahía trasera de bombas
      ctx.beginPath();
      ctx.arc(-r * 0.1, 0, r * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = '#fb7185';
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 12;
      ctx.fill();
      break;
    }

    // 11. ELITE JUGGERNAUT: Acorazado pesado con blindaje frontal
    case 'elite_juggernaut': {
      // Propulsores de fusión traseros
      ctx.fillStyle = '#f97316';
      ctx.fillRect(-r * 1.2, -r * 0.5, r * 0.4, 6);
      ctx.fillRect(-r * 1.2, r * 0.3, r * 0.4, 6);

      // Casco acorazado pesado
      ctx.beginPath();
      ctx.moveTo(r * 1.2, 0);
      ctx.lineTo(r * 0.5, -r * 0.9);
      ctx.lineTo(-r * 0.9, -r * 0.85);
      ctx.lineTo(-r * 0.7, 0);
      ctx.lineTo(-r * 0.9, r * 0.85);
      ctx.lineTo(r * 0.5, r * 0.9);
      ctx.closePath();
      ctx.fillStyle = '#1c1917';
      ctx.fill();
      ctx.strokeStyle = '#fb923c';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Frente con ceja blindada
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.1, -Math.PI / 3, Math.PI / 3);
      ctx.strokeStyle = '#fdba74';
      ctx.lineWidth = 4;
      ctx.stroke();
      break;
    }

    // 8. ELITE ASSASSIN / FANTASMA DE FASE: Daga sigilosa alada
    case 'elite_assassin': {
      ctx.beginPath();
      ctx.moveTo(r * 1.5, 0);
      ctx.lineTo(-r * 0.3, -r * 1.1);
      ctx.lineTo(-r * 0.9, -r * 0.4);
      ctx.lineTo(-r * 0.5, 0);
      ctx.lineTo(-r * 0.9, r * 0.4);
      ctx.lineTo(-r * 0.3, r * 1.1);
      ctx.closePath();
      ctx.fillStyle = '#180828';
      ctx.fill();
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Núcleo de fase violeta
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#f0abfc';
      ctx.fill();
      break;
    }

    // 9. JEFE 1 (Sector 3): TITAN PROTO-DREADNOUGHT
    case 'boss_titan': {
      // Escape de propulsor pesado doble
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(-r * 0.9, -r * 0.4);
      ctx.lineTo(-r * 1.5 - Math.random() * 12, 0);
      ctx.lineTo(-r * 0.9, r * 0.4);
      ctx.fill();

      // Núcleo octagonal acorazado
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        const ox = Math.cos(a) * r;
        const oy = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(ox, oy);
        else ctx.lineTo(ox, oy);
      }
      ctx.closePath();
      ctx.fillStyle = '#170505';
      ctx.fill();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Batería láser frontal doble
      ctx.fillStyle = '#7f1d1d';
      ctx.fillRect(r * 0.4, -r * 0.5, r * 0.9, 8);
      ctx.fillRect(r * 0.4, r * 0.5 - 8, r * 0.9, 8);

      // Núcleo pulsante
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(1, r * 0.35 + pulse * 4), 0, Math.PI * 2);
      ctx.fillStyle = '#f87171';
      ctx.fill();
      break;
    }

    // 10. JEFE 2 (Sector 6): CHRONO WEAVER
    case 'boss_weaver': {
      const spin = enemy.behaviorTimer * 2.2;
      // 3 Anillos temporales exteriores
      for (let ring = 0; ring < 3; ring++) {
        ctx.save();
        ctx.rotate(spin * (ring % 2 === 0 ? 1 : -1) + (ring * Math.PI) / 3);
        ctx.beginPath();
        ctx.ellipse(0, 0, Math.max(1, r * 1.1 - ring * 6), Math.max(1, r * 0.6), 0, 0, Math.PI * 2);
        ctx.strokeStyle = ring === 0 ? '#38bdf8' : '#818cf8';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.restore();
      }

      // Ojo cronométrico central
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(1, r * 0.4), 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#e0f2fe';
      ctx.fill();
      break;
    }

    // 11. JEFE 3 (Sector 9): HEX-CORE OVERLORD
    case 'boss_hexcore': {
      // Barrera de 6 hojas giratorias
      const spin = enemy.behaviorTimer * 1.5;
      ctx.save();
      ctx.rotate(spin);
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        ctx.save();
        ctx.rotate(a);
        ctx.fillStyle = '#1e1b4b';
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(r * 0.7, -6, r * 0.5, 12, 4);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();

      // Bastión hexagonal principal
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        const hx = Math.cos(a) * (r * 0.75);
        const hy = Math.sin(a) * (r * 0.75);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.fillStyle = '#0e081c';
      ctx.fill();
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Núcleo soberano púrpura
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(1, r * 0.3 + pulse * 4), 0, Math.PI * 2);
      ctx.fillStyle = '#f3e8ff';
      ctx.fill();
      break;
    }

    // 12. JEFE 4 (Sector 12): OBSIDIAN VALKYRIE
    case 'boss_valkyrie': {
      // Hiper-alas en flecha
      ctx.beginPath();
      ctx.moveTo(r * 1.4, 0);
      ctx.lineTo(r * 0.2, -r * 1.3);
      ctx.lineTo(-r * 0.7, -r * 1.2);
      ctx.lineTo(-r * 0.3, -r * 0.3);
      ctx.lineTo(-r * 1.1, 0);
      ctx.lineTo(-r * 0.3, r * 0.3);
      ctx.lineTo(-r * 0.7, r * 1.2);
      ctx.lineTo(r * 0.2, r * 1.3);
      ctx.closePath();
      ctx.fillStyle = '#09090b';
      ctx.fill();
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // Resplandor de bordes de plasma dobles
      ctx.strokeStyle = '#fb7185';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(r * 1.2, 0);
      ctx.lineTo(-r * 0.6, -r * 1.1);
      ctx.moveTo(r * 1.2, 0);
      ctx.lineTo(-r * 0.6, r * 1.1);
      ctx.stroke();

      // Visor de la Valkiria carmesí
      ctx.fillStyle = '#ffe4e6';
      ctx.fillRect(r * 0.3, -3, r * 0.5, 6);
      break;
    }

    // 13. JEFE 5 (Sector 15 / Protocolo Titán): APEX NULL-SINGULARITY (Agujero negro Gargantúa)
    case 'boss_singularity': {
      const vortex = now * 0.006;
      const isCharging = enemy.isCharging;

      // 1. Halo de lente gravitacional de Einstein
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(1, r * 1.55 + Math.sin(now * 0.008) * 4), 0, Math.PI * 2);
      ctx.strokeStyle = isCharging ? 'rgba(239, 68, 68, 0.65)' : 'rgba(251, 191, 36, 0.45)';
      ctx.lineWidth = isCharging ? 4 : 2;
      ctx.shadowColor = isCharging ? '#ef4444' : '#fbbf24';
      ctx.shadowBlur = 18;
      ctx.stroke();
      ctx.restore();

      // 2. Filamentos de materia de acreción relativista
      for (let arm = 0; arm < 6; arm++) {
        ctx.save();
        ctx.rotate(vortex * (arm % 2 === 0 ? 1.2 : -0.9) + (arm * Math.PI) / 3);
        ctx.beginPath();
        ctx.ellipse(
          0,
          0,
          Math.max(1, isCharging ? r * 0.9 : r * (1.35 + (arm % 3) * 0.15)),
          Math.max(1, isCharging ? r * 0.25 : r * (0.38 + (arm % 2) * 0.1)),
          0,
          0,
          Math.PI * 2
        );
        ctx.strokeStyle = arm % 2 === 0 ? (isCharging ? '#ef4444' : '#fbbf24') : '#f59e0b';
        ctx.lineWidth = isCharging ? 3.5 : 2.2;
        ctx.stroke();

        // Nodos de fotones de alta velocidad en órbita sobre el disco de acreción
        const nodeAngle = now * 0.012 + arm;
        const nx = Math.cos(nodeAngle) * (r * 1.2);
        const ny = Math.sin(nodeAngle) * (r * 0.4);
        ctx.beginPath();
        ctx.arc(nx, ny, isCharging ? 3.5 : 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 8;
        ctx.fill();

        ctx.restore();
      }

      // 3. Horizonte de eventos absoluto interior (Abismo de vacío negro)
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(1, isCharging ? r * 0.5 : r * 0.75), 0, Math.PI * 2);
      ctx.fillStyle = '#020203';
      ctx.fill();
      ctx.strokeStyle = isCharging ? '#ef4444' : '#d97706';
      ctx.lineWidth = isCharging ? 5 : 3.5;
      ctx.stroke();

      // 4. Núcleo incandescente de la esfera de fotones
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(1, isCharging ? r * 0.35 + pulse * 6 : r * 0.22 + pulse * 3), 0, Math.PI * 2);
      ctx.fillStyle = isCharging ? '#fef08a' : '#ffffff';
      ctx.shadowColor = isCharging ? '#f59e0b' : '#38bdf8';
      ctx.shadowBlur = 14;
      ctx.fill();

      // Puntas emisoras de chorro relativista perpendicular
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-2, -r * 1.4, 4, r * 0.5);
      ctx.fillRect(-2, r * 0.9, 4, r * 0.5);
      break;
    }
  }

  // Dibuja el telémetro láser de carga para francotiradores y jefes
  if (enemy.isCharging && enemy.targetPos) {
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(enemy.x, enemy.y);
    ctx.lineTo(enemy.targetPos.x, enemy.targetPos.y);
    ctx.strokeStyle = enemy.isBoss ? 'rgba(239, 68, 68, 0.75)' : 'rgba(244, 63, 94, 0.65)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
    ctx.save();
    ctx.translate(enemy.x, enemy.y);
  }

  // Dibuja barra de salud para jefes y enemigos élite
  ctx.restore();

  // Barra de salud flotante en el espacio del mundo
  if (enemy.hp < enemy.maxHp || enemy.isBoss || enemy.isElite) {
    ctx.save();
    ctx.translate(enemy.x, enemy.y);

    const barW = enemy.isBoss ? enemy.radius * 2.8 : enemy.radius * 2.2;
    const barH = enemy.isBoss ? 5.5 : 3.5;
    const hpPct = Math.max(0, enemy.hp / enemy.maxHp);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(-barW / 2, -enemy.radius - (enemy.isBoss ? 16 : 9), barW, barH);
    ctx.fillStyle = enemy.isBoss ? '#ef4444' : enemy.isElite ? '#fb923c' : enemy.color;
    ctx.fillRect(-barW / 2, -enemy.radius - (enemy.isBoss ? 16 : 9), barW * hpPct, barH);

    // Nombre flotante de jefe o élite
    if (enemy.bossName || enemy.isElite) {
      ctx.font = 'bold 10px monospace';
      ctx.fillStyle = enemy.isBoss ? '#ef4444' : '#fb923c';
      ctx.textAlign = 'center';
      ctx.fillText(enemy.bossName || 'ELITE HOSTILE', 0, -enemy.radius - (enemy.isBoss ? 20 : 13));
    }
    ctx.restore();
  }
}
