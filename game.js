/* ── PIXEL SLIME DRAWING ── */
    const canvas = document.getElementById('slimeCanvas');
    const ctx = canvas.getContext('2d');
    const P = 5; // pixel size

    // 16x16 slime sprite (0=transparent, 1=dark outline, 2=body, 3=light highlight, 4=eye white, 5=pupil, 6=mouth, 7=belly)
    // 16x16 slime sprite with flat squishy bottom
    const sprite = [
      [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
      [0,0,0,0,1,1,2,2,2,2,1,1,0,0,0,0],
      [0,0,0,1,2,3,3,2,2,2,2,2,1,0,0,0],
      [0,0,1,2,3,3,2,2,2,2,2,2,2,1,0,0],
      [0,1,2,3,2,2,2,2,2,2,2,2,2,2,1,0],
      [0,1,2,2,4,4,2,2,2,4,4,2,2,2,1,0],
      [1,2,2,2,4,5,2,2,2,4,5,2,2,2,2,1],
      [1,2,2,2,2,2,2,7,7,2,2,2,2,2,2,1],
      [1,2,2,2,2,2,7,7,7,7,2,2,2,2,2,1],
      [1,2,2,2,2,2,7,7,7,7,2,2,2,2,2,1],
      [1,2,2,2,2,2,2,7,7,2,2,2,2,2,2,1],
      [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
      [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
      [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
      [0,1,2,2,2,2,2,2,2,2,2,2,2,2,1,0],
      [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
    ];

    const colors = {
      0: 'transparent',
      1: '#1a1a3a',      // dark outline
      2: '#3e7ecf',      // body blue
      3: '#7ab0f0',      // highlight
      4: '#ffffff',      // eye white
      5: '#1a1a2e',      // pupil
      6: '#2a5a8a',      // mouth (unused now)
      7: '#5da0e6',      // belly / lighter blue
    };

    function drawSlime() {
      ctx.clearRect(0, 0, 80, 80);
      for (let y = 0; y < 16; y++) {
        for (let x = 0; x < 16; x++) {
          const c = sprite[y][x];
          if (c === 0) continue;
          ctx.fillStyle = colors[c];
          ctx.fillRect(x * P, y * P, P, P);
        }
      }

      // Update browser tab indicator (favicon)
      try {
        const iconUrl = canvas.toDataURL('image/png');
        let fav = document.getElementById('favicon');
        if (!fav) {
          fav = document.createElement('link');
          fav.id = 'favicon';
          fav.rel = 'icon';
          fav.type = 'image/png';
          document.head.appendChild(fav);
        }
        fav.href = iconUrl;
      } catch (e) {
        console.warn('Could not generate favicon data URL', e);
      }
    }
    drawSlime();

    /* ── 3D TILT EFFECT ON CARDS ── */
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale(1.04)`;

        // move shimmer with cursor
        const pctX = (x / rect.width) * 100;
        const pctY = (y / rect.height) * 100;
        card.style.setProperty('--mx', pctX + '%');
        card.style.setProperty('--my', pctY + '%');
        if (card.querySelector('::before')) {
          card.style.background = `
            radial-gradient(circle at ${pctX}% ${pctY}%, rgba(255,255,255,.04) 0%, transparent 50%),
            var(--card)
          `;
        }
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.background = '';
      });
    });

    /* ── FLOATING DIAMONDS ── */
    function spawnDiamonds() {
      const container = document.querySelector('.bg-pattern');
      const colors = ['var(--accent)', 'var(--accent2)', 'var(--accent3)', 'var(--gold)'];
      for (let i = 0; i < 18; i++) {
        const d = document.createElement('div');
        d.className = 'diamond';
        d.style.left = Math.random() * 100 + '%';
        d.style.top = 30 + Math.random() * 60 + '%';
        d.style.animationDelay = Math.random() * 8 + 's';
        d.style.animationDuration = 6 + Math.random() * 6 + 's';
        d.style.background = colors[Math.floor(Math.random() * colors.length)];
        d.style.width = d.style.height = (4 + Math.random() * 4) + 'px';
        container.appendChild(d);
      }
    }
    spawnDiamonds();

    /* ── SCREEN SWITCHING ── */
    const mainContainer = document.querySelector('.container');
    const creditsScreen = document.getElementById('creditsScreen');
    const settingsScreen = document.getElementById('settingsScreen');
    const playScreen = document.getElementById('playScreen');
    const changelogScreen = document.getElementById('changelogScreen');
    const allScreens = [creditsScreen, settingsScreen, playScreen, changelogScreen];

    function showPlay() {
      mainContainer.classList.add('hidden');
      playScreen.style.display = 'flex';
      requestAnimationFrame(() => {
        playScreen.classList.add('visible');
      });
    }

    function showCredits() {
      mainContainer.classList.add('hidden');
      creditsScreen.style.display = 'flex';
      requestAnimationFrame(() => {
        creditsScreen.classList.add('visible');
      });
    }

    function showSettings() {
      mainContainer.classList.add('hidden');
      settingsScreen.style.display = 'flex';
      requestAnimationFrame(() => {
        settingsScreen.classList.add('visible');
      });
    }

    function showChangelog() {
      creditsScreen.classList.remove('visible');
      setTimeout(() => {
        creditsScreen.style.display = 'none';
        changelogScreen.style.display = 'flex';
        requestAnimationFrame(() => {
          changelogScreen.classList.add('visible');
        });
      }, 200);
    }

    function showCreditsFromChangelog() {
      changelogScreen.classList.remove('visible');
      setTimeout(() => {
        changelogScreen.style.display = 'none';
        creditsScreen.style.display = 'flex';
        requestAnimationFrame(() => {
          creditsScreen.classList.add('visible');
        });
      }, 200);
    }

    function showMenu() {
      allScreens.forEach(s => {
        if (s) s.classList.remove('visible');
      });
      setTimeout(() => {
        allScreens.forEach(s => {
          if (s) s.style.display = 'none';
        });
        mainContainer.classList.remove('hidden');
      }, 300);
    }

    function selectMode(mode) {
      playClick();
      const card = document.querySelector('.card-' + mode);
      if (card) {
        card.style.transition = 'none';
        card.style.transform = 'scale(.93)';
        setTimeout(() => {
          card.style.transition = 'transform .3s ease, box-shadow .3s ease';
          card.style.transform = '';
        }, 150);
      }
      if (mode === 'classic') {
        setTimeout(startStandardGame, 200);
      } else {
        console.log(`[Slime's Revenge] Gamemode selected: "${mode}" — not implemented yet.`);
      }
    }

    /* ── BATTLEFIELD GAME ENGINE ── */
    const gameScreen = document.getElementById('gameScreen');
    const gameCanvas = document.getElementById('gameCanvas');
    const gctx = gameCanvas.getContext('2d');

    // Intro Cutscene DOM elements
    const cutsceneLetterboxTop = document.getElementById('cutsceneLetterboxTop');
    const cutsceneLetterboxBottom = document.getElementById('cutsceneLetterboxBottom');
    const cutsceneOverlay = document.getElementById('cutsceneOverlay');
    const cutsceneTextBox = document.getElementById('cutsceneTextBox');
    const cutsceneSpeaker = document.getElementById('cutsceneSpeaker');
    const cutsceneText = document.getElementById('cutsceneText');
    const cutsceneBossCard = document.getElementById('cutsceneBossCard');
    const cutsceneSkipBtn = document.getElementById('cutsceneSkipBtn');

    let gameRunning = false;
    let isPaused = false;
    let gameAnimId = null;
    let lastFrameTime = performance.now();
    const ARENA_W = 1600; // 16:9 widescreen arena
    const ARENA_H = 900;

    // Boss battle audio instance
    const bossAudio = new Audio('boss_theme.mp3');
    bossAudio.loop = true;

    // Intro Cutscene State
    let inCutscene = false;
    let cutsceneTimer = 0;
    const cutsceneSummonCircle = {
      radius: 0,
      ringAngle: 0,
      burstFired: false,
      particles: [],
      shockwaves: []
    };
    let cutsceneDropOffset = -80;
    let cutsceneSlimeScaleX = 1;
    let cutsceneSlimeScaleY = 1;
    let cutsceneBossDescent = {
      flared: false
    };
    let cutsceneDialogueState = {
      lastBeepChar: 0
    };

    // Slime player state
    const player = {
      x: ARENA_W / 2,
      y: ARENA_H / 2,
      vx: 0,
      vy: 0,
      radius: 20,
      baseSpeed: 4.8,
      speed: 4.8,
      angle: 0,
      wobble: 0,
      // Health state (100 HP max, 1.0 HP regen per 5s)
      maxHp: 100,
      hp: 100,
      iFrames: 0,
      // Dash ability (Shift)
      isDashing: false,
      dashTimer: 0,
      dashDuration: 0.18,
      dashCooldown: 0,
      dashMaxCooldown: 1.2,
      dashSpeedMultiplier: 3.6,
      dashAngle: 0,
      ghostTimer: 0,
      // Shield ability (E)
      shieldActive: false,
      shieldTimer: 0,
      shieldDuration: 0.5,
      shieldCooldown: 0,
      shieldMaxCooldown: 5.0,
      shieldPulse: 0
    };

    // Boss state: Red Pixel "Fallen Angel" (No health, survival evasion)
    const boss = {
      x: ARENA_W / 2,
      y: 190,
      targetX: ARENA_W / 2,
      targetY: 190,
      spearAngle: Math.PI / 2,
      floatTimer: 0,
      repositionTimer: 3.0,
      wingFlap: 0
    };

    // Attacks & effects collections
    const lasers = [];
    const bombs = [];
    const explosionRings = [];
    const bossEmbers = [];
    const dashGhosts = [];
    const dashParticles = [];
    const shieldDissolves = [];

    // Attack cooldown timers
    let fightTimer = 0;
    const PHASE_1_DURATION = 127; // Phase 1 lasts until 2:07 (127s)
    let phase1Complete = false;
    let aimedLaserTimer = 2.5;
    let randomLaserTimer = 3.2;
    let skyBombTimer = 1.8;

    // Camera
    let camX = player.x - window.innerWidth / 2;
    let camY = player.y - window.innerHeight / 2;

    // Input state
    const keys = {};
    let mouseScreenX = window.innerWidth / 2;
    let mouseScreenY = window.innerHeight / 2;

    window.addEventListener('keydown', e => {
      const k = e.key ? e.key.toLowerCase() : '';
      keys[k] = true;
      if (e.code) keys[e.code] = true;

      const isEscape = e.key === 'Escape' || e.key === 'Esc' || e.code === 'Escape' || e.keyCode === 27;

      // Cutscene skip keys (Space, Enter, Escape)
      if (inCutscene) {
        if (e.code === 'Space' || e.key === ' ' || e.code === 'Enter' || e.key === 'Enter' || isEscape) {
          e.preventDefault();
          e.stopPropagation();
          skipCutscene();
          return;
        }
      }

      if (isEscape && gameRunning) {
        e.preventDefault();
        e.stopPropagation();
        if (isPaused) {
          const pauseSettingsBox = document.getElementById('pauseSettingsBox');
          if (pauseSettingsBox && !pauseSettingsBox.classList.contains('hidden')) {
            closeInGameSettings();
          } else {
            resumeGame();
          }
        } else {
          pauseGame();
        }
        return;
      }

      if (gameRunning && !isPaused && !inCutscene) {
        if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.key === 'Shift') {
          triggerDash();
        } else if (k === 'e') {
          triggerShield();
        }
      }
    });

    window.addEventListener('keyup', e => {
      const k = e.key ? e.key.toLowerCase() : '';
      keys[k] = false;
      if (e.code) keys[e.code] = false;
    });

    window.addEventListener('mousemove', e => {
      mouseScreenX = e.clientX;
      mouseScreenY = e.clientY;
    });

    if (gameCanvas) {
      gameCanvas.addEventListener('click', () => {
        window.focus();
        if (inCutscene && cutsceneTimer > 0.35) {
          skipCutscene();
        }
      });
    }

    if (cutsceneOverlay) {
      cutsceneOverlay.addEventListener('click', () => {
        if (inCutscene && cutsceneTimer > 0.35) {
          skipCutscene();
        }
      });
    }

    function resizeGameCanvas() {
      if (!gameCanvas) return;
      gameCanvas.width = window.innerWidth;
      gameCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeGameCanvas);

    // Fog / environmental particles (subtle red hues & drifting embers)
    const fogParticles = [];
    const NUM_FOG = 32;
    for (let i = 0; i < NUM_FOG; i++) {
      fogParticles.push({
        x: Math.random() * ARENA_W,
        y: Math.random() * ARENA_H,
        radius: 12 + Math.random() * 24,
        alpha: 0.035 + Math.random() * 0.075,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        color: Math.random() > 0.4 ? 'rgba(190, 20, 35,' : 'rgba(130, 10, 25,'
      });
    }

    // Drifting ambient red light nodes across the void
    const ambientNodes = [
      { x: 300, y: 220, r: 280, vx: 0.18, vy: 0.14 },
      { x: 800, y: 250, r: 300, vx: -0.14, vy: 0.18 },
      { x: 1300, y: 650, r: 260, vx: 0.16, vy: -0.15 },
      { x: 500, y: 700, r: 270, vx: -0.15, vy: -0.16 }
    ];

    /* ── SOUND SYNTHESIS FOR COMBAT, ABILITIES & WARNINGS ── */
    function getAudioCtx() {
      if (typeof audioCtx !== 'undefined' && audioCtx) {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        return audioCtx;
      }
      return null;
    }

    function playDashSound() {
      const vol = (typeof sfxVolume !== 'undefined') ? sfxVolume : 1.0;
      if (vol <= 0) return;
      try {
        const ctx = getAudioCtx();
        if (!ctx) return;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.16);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(850, now);
        filter.frequency.exponentialRampToValueAtTime(180, now + 0.16);

        gain.gain.setValueAtTime(vol * 0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.17);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.17);
      } catch (e) {}
    }

    function playShieldSound() {
      const vol = (typeof sfxVolume !== 'undefined') ? sfxVolume : 1.0;
      if (vol <= 0) return;
      try {
        const ctx = getAudioCtx();
        if (!ctx) return;
        const now = ctx.currentTime;

        [587.33, 880, 1174.66].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.02);
          osc.frequency.exponentialRampToValueAtTime(freq * 1.04, now + 0.28);

          const g = gain.gain;
          g.setValueAtTime(0.001, now);
          g.linearRampToValueAtTime(vol * (0.24 / (idx + 1)), now + 0.035);
          g.exponentialRampToValueAtTime(0.001, now + 0.45);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.02);
          osc.stop(now + 0.48);
        });
      } catch (e) {}
    }

    function playShieldDissipateSound() {
      const vol = (typeof sfxVolume !== 'undefined') ? sfxVolume : 1.0;
      if (vol <= 0) return;
      try {
        const ctx = getAudioCtx();
        if (!ctx) return;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(950, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.12);

        gain.gain.setValueAtTime(vol * 0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.14);
      } catch (e) {}
    }

    /* ── SHIELD DEFLECT / TINK SOUND ── */
    function playDeflectSound() {
      const vol = (typeof sfxVolume !== 'undefined') ? sfxVolume : 1.0;
      if (vol <= 0) return;
      try {
        const ctx = getAudioCtx();
        if (!ctx) return;
        const now = ctx.currentTime;

        // Sharp metallic strike transient
        const clickOsc = ctx.createOscillator();
        const clickGain = ctx.createGain();
        clickOsc.type = 'triangle';
        clickOsc.frequency.setValueAtTime(3400, now);
        clickOsc.frequency.exponentialRampToValueAtTime(1600, now + 0.035);
        clickGain.gain.setValueAtTime(vol * 0.5, now);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
        clickOsc.connect(clickGain);
        clickGain.connect(ctx.destination);
        clickOsc.start(now);
        clickOsc.stop(now + 0.035);

        // High metallic "tink" resonating frequencies (parry ring)
        const freqs = [2150, 3420, 5180];
        freqs.forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = (idx === 0) ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(f, now);
          osc.frequency.exponentialRampToValueAtTime(f * 0.985, now + 0.32);

          const peakGain = vol * (0.38 / (idx + 1));
          gain.gain.setValueAtTime(peakGain, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.35);
        });
      } catch (e) {}
    }

    function playLaserWarningSound() {
      const vol = (typeof sfxVolume !== 'undefined') ? sfxVolume : 1.0;
      if (vol <= 0) return;
      try {
        const ctx = getAudioCtx();
        if (!ctx) return;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1350, now);
        osc.frequency.setValueAtTime(1700, now + 0.04);
        gain.gain.setValueAtTime(vol * 0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
      } catch (e) {}
    }

    function playLaserFireSound() {
      const vol = (typeof sfxVolume !== 'undefined') ? sfxVolume : 1.0;
      if (vol <= 0) return;
      try {
        const ctx = getAudioCtx();
        if (!ctx) return;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(780, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.2);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1300, now);
        filter.frequency.exponentialRampToValueAtTime(240, now + 0.2);

        gain.gain.setValueAtTime(vol * 0.32, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.22);
      } catch (e) {}
    }

    function playBombExplosionSound() {
      const vol = (typeof sfxVolume !== 'undefined') ? sfxVolume : 1.0;
      if (vol <= 0) return;
      try {
        const ctx = getAudioCtx();
        if (!ctx) return;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(170, now);
        osc.frequency.exponentialRampToValueAtTime(32, now + 0.28);

        gain.gain.setValueAtTime(vol * 0.38, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.3);
      } catch (e) {}
    }

    /* ── INTRO CUTSCENE SOUND SYNTHESIS ── */
    function playSummonChargeSound() {
      const vol = (typeof sfxVolume !== 'undefined') ? sfxVolume : 1.0;
      if (vol <= 0) return;
      try {
        const ctx = getAudioCtx();
        if (!ctx) return;
        const now = ctx.currentTime;

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(160, now);
        osc1.frequency.exponentialRampToValueAtTime(520, now + 1.25);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(162, now);
        osc2.frequency.exponentialRampToValueAtTime(524, now + 1.25);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, now);
        filter.frequency.linearRampToValueAtTime(1200, now + 1.25);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(vol * 0.28, now + 0.9);
        gain.gain.linearRampToValueAtTime(vol * 0.38, now + 1.25);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.35);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 1.36);
        osc2.stop(now + 1.36);
      } catch (e) {}
    }

    function playSummonBurstSound() {
      const vol = (typeof sfxVolume !== 'undefined') ? sfxVolume : 1.0;
      if (vol <= 0) return;
      try {
        const ctx = getAudioCtx();
        if (!ctx) return;
        const now = ctx.currentTime;

        // Ethereal crystal chord
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.015);
          osc.frequency.exponentialRampToValueAtTime(freq * 1.03, now + 0.6);

          gain.gain.setValueAtTime(0.001, now + idx * 0.015);
          gain.gain.linearRampToValueAtTime(vol * (0.22 / (idx + 1)), now + idx * 0.015 + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.015);
          osc.stop(now + 0.72);
        });

        // Squishy slime impact thud
        const oscThud = ctx.createOscillator();
        const gainThud = ctx.createGain();
        oscThud.type = 'triangle';
        oscThud.frequency.setValueAtTime(220, now + 0.32);
        oscThud.frequency.exponentialRampToValueAtTime(60, now + 0.48);

        gainThud.gain.setValueAtTime(0.001, now + 0.32);
        gainThud.gain.linearRampToValueAtTime(vol * 0.32, now + 0.34);
        gainThud.gain.exponentialRampToValueAtTime(0.001, now + 0.52);

        oscThud.connect(gainThud);
        gainThud.connect(ctx.destination);
        oscThud.start(now + 0.32);
        oscThud.stop(now + 0.53);
      } catch (e) {}
    }

    function playAngelDescentRumble() {
      const vol = (typeof sfxVolume !== 'undefined') ? sfxVolume : 1.0;
      if (vol <= 0) return;
      try {
        const ctx = getAudioCtx();
        if (!ctx) return;
        const now = ctx.currentTime;

        // Deep sub-bass boom
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.exponentialRampToValueAtTime(36, now + 1.2);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(260, now);
        filter.frequency.exponentialRampToValueAtTime(70, now + 1.2);

        gain.gain.setValueAtTime(vol * 0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 1.45);

        // Angelic overtone chime
        [440, 554.37, 659.25, 880].forEach((freq, idx) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'sine';
          o.frequency.setValueAtTime(freq, now + 0.05);
          g.gain.setValueAtTime(0.001, now + 0.05);
          g.gain.linearRampToValueAtTime(vol * 0.12, now + 0.15);
          g.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
          o.connect(g);
          g.connect(ctx.destination);
          o.start(now + 0.05);
          o.stop(now + 1.25);
        });
      } catch (e) {}
    }

    function playDialogueBeep() {
      const vol = (typeof sfxVolume !== 'undefined') ? sfxVolume : 1.0;
      if (vol <= 0) return;
      try {
        const ctx = getAudioCtx();
        if (!ctx) return;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(490 + (Math.random() * 30 - 15), now);

        gain.gain.setValueAtTime(vol * 0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.038);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.04);
      } catch (e) {}
    }

    /* ── INTRO CUTSCENE CONTROLLER ── */
    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function startCutscene() {
      inCutscene = true;
      cutsceneTimer = 0;

      // Summon circle init
      cutsceneSummonCircle.radius = 0;
      cutsceneSummonCircle.ringAngle = 0;
      cutsceneSummonCircle.burstFired = false;
      cutsceneSummonCircle.particles.length = 0;
      cutsceneSummonCircle.shockwaves.length = 0;

      // Slime drop init
      cutsceneDropOffset = -80;
      cutsceneSlimeScaleX = 1;
      cutsceneSlimeScaleY = 1;

      // Boss descent init
      cutsceneBossDescent.flared = false;
      boss.x = ARENA_W / 2;
      boss.y = -350;
      boss.targetX = ARENA_W / 2;
      boss.targetY = 190;
      boss.spearAngle = Math.PI / 2;

      // Dialogue init
      cutsceneDialogueState.lastBeepChar = 0;
      if (cutsceneTextBox) {
        cutsceneTextBox.classList.remove('visible');
        if (cutsceneText) cutsceneText.textContent = '';
      }
      if (cutsceneBossCard) {
        cutsceneBossCard.classList.remove('visible');
      }

      // UI state: letterbox slide-in and skip prompt show
      gameScreen.classList.add('in-cutscene');
      if (cutsceneSkipBtn) cutsceneSkipBtn.classList.add('visible');

      // Audio cue
      playSummonChargeSound();
    }

    function updateCutscene(dt) {
      cutsceneTimer += dt;

      // ── 1. Arcane Summoning Circle & Mana Convergence (t: 0 - 2.5s) ──
      if (cutsceneTimer < 1.3) {
        cutsceneSummonCircle.radius = Math.min(48, cutsceneTimer * 38);
        cutsceneSummonCircle.ringAngle += dt * 2.4;

        // Inward streaming mana motes
        if (Math.random() < 0.65) {
          const pAngle = Math.random() * Math.PI * 2;
          const pDist = 65 + Math.random() * 80;
          cutsceneSummonCircle.particles.push({
            x: ARENA_W / 2 + Math.cos(pAngle) * pDist,
            y: ARENA_H / 2 + Math.sin(pAngle) * pDist,
            speed: 2.8 + Math.random() * 3.5,
            life: 1.0,
            size: 2.2 + Math.random() * 2.5,
            color: Math.random() > 0.3 ? '#00f0ff' : '#92f3ff'
          });
        }
      }

      // Slime Spawn burst at t = 1.3s
      if (cutsceneTimer >= 1.3 && !cutsceneSummonCircle.burstFired) {
        cutsceneSummonCircle.burstFired = true;
        playSummonBurstSound();
        cutsceneSummonCircle.shockwaves.push({
          x: ARENA_W / 2,
          y: ARENA_H / 2,
          radius: 12,
          alpha: 1.0
        });

        // Outward burst of cyan sparks
        for (let i = 0; i < 28; i++) {
          const a = Math.random() * Math.PI * 2;
          const sp = 2.5 + Math.random() * 5.5;
          dashParticles.push({
            x: ARENA_W / 2,
            y: ARENA_H / 2,
            vx: Math.cos(a) * sp,
            vy: Math.sin(a) * sp,
            life: 0.35 + Math.random() * 0.25,
            maxLife: 0.6,
            size: 2.5 + Math.random() * 2.5,
            color: Math.random() > 0.3 ? '#00f0ff' : '#ffffff'
          });
        }
      }

      // Update converging mana particles
      for (let i = cutsceneSummonCircle.particles.length - 1; i >= 0; i--) {
        const p = cutsceneSummonCircle.particles[i];
        const dx = ARENA_W / 2 - p.x;
        const dy = ARENA_H / 2 - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 4 || p.life <= 0) {
          cutsceneSummonCircle.particles.splice(i, 1);
          continue;
        }
        const moveDist = Math.min(dist, p.speed * (1.2 + (1 - dist / 150) * 2.8));
        p.x += (dx / dist) * moveDist;
        p.y += (dy / dist) * moveDist;
        p.life -= dt;
      }

      // Update shockwave rings
      for (let i = cutsceneSummonCircle.shockwaves.length - 1; i >= 0; i--) {
        const sw = cutsceneSummonCircle.shockwaves[i];
        sw.radius += 190 * dt;
        sw.alpha -= 1.8 * dt;
        if (sw.alpha <= 0) {
          cutsceneSummonCircle.shockwaves.splice(i, 1);
        }
      }

      // Slime Drop and Squish landing
      if (cutsceneTimer >= 1.3 && cutsceneTimer < 1.65) {
        const fallP = (cutsceneTimer - 1.3) / 0.35;
        cutsceneDropOffset = -80 * (1 - fallP * fallP);
        cutsceneSlimeScaleX = 0.86;
        cutsceneSlimeScaleY = 1.22;
      } else if (cutsceneTimer >= 1.65 && cutsceneTimer < 1.85) {
        const sqP = (cutsceneTimer - 1.65) / 0.20;
        cutsceneDropOffset = 0;
        cutsceneSlimeScaleX = 1.0 + 0.44 * Math.sin(sqP * Math.PI);
        cutsceneSlimeScaleY = 1.0 - 0.38 * Math.sin(sqP * Math.PI);
      } else if (cutsceneTimer >= 1.85 && cutsceneTimer < 2.30) {
        const bnP = (cutsceneTimer - 1.85) / 0.45;
        cutsceneDropOffset = -14 * Math.sin(bnP * Math.PI) * (1 - bnP);
        cutsceneSlimeScaleX = 1 + 0.16 * Math.cos(bnP * Math.PI * 2) * (1 - bnP);
        cutsceneSlimeScaleY = 1 - 0.16 * Math.cos(bnP * Math.PI * 2) * (1 - bnP);
      } else if (cutsceneTimer >= 2.30) {
        cutsceneDropOffset = 0;
        cutsceneSlimeScaleX = 1;
        cutsceneSlimeScaleY = 1;
      }

      // ── 2. Pixel RPG Narrative Typewriter Dialogue (t: 2.4s - 6.3s) ──
      const LINE1 = "...A lone slime awakens in the cosmic abyss.";
      const LINE2 = "A divine fury descends from the heavens above...";

      if (cutsceneTimer >= 2.4 && cutsceneTimer < 4.3) {
        if (cutsceneTextBox) cutsceneTextBox.classList.add('visible');
        if (cutsceneSpeaker) cutsceneSpeaker.textContent = "✦ ABYSSAL VOID ✦";
        const charProg = Math.floor((cutsceneTimer - 2.4) / 0.038);
        const count = Math.min(LINE1.length, Math.max(0, charProg));
        if (cutsceneText) cutsceneText.textContent = LINE1.slice(0, count);

        if (count > cutsceneDialogueState.lastBeepChar) {
          if (count % 2 === 0 && LINE1[count - 1] !== ' ') {
            playDialogueBeep();
          }
          cutsceneDialogueState.lastBeepChar = count;
        }
      } else if (cutsceneTimer >= 4.3 && cutsceneTimer < 4.4) {
        // Brief transition pause between dialogue lines
        cutsceneDialogueState.lastBeepChar = 0;
      } else if (cutsceneTimer >= 4.4 && cutsceneTimer < 6.3) {
        if (cutsceneTextBox) cutsceneTextBox.classList.add('visible');
        if (cutsceneSpeaker) cutsceneSpeaker.textContent = "✦ CELESTIAL DISTURBANCE ✦";
        const charProg = Math.floor((cutsceneTimer - 4.4) / 0.035);
        const count = Math.min(LINE2.length, Math.max(0, charProg));
        if (cutsceneText) cutsceneText.textContent = LINE2.slice(0, count);

        if (count > cutsceneDialogueState.lastBeepChar) {
          if (count % 2 === 0 && LINE2[count - 1] !== ' ') {
            playDialogueBeep();
          }
          cutsceneDialogueState.lastBeepChar = count;
        }
      } else if (cutsceneTimer >= 6.3) {
        if (cutsceneTextBox) cutsceneTextBox.classList.remove('visible');
      }

      // ── 3. The Fallen Seraph Celestial Descent (t: 6.4s - 10.4s) ──
      if (cutsceneTimer < 6.4) {
        boss.y = -350;
        boss.x = ARENA_W / 2;
      } else if (cutsceneTimer >= 6.4 && cutsceneTimer < 8.4) {
        const p = Math.min(1, (cutsceneTimer - 6.4) / 2.0);
        boss.y = -350 + (190 - (-350)) * easeOutCubic(p);
        boss.x = ARENA_W / 2;
        boss.wingFlap = Math.sin(cutsceneTimer * 8.5);
        boss.spearAngle = Math.atan2(player.y - boss.y, player.x - (boss.x + 16)) - Math.PI / 2;

        // Shower of celestial red embers descending from the top
        if (Math.random() < 0.75) {
          bossEmbers.push({
            x: (ARENA_W / 2) + (Math.random() - 0.5) * 480,
            y: boss.y + 40 + Math.random() * 20,
            vx: (Math.random() - 0.5) * 1.5,
            vy: 2.5 + Math.random() * 3.5,
            life: 0.9 + Math.random() * 0.7,
            maxLife: 1.6,
            size: 2.0 + Math.random() * 3.0,
            color: Math.random() > 0.4 ? '#ff2244' : '#ffa030'
          });
        }
      } else if (cutsceneTimer >= 8.4) {
        boss.y = 190 + Math.sin((cutsceneTimer - 8.4) * 2.2) * 8;
        boss.wingFlap = Math.sin((cutsceneTimer - 8.4) * 4.8);
        boss.spearAngle = Math.atan2(player.y - boss.y, player.x - (boss.x + 16)) - Math.PI / 2;

        // Flare wings & bass rumble on touchdown
        if (!cutsceneBossDescent.flared) {
          cutsceneBossDescent.flared = true;
          playAngelDescentRumble();

          explosionRings.push({
            x: boss.x,
            y: 190,
            radius: 20,
            maxRadius: 240,
            alpha: 1.0
          });

          for (let i = 0; i < 35; i++) {
            const pa = Math.random() * Math.PI * 2;
            const ps = 3 + Math.random() * 8;
            dashParticles.push({
              x: boss.x,
              y: 190,
              vx: Math.cos(pa) * ps,
              vy: Math.sin(pa) * ps,
              life: 0.45 + Math.random() * 0.35,
              maxLife: 0.8,
              size: 3 + Math.random() * 3.5,
              color: Math.random() > 0.4 ? '#ff1d3f' : '#ffa520'
            });
          }

          if (cutsceneBossCard) cutsceneBossCard.classList.add('visible');
        }
      }

      // Retract letterbox and hide card before combat begins
      if (cutsceneTimer >= 9.8) {
        if (cutsceneBossCard) cutsceneBossCard.classList.remove('visible');
        if (cutsceneSkipBtn) cutsceneSkipBtn.classList.remove('visible');
        gameScreen.classList.remove('in-cutscene');
      }

      // Cutscene finishes naturally
      if (cutsceneTimer >= 10.4) {
        endCutscene(false);
      }
    }

    function endCutscene(isSkipped) {
      if (!inCutscene) return;
      inCutscene = false;

      // Clean up DOM overlays
      gameScreen.classList.remove('in-cutscene');
      if (cutsceneTextBox) cutsceneTextBox.classList.remove('visible');
      if (cutsceneBossCard) cutsceneBossCard.classList.remove('visible');
      if (cutsceneSkipBtn) cutsceneSkipBtn.classList.remove('visible');

      // Place player and boss in combat starting positions
      player.x = ARENA_W / 2;
      player.y = ARENA_H / 2;
      player.vx = 0;
      player.vy = 0;
      cutsceneDropOffset = 0;
      cutsceneSlimeScaleX = 1;
      cutsceneSlimeScaleY = 1;

      boss.x = ARENA_W / 2;
      boss.y = 190;
      boss.targetX = ARENA_W / 2;
      boss.targetY = 190;
      boss.spearAngle = Math.atan2(player.y - boss.y, player.x - (boss.x + 16)) - Math.PI / 2;
      boss.repositionTimer = 2.8;

      // Clean up cutscene temporary particles
      cutsceneSummonCircle.particles.length = 0;
      cutsceneSummonCircle.shockwaves.length = 0;

      // Reset fight timers so attacks begin crisply
      fightTimer = 0;
      aimedLaserTimer = 2.2;
      randomLaserTimer = 3.0;
      skyBombTimer = 1.6;

      updateAbilityHUD();
      updatePlayerHealthHUD();
    }

    function skipCutscene() {
      if (inCutscene) {
        endCutscene(true);
      }
    }
    window.skipCutscene = skipCutscene;

    function drawCutsceneSummonCircle(ctx) {
      if (!inCutscene && cutsceneSummonCircle.shockwaves.length === 0) return;

      const cx = ARENA_W / 2;
      const cy = ARENA_H / 2;

      // 1. Arcane Summoning Circle
      if (cutsceneTimer < 2.5) {
        const R = cutsceneSummonCircle.radius;
        if (R > 1) {
          ctx.save();

          // Ambient floor cyan glow
          const glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.8);
          glowGrad.addColorStop(0, 'rgba(0, 240, 255, 0.22)');
          glowGrad.addColorStop(0.5, 'rgba(0, 180, 240, 0.08)');
          glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, R * 1.8, 0, Math.PI * 2);
          ctx.fill();

          // Outer solid ring
          ctx.strokeStyle = 'rgba(0, 240, 255, 0.85)';
          ctx.lineWidth = 2.5;
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 14;
          ctx.beginPath();
          ctx.arc(cx, cy, R, 0, Math.PI * 2);
          ctx.stroke();

          // Inner rotating dashed ring
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(cutsceneSummonCircle.ringAngle);
          ctx.setLineDash([8, 6]);
          ctx.strokeStyle = 'rgba(120, 245, 255, 0.7)';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.arc(0, 0, R * 0.76, 0, Math.PI * 2);
          ctx.stroke();

          // Arcane 8-point geometric star / occult glyphs
          const starR = R * 0.52;
          ctx.setLineDash([]);
          ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
          ctx.lineWidth = 1.5;
          for (let k = 0; k < 2; k++) {
            ctx.save();
            ctx.rotate(k * (Math.PI / 4));
            ctx.strokeRect(-starR, -starR, starR * 2, starR * 2);
            ctx.restore();
          }

          // Center rune diamond
          ctx.fillStyle = 'rgba(0, 240, 255, 0.5)';
          ctx.beginPath();
          ctx.moveTo(0, -R * 0.22);
          ctx.lineTo(R * 0.22, 0);
          ctx.lineTo(0, R * 0.22);
          ctx.lineTo(-R * 0.22, 0);
          ctx.closePath();
          ctx.fill();

          ctx.restore();
          ctx.restore();
        }
      }

      // 2. Converging Mana Motes
      cutsceneSummonCircle.particles.forEach(p => {
        ctx.save();
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 3. Shockwave Rings
      cutsceneSummonCircle.shockwaves.forEach(sw => {
        ctx.save();
        ctx.strokeStyle = `rgba(0, 240, 255, ${Math.max(0, sw.alpha)})`;
        ctx.lineWidth = 3.5;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });
    }

    /* ── PLAYER HEALTH HUD & DAMAGE ── */
    function updatePlayerHealthHUD() {
      const hud = document.getElementById('playerHealthHud');
      const hpText = document.getElementById('playerHpText');
      const hpFill = document.getElementById('playerHpFill');
      if (!hud || !hpText || !hpFill) return;

      const hpClamped = Math.max(0, Math.min(player.maxHp, player.hp));
      const hpFloored = Math.floor(hpClamped);
      hpText.textContent = `${hpFloored} / ${player.maxHp}`;
      const pct = (hpClamped / player.maxHp) * 100;
      hpFill.style.width = pct + '%';

      if (hpFloored <= player.maxHp * 0.3) {
        hud.classList.add('low-hp');
      } else {
        hud.classList.remove('low-hp');
      }
    }

    function damagePlayer(amount = 10.0) {
      if (!gameRunning || isPaused || player.iFrames > 0) return;

      // Shield blocks and deflects damage completely!
      if (player.shieldActive) {
        playDeflectSound(); // Crisp metallic TINK / deflect sound!
        shieldDissolves.push({
          x: player.x,
          y: player.y,
          radius: player.radius + 16,
          alpha: 1.0
        });
        for (let i = 0; i < 12; i++) {
          dashParticles.push({
            x: player.x,
            y: player.y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            life: 0.35,
            maxLife: 0.35,
            size: 3,
            color: '#00f0ff'
          });
        }
        return;
      }

      // Shield not active -> take damage!
      player.hp = Math.max(0, player.hp - amount);
      player.iFrames = 0.8;
      playDamageSound(); // damage.mp3!
      updatePlayerHealthHUD();

      // Screen impact particles
      for (let i = 0; i < 12; i++) {
        dashParticles.push({
          x: player.x,
          y: player.y,
          vx: (Math.random() - 0.5) * 5,
          vy: (Math.random() - 0.5) * 5,
          life: 0.38,
          maxLife: 0.38,
          size: 3.5,
          color: '#ff2244'
        });
      }

      if (player.hp <= 0) {
        triggerDefeat();
      }
    }

    function triggerDefeat() {
      gameRunning = false;
      isPaused = true;
      if (bossAudio) {
        bossAudio.pause();
      }
      const defeatOverlay = document.getElementById('defeatOverlay');
      if (defeatOverlay) {
        defeatOverlay.classList.add('visible');
        defeatOverlay.style.display = 'flex';
      }
    }

    /* ── COLLISION HELPER (Point to Line Segment) ── */
    function distToSegment(px, py, x1, y1, x2, y2) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const lenSq = dx * dx + dy * dy;
      if (lenSq === 0) return Math.hypot(px - x1, py - y1);
      let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
      t = Math.max(0, Math.min(1, t));
      const projX = x1 + t * dx;
      const projY = y1 + t * dy;
      return Math.hypot(px - projX, py - projY);
    }

    /* ── ATTACK SPAWNERS ── */
    function spawnAimedLaser() {
      const bobY = Math.sin(boss.floatTimer * 2.2) * 14;
      const lanceX = boss.x + 16 + Math.cos(boss.spearAngle + Math.PI / 2) * 55;
      const lanceY = boss.y + bobY + 2 + Math.sin(boss.spearAngle + Math.PI / 2) * 55;

      lasers.push({
        type: 'aimed',
        x1: lanceX,
        y1: lanceY,
        x2: player.x,
        y2: player.y,
        angle: boss.spearAngle,
        trackDuration: 0.72,
        lockDuration: 0.44,
        fireDuration: 0.24,
        timer: 0,
        state: 'tracking',
        width: 36,
        hasHit: false,
        soundPlayed: false
      });
    }

    // Alias for compatibility
    function spawnRandomSpearLaser() {
      spawnAimedLaser();
    }

    function spawnRandomLaser(delayOffset = 0) {
      const isHorizontal = Math.random() > 0.45;
      if (isHorizontal) {
        // Completely random horizontal lane
        const y = 70 + Math.random() * (ARENA_H - 140);
        lasers.push({
          type: 'lane',
          x1: 0,
          y1: y,
          x2: ARENA_W,
          y2: y,
          warningDuration: 0.95,
          fireDuration: 0.28,
          timer: -delayOffset,
          state: 'warning',
          width: 50,
          hasHit: false,
          soundPlayed: false
        });
      } else {
        // Completely random vertical lane
        const x = 70 + Math.random() * (ARENA_W - 140);
        lasers.push({
          type: 'lane',
          x1: x,
          y1: 0,
          x2: x,
          y2: ARENA_H,
          warningDuration: 0.95,
          fireDuration: 0.28,
          timer: -delayOffset,
          state: 'warning',
          width: 50,
          hasHit: false,
          soundPlayed: false
        });
      }
    }

    function spawnSkyBomb(targetX, targetY, customRadius = 96) {
      if (targetX === undefined) {
        // Completely random across the arena, regardless of player position
        targetX = customRadius + 25 + Math.random() * (ARENA_W - (customRadius + 25) * 2);
        targetY = customRadius + 25 + Math.random() * (ARENA_H - (customRadius + 25) * 2);
      }
      bombs.push({
        x: targetX,
        y: targetY,
        radius: customRadius,
        warningDuration: 1.2,
        timer: 0,
        state: 'falling',
        altitude: 420,
        hasHit: false
      });
    }

    /* ── ABILITY TRIGGERS ── */
    function triggerDash() {
      if (player.isDashing || player.dashCooldown > 0) return;

      player.isDashing = true;
      player.dashTimer = player.dashDuration;
      player.dashCooldown = player.dashMaxCooldown;

      // Determine dash trajectory
      if (movementMode === 'keyboard') {
        let mx = 0, my = 0;
        if (keys['w'] || keys['arrowup']) my -= 1;
        if (keys['s'] || keys['arrowdown']) my += 1;
        if (keys['a'] || keys['arrowleft']) mx -= 1;
        if (keys['d'] || keys['arrowright']) mx += 1;

        if (mx !== 0 || my !== 0) {
          player.dashAngle = Math.atan2(my, mx);
          player.angle = player.dashAngle;
        } else {
          player.dashAngle = player.angle;
        }
      } else {
        const worldMouseX = camX + mouseScreenX;
        const worldMouseY = camY + mouseScreenY;
        player.dashAngle = Math.atan2(worldMouseY - player.y, worldMouseX - player.x);
        player.angle = player.dashAngle;
      }

      // Initial dash particles
      for (let i = 0; i < 12; i++) {
        const pAngle = player.dashAngle + Math.PI + (Math.random() - 0.5) * 1.1;
        const pSpeed = 2 + Math.random() * 4.5;
        dashParticles.push({
          x: player.x,
          y: player.y,
          vx: Math.cos(pAngle) * pSpeed,
          vy: Math.sin(pAngle) * pSpeed,
          life: 0.25 + Math.random() * 0.15,
          maxLife: 0.4,
          size: 3 + Math.random() * 2.5,
          color: Math.random() > 0.35 ? '#40e0ff' : '#6daef8'
        });
      }

      playDashSound();
    }

    function triggerShield() {
      if (player.shieldActive || player.shieldCooldown > 0) return;

      player.shieldActive = true;
      player.shieldTimer = player.shieldDuration;
      player.shieldCooldown = player.shieldMaxCooldown;
      player.shieldPulse = 0;

      playShieldSound();
    }

    function updateAbilityHUD() {
      // Dash HUD (Shift)
      const slotDash = document.getElementById('slotDash');
      const borderDash = document.getElementById('borderDash');
      const nameDash = document.getElementById('nameDash');
      if (slotDash && borderDash) {
        const total = borderDash.getTotalLength ? borderDash.getTotalLength() : 205.7;
        borderDash.style.strokeDasharray = total;
        if (player.dashCooldown > 0) {
          slotDash.classList.remove('ready');
          const remRatio = player.dashCooldown / player.dashMaxCooldown;
          borderDash.style.strokeDashoffset = remRatio * total;
          if (nameDash) nameDash.textContent = player.dashCooldown.toFixed(1) + 's';
        } else {
          slotDash.classList.add('ready');
          borderDash.style.strokeDashoffset = '0';
          if (nameDash) nameDash.textContent = 'DASH';
        }
      }

      // Shield HUD (E)
      const slotShield = document.getElementById('slotShield');
      const borderShield = document.getElementById('borderShield');
      const nameShield = document.getElementById('nameShield');
      if (slotShield && borderShield) {
        const total = borderShield.getTotalLength ? borderShield.getTotalLength() : 205.7;
        borderShield.style.strokeDasharray = total;
        if (player.shieldActive) {
          slotShield.classList.add('active-state');
          borderShield.style.strokeDashoffset = '0';
          if (nameShield) nameShield.textContent = 'ACTIVE';
        } else {
          slotShield.classList.remove('active-state');
          if (player.shieldCooldown > 0) {
            slotShield.classList.remove('ready');
            const remRatio = player.shieldCooldown / player.shieldMaxCooldown;
            // Cooldown border timer wrapping around the box
            borderShield.style.strokeDashoffset = remRatio * total;
            if (nameShield) nameShield.textContent = player.shieldCooldown.toFixed(1) + 's';
          } else {
            slotShield.classList.add('ready');
            borderShield.style.strokeDashoffset = '0';
            if (nameShield) nameShield.textContent = 'SHIELD';
          }
        }
      }
    }

    /* ── IN-GAME PAUSE & SETTINGS ── */
    function pauseGame() {
      if (!gameRunning || isPaused) return;
      playClick();
      isPaused = true;
      const overlay = document.getElementById('pauseOverlay');
      const mainBox = document.getElementById('pauseMainBox');
      const settingsBox = document.getElementById('pauseSettingsBox');
      if (overlay) {
        overlay.classList.add('visible');
        overlay.style.display = 'flex';
      }
      if (mainBox) mainBox.classList.remove('hidden');
      if (settingsBox) settingsBox.classList.add('hidden');

      // Pause music when game is paused so fight choreography timing stays in sync
      if (bossAudio && !bossAudio.paused) {
        bossAudio.pause();
      }
    }

    function resumeGame() {
      if (!gameRunning || !isPaused) return;
      playClick();
      isPaused = false;
      const overlay = document.getElementById('pauseOverlay');
      if (overlay) {
        overlay.classList.remove('visible');
        overlay.style.display = 'none';
      }

      // Resume music right where it left off
      if (bossAudio) {
        bossAudio.volume = (masterSlider.value / 100) * (musicSlider.value / 100);
        bossAudio.play().catch(() => {});
      }

      lastFrameTime = performance.now();
    }

    function openInGameSettings() {
      playClick();
      const mainBox = document.getElementById('pauseMainBox');
      const settingsBox = document.getElementById('pauseSettingsBox');
      if (mainBox) mainBox.classList.add('hidden');
      if (settingsBox) settingsBox.classList.remove('hidden');

      // Sync slider positions and values from main settings
      const inMaster = document.getElementById('ingameMasterSlider');
      const inMusic  = document.getElementById('ingameMusicSlider');
      const inSfx    = document.getElementById('ingameSfxSlider');
      if (inMaster) {
        inMaster.value = masterSlider.value;
        document.getElementById('ingameMasterValue').textContent = masterSlider.value + '%';
      }
      if (inMusic) {
        inMusic.value = musicSlider.value;
        document.getElementById('ingameMusicValue').textContent = musicSlider.value + '%';
      }
      if (inSfx) {
        inSfx.value = sfxSlider.value;
        document.getElementById('ingameSfxValue').textContent = sfxSlider.value + '%';
      }

      syncInGameMovementUI();
    }

    function closeInGameSettings() {
      playClick();
      const mainBox = document.getElementById('pauseMainBox');
      const settingsBox = document.getElementById('pauseSettingsBox');
      if (settingsBox) settingsBox.classList.add('hidden');
      if (mainBox) mainBox.classList.remove('hidden');
    }

    function syncInGameVolumes(type, val) {
      if (type === 'master') {
        masterSlider.value = val;
        document.getElementById('ingameMasterValue').textContent = val + '%';
      } else if (type === 'music') {
        musicSlider.value = val;
        document.getElementById('ingameMusicValue').textContent = val + '%';
      } else if (type === 'sfx') {
        sfxSlider.value = val;
        document.getElementById('ingameSfxValue').textContent = val + '%';
      }
      updateVolumes();
    }

    function syncInGameMovementUI() {
      const isMouse = movementMode === 'mouse';
      const inTrack = document.getElementById('ingameMovementTrack');
      const inOptKbd = document.getElementById('ingameOptKeyboard');
      const inOptMouse = document.getElementById('ingameOptMouse');

      if (inTrack) inTrack.classList.toggle('is-mouse', isMouse);
      if (inOptKbd) inOptKbd.classList.toggle('active', !isMouse);
      if (inOptMouse) inOptMouse.classList.toggle('active', isMouse);
    }

    function startStandardGame() {
      resizeGameCanvas();
      gameRunning = true;
      isPaused = false;
      player.x = ARENA_W / 2;
      player.y = ARENA_H / 2;
      player.vx = 0;
      player.vy = 0;
      player.angle = 0;
      player.wobble = 0;
      player.hp = 100;
      player.maxHp = 100;
      player.iFrames = 0;
      player.isDashing = false;
      player.dashTimer = 0;
      player.dashCooldown = 0;
      player.shieldActive = false;
      player.shieldTimer = 0;
      player.shieldCooldown = 0;

      // Boss reset (starts high in heavens for intro cutscene)
      boss.x = ARENA_W / 2;
      boss.y = -350;
      boss.targetX = ARENA_W / 2;
      boss.targetY = 190;
      boss.floatTimer = 0;
      boss.repositionTimer = 3.0;

      // Reset attacks and timers
      fightTimer = 0;
      phase1Complete = false;
      aimedLaserTimer = 2.5;
      randomLaserTimer = 3.2;
      skyBombTimer = 1.8;
      lasers.length = 0;
      bombs.length = 0;
      explosionRings.length = 0;
      bossEmbers.length = 0;
      dashGhosts.length = 0;
      dashParticles.length = 0;
      shieldDissolves.length = 0;

      // Center camera directly on 16:9 arena / player
      if (gameCanvas.width >= ARENA_W) {
        camX = (ARENA_W - gameCanvas.width) / 2;
      } else {
        camX = Math.max(0, Math.min(ARENA_W - gameCanvas.width, player.x - gameCanvas.width / 2));
      }
      if (gameCanvas.height >= ARENA_H) {
        camY = (ARENA_H - gameCanvas.height) / 2;
      } else {
        camY = Math.max(0, Math.min(ARENA_H - gameCanvas.height, player.y - gameCanvas.height / 2));
      }

      // Hide pause, defeat, and phase banners if open
      const overlay = document.getElementById('pauseOverlay');
      if (overlay) {
        overlay.classList.remove('visible');
        overlay.style.display = 'none';
      }
      const defeatOverlay = document.getElementById('defeatOverlay');
      if (defeatOverlay) {
        defeatOverlay.classList.remove('visible');
        defeatOverlay.style.display = 'none';
      }
      const banner = document.getElementById('phaseBanner');
      if (banner) {
        banner.classList.remove('visible');
      }

      // Hide menu screens
      mainContainer.classList.add('hidden');
      playScreen.classList.remove('visible');
      playScreen.style.display = 'none';

      // Show game arena
      gameScreen.classList.add('active');
      window.focus();

      // Audio transition: switch from menu music to boss music (starts at t=0 for cutscene buildup)
      bgMusic.pause();
      const master = masterSlider ? masterSlider.value / 100 : 0.75;
      const music  = musicSlider ? musicSlider.value / 100 : 1;
      bossAudio.volume = master * music;
      bossAudio.currentTime = 0;
      bossAudio.play().catch(() => {});

      // Launch intro cutscene
      startCutscene();

      if (gameAnimId) cancelAnimationFrame(gameAnimId);
      lastFrameTime = performance.now();
      updateAbilityHUD();
      updatePlayerHealthHUD();
      gameLoop();
    }

    function triggerPhase1Complete() {
      const banner = document.getElementById('phaseBanner');
      if (banner) {
        banner.classList.add('visible');
      }
      playShieldSound();
    }

    function exitGame() {
      playClick();
      gameRunning = false;
      isPaused = false;
      phase1Complete = false;
      if (inCutscene) {
        inCutscene = false;
        gameScreen.classList.remove('in-cutscene');
        if (cutsceneTextBox) cutsceneTextBox.classList.remove('visible');
        if (cutsceneBossCard) cutsceneBossCard.classList.remove('visible');
        if (cutsceneSkipBtn) cutsceneSkipBtn.classList.remove('visible');
      }
      if (gameAnimId) cancelAnimationFrame(gameAnimId);

      const overlay = document.getElementById('pauseOverlay');
      if (overlay) {
        overlay.classList.remove('visible');
        overlay.style.display = 'none';
      }
      const defeatOverlay = document.getElementById('defeatOverlay');
      if (defeatOverlay) {
        defeatOverlay.classList.remove('visible');
        defeatOverlay.style.display = 'none';
      }
      const banner = document.getElementById('phaseBanner');
      if (banner) {
        banner.classList.remove('visible');
      }

      // Stop boss audio & resume menu music
      bossAudio.pause();
      bossAudio.currentTime = 0;
      playRandomMenuSong();

      gameScreen.classList.remove('active');
      showMenu();
    }

    /* ── DRAW FALLEN ANGEL BOSS (RED PIXEL ART) ── */
    function drawAngelWing(ctx, dir) {
      ctx.scale(dir, 1);
      ctx.shadowColor = 'rgba(255, 20, 45, 0.45)';
      ctx.shadowBlur = 14;

      // Outer primary feathers (large dark crimson span)
      ctx.fillStyle = '#420712';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(36, -34, 68, -28);
      ctx.lineTo(60, -14);
      ctx.lineTo(72, -12);
      ctx.lineTo(58, 4);
      ctx.lineTo(68, 8);
      ctx.lineTo(50, 22);
      ctx.lineTo(56, 28);
      ctx.lineTo(32, 38);
      ctx.lineTo(14, 28);
      ctx.closePath();
      ctx.fill();

      // Mid scarlet feather tier
      ctx.fillStyle = '#9e112a';
      ctx.beginPath();
      ctx.moveTo(4, -2);
      ctx.quadraticCurveTo(28, -26, 54, -22);
      ctx.lineTo(48, -10);
      ctx.lineTo(56, -8);
      ctx.lineTo(44, 6);
      ctx.lineTo(50, 10);
      ctx.lineTo(36, 22);
      ctx.lineTo(20, 18);
      ctx.closePath();
      ctx.fill();

      // Inner fiery highlights
      ctx.fillStyle = '#e81e42';
      ctx.beginPath();
      ctx.moveTo(6, -4);
      ctx.quadraticCurveTo(22, -18, 38, -16);
      ctx.lineTo(34, -4);
      ctx.lineTo(28, 8);
      ctx.lineTo(14, 10);
      ctx.closePath();
      ctx.fill();

      ctx.shadowBlur = 0;
    }

    function drawFallenAngel(ctx, bx, by, spearAngle, wingFlap, bobY) {
      const y = by + bobY;
      ctx.save();
      ctx.translate(bx, y);

      // 1. Fallen Angel Wings (Flapping behind body)
      ctx.save();
      ctx.translate(-14, -8);
      ctx.rotate(-0.35 + wingFlap * 0.28);
      drawAngelWing(ctx, -1);
      ctx.restore();

      ctx.save();
      ctx.translate(14, -8);
      ctx.rotate(0.35 - wingFlap * 0.28);
      drawAngelWing(ctx, 1);
      ctx.restore();

      // 2. Broken Glowing Crimson Halo (Floating above head)
      ctx.save();
      ctx.shadowColor = '#ff1a3c';
      ctx.shadowBlur = 12;
      ctx.strokeStyle = '#ff3355';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(-2, -42, 17, 5.5, -0.22, 0.4, Math.PI * 1.85);
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-12, -44, 3, 3);
      ctx.restore();

      // 3. Flowing Tattered Obsidian & Crimson Robes
      ctx.fillStyle = '#1c0409';
      ctx.beginPath();
      ctx.moveTo(-18, 6);
      ctx.lineTo(18, 6);
      ctx.lineTo(26, 44);
      ctx.lineTo(12, 38);
      ctx.lineTo(0, 48);
      ctx.lineTo(-12, 38);
      ctx.lineTo(-26, 44);
      ctx.closePath();
      ctx.fill();

      // Inner Crimson Pleats
      ctx.fillStyle = '#6b0c1c';
      ctx.beginPath();
      ctx.moveTo(-12, 8);
      ctx.lineTo(12, 8);
      ctx.lineTo(16, 40);
      ctx.lineTo(0, 44);
      ctx.lineTo(-16, 40);
      ctx.closePath();
      ctx.fill();

      // Robe runes / seam highlights
      ctx.strokeStyle = '#ff2b4c';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 10);
      ctx.lineTo(0, 42);
      ctx.moveTo(-8, 22);
      ctx.lineTo(8, 22);
      ctx.stroke();

      // 4. Gothic Armored Torso / Breastplate
      ctx.fillStyle = '#26060c';
      ctx.fillRect(-12, -14, 24, 22);
      ctx.fillStyle = '#8f1226';
      ctx.fillRect(-9, -11, 18, 16);
      ctx.fillStyle = '#d4193b';
      ctx.fillRect(-5, -8, 10, 10);

      // Armored Pauldrons (Shoulders)
      ctx.fillStyle = '#1a0307';
      ctx.fillRect(-18, -16, 9, 10);
      ctx.fillRect(9, -16, 9, 10);
      ctx.fillStyle = '#c41535';
      ctx.fillRect(-16, -14, 5, 6);
      ctx.fillRect(11, -14, 5, 6);

      // 5. Hooded Head & Glowing Red Slit Eyes
      ctx.fillStyle = '#120205';
      ctx.beginPath();
      ctx.arc(0, -24, 13, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#060002';
      ctx.beginPath();
      ctx.arc(0, -23, 9, 0, Math.PI * 2);
      ctx.fill();

      // Twin Piercing Glowing Crimson Eyes
      ctx.shadowColor = '#ff0033';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-6, -24, 4, 2);
      ctx.fillRect(2, -24, 4, 2);
      ctx.fillStyle = '#ff113a';
      ctx.fillRect(-7, -25, 6, 4);
      ctx.fillRect(1, -25, 6, 4);
      ctx.shadowBlur = 0;

      // 6. The Spear ("Lance of the Fall") held in hand
      ctx.save();
      ctx.translate(16, 2);
      ctx.rotate(spearAngle);

      // Obsidian spear shaft
      ctx.fillStyle = '#1c1f2b';
      ctx.fillRect(-3, -38, 6, 96);
      ctx.fillStyle = '#a81630';
      ctx.fillRect(-2, -10, 4, 35); // wrapped grip

      // Spear Crossguard
      ctx.fillStyle = '#e6193c';
      ctx.shadowColor = '#ff2040';
      ctx.shadowBlur = 8;
      ctx.fillRect(-10, -38, 20, 5);

      // Razor Spearhead (Incandescent Crimson Blade)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(0, -78);
      ctx.lineTo(8, -44);
      ctx.lineTo(4, -40);
      ctx.lineTo(0, -42);
      ctx.lineTo(-4, -40);
      ctx.lineTo(-8, -44);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#ff1133';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = '#ff0033';
      ctx.fillRect(-2, -56, 4, 10);

      ctx.shadowBlur = 0;
      ctx.restore();

      ctx.restore();
    }

    function gameLoop(now = performance.now()) {
      if (!gameRunning) return;
      gameAnimId = requestAnimationFrame(gameLoop);

      const dt = Math.min((now - lastFrameTime) / 1000, 0.1);
      lastFrameTime = now;

      if (isPaused) return;

      const bobY = inCutscene
        ? (cutsceneTimer >= 8.4 ? Math.sin((cutsceneTimer - 8.4) * 2.2) * 8 : 0)
        : Math.sin(boss.floatTimer * 2.2) * 14;

      if (inCutscene) {
        updateCutscene(dt);
      } else {
        fightTimer += dt;

      // ── PLAYER HP REGENERATION: 1.0 HP per 5s (0.2 HP/s, 10x scaled) ──
      if (player.hp < player.maxHp) {
        player.hp = Math.min(player.maxHp, player.hp + (1.0 / 5.0) * dt);
        updatePlayerHealthHUD();
      }
      if (player.iFrames > 0) {
        player.iFrames = Math.max(0, player.iFrames - dt);
      }

      // ── ABILITY TIMERS & COOLDOWNS ──
      if (player.dashCooldown > 0) {
        player.dashCooldown = Math.max(0, player.dashCooldown - dt);
      }
      if (player.shieldCooldown > 0) {
        player.shieldCooldown = Math.max(0, player.shieldCooldown - dt);
      }
      if (player.shieldActive) {
        player.shieldTimer -= dt;
        player.shieldPulse += dt * 8;
        if (player.shieldTimer <= 0) {
          player.shieldActive = false;
          playShieldDissipateSound();
          shieldDissolves.push({
            x: player.x,
            y: player.y,
            radius: player.radius + 12,
            alpha: 0.95
          });
        }
      }
      updateAbilityHUD();

      // ── UPDATE BOSS MOVEMENT & AI (FALLEN ANGEL) ──
      boss.floatTimer += dt;
      boss.repositionTimer -= dt;
      if (boss.repositionTimer <= 0) {
        boss.repositionTimer = 3.2 + Math.random() * 2.2;
        const targetRegionX = Math.max(ARENA_W * 0.2, Math.min(ARENA_W * 0.8, player.x + (Math.random() - 0.5) * 400));
        boss.targetX = targetRegionX;
        boss.targetY = 150 + Math.random() * 120;
      }
      boss.x += (boss.targetX - boss.x) * 0.04;
      boss.y += (boss.targetY - boss.y) * 0.04;

      const bobY = Math.sin(boss.floatTimer * 2.2) * 14;
      boss.wingFlap = Math.sin(boss.floatTimer * 4.8);

      // Spear dynamically aims toward player
      const spearAimX = player.x - (boss.x + 16);
      const spearAimY = player.y - (boss.y + bobY + 2);
      boss.spearAngle = Math.atan2(spearAimY, spearAimX) - Math.PI / 2;

      // Spawn falling boss embers
      if (Math.random() < 0.4) {
        bossEmbers.push({
          x: boss.x + (Math.random() - 0.5) * 85,
          y: boss.y + bobY + 12,
          vx: (Math.random() - 0.5) * 0.8,
          vy: 1.2 + Math.random() * 1.8,
          life: 0.8 + Math.random() * 0.6,
          maxLife: 1.4,
          size: 1.5 + Math.random() * 2.0,
          color: Math.random() > 0.4 ? '#ff2040' : '#ffa030'
        });
      }

      // ── ATTACK TIMERS (PHASE 1 CHOREOGRAPHY - LASTS UNTIL 2:07 / 127s) ──
      if (fightTimer >= PHASE_1_DURATION && !phase1Complete) {
        phase1Complete = true;
        lasers.length = 0;
        bombs.length = 0;
        triggerPhase1Complete();
      }

      if (!phase1Complete) {
        // Aimed Spear Lasers (targets player)
        aimedLaserTimer -= dt;
        if (aimedLaserTimer <= 0) {
          aimedLaserTimer = Math.max(1.6, 2.8 - Math.min(fightTimer * 0.012, 1.0));
          spawnAimedLaser();
          if (fightTimer > 30 && Math.random() < 0.45) {
            setTimeout(() => { if (gameRunning && !isPaused && !phase1Complete) spawnAimedLaser(); }, 320);
          }
        }

        // Random Lane Lasers (strictly 2 lasers per wave!)
        randomLaserTimer -= dt;
        if (randomLaserTimer <= 0) {
          randomLaserTimer = Math.max(1.8, 3.0 - Math.min(fightTimer * 0.015, 1.1));
          for (let k = 0; k < 2; k++) {
            spawnRandomLaser(k * 0.14);
          }
        }

        // Sky Bombs (HIGH FREQUENCY - continuous rain of bombs across random spots!)
        skyBombTimer -= dt;
        if (skyBombTimer <= 0) {
          skyBombTimer = Math.max(0.65, 1.25 - Math.min(fightTimer * 0.008, 0.55));
          const numBombs = 2 + Math.floor(Math.random() * 3); // 2 to 4 bombs per wave
          for (let b = 0; b < numBombs; b++) {
            setTimeout(() => {
              if (gameRunning && !isPaused && !phase1Complete) {
                spawnSkyBomb();
              }
            }, b * 130);
          }
        }
      }

      // ── UPDATE LASERS & COLLISIONS ──
      for (let i = lasers.length - 1; i >= 0; i--) {
        const l = lasers[i];
        l.timer += dt;

        if (l.type === 'aimed' || l.type === 'spear') {
          const lanceX = boss.x + 16 + Math.cos(boss.spearAngle + Math.PI / 2) * 55;
          const lanceY = boss.y + bobY + 2 + Math.sin(boss.spearAngle + Math.PI / 2) * 55;
          l.x1 = lanceX;
          l.y1 = lanceY;

          if (l.state === 'tracking') {
            const dx = player.x - l.x1;
            const dy = player.y - l.y1;
            l.angle = Math.atan2(dy, dx);
            l.x2 = l.x1 + Math.cos(l.angle) * 2500;
            l.y2 = l.y1 + Math.sin(l.angle) * 2500;

            if (l.timer >= l.trackDuration) {
              l.state = 'locked';
              l.timer = 0;
              playLaserWarningSound();
            }
          } else if (l.state === 'locked') {
            if (l.timer >= l.lockDuration) {
              l.state = 'firing';
              l.timer = 0;
              playLaserFireSound();
            }
          } else if (l.state === 'firing') {
            if (!l.hasHit) {
              const d = distToSegment(player.x, player.y, l.x1, l.y1, l.x2, l.y2);
              if (d <= player.radius + l.width / 2) {
                l.hasHit = true;
                damagePlayer(5.0); // Homing laser nerfed to 5 damage
              }
            }
            if (l.timer >= l.fireDuration) {
              lasers.splice(i, 1);
              continue;
            }
          }
        } else if (l.type === 'lane') {
          if (l.state === 'warning') {
            if (l.timer >= l.warningDuration - 0.42 && !l.soundPlayed) {
              l.soundPlayed = true;
              playLaserWarningSound();
            }
            if (l.timer >= l.warningDuration) {
              l.state = 'firing';
              l.timer = 0;
              playLaserFireSound();
            }
          } else if (l.state === 'firing') {
            if (!l.hasHit) {
              const d = distToSegment(player.x, player.y, l.x1, l.y1, l.x2, l.y2);
              if (d <= player.radius + l.width / 2) {
                l.hasHit = true;
                damagePlayer(10.0); // Lane laser (10 damage)
              }
            }
            if (l.timer >= l.fireDuration) {
              lasers.splice(i, 1);
              continue;
            }
          }
        }
      }

      // ── UPDATE SKY BOMBS & COLLISIONS ──
      for (let i = bombs.length - 1; i >= 0; i--) {
        const b = bombs[i];
        b.timer += dt;

        if (b.state === 'falling') {
          const progress = Math.min(1, b.timer / b.warningDuration);
          b.altitude = 420 * (1 - progress);

          if (b.timer >= b.warningDuration) {
            b.state = 'exploding';
            b.timer = 0;
            b.explodeTimer = 0.28;
            playBombExplosionSound();

            explosionRings.push({
              x: b.x,
              y: b.y,
              radius: 12,
              maxRadius: b.radius + 18,
              alpha: 1.0
            });

            for (let p = 0; p < 22; p++) {
              const pa = Math.random() * Math.PI * 2;
              const ps = 2 + Math.random() * 7;
              dashParticles.push({
                x: b.x,
                y: b.y,
                vx: Math.cos(pa) * ps,
                vy: Math.sin(pa) * ps,
                life: 0.35 + Math.random() * 0.25,
                maxLife: 0.6,
                size: 3 + Math.random() * 3.5,
                color: Math.random() > 0.4 ? '#ff2545' : '#ff9520'
              });
            }

            if (!b.hasHit) {
              const d = Math.hypot(player.x - b.x, player.y - b.y);
              if (d <= player.radius + b.radius) {
                b.hasHit = true;
                damagePlayer(10.0); // Bomb 10 damage
              }
            }
          }
        } else if (b.state === 'exploding') {
          b.explodeTimer -= dt;
          if (b.explodeTimer <= 0) {
            b.state = 'scorch';
            b.scorchTimer = 0.8;
          }
        } else if (b.state === 'scorch') {
          b.scorchTimer -= dt;
          if (b.scorchTimer <= 0) {
            bombs.splice(i, 1);
            continue;
          }
        }
      }
      }

      // ── UPDATE EXPLOSION RINGS & BOSS EMBERS ──
      for (let i = explosionRings.length - 1; i >= 0; i--) {
        const er = explosionRings[i];
        er.radius += 180 * dt;
        er.alpha -= 2.8 * dt;
        if (er.alpha <= 0) {
          explosionRings.splice(i, 1);
        }
      }

      for (let i = bossEmbers.length - 1; i >= 0; i--) {
        const em = bossEmbers[i];
        em.x += em.vx;
        em.y += em.vy;
        em.life -= dt;
        if (em.life <= 0) {
          bossEmbers.splice(i, 1);
        }
      }

      // ── PLAYER MOVEMENT & DASH DYNAMICS ──
      if (!inCutscene) {
        if (player.isDashing) {
          player.dashTimer -= dt;
          player.vx = Math.cos(player.dashAngle) * (player.baseSpeed * player.dashSpeedMultiplier);
          player.vy = Math.sin(player.dashAngle) * (player.baseSpeed * player.dashSpeedMultiplier);
          player.wobble += 0.35;

          // Spawn afterimages
          player.ghostTimer += dt;
          if (player.ghostTimer >= 0.026) {
            player.ghostTimer = 0;
            dashGhosts.push({
              x: player.x,
              y: player.y,
              angle: player.angle,
              alpha: 0.72
            });
          }

          // Spawn dash particles
          if (Math.random() < 0.8) {
            const pAngle = player.angle + Math.PI + (Math.random() - 0.5) * 0.9;
            dashParticles.push({
              x: player.x - Math.cos(player.angle) * 10,
              y: player.y - Math.sin(player.angle) * 10,
              vx: Math.cos(pAngle) * (2 + Math.random() * 3.5),
              vy: Math.sin(pAngle) * (2 + Math.random() * 3.5),
              life: 0.2 + Math.random() * 0.16,
              maxLife: 0.36,
              size: 2.5 + Math.random() * 2.5,
              color: Math.random() > 0.3 ? '#4ce5ff' : '#ffffff'
            });
          }

          if (player.dashTimer <= 0) {
            player.isDashing = false;
            player.vx *= 0.45;
            player.vy *= 0.45;
          }
        } else {
          if (movementMode === 'keyboard') {
            let mx = 0, my = 0;
            if (keys['w'] || keys['arrowup']) my -= 1;
            if (keys['s'] || keys['arrowdown']) my += 1;
            if (keys['a'] || keys['arrowleft']) mx -= 1;
            if (keys['d'] || keys['arrowright']) mx += 1;

            if (mx !== 0 || my !== 0) {
              const len = Math.hypot(mx, my);
              mx /= len;
              my /= len;
              player.vx = mx * player.baseSpeed;
              player.vy = my * player.baseSpeed;
              player.angle = Math.atan2(my, mx);
              player.wobble += 0.22;
            } else {
              player.vx *= 0.82;
              player.vy *= 0.82;
              player.wobble += 0.04;
            }
          } else {
            const worldMouseX = camX + mouseScreenX;
            const worldMouseY = camY + mouseScreenY;
            const toX = worldMouseX - player.x;
            const toY = worldMouseY - player.y;
            const dist = Math.hypot(toX, toY);
            player.angle = Math.atan2(toY, toX);

            if (dist > 18) {
              const targetSpeed = Math.min(player.baseSpeed, dist * 0.07);
              player.vx = (toX / dist) * targetSpeed;
              player.vy = (toY / dist) * targetSpeed;
              player.wobble += 0.22;
            } else {
              player.vx *= 0.8;
              player.vy *= 0.8;
              player.wobble += 0.04;
            }
          }
        }

        player.x += player.vx;
        player.y += player.vy;

        // Constrain inside 16:9 arena bounds
        const margin = player.radius + 12;
        player.x = Math.max(margin, Math.min(ARENA_W - margin, player.x));
        player.y = Math.max(margin, Math.min(ARENA_H - margin, player.y));
      } else {
        player.vx = 0;
        player.vy = 0;
      }

      // Camera smoothly follows player with smart 16:9 framing
      let targetCamX, targetCamY;
      const camFocusX = ARENA_W / 2;
      let camFocusY = ARENA_H / 2;
      if (inCutscene && cutsceneTimer >= 6.4 && cutsceneTimer <= 9.2) {
        const tiltProg = Math.sin(((cutsceneTimer - 6.4) / 2.8) * Math.PI);
        camFocusY = ARENA_H / 2 - tiltProg * 110;
      }
      const playerFocusX = inCutscene ? camFocusX : player.x;
      const playerFocusY = inCutscene ? camFocusY : player.y;

      if (gameCanvas.width >= ARENA_W) {
        targetCamX = (ARENA_W - gameCanvas.width) / 2;
      } else {
        targetCamX = Math.max(0, Math.min(ARENA_W - gameCanvas.width, playerFocusX - gameCanvas.width / 2));
      }

      if (gameCanvas.height >= ARENA_H) {
        targetCamY = (ARENA_H - gameCanvas.height) / 2;
      } else {
        targetCamY = Math.max(0, Math.min(ARENA_H - gameCanvas.height, playerFocusY - gameCanvas.height / 2));
      }

      camX += (targetCamX - camX) * 0.12;
      camY += (targetCamY - camY) * 0.12;

      // Update ambient glow nodes
      ambientNodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 120 || node.x > ARENA_W - 120) node.vx *= -1;
        if (node.y < 120 || node.y > ARENA_H - 120) node.vy *= -1;
      });

      // Update fog particles
      fogParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x += ARENA_W;
        if (p.x > ARENA_W) p.x -= ARENA_W;
        if (p.y < 0) p.y += ARENA_H;
        if (p.y > ARENA_H) p.y -= ARENA_H;
      });

      // ── RENDER SCENE ──
      // 1. Pitch-black void
      gctx.fillStyle = '#000000';
      gctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

      gctx.save();
      gctx.translate(-Math.round(camX), -Math.round(camY));

      // 2. Subtle red grid on arena floor
      const startGridX = Math.max(0, Math.floor(camX / 48) * 48);
      const endGridX   = Math.min(ARENA_W, Math.ceil((camX + gameCanvas.width) / 48) * 48);
      const startGridY = Math.max(0, Math.floor(camY / 48) * 48);
      const endGridY   = Math.min(ARENA_H, Math.ceil((camY + gameCanvas.height) / 48) * 48);

      gctx.strokeStyle = 'rgba(180, 18, 30, 0.05)';
      gctx.lineWidth = 1;
      gctx.beginPath();
      for (let x = startGridX; x <= endGridX; x += 48) {
        gctx.moveTo(x, startGridY);
        gctx.lineTo(x, endGridY);
      }
      for (let y = startGridY; y <= endGridY; y += 48) {
        gctx.moveTo(startGridX, y);
        gctx.lineTo(endGridX, y);
      }
      gctx.stroke();

      // 3. Subtle ambient red hues drifting across the void
      ambientNodes.forEach(node => {
        const glow = gctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.r);
        glow.addColorStop(0, 'rgba(190, 15, 30, 0.06)');
        glow.addColorStop(0.6, 'rgba(120, 8, 20, 0.025)');
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        gctx.fillStyle = glow;
        gctx.fillRect(node.x - node.r, node.y - node.r, node.r * 2, node.r * 2);
      });

      // 4. Subtle fog / environmental particles
      fogParticles.forEach(p => {
        if (p.x + p.radius < camX || p.x - p.radius > camX + gameCanvas.width ||
            p.y + p.radius < camY || p.y - p.radius > camY + gameCanvas.height) return;

        const fgrad = gctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        fgrad.addColorStop(0, `${p.color} ${p.alpha})`);
        fgrad.addColorStop(1, `${p.color} 0)`);
        gctx.fillStyle = fgrad;
        gctx.beginPath();
        gctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        gctx.fill();
      });

      // 5. Arena Boundary Walls & Corners
      gctx.strokeStyle = 'rgba(255, 35, 55, 0.55)';
      gctx.lineWidth = 3;
      gctx.shadowColor = '#ff2035';
      gctx.shadowBlur = 16;
      gctx.strokeRect(0, 0, ARENA_W, ARENA_H);
      gctx.shadowBlur = 0;

      // Corner markers
      gctx.fillStyle = '#ff2b3d';
      const csize = 20;
      [[0, 0], [ARENA_W - csize, 0], [0, ARENA_H - csize], [ARENA_W - csize, ARENA_H - csize]].forEach(([cx, cy]) => {
        gctx.fillRect(cx, cy, csize, csize);
      });

      // Arcane Summoning Circle & Mana Convergence (Intro Cutscene)
      drawCutsceneSummonCircle(gctx);

      // 6. Sky Bomb Danger Zones & Scorch Marks (Drawn on arena floor)
      bombs.forEach(b => {
        if (b.state === 'falling') {
          gctx.save();
          const progress = Math.min(1, b.timer / b.warningDuration);

          // Outer danger ring
          gctx.strokeStyle = 'rgba(255, 35, 60, 0.85)';
          gctx.lineWidth = 2.5;
          gctx.shadowColor = '#ff2040';
          gctx.shadowBlur = 10;
          gctx.beginPath();
          gctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          gctx.stroke();

          // Expanding countdown fill ring
          gctx.fillStyle = 'rgba(255, 20, 50, 0.22)';
          gctx.beginPath();
          gctx.arc(b.x, b.y, b.radius * progress, 0, Math.PI * 2);
          gctx.fill();

          // Crosshair indicators
          gctx.strokeStyle = 'rgba(255, 80, 100, 0.45)';
          gctx.lineWidth = 1.5;
          gctx.beginPath();
          gctx.moveTo(b.x - b.radius, b.y); gctx.lineTo(b.x + b.radius, b.y);
          gctx.moveTo(b.x, b.y - b.radius); gctx.lineTo(b.x, b.y + b.radius);
          gctx.stroke();

          // Shadow of descending celestial bomb
          const shadowScale = 0.3 + 0.7 * progress;
          gctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
          gctx.beginPath();
          gctx.ellipse(b.x, b.y, 14 * shadowScale, 6 * shadowScale, 0, 0, Math.PI * 2);
          gctx.fill();
          gctx.restore();
        } else if (b.state === 'scorch') {
          gctx.save();
          const a = Math.max(0, b.scorchTimer / 0.8);
          gctx.fillStyle = `rgba(40, 6, 12, ${a * 0.45})`;
          gctx.beginPath();
          gctx.arc(b.x, b.y, b.radius * 0.65, 0, Math.PI * 2);
          gctx.fill();
          gctx.restore();
        }
      });

      // 7. Laser Warning Telegraphs & Active Fired Beams
      lasers.forEach(l => {
        if (l.state === 'tracking') {
          // Faint red tracking line
          gctx.save();
          gctx.strokeStyle = 'rgba(255, 45, 65, 0.45)';
          gctx.lineWidth = 2;
          gctx.setLineDash([8, 6]);
          gctx.beginPath();
          gctx.moveTo(l.x1, l.y1);
          gctx.lineTo(l.x2, l.y2);
          gctx.stroke();
          gctx.setLineDash([]);
          gctx.restore();
        } else if (l.state === 'locked' || l.state === 'warning') {
          // Locked in place, flashing red danger warning!
          const flash = (Math.floor(l.timer * 22) % 2 === 0);
          gctx.save();
          gctx.strokeStyle = flash ? 'rgba(255, 30, 60, 0.95)' : 'rgba(255, 120, 140, 0.5)';
          gctx.shadowColor = '#ff113a';
          gctx.shadowBlur = 14;
          gctx.lineWidth = (l.type === 'lane') ? 6 : 4;
          gctx.beginPath();
          gctx.moveTo(l.x1, l.y1);
          gctx.lineTo(l.x2, l.y2);
          gctx.stroke();

          // Lane boundary guide stripes for lane lasers
          if (l.type === 'lane') {
            gctx.fillStyle = flash ? 'rgba(255, 20, 45, 0.12)' : 'rgba(255, 20, 45, 0.05)';
            if (l.y1 === l.y2) {
              // Horizontal lane
              gctx.fillRect(l.x1, l.y1 - l.width / 2, l.x2 - l.x1, l.width);
            } else {
              // Vertical lane
              gctx.fillRect(l.x1 - l.width / 2, l.y1, l.width, l.y2 - l.y1);
            }
          }

          gctx.shadowBlur = 0;
          gctx.restore();
        } else if (l.state === 'firing') {
          // High-energy laser blast!
          gctx.save();
          // Fiery outer glow
          gctx.strokeStyle = 'rgba(255, 20, 50, 0.85)';
          gctx.shadowColor = '#ff0033';
          gctx.shadowBlur = 24;
          gctx.lineWidth = l.width + 10;
          gctx.beginPath();
          gctx.moveTo(l.x1, l.y1);
          gctx.lineTo(l.x2, l.y2);
          gctx.stroke();

          // Searing white core
          gctx.strokeStyle = '#ffffff';
          gctx.lineWidth = l.width * 0.5;
          gctx.beginPath();
          gctx.moveTo(l.x1, l.y1);
          gctx.lineTo(l.x2, l.y2);
          gctx.stroke();
          gctx.shadowBlur = 0;
          gctx.restore();
        }
      });

      // 8. Exploding Sky Bombs (Fireball detonation)
      bombs.forEach(b => {
        if (b.state === 'exploding') {
          gctx.save();
          const expProgress = 1 - (b.explodeTimer / 0.28);
          const curR = b.radius * (0.4 + 0.6 * expProgress);
          const radGrad = gctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, curR);
          radGrad.addColorStop(0, '#ffffff');
          radGrad.addColorStop(0.35, '#ff4d6d');
          radGrad.addColorStop(0.75, 'rgba(200, 10, 30, 0.85)');
          radGrad.addColorStop(1, 'rgba(100, 0, 15, 0)');
          gctx.fillStyle = radGrad;
          gctx.shadowColor = '#ff113a';
          gctx.shadowBlur = 20;
          gctx.beginPath();
          gctx.arc(b.x, b.y, curR, 0, Math.PI * 2);
          gctx.fill();
          gctx.restore();
        }
      });

      // 9. Explosion Shockwave Rings
      explosionRings.forEach(er => {
        gctx.save();
        gctx.strokeStyle = `rgba(255, 60, 80, ${er.alpha})`;
        gctx.lineWidth = 3;
        gctx.shadowColor = '#ff2040';
        gctx.shadowBlur = 12;
        gctx.beginPath();
        gctx.arc(er.x, er.y, er.radius, 0, Math.PI * 2);
        gctx.stroke();
        gctx.restore();
      });

      // 10. Descending Sky Bombs (In flight through the air)
      bombs.forEach(b => {
        if (b.state === 'falling') {
          gctx.save();
          const curY = b.y - b.altitude;

          // Fiery descent tail
          gctx.fillStyle = 'rgba(255, 60, 40, 0.7)';
          gctx.beginPath();
          gctx.moveTo(b.x - 7, curY);
          gctx.lineTo(b.x + 7, curY);
          gctx.lineTo(b.x, curY - 32);
          gctx.closePath();
          gctx.fill();

          // Spiky dark celestial orb
          gctx.fillStyle = '#26040a';
          gctx.shadowColor = '#ff113a';
          gctx.shadowBlur = 12;
          gctx.beginPath();
          gctx.arc(b.x, curY, 11, 0, Math.PI * 2);
          gctx.fill();

          // Glowing scarlet core
          gctx.fillStyle = '#ff2045';
          gctx.beginPath();
          gctx.arc(b.x, curY, 6, 0, Math.PI * 2);
          gctx.fill();
          gctx.fillStyle = '#ffffff';
          gctx.fillRect(b.x - 2, curY - 2, 4, 4);
          gctx.restore();
        }
      });

      // 11. Boss Drifting Embers
      bossEmbers.forEach(em => {
        const a = Math.max(0, em.life / em.maxLife);
        gctx.save();
        gctx.fillStyle = em.color;
        gctx.globalAlpha = a;
        gctx.shadowColor = em.color;
        gctx.shadowBlur = 6;
        gctx.beginPath();
        gctx.arc(em.x, em.y, em.size, 0, Math.PI * 2);
        gctx.fill();
        gctx.restore();
      });

      // 12. Draw Boss: Red Pixel "Fallen Angel" (Floating above and around with spear)
      drawFallenAngel(gctx, boss.x, boss.y, boss.spearAngle, boss.wingFlap, bobY);

      // 13. Dash Afterimages (Ghosts)
      for (let i = dashGhosts.length - 1; i >= 0; i--) {
        const g = dashGhosts[i];
        g.alpha -= 3.2 * dt;
        if (g.alpha <= 0) {
          dashGhosts.splice(i, 1);
          continue;
        }
        gctx.save();
        gctx.translate(g.x, g.y);
        gctx.rotate(g.angle);
        gctx.scale(1.4, 0.65);
        gctx.fillStyle = `rgba(64, 190, 255, ${g.alpha * 0.5})`;
        gctx.shadowColor = 'rgba(64, 220, 255, 0.8)';
        gctx.shadowBlur = 12;
        gctx.beginPath();
        gctx.arc(0, 0, 18, 0, Math.PI * 2);
        gctx.fill();
        gctx.restore();
      }

      // 14. Dash Trailing Particles
      for (let i = dashParticles.length - 1; i >= 0; i--) {
        const p = dashParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= dt;
        if (p.life <= 0) {
          dashParticles.splice(i, 1);
          continue;
        }
        const a = Math.max(0, p.life / p.maxLife);
        gctx.save();
        gctx.fillStyle = p.color;
        gctx.globalAlpha = a;
        gctx.shadowColor = p.color;
        gctx.shadowBlur = 6;
        gctx.beginPath();
        gctx.arc(p.x, p.y, p.size * a, 0, Math.PI * 2);
        gctx.fill();
        gctx.restore();
      }

      // 15. Shield Dissipation Rings
      for (let i = shieldDissolves.length - 1; i >= 0; i--) {
        const d = shieldDissolves[i];
        d.radius += 80 * dt;
        d.alpha -= 2.2 * dt;
        if (d.alpha <= 0) {
          shieldDissolves.splice(i, 1);
          continue;
        }
        gctx.save();
        gctx.strokeStyle = `rgba(0, 240, 255, ${d.alpha})`;
        gctx.lineWidth = 2.5;
        gctx.shadowColor = '#00f0ff';
        gctx.shadowBlur = 12;
        gctx.beginPath();
        gctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
        gctx.stroke();
        gctx.restore();
      }

      // 16. Draw Top-Down Circular Slime Player (with i-frame damage flash & cutscene landing)
      if (!inCutscene || cutsceneTimer >= 1.3) {
        gctx.save();
        const slimeDrawY = inCutscene ? player.y + cutsceneDropOffset : player.y;
        gctx.translate(player.x, slimeDrawY);
        gctx.rotate(player.angle);

        // Slime damage flash flicker
        if (player.iFrames > 0 && Math.floor(player.iFrames * 20) % 2 === 0) {
          gctx.globalAlpha = 0.55;
        }

        // Dash squash & stretch animation or cutscene impact bounce
        let sx = 1, sy = 1;
        if (inCutscene) {
          sx = cutsceneSlimeScaleX;
          sy = cutsceneSlimeScaleY;
        } else if (player.isDashing) {
          sx = 1.48;
          sy = 0.62;
        } else {
          const isMove = Math.hypot(player.vx, player.vy) > 0.4;
          const squash = Math.sin(player.wobble) * (isMove ? 0.08 : 0.025);
          sx = 1 + squash;
          sy = 1 - squash;
        }
        gctx.scale(sx, sy);

        // Slime floor glow
        gctx.shadowColor = player.isDashing
          ? 'rgba(64, 224, 255, 0.9)'
          : (player.iFrames > 0 ? 'rgba(255, 40, 60, 0.8)' : 'rgba(62, 126, 207, 0.5)');
        gctx.shadowBlur = player.isDashing ? 24 : 18;

        // Dark slime outline
        gctx.fillStyle = player.iFrames > 0 ? '#380a14' : '#10142b';
        gctx.beginPath();
        gctx.arc(0, 0, 20, 0, Math.PI * 2);
        gctx.fill();
        gctx.shadowBlur = 0;

        // Main slime body
        gctx.fillStyle = player.iFrames > 0
          ? '#ff3355'
          : (player.isDashing ? '#36a8ff' : '#3e7ecf');
        gctx.beginPath();
        gctx.arc(0, 0, 18, 0, Math.PI * 2);
        gctx.fill();

        // Inner lighter jelly core
        gctx.fillStyle = player.iFrames > 0
          ? '#ff7895'
          : (player.isDashing ? '#78d2ff' : '#5da0e6');
        gctx.beginPath();
        gctx.arc(2, 0, 10, 0, Math.PI * 2);
        gctx.fill();

        // Top-down specular highlight
        gctx.fillStyle = player.iFrames > 0
          ? '#ffb8c8'
          : (player.isDashing ? '#bde8ff' : '#7ab0f0');
        gctx.beginPath();
        gctx.ellipse(-5, -6, 7, 3.5, -0.4, 0, Math.PI * 2);
        gctx.fill();

        // Top-down eyes looking forward
        gctx.fillStyle = '#ffffff';
        gctx.beginPath();
        gctx.arc(7, -5, 3.5, 0, Math.PI * 2);
        gctx.fill();
        gctx.fillStyle = '#10142b';
        gctx.beginPath();
        gctx.arc(8, -5, 1.8, 0, Math.PI * 2);
        gctx.fill();

        gctx.fillStyle = '#ffffff';
        gctx.beginPath();
        gctx.arc(7, 5, 3.5, 0, Math.PI * 2);
        gctx.fill();
        gctx.fillStyle = '#10142b';
        gctx.beginPath();
        gctx.arc(8, 5, 1.8, 0, Math.PI * 2);
        gctx.fill();

        gctx.restore(); // end player transform
      }

      // 17. Forcefield Effect (Active Shield E)
      if (player.shieldActive) {
        gctx.save();
        gctx.translate(player.x, player.y);

        const shieldRadius = player.radius + 12;
        const pulse = Math.sin(player.shieldPulse * 6) * 1.8;
        const rad = shieldRadius + pulse;

        // Glowing outer forcefield aura
        const aura = gctx.createRadialGradient(0, 0, player.radius * 0.6, 0, 0, rad + 10);
        aura.addColorStop(0, 'rgba(40, 210, 255, 0.08)');
        aura.addColorStop(0.7, 'rgba(50, 220, 255, 0.22)');
        aura.addColorStop(1, 'rgba(0, 240, 255, 0)');
        gctx.fillStyle = aura;
        gctx.beginPath();
        gctx.arc(0, 0, rad + 10, 0, Math.PI * 2);
        gctx.fill();

        // Main forcefield perimeter ring
        gctx.shadowColor = '#00f2ff';
        gctx.shadowBlur = 14;
        gctx.strokeStyle = 'rgba(120, 240, 255, 0.9)';
        gctx.lineWidth = 2.5;
        gctx.beginPath();
        gctx.arc(0, 0, rad, 0, Math.PI * 2);
        gctx.stroke();

        // Rotating electric energy arcs around forcefield
        const numArcs = 3;
        gctx.lineWidth = 3.5;
        gctx.strokeStyle = '#ffffff';
        for (let a = 0; a < numArcs; a++) {
          const startA = player.shieldPulse * 4 + (a * (Math.PI * 2 / numArcs));
          const arcLen = 0.58;
          gctx.beginPath();
          gctx.arc(0, 0, rad, startA, startA + arcLen);
          gctx.stroke();
        }

        // Geometric hexagonal lattice shimmer
        gctx.strokeStyle = 'rgba(180, 250, 255, 0.35)';
        gctx.lineWidth = 1;
        gctx.beginPath();
        const hexSides = 6;
        for (let s = 0; s < hexSides; s++) {
          const ha = (s * Math.PI / 3) + player.shieldPulse * 1.6;
          const hx = Math.cos(ha) * (rad - 3);
          const hy = Math.sin(ha) * (rad - 3);
          if (s === 0) gctx.moveTo(hx, hy);
          else gctx.lineTo(hx, hy);
        }
        gctx.closePath();
        gctx.stroke();

        gctx.shadowBlur = 0;
        gctx.restore();
      }

      // 18. Small White Arrow Pointing in Movement Direction
      gctx.save();
      const arrowDistance = 34 + Math.sin(player.wobble * 2) * 2;
      const ax = player.x + Math.cos(player.angle) * arrowDistance;
      const ay = player.y + Math.sin(player.angle) * arrowDistance;
      gctx.translate(ax, ay);
      gctx.rotate(player.angle);

      gctx.fillStyle = '#ffffff';
      gctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
      gctx.shadowBlur = 6;

      gctx.beginPath();
      gctx.moveTo(6, 0);
      gctx.lineTo(-4, -4);
      gctx.lineTo(-2, 0);
      gctx.lineTo(-4, 4);
      gctx.closePath();
      gctx.fill();
      gctx.restore();

      gctx.restore(); // end world transform

      // 19. Fullscreen dark red vignette overlay
      const vignette = gctx.createRadialGradient(
        gameCanvas.width / 2, gameCanvas.height / 2, gameCanvas.height * 0.25,
        gameCanvas.width / 2, gameCanvas.height / 2, gameCanvas.width * 0.65
      );
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(1, 'rgba(40, 0, 10, 0.55)');
      gctx.fillStyle = vignette;
      gctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    }

    /* ── BACKGROUND MUSIC (RANDOM MENU PLAYLIST) ── */
    // Menu songs (clean normalized filenames)
    const menuSongs = [
      'menu_1.mp3',
      'menu_2.mp3',
      'menu_3.mp3',
      'menu_4.mp3'
    ];

    // Reserved for boss fights
    const bossSongs = [
      'boss_theme.mp3'
    ];

    let currentSongIndex = -1;
    const bgMusic = new Audio();
    bgMusic.volume = 0.75;

    function getNextRandomSong() {
      if (menuSongs.length <= 1) return 0;
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * menuSongs.length);
      } while (nextIndex === currentSongIndex);
      return nextIndex;
    }

    function playRandomMenuSong() {
      currentSongIndex = getNextRandomSong();
      const songPath = menuSongs[currentSongIndex];
      bgMusic.src = encodeURI(songPath);
      updateMusicVolume();
      bgMusic.play().catch(() => {});
      console.log(`[Slime's Revenge] Now playing menu song: ${songPath}`);
    }

    // Automatically shuffle to another random menu song when current song ends
    bgMusic.addEventListener('ended', () => {
      playRandomMenuSong();
    });

    // Browsers block autoplay until user interacts — start on first click
    let musicStarted = false;
    function startMusic() {
      if (!musicStarted) {
        playRandomMenuSong();
        musicStarted = true;
      }
    }
    document.addEventListener('click', startMusic, { once: true });

    /* ── DAMAGE SOUND EFFECT ── */
    const damageAudio = new Audio('damage.mp3');
    function playDamageSound() {
      const vol = sfxVolume;
      if (vol <= 0) return;
      damageAudio.currentTime = 0;
      damageAudio.volume = vol;
      damageAudio.play().catch(() => {});
    }

    /* ── VOLUME CONTROLS ── */
    const masterSlider = document.getElementById('masterSlider');
    const musicSlider  = document.getElementById('musicSlider');
    const sfxSlider    = document.getElementById('sfxSlider');
    let sfxVolume = 1.0;
    let unfocusedEnabled = true;

    // Set toggle to default enabled state
    document.getElementById('unfocusedToggle').classList.add('active');

    function updateVolumes() {
      const master = masterSlider.value / 100;
      const music  = musicSlider.value / 100;
      sfxVolume     = (sfxSlider.value / 100) * master;

      document.getElementById('masterValue').textContent = masterSlider.value + '%';
      document.getElementById('musicValue').textContent  = musicSlider.value + '%';
      document.getElementById('sfxValue').textContent     = sfxSlider.value + '%';

      updateMusicVolume();
    }

    function updateMusicVolume() {
      const master = masterSlider ? masterSlider.value / 100 : 0.75;
      const music  = musicSlider ? musicSlider.value / 100 : 1;
      const vol = master * music;
      bgMusic.volume = vol;
      if (typeof bossAudio !== 'undefined') bossAudio.volume = vol;
    }

    function toggleUnfocused() {
      unfocusedEnabled = !unfocusedEnabled;
      document.getElementById('unfocusedToggle').classList.toggle('active', unfocusedEnabled);
    }

    // Mute/unmute when tab loses/gains focus
    document.addEventListener('visibilitychange', () => {
      if (!unfocusedEnabled) {
        if (document.hidden) {
          bgMusic.dataset.prevVolume = bgMusic.volume;
          bgMusic.volume = 0;
          if (typeof bossAudio !== 'undefined') {
            bossAudio.dataset.prevVolume = bossAudio.volume;
            bossAudio.volume = 0;
          }
        } else {
          bgMusic.volume = parseFloat(bgMusic.dataset.prevVolume || bgMusic.volume);
          if (typeof bossAudio !== 'undefined') {
            bossAudio.volume = parseFloat(bossAudio.dataset.prevVolume || bossAudio.volume);
          }
        }
      }
    });

    /* ── CLICK SOUND (Web Audio API) ── */
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    function playClick() {
      const vol = sfxVolume;
      if (vol <= 0) return;

      const now = audioCtx.currentTime;

      // short square-wave blip for retro feel
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.06);
      gain.gain.setValueAtTime(vol * 0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.08);

      // layered high tick for crispness
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1400, now);
      osc2.frequency.exponentialRampToValueAtTime(600, now + 0.04);
      gain2.gain.setValueAtTime(vol * 0.15, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(now);
      osc2.stop(now + 0.05);
    }

    /* ── MOVEMENT MODE (CLICK-TO-SLIDE) ── */
    let movementMode = 'keyboard'; // 'keyboard' | 'mouse'
    const movementTrack = document.getElementById('movementTrack');
    const optKeyboard   = document.getElementById('optKeyboard');
    const optMouse      = document.getElementById('optMouse');

    function updateMovementUI(isMouse) {
      movementMode = isMouse ? 'mouse' : 'keyboard';
      if (movementTrack) movementTrack.classList.toggle('is-mouse', isMouse);
      if (optKeyboard) optKeyboard.classList.toggle('active', !isMouse);
      if (optMouse) optMouse.classList.toggle('active', isMouse);
      if (typeof syncInGameMovementUI === 'function') syncInGameMovementUI();
      console.log(`[Slime's Revenge] Movement mode: ${movementMode}`);
    }

    function setMovementMode(modeIndex) {
      playClick();
      updateMovementUI(modeIndex === 1);
    }

    function toggleMovementMode() {
      playClick();
      updateMovementUI(movementMode === 'keyboard');
    }

    /* ── MENU CLICK ── */
    function menuClick(action) {
      playClick();
      const card = document.querySelector('.card-' + action);
      card.style.transition = 'none';
      card.style.transform = 'scale(.93)';
      card.style.boxShadow = '0 0 20px rgba(93,230,122,.4)';
      setTimeout(() => {
        card.style.transition = 'transform .3s ease, box-shadow .3s ease';
        card.style.transform = '';
        card.style.boxShadow = '';
      }, 150);

      if (action === 'play') {
        setTimeout(showPlay, 200);
      } else if (action === 'credits') {
        setTimeout(showCredits, 200);
      } else if (action === 'settings') {
        setTimeout(showSettings, 200);
      } else {
        console.log(`[Slime's Revenge] "${action}" clicked — not implemented yet.`);
      }
    }
