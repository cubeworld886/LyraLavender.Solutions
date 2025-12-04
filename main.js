// Lyra Labander Solutions — Interacciones, galaxia y constelación Lyra (v5)
(function () {
  document.documentElement.classList.remove('no-js');
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Loader + hero reveals
  window.addEventListener('load', () => {
    setTimeout(() => {
      const loader = $('#loader');
      if (loader) loader.classList.add('hidden');
    }, 320);
    $$('.fx-reveal-1, .fx-reveal-2, .fx-reveal-3, .fx-reveal-4').forEach(el => el.classList.add('show'));
  });

  // Año dinámico en footer
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Nav mobile
  const toggle = $('.nav-toggle');
  const menu = $('#menu');
  toggle?.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Scroll reveal (IntersectionObserver)
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  $$('.fx-item, .sector, .case').forEach(el => io.observe(el));

  // Tilt effect (3D cards)
  const tiltMax = 10; // grados
  function handleTilt(e) {
    const card = e.currentTarget;
    const b = card.getBoundingClientRect();
    const cx = b.left + b.width / 2;
    const cy = b.top + b.height / 2;
    const dx = (e.clientX - cx) / (b.width / 2);
    const dy = (e.clientY - cy) / (b.height / 2);
    card.style.transform = `rotateY(${dx * tiltMax}deg) rotateX(${-dy * tiltMax}deg)`;
  }
  function resetTilt(e) { e.currentTarget.style.transform = ''; }
  $$('.tilt').forEach(c => {
    c.addEventListener('mousemove', handleTilt);
    c.addEventListener('mouseleave', resetTilt);
    c.addEventListener('blur', resetTilt);
  });

  // Sectores interactivos (toggle estado activo)
  $$('.sector').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.sector').forEach(s => s.classList.remove('is-active'));
      btn.classList.add('is-active');
    });
  });

  // Casos interactivos (marker de activo)
  $$('[data-case]').forEach(card => {
    card.addEventListener('mouseenter', () => {
      $$('[data-case]').forEach(c => c.classList.remove('is-active'));
      card.classList.add('is-active');
    });
  });

  // Modal cotizador (multi‑paso)
  const modal = $('#cotizador');
  const openBtns = $$('[data-open-cotizador]');
  const closeBtn = $('[data-close-cotizador]');
  const steps = modal ? $$('.step', modal) : [];
  const nextBtn = modal ? $('[data-next]', modal) : null;
  const prevBtn = modal ? $('[data-prev]', modal) : null;
  const submitBtn = modal ? $('[data-submit]', modal) : null;
  let current = 0;

  function showStep(i) {
    steps.forEach((s, idx) => s.classList.toggle('active', idx === i));
    if (prevBtn) prevBtn.toggleAttribute('disabled', i === 0);
    if (nextBtn) nextBtn.hidden = (i === steps.length - 1);
    if (submitBtn) submitBtn.hidden = !(i === steps.length - 1);
    current = i;
  }

  if (modal) {
    openBtns.forEach(b => b.addEventListener('click', () => { modal.showModal(); showStep(0); }));
    closeBtn?.addEventListener('click', () => modal.close());
    prevBtn?.addEventListener('click', () => { showStep(Math.max(0, current - 1)); });
    nextBtn?.addEventListener('click', () => { showStep(Math.min(steps.length - 1, current + 1)); });

    // Rango de presupuesto con output
    const range = $('input[type="range"][name="presupuesto"]', modal);
    const out = $('output', modal);
    if (range && out) {
      const fmt = v => '$' + Number(v).toLocaleString('en-US', { maximumFractionDigits: 0 });
      out.value = fmt(range.value);
      range.addEventListener('input', () => out.value = fmt(range.value));
    }

    // Envío — abre mailto con resumen
    modal.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(e.target);
      const tipo = data.get('tipo');
      const industria = data.get('industria');
      const presupuesto = data.get('presupuesto');
      const nombre = data.get('nombre');
      const empresa = data.get('empresa') || '';
      const email = data.get('email');
      const tel = data.get('tel') || '';
      const notas = data.get('notas') || '';
      const resumen = `
Solicitud de propuesta — Lyra Labander Solutions
================================================

Tipo de proyecto: ${tipo}
Industria: ${industria}
Presupuesto estimado (USD): ${Number(presupuesto).toLocaleString('en-US')}

Contacto
Nombre: ${nombre}
Empresa: ${empresa}
Email: ${email}
Teléfono: ${tel}

Notas:
${notas}
`;
      const destino = 'contacto@lyralabander.com';
      const subject = `Solicitud de propuesta — ${nombre}`;
      const body = encodeURIComponent(resumen);
      window.location.href = `mailto:${destino}?subject=${encodeURIComponent(subject)}&body=${body}`;
      modal.close();
    });
  }

  // Personaje guía (orbe)
  const guide = $('[data-guide]');
  const guideTooltip = guide ? guide.querySelector('.guide-tooltip') : null;
  if (guide && guideTooltip) {
    const secServicios = $('#servicios');
    const secCasos = $('#casos');
    const secContacto = $('#contacto');
    const secMision = $('#t-mision-vision');
    const secValores = $('#t-valores');
    const secQuienes = $('#t-quienes');

    const getTop = (el) => el ? (el.getBoundingClientRect().top + (window.scrollY || window.pageYOffset)) : Infinity;

    const updateGuideText = () => {
      const y = window.scrollY || window.pageYOffset;
      const h = window.innerHeight || 800;

      if (secServicios) {
        const yServicios = getTop(secServicios);
        const yCasos = getTop(secCasos);
        const yContacto = getTop(secContacto);
        if (y < yServicios - h * 0.4) {
          guideTooltip.textContent = 'Explora los servicios que podemos construir contigo.';
        } else if (y < yCasos - h * 0.4) {
          guideTooltip.textContent = '¿Listo para ver casos y resultados reales?';
        } else if (y < yContacto - h * 0.4) {
          guideTooltip.textContent = 'Te acompaño hacia la sección de contacto.';
        } else {
          guideTooltip.textContent = '¿Agendamos el siguiente paso para tu proyecto?';
        }
      } else if (secMision) {
        const yValores = getTop(secValores);
        const yQuienes = getTop(secQuienes);
        if (y < yValores - h * 0.4) {
          guideTooltip.textContent = 'Conoce la misión y visión que guían nuestro trabajo.';
        } else if (y < yQuienes - h * 0.4) {
          guideTooltip.textContent = 'Revisa los valores que aplicamos en cada proyecto.';
        } else {
          guideTooltip.textContent = 'Te llevo directo a cómo podemos trabajar contigo.';
        }
      }
    };

    window.addEventListener('scroll', updateGuideText, { passive: true });
    updateGuideText();

    guide.addEventListener('click', () => {
      let target = $('#contrata') || $('#contacto') || $('#t-quienes') || $('#t-valores');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // ---------------------
  // Fondo estelar 2D optimizado
  // ---------------------
  const starCanvas = $('#starfield');
  const ctx = starCanvas ? starCanvas.getContext('2d', { alpha: true }) : null;
  let stars = [];
  let comets = [];
  let pointer = { x: window.innerWidth / 2, y: window.innerHeight / 3 };
  let galaxyPulse = 0;
  let starW = 0;
  let starH = 0;
  let starRunning = false;
  let starAnimationId = null;

  function resizeStarfield() {
    if (!starCanvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    const rect = starCanvas.getBoundingClientRect();
    starW = rect.width;
    starH = rect.height;
    starCanvas.width = Math.floor(rect.width * dpr);
    starCanvas.height = Math.floor(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const baseCount = Math.floor((starW * starH) / 14000);
    const count = Math.max(80, Math.min(baseCount, 200));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * starW,
      y: Math.random() * starH,
      r: Math.random() * 1.2 + 0.25,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.5 + 0.25
    }));
  }

  function spawnComet(x, y) {
    if (!ctx) return;
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.8 + Math.random() * 1.6;
    comets.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0,
      maxLife: 40 + Math.random() * 25
    });
    if (comets.length > 18) comets.shift();
  }

  function renderStarfield() {
    if (!ctx || !starW || !starH) return;
    ctx.clearRect(0, 0, starW, starH);

    const g = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, starW * 0.65);
    g.addColorStop(0, `rgba(167,139,250,${0.09 + galaxyPulse * 0.06})`);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, starW, starH);

    const len = stars.length;
    for (let i = 0; i < len; i++) {
      const s = stars[i];
      s.phase += 0.015 * s.speed;
      const alpha = (Math.sin(s.phase) + 1) / 2 * 0.7 + 0.15;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    for (let i = comets.length - 1; i >= 0; i--) {
      const c = comets[i];
      c.life++;
      c.x += c.vx;
      c.y += c.vy;
      const t = c.life / c.maxLife;
      const alpha = 1 - t;
      if (alpha <= 0) {
        comets.splice(i, 1);
        continue;
      }
      ctx.strokeStyle = `rgba(192,132,252,${alpha})`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(c.x, c.y);
      ctx.lineTo(c.x - c.vx * 4, c.y - c.vy * 4);
      ctx.stroke();
    }

    starAnimationId = requestAnimationFrame(renderStarfield);
  }

  function initStarfield() {
    if (!starCanvas || !ctx) return;
    resizeStarfield();
    if (!starRunning) {
      starRunning = true;
      starAnimationId = requestAnimationFrame(renderStarfield);
    }
  }

  if (!prefersReducedMotion && starCanvas && ctx) {
    const ro = new ResizeObserver(() => {
      resizeStarfield();
    });
    ro.observe(starCanvas);

    window.addEventListener('pointermove', (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY * 0.7;
    });
    window.addEventListener('pointerdown', (e) => {
      spawnComet(e.clientX, e.clientY);
      galaxyPulse = 1;
    });
  }

  // ---------------------
  // Parallax de nebulosas
  // ---------------------
  const nebulas = $$('.nebula');
  function handleScroll() {
    const y = window.scrollY || window.pageYOffset;
    const factor = y * 0.015;
    nebulas.forEach((n, i) => {
      const depth = (i + 1) * 5;
      n.style.transform = `translate3d(0, ${-factor * depth}px, 0)`;
    });
  }
  if (!prefersReducedMotion) {
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // ---------------------
  // THREE.js 3D — Constelación de Lyra con coordenadas aproximadas reales
  // ---------------------
  // ---------------------
// THREE.js 3D — Constelación de Lyra refinada
// ---------------------
function initThree() {
  if (!window.THREE || prefersReducedMotion) return;
  const root = $('#three-root');
  if (!root) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    50,
    root.clientWidth / root.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0.2, 8.5);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.setSize(root.clientWidth, root.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  root.appendChild(renderer.domElement);

  // Luces: menos agresivas para que no se haga una mancha
  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);
  const key = new THREE.PointLight(0x9b6bff, 0.9);
  key.position.set(6, 4, 6);
  scene.add(key);
  const rim = new THREE.PointLight(0xc084fc, 0.6);
  rim.position.set(-6, -2, -4);
  scene.add(rim);

  // -----------------------------
  // Constelación de Lyra
  // -----------------------------
  // RA (horas), Dec (grados), magnitud aproximada
  const lyraEquatorial = [
    { name: 'Vega',   raHours: 18.6156, decDeg: 38.7836, mag: 0.0 },
    { name: 'Sheliak',raHours: 18.8344, decDeg: 33.3628, mag: 3.4 },
    { name: 'Sulafat',raHours: 18.9822, decDeg: 32.6894, mag: 3.3 },
    { name: 'Delta2', raHours: 18.9086, decDeg: 36.9686, mag: 4.3 },
    { name: 'Zeta1',  raHours: 18.7461, decDeg: 37.6036, mag: 4.3 }
  ];

  const toRad = Math.PI / 180;
  const raCenter = lyraEquatorial.reduce((acc, s) => acc + s.raHours, 0) / lyraEquatorial.length;
  const decCenter = lyraEquatorial.reduce((acc, s) => acc + s.decDeg, 0) / lyraEquatorial.length;

  // Escalas para proyectar RA/Dec a un plano visible
  const scaleX = 0.25;
  const scaleY = 0.35;

  // Proyección a plano RA/Dec normalizado
  const prelimStars = lyraEquatorial.map((s, idx) => {
    const dRaDeg = (s.raHours - raCenter) * 15;      // diferencia en grados de RA
    const dDecDeg = (s.decDeg - decCenter);          // diferencia en grados de Dec
    const x = dRaDeg * Math.cos(decCenter * toRad) * scaleX;
    const y = dDecDeg * scaleY;
    const z = (idx - (lyraEquatorial.length - 1) / 2) * 0.08; // ligera profundidad
    return { name: s.name, mag: s.mag, x, y, z };
  });

  // Centramos el conjunto en el origen
  let cx = 0, cy = 0, cz = 0;
  prelimStars.forEach(s => { cx += s.x; cy += s.y; cz += s.z; });
  cx /= prelimStars.length; cy /= prelimStars.length; cz /= prelimStars.length;

  const centeredStars = prelimStars.map(s => ({
    name: s.name,
    mag: s.mag,
    pos: [s.x - cx, s.y - cy, s.z - cz]
  }));

  const magMin = Math.min(...centeredStars.map(s => s.mag));
  const magMax = Math.max(...centeredStars.map(s => s.mag));

  const lyraGroup = new THREE.Group();
  scene.add(lyraGroup);

  const starBaseGeo = new THREE.SphereGeometry(0.1, 26, 26);
  const glowBaseGeo = new THREE.SphereGeometry(0.3, 24, 24);
  const lyraStars = [];

  centeredStars.forEach((d, idx) => {
    const t = (d.mag - magMin) / (magMax - magMin || 1);
    const scale = 1.3 - t * 0.4;     // Vega más grande, otras más pequeñas
    const pulse = 1.4 - t * 0.5;     // Vega con pulso más fuerte

    const color = idx === 0 ? 0xe5edff : 0xf9f5ff; // Vega un poco más azul
    const starMat = new THREE.MeshBasicMaterial({ color });
    const star = new THREE.Mesh(starBaseGeo, starMat);
    star.position.set(d.pos[0], d.pos[1], d.pos[2]);
    star.scale.setScalar(scale);
    lyraGroup.add(star);

    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x9f7aea,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const glow = new THREE.Mesh(glowBaseGeo, glowMat);
    glow.position.copy(star.position);
    glow.scale.setScalar(scale * 1.6);
    lyraGroup.add(glow);

    lyraStars.push({
      star,
      glow,
      baseOpacity: 0.12 + 0.08 * pulse,
      pulseStrength: 0.18 * pulse,
      phase: Math.random() * Math.PI * 2
    });
  });

  // Líneas que dibujan la figura de la constelación (usando índices de centeredStars)
  const starPositions = centeredStars.map(s => new THREE.Vector3(s.pos[0], s.pos[1], s.pos[2]));
  const connections = [
    [0, 4], // Vega - Zeta1
    [0, 3], // Vega - Delta2
    [4, 3], // Zeta1 - Delta2
    [3, 1], // Delta2 - Sheliak
    [1, 2], // Sheliak - Sulafat
    [2, 0]  // Sulafat - Vega
  ];
  const linePoints = [];
  connections.forEach(([a, b]) => {
    linePoints.push(starPositions[a], starPositions[b]);
  });
  const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x9f7aea,
    transparent: true,
    opacity: 0.75
  });
  const lines = new THREE.LineSegments(lineGeo, lineMat);
  lyraGroup.add(lines);

  // Halo alrededor de toda la constelación
  const haloGeo = new THREE.RingGeometry(1.5, 2.8, 84);
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0x4c1d95,
    transparent: true,
    opacity: 0.22,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  const halo = new THREE.Mesh(haloGeo, haloMat);
  halo.rotation.x = Math.PI / 2.15;
  halo.position.z = -0.6;
  lyraGroup.add(halo);

  // Ajuste inicial de orientación y escala
  lyraGroup.rotation.x = 0.3;
  lyraGroup.rotation.z = Math.PI * 0.04;
  lyraGroup.scale.setScalar(1.5);

  // Estrellas 3D de fondo
  const starGeo3D = new THREE.BufferGeometry();
  const COUNT = 450;
  const starPos3D = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT * 3; i += 3) {
    const r = 30 * Math.random() + 14;
    const phi = Math.random() * Math.PI * 2;
    const costheta = Math.random() * 2 - 1;
    const theta = Math.acos(costheta);
    starPos3D[i]     = r * Math.sin(theta) * Math.cos(phi);
    starPos3D[i + 1] = r * Math.sin(theta) * Math.sin(phi);
    starPos3D[i + 2] = r * Math.cos(theta);
  }
  starGeo3D.setAttribute('position', new THREE.BufferAttribute(starPos3D, 3));
  const starMat3D = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, sizeAttenuation: true });
  const stars3D = new THREE.Points(starGeo3D, starMat3D);
  scene.add(stars3D);

  // Resize
  const resize = () => {
    const w = root.clientWidth, h = root.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(root);

  // Parallax & boost con puntero
  const parallax = { x: 0, y: 0 };
  let isPointerDown = false;
  let boost = 0;
  let lastT = performance.now();

  window.addEventListener('pointermove', (e) => {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    parallax.x = nx;
    parallax.y = ny;
  });

  window.addEventListener('pointerdown', () => { isPointerDown = true; });
  window.addEventListener('pointerup', () => { isPointerDown = false; });
  window.addEventListener('pointerleave', () => { isPointerDown = false; });

  function tick(now) {
    const dt = Math.min((now - lastT) / 1000, 0.04);
    lastT = now;

    const targetBoost = isPointerDown ? 1 : 0;
    boost += (targetBoost - boost) * 4 * dt;
    galaxyPulse += ((isPointerDown ? 1 : 0) - galaxyPulse) * 3 * dt;

    // Rotación base + respuesta al usuario
    const spinBase = 0.18;
    const spinBoost = 0.55;
    const parallaxTiltX = parallax.y * 0.18;
    const parallaxTiltZ = parallax.x * 0.18;

    lyraGroup.rotation.y += (spinBase + spinBoost * boost) * dt;
    lyraGroup.rotation.x = 0.3 + parallaxTiltX;
    lyraGroup.rotation.z = Math.PI * 0.04 + parallaxTiltZ;
    halo.rotation.z += 0.045 * dt;

    // Escala sutil con boost
    const scaleBase = 1.5;
    const scaleBoost = 0.12;
    const s = scaleBase + scaleBoost * boost;
    lyraGroup.scale.setScalar(s);

    // Pulso de brillo en las estrellas
    const t = now * 0.0016;
    lyraStars.forEach((sData, idx) => {
      const osc = (Math.sin(sData.phase + t * (1.2 + idx * 0.18)) + 1) / 2;
      const factor = sData.baseOpacity + osc * sData.pulseStrength * (0.6 + 0.4 * boost);
      sData.glow.material.opacity = factor;
    });

    // Varia opacidad de líneas y halo con la interacción
    lineMat.opacity = 0.55 + 0.35 * (0.3 + boost);
    haloMat.opacity = 0.18 + 0.28 * (0.3 + boost);

    // Parallax de cámara
    camera.position.x += (parallax.x * 0.8 - camera.position.x) * 0.06;
    camera.position.y += (-parallax.y * 0.5 - camera.position.y) * 0.06;
    camera.lookAt(0, 0, 0);

    // Lento giro de estrellas de fondo
    stars3D.rotation.y -= 0.035 * dt;

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

  window.addEventListener('load', () => {
    if (!prefersReducedMotion) {
      initStarfield();
      initThree();
    }
  });

})();