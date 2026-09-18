/* ================================================================
   DARSHAN // 3D CYBERPUNK MATRIX HOLOGRAM CORE SCRIPT
   Three.js 3D Universe, Particle Starfield, Rotating Cyber-Core,
   5 Distinct 3D Data Node Geometries, Celestial Orbit Tracks,
   Raycast Selection, Cinematic Camera Flight, Sci-Fi Audio Synthesizer,
   Preloader Bootloader, & ATS Resume Modal System.
   ================================================================ */

'use strict';

// ============================================================
// 1. SCI-FI WEB AUDIO SYNTHESIZER
// Generates futuristic cyber tones without external sound files
// ============================================================
class SciFiAudio {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.init();
  }

  init() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      // Lazy init on first user gesture to comply with browser autoplay policies
      const startAudio = () => {
        if (!this.ctx) {
          this.ctx = new AudioContext();
        }
        window.removeEventListener('click', startAudio);
        window.removeEventListener('keydown', startAudio);
      };
      window.addEventListener('click', startAudio, { once: true });
      window.addEventListener('keydown', startAudio, { once: true });
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  playWarp() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.35);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) { }
  }

  playHover() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.setValueAtTime(720, now + 0.04);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) { }
  }

  playClick() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.06);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch (e) { }
  }
}

// ============================================================
// 2. MAIN 3D UNIVERSE CONTROLLER
// ============================================================
class CyberpunkUniverse {
  constructor() {
    this.canvas = document.getElementById('webgl-canvas');
    if (!this.canvas) return;

    this.audio = new SciFiAudio();
    this.nodes = [];
    this.mouse = new THREE.Vector2(0, 0);

    // 6 Flight Waypoints along the deep-space corridor
    // 0: hero, 1: about, 2: projects, 3: skills, 4: experience, 5: contact
    this.waypoints = [
      {
        id: 'sec-hero',
        targetName: 'CORE // OVERVIEW',
        cam: new THREE.Vector3(0, 0, 26),
        lookAt: new THREE.Vector3(0, 0, 0)
      },
      {
        id: 'sec-about',
        targetName: 'NODE_01 // IDENTITY',
        cam: new THREE.Vector3(-3.2, 0.4, -20),
        lookAt: new THREE.Vector3(3.6, 0, -35)
      },
      {
        id: 'sec-projects',
        targetName: 'NODE_02 // ARCHITECTURE',
        cam: new THREE.Vector3(3.2, 0.4, -60),
        lookAt: new THREE.Vector3(-3.6, 0, -75)
      },
      {
        id: 'sec-skills',
        targetName: 'NODE_03 // KERNEL MATRIX',
        cam: new THREE.Vector3(-3.2, 0.4, -100),
        lookAt: new THREE.Vector3(3.6, 0, -115)
      },
      {
        id: 'sec-experience',
        targetName: 'NODE_04 // PRODUCTION LOGS',
        cam: new THREE.Vector3(3.2, 0.4, -140),
        lookAt: new THREE.Vector3(-3.6, 0, -155)
      },
      {
        id: 'sec-contact',
        targetName: 'NODE_05 // TRANSMISSION',
        cam: new THREE.Vector3(0, 0, -180),
        lookAt: new THREE.Vector3(0, 2.0, -195)
      }
    ];

    this.activeSectionIdx = 0;
    this.targetCamPos = this.waypoints[0].cam.clone();
    this.targetLookAt = this.waypoints[0].lookAt.clone();
    this.currentLookAt = this.waypoints[0].lookAt.clone();

    this.initThree();
    this.createCyberCore();
    this.createParticleStarfield();
    this.createDataNodes();
    this.initEvents();
    this.initTelemetry();
    this.updateCameraFromScroll();
    this.animate();
  }

  initThree() {
    // Scene with atmospheric deep-space fog
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x05070e, 0.012);

    // Perspective Camera
    this.camera = new THREE.PerspectiveCamera(
      52,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.copy(this.waypoints[0].cam);

    // WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setClearColor(0x05070e, 1);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Calibrated Deep-Space Lighting
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.3);
    this.scene.add(ambientLight);

    // Central Core Reactor Point Light
    const coreLight = new THREE.PointLight(0x00f0ff, 2.6, 80);
    coreLight.position.set(0, 0, 0);
    this.scene.add(coreLight);

    // Secondary Quantum Violet Rim Light
    const rimLight = new THREE.PointLight(0x818cf8, 1.8, 100);
    rimLight.position.set(16, 14, -60);
    this.scene.add(rimLight);

    // Third Emerald Rim Light deeper down the corridor
    const deepLight = new THREE.PointLight(0x00f5a0, 1.6, 100);
    deepLight.position.set(-16, 12, -140);
    this.scene.add(deepLight);
  }

  // ------------------------------------------------------------
  // Central Glowing Cyber-Core (Radiant Plasma Reactor & Harmonic Rings)
  // Anchored at Coordinate Origin (0, 0, 0)
  // ------------------------------------------------------------
  createCyberCore() {
    this.coreGroup = new THREE.Group();

    // 1. Inner Wireframe Icosahedron (Electric Cyan)
    const icoGeo = new THREE.IcosahedronGeometry(3.2, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });
    this.innerCore = new THREE.Mesh(icoGeo, icoMat);
    this.coreGroup.add(this.innerCore);

    // 2. Central Solid Energy Core (High-Luminance Plasma Ice Core)
    const innerGeo = new THREE.SphereGeometry(1.3, 16, 16);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xe0faff,
      wireframe: false
    });
    this.solidCore = new THREE.Mesh(innerGeo, innerMat);
    this.coreGroup.add(this.solidCore);

    // 3. Orbital Rings (Dual-Harmonic Cyan & Violet Fine Rings)
    const ringGeo1 = new THREE.TorusGeometry(6.2, 0.025, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.55 });
    this.ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    this.ring1.rotation.x = Math.PI / 3;
    this.coreGroup.add(this.ring1);

    const ringGeo2 = new THREE.TorusGeometry(8.4, 0.02, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x818cf8, transparent: true, opacity: 0.45 });
    this.ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    this.ring2.rotation.y = Math.PI / 4;
    this.coreGroup.add(this.ring2);

    this.scene.add(this.coreGroup);
  }

  // ------------------------------------------------------------
  // Multi-Spectral Deep-Space Starfield Corridor
  // Populated along the entire length of the flight path (Z: +35 to -235)
  // ------------------------------------------------------------
  createParticleStarfield() {
    const count = 3000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const cyanColor = new THREE.Color(0x38bdf8);
    const iceColor = new THREE.Color(0xe0f2fe);
    const violetColor = new THREE.Color(0x818cf8);
    const amberColor = new THREE.Color(0xfde68a);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 85;
      positions[i3 + 1] = (Math.random() - 0.5) * 65;
      positions[i3 + 2] = 35 - Math.random() * 260;

      const rand = Math.random();
      let chosenColor;
      if (rand < 0.5) {
        chosenColor = cyanColor;
      } else if (rand < 0.75) {
        chosenColor = iceColor;
      } else if (rand < 0.9) {
        chosenColor = violetColor;
      } else {
        chosenColor = amberColor;
      }

      colors[i3] = chosenColor.r;
      colors[i3 + 1] = chosenColor.g;
      colors[i3 + 2] = chosenColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });

    this.starfield = new THREE.Points(geometry, material);
    this.scene.add(this.starfield);
  }

  // ------------------------------------------------------------
  // 5 CELESTIAL DATA NODES ANCHORED AT MILESTONE WAYPOINTS
  // Each node revolves INDEPENDENTLY on its own local axes
  // ------------------------------------------------------------
  createDataNodes() {
    const nodeConfigs = [
      {
        id: 'about',
        label: 'IDENTITY // ABOUT',
        color: 0x00f0ff,
        basePos: new THREE.Vector3(4.5, 0, -35),
        rotSpeed: { x: 0.012, y: 0.016 },
        floatOffset: 0,
        createGeometries: (group) => {
          // Node 1: Octahedron with rotating sub-gyro ring (Ion Cyan)
          const geo = new THREE.OctahedronGeometry(1.8, 0);
          const mat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true, transparent: true, opacity: 0.85 });
          const mesh = new THREE.Mesh(geo, mat);

          const innerGeo = new THREE.SphereGeometry(0.5, 10, 10);
          const innerMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.9 });
          const innerMesh = new THREE.Mesh(innerGeo, innerMat);

          const gyroGeo = new THREE.TorusGeometry(2.6, 0.025, 8, 48);
          const gyroMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.5 });
          const gyro = new THREE.Mesh(gyroGeo, gyroMat);
          gyro.rotation.x = Math.PI / 4;

          group.add(innerMesh);
          group.add(gyro);
          group.add(mesh);
          return { mesh, subMesh: gyro };
        }
      },
      {
        id: 'projects',
        label: 'ARCH // PROJECTS',
        color: 0x818cf8,
        basePos: new THREE.Vector3(-4.5, 0, -75),
        rotSpeed: { x: 0.011, y: 0.014 },
        floatOffset: 1.2,
        createGeometries: (group) => {
          // Node 2: Dodecahedron with inner core (Quantum Violet)
          const geo = new THREE.DodecahedronGeometry(1.9, 0);
          const mat = new THREE.MeshBasicMaterial({ color: 0x818cf8, wireframe: true, transparent: true, opacity: 0.85 });
          const mesh = new THREE.Mesh(geo, mat);

          const innerGeo = new THREE.IcosahedronGeometry(0.8, 0);
          const innerMat = new THREE.MeshBasicMaterial({ color: 0xa5b4fc, wireframe: true, transparent: true, opacity: 0.7 });
          const innerMesh = new THREE.Mesh(innerGeo, innerMat);

          group.add(innerMesh);
          group.add(mesh);
          return { mesh, subMesh: innerMesh };
        }
      },
      {
        id: 'skills',
        label: 'MATRIX // SKILLS',
        color: 0x00f5a0,
        basePos: new THREE.Vector3(4.5, 0, -115),
        rotSpeed: { x: 0.013, y: 0.015 },
        floatOffset: 2.4,
        createGeometries: (group) => {
          // Node 3: 20-faced Icosahedron with equatorial ring (Matrix Emerald)
          const geo = new THREE.IcosahedronGeometry(2.0, 0);
          const mat = new THREE.MeshBasicMaterial({ color: 0x00f5a0, wireframe: true, transparent: true, opacity: 0.85 });
          const mesh = new THREE.Mesh(geo, mat);

          const ringGeo = new THREE.TorusGeometry(2.8, 0.025, 8, 48);
          const ringMat = new THREE.MeshBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.5 });
          const ringMesh = new THREE.Mesh(ringGeo, ringMat);

          group.add(ringMesh);
          group.add(mesh);
          return { mesh, subMesh: ringMesh };
        }
      },
      {
        id: 'experience',
        label: 'LOGS // KRYTIL',
        color: 0xf59e0b,
        basePos: new THREE.Vector3(-4.5, 0, -155),
        rotSpeed: { x: 0.010, y: 0.012 },
        floatOffset: 3.6,
        createGeometries: (group) => {
          // Node 4: Stepped modular box with rotated inner cube (Solar Amber)
          const geo = new THREE.BoxGeometry(2.3, 2.3, 2.3);
          const mat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true, transparent: true, opacity: 0.85 });
          const mesh = new THREE.Mesh(geo, mat);

          const innerGeo = new THREE.BoxGeometry(1.3, 1.3, 1.3);
          const innerMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, wireframe: true, transparent: true, opacity: 0.7 });
          const innerMesh = new THREE.Mesh(innerGeo, innerMat);
          innerMesh.rotation.set(Math.PI / 4, Math.PI / 4, 0);

          group.add(innerMesh);
          group.add(mesh);
          return { mesh, subMesh: innerMesh };
        }
      },
      {
        id: 'contact',
        label: 'TRANSMISSION',
        color: 0xf43f5e,
        basePos: new THREE.Vector3(0, 2.2, -195),
        rotSpeed: { x: 0.014, y: 0.018 },
        floatOffset: 4.8,
        createGeometries: (group) => {
          // Node 5: Torus Knot electromagnetic transmitter beacon (Plasma Rose)
          const geo = new THREE.TorusKnotGeometry(1.4, 0.3, 48, 8, 2, 3);
          const mat = new THREE.MeshBasicMaterial({ color: 0xf43f5e, wireframe: true, transparent: true, opacity: 0.85 });
          const mesh = new THREE.Mesh(geo, mat);

          const innerGeo = new THREE.SphereGeometry(0.5, 12, 12);
          const innerMat = new THREE.MeshBasicMaterial({ color: 0xfb7185, transparent: true, opacity: 0.95 });
          const innerMesh = new THREE.Mesh(innerGeo, innerMat);

          group.add(innerMesh);
          group.add(mesh);
          return { mesh, subMesh: innerMesh };
        }
      }
    ];

    nodeConfigs.forEach(def => {
      const group = new THREE.Group();
      const { mesh, subMesh } = def.createGeometries(group);

      // Billboard Text Label with glowing holographic text
      const labelSprite = this.createTextSprite(def.label, def.color);
      labelSprite.position.set(0, 2.8, 0);
      group.add(labelSprite);

      // Anchor entity at its independent milestone position
      group.position.copy(def.basePos);

      // Attach metadata
      group.userData = {
        id: def.id,
        label: def.label,
        basePos: def.basePos.clone(),
        rotSpeed: def.rotSpeed,
        floatOffset: def.floatOffset,
        mesh: mesh,
        subMesh: subMesh,
        originalColor: def.color
      };

      this.nodes.push(group);
      this.scene.add(group);
    });
  }

  createTextSprite(text, colorHex) {
    const canvas = document.createElement('canvas');
    canvas.width = 360;
    canvas.height = 72;
    const ctx = canvas.getContext('2d');

    const hexStr = `#${colorHex.toString(16).padStart(6, '0')}`;
    ctx.font = 'bold 22px "JetBrains Mono", monospace';
    ctx.fillStyle = hexStr;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = hexStr;
    ctx.shadowBlur = 10;
    ctx.fillText(`[ ${text} ]`, 180, 36);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.95 });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(7.0, 1.4, 1);
    return sprite;
  }

  // ------------------------------------------------------------
  // Scroll Listener, Drag/Parallax, & Interaction Events
  // ------------------------------------------------------------
  initEvents() {
    // Window Resize
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.updateCameraFromScroll();
    });

    // Native Page Scroll driving the 3D cinematic flight
    window.addEventListener('scroll', () => {
      this.updateCameraFromScroll();
    }, { passive: true });

    // ── Sequential Scroll-Reveal via IntersectionObserver ──────────────────
    // Hero is always visible. Each other section reveals when 18% in viewport.
    const heroSec = document.getElementById('sec-hero');
    if (heroSec) heroSec.classList.add('is-visible');

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Play a subtle warp tone on first reveal
          this.audio.playWarp();
          // Stop observing once revealed (one-shot animation)
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.18,
      rootMargin: '0px 0px -5% 0px'
    });

    document.querySelectorAll('.scroll-section:not(#sec-hero)').forEach(sec => {
      revealObserver.observe(sec);
    });
    // ──────────────────────────────────────────────────────────────────────

    // Subtle Mouse Move Parallax
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Dock Button Clicks (Smooth scroll to corresponding section)
    const dockButtons = document.querySelectorAll('.dock-node-btn');
    const sectionIds = ['sec-hero', 'sec-about', 'sec-projects', 'sec-skills', 'sec-experience', 'sec-contact'];

    dockButtons.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        this.audio.playClick();
        const targetSec = document.getElementById(sectionIds[idx]);
        if (targetSec) {
          targetSec.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Resume Modal Triggers
    const resumeTrigger = document.getElementById('hud-resume-trigger');
    if (resumeTrigger) {
      resumeTrigger.addEventListener('click', () => openResumeModal());
    }

    const resumeCloseBtn = document.getElementById('close-resume-btn');
    if (resumeCloseBtn) {
      resumeCloseBtn.addEventListener('click', () => closeResumeModal());
    }

    const printResumeBtn = document.getElementById('print-resume-btn');
    if (printResumeBtn) {
      printResumeBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // Click outside modal to close
    const resumeModal = document.getElementById('resume-modal');
    if (resumeModal) {
      resumeModal.addEventListener('click', (e) => {
        if (e.target === resumeModal) {
          closeResumeModal();
        }
      });
    }

    // Keyboard Shortcuts (0-5 to jump, ESC to close resume)
    window.addEventListener('keydown', (e) => {
      const modal = document.getElementById('resume-modal');
      const isModalOpen = modal && !modal.classList.contains('hidden');

      if (e.key === 'Escape') {
        if (isModalOpen) {
          closeResumeModal();
        }
      } else if (!isModalOpen) {
        const keyNum = parseInt(e.key, 10);
        if (!isNaN(keyNum) && keyNum >= 0 && keyNum < sectionIds.length) {
          this.audio.playWarp();
          const targetSec = document.getElementById(sectionIds[keyNum]);
          if (targetSec) {
            targetSec.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    });

    // Audio SFX Toggle
    const audioBtn = document.getElementById('audio-toggle-btn');
    const audioState = document.getElementById('audio-state');
    const audioIcon = document.getElementById('audio-icon');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        const state = this.audio.toggle();
        audioState.textContent = state ? 'ON' : 'OFF';
        audioIcon.textContent = state ? '🔊' : '🔇';
      });
    }
  }

  // ------------------------------------------------------------
  // Scroll-Driven Camera Waypoint Interpolation
  // ------------------------------------------------------------
  updateCameraFromScroll() {
    const sections = document.querySelectorAll('.scroll-section');
    if (!sections.length) return;

    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const windowH = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight - windowH;
    const totalProgress = docHeight > 0 ? Math.min(Math.max(scrollY / docHeight, 0), 1) : 0;

    // Fractional progress along the 5 segments
    const segmentProgress = totalProgress * (this.waypoints.length - 1);
    const index = Math.min(Math.floor(segmentProgress), this.waypoints.length - 2);
    const frac = segmentProgress - index;

    // Smoothstep easing for cinematic glide
    const smoothFrac = frac * frac * (3 - 2 * frac);

    const w0 = this.waypoints[index];
    const w1 = this.waypoints[index + 1];

    if (w0 && w1) {
      this.targetCamPos.lerpVectors(w0.cam, w1.cam, smoothFrac);
      this.targetLookAt.lerpVectors(w0.lookAt, w1.lookAt, smoothFrac);
    }

    // Determine nearest section to screen center for HUD highlighting
    let activeIdx = 0;
    let minDistance = Infinity;
    sections.forEach((sec, idx) => {
      const rect = sec.getBoundingClientRect();
      const dist = Math.abs(rect.top + rect.height * 0.5 - windowH * 0.5);
      if (dist < minDistance) {
        minDistance = dist;
        activeIdx = idx;
      }
    });

    if (activeIdx !== this.activeSectionIdx) {
      this.activeSectionIdx = activeIdx;
      this.onSectionChange(activeIdx);
    }
  }

  onSectionChange(index) {
    const wp = this.waypoints[index];
    if (!wp) return;

    // Update top HUD Target readout
    const targetEl = document.getElementById('hud-target-name');
    if (targetEl) {
      targetEl.textContent = wp.targetName;
    }

    // Update bottom dock active class
    const dockButtons = document.querySelectorAll('.dock-node-btn');
    dockButtons.forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });
  }

  // ------------------------------------------------------------
  // Live Telemetry IST Clock
  // ------------------------------------------------------------
  initTelemetry() {
    const timeEl = document.getElementById('hud-time');
    if (!timeEl) return;

    const updateClock = () => {
      const now = new Date();
      const istString = now.toLocaleTimeString('en-GB', {
        timeZone: 'Asia/Kolkata',
        hour12: false
      });
      timeEl.textContent = `${istString} IST`;
    };

    updateClock();
    setInterval(updateClock, 1000);
  }

  // ------------------------------------------------------------
  // Render Loop & Physics Animation
  // ------------------------------------------------------------
  animate() {
    requestAnimationFrame(() => this.animate());

    const time = Date.now();

    // 1. Central Core Reactor Rotation & Breathing Pulse
    if (this.coreGroup) {
      this.innerCore.rotation.x += 0.008;
      this.innerCore.rotation.y += 0.012;
      this.ring1.rotation.z += 0.006;
      this.ring2.rotation.x += 0.005;

      const scale = 1 + Math.sin(time * 0.003) * 0.05;
      this.innerCore.scale.set(scale, scale, scale);
    }

    // 2. Swirling Deep-Space Starfield
    if (this.starfield) {
      this.starfield.rotation.z += 0.0003;
    }

    // 3. Each Entity Revolves INDEPENDENTLY on its own local axes
    this.nodes.forEach(node => {
      node.userData.mesh.rotation.x += node.userData.rotSpeed.x;
      node.userData.mesh.rotation.y += node.userData.rotSpeed.y;

      if (node.userData.subMesh) {
        node.userData.subMesh.rotation.y -= node.userData.rotSpeed.y * 1.5;
        node.userData.subMesh.rotation.z += node.userData.rotSpeed.x * 1.2;
      }

      // Gentle floating hover motion along Y
      node.position.y = node.userData.basePos.y + Math.sin(time * 0.0018 + node.userData.floatOffset) * 0.35;
    });

    // 4. Smooth Camera Flight with Subtle Mouse Parallax
    const mouseParallaxX = this.mouse.x * 1.2;
    const mouseParallaxY = this.mouse.y * 0.8;

    const desiredCamPos = this.targetCamPos.clone();
    desiredCamPos.x += mouseParallaxX;
    desiredCamPos.y += mouseParallaxY;

    this.camera.position.lerp(desiredCamPos, 0.055);
    this.currentLookAt.lerp(this.targetLookAt, 0.055);
    this.camera.lookAt(this.currentLookAt);

    // Update HUD Coordinates
    const coordX = document.getElementById('hud-coord-x');
    const coordY = document.getElementById('hud-coord-y');
    const coordZ = document.getElementById('hud-coord-z');
    if (coordX && coordY && coordZ) {
      coordX.textContent = this.camera.position.x.toFixed(2);
      coordY.textContent = this.camera.position.y.toFixed(2);
      coordZ.textContent = this.camera.position.z.toFixed(2);
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// ============================================================
// SYSTEM BOOTLOADER PRELOADER
// ============================================================
function initPreloader() {
  const preloader = document.getElementById('cyber-preloader');
  const bar = document.getElementById('preloader-bar');
  if (!preloader || !bar) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 25) + 15;
    if (progress >= 100) {
      progress = 100;
      bar.style.width = '100%';
      clearInterval(interval);
      setTimeout(() => {
        preloader.classList.add('fade-out');
      }, 350);
    } else {
      bar.style.width = `${progress}%`;
    }
  }, 75);
}

// ============================================================
// RESUME MODAL HANDLERS
// ============================================================
function openResumeModal() {
  const modal = document.getElementById('resume-modal');
  if (modal) {
    modal.classList.remove('hidden');
    if (window.cyberUniverse && window.cyberUniverse.audio) {
      window.cyberUniverse.audio.playClick();
    }
  }
}

function closeResumeModal() {
  const modal = document.getElementById('resume-modal');
  if (modal) {
    modal.classList.add('hidden');
    if (window.cyberUniverse && window.cyberUniverse.audio) {
      window.cyberUniverse.audio.playClick();
    }
  }
}

// ============================================================
// CLIPBOARD HELPER (WITH FALLBACK FOR FILE:// & LOCALHOST)
// ============================================================
function copyToClipboard(text, successMsg) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg);
    }).catch(() => {
      fallbackCopy(text, successMsg);
    });
  } else {
    fallbackCopy(text, successMsg);
  }
}

function fallbackCopy(text, successMsg) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(successMsg);
  } catch (err) {
    prompt("Copy transmission manually:", text);
  }
  document.body.removeChild(textArea);
}

// ============================================================
// TOAST HELPER
// ============================================================
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  const text = document.getElementById('toast-text');
  if (!toast || !text) return;

  text.textContent = msg;
  toast.classList.remove('hidden');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.add('hidden');
  }, 2400);
}

// ============================================================
// START UNIVERSE ON DOM READY
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  window.cyberUniverse = new CyberpunkUniverse();
});

