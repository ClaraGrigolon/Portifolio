/**
 * PORTFÓLIO ANA CLARA GRIGOLON - SCRIPT.JS
 * Funcionalidades Integradas:
 * 1. Micro-interações do Cursor Dinâmico com interpolação suave (Inspiração Immersive-G)
 * 2. Sistema de Pontos de Luz no Hero com Física de Repulsão do Cursor (Inspiração Libellulaweb + Física Dinâmica)
 * 3. Divisória Tecnológica de Dados / Mapa Mundial em Código Monospace (Inspiração Anthracite Studio i2)
 *    - Sem blocos delimitadores
 *    - Ponto de luz que surge e segue o cursor exclusivamente ao sobrevoar o mapa
 *    - Iluminação em tempo real dos caracteres tipográficos
 * 4. Sistema de Tema (Dark / Light Mode) com persistência em localStorage
 * 5. Header Flutuante em Pill dinâmico & Ativação de Seção ao Rolar
 * 6. Menu Mobile Responsivo e Acessível (WAI-ARIA)
 * 7. Micro-interações 3D (Tilt Effect) nos 10 cards de projetos (Inspiração DriveBerry & Immersive-G)
 * 8. Scroll Reveal fluído com IntersectionObserver
 * 9. Validação interativa do formulário de contato com Toast Notification de feedback
 * 10. Atualização dinâmica do ano de copyright no rodapé
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. CURSOR PERSONALIZADO INTERATIVO (Inspiração Immersive-G)
     ========================================================================== */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  if (cursorDot && cursorRing && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let isCursorVisible = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isCursorVisible) {
        cursorDot.style.opacity = '1';
        cursorRing.style.opacity = '1';
        isCursorVisible = true;
      }

      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    });

    window.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
      isCursorVisible = false;
    });

    function renderCursorRing() {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(renderCursorRing);
    }
    requestAnimationFrame(renderCursorRing);

    const interactiveElements = document.querySelectorAll('a, button, [data-cursor], .interactive-card, .tech-badge-card');

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        const cursorType = el.getAttribute('data-cursor') || (el.classList.contains('interactive-card') ? 'card' : 'link');

        if (cursorType === 'card') {
          cursorRing.classList.add('cursor-hover-card');
        } else {
          cursorRing.classList.add('cursor-hover-link');
        }
      });

      el.addEventListener('mouseleave', () => {
        cursorRing.classList.remove('cursor-hover-link', 'cursor-hover-card');
      });
    });
  }

        /* ==========================================================================
     2. PONTOS DE LUZ NO HERO COM FÍSICA DE REPULSÃO DO CURSOR
     - Área de brilho ampla, radiante e luminosa
     - Movimento autônomo suave com física de repulsão ao aproximar o mouse
     ========================================================================== */
  function initHeroParticles() {
    const hero = document.getElementById('hero');
    const canvas = document.getElementById('hero-particles-canvas');
    if (!hero || !canvas) return;

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;
    let particles = [];
    const PARTICLE_COUNT = 55;

    const mouse = { x: -9999, y: -9999, active: false };

    function resize() {
      const rect = hero.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }
    resize();
    window.addEventListener('resize', resize);

    const colorPalettes = [
      { core: '#FFFFFF', glow1: 'rgba(255, 255, 255, 0.85)', glow2: 'rgba(245, 187, 141, 0.45)' }, // Pêssego estelar
      { core: '#F5BB8D', glow1: 'rgba(245, 187, 141, 0.80)', glow2: 'rgba(206, 47, 47, 0.35)' },   // Pêssego luminoso
      { core: '#CE2F2F', glow1: 'rgba(206, 47, 47, 0.75)',   glow2: 'rgba(206, 47, 47, 0.22)' },   // Vermelho vivo
      { core: '#E0EAFF', glow1: 'rgba(145, 200, 255, 0.80)', glow2: 'rgba(90, 145, 255, 0.32)' }   // Ciano elétrico
    ];

    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const col = colorPalettes[i % colorPalettes.length];
      const speed = 0.30 + Math.random() * 0.42;
      const angle = Math.random() * Math.PI * 2;
      particles.push({
        x: Math.random() * (width || window.innerWidth),
        y: Math.random() * (height || window.innerHeight),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        baseVx: Math.cos(angle) * speed,
        baseVy: Math.sin(angle) * speed,
        radius: 1.8 + Math.random() * 2.2,
        glowRadius: 12.0 + Math.random() * 18.0, // Área de brilho ampla e radiante
        coreColor: col.core,
        glow1: col.glow1,
        glow2: col.glow2,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.025
      });
    }

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });

    hero.addEventListener('mouseleave', () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    });

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      const repelRadius = 160;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 1. Repulsão pelo cursor do mouse
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < repelRadius && dist > 1) {
            const force = (1 - (dist / repelRadius)) * 5.0;
            const angle = Math.atan2(dy, dx);
            p.vx += Math.cos(angle) * force;
            p.vy += Math.sin(angle) * force;
          }
        }

        // 2. Amortecimento & restauração de velocidade autônoma
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.vx += (p.baseVx - p.vx) * 0.04;
        p.vy += (p.baseVy - p.vy) * 0.04;

        p.x += p.vx;
        p.y += p.vy;

        // 3. Reaparecimento contínuo nas bordas
        if (p.x < -30) p.x = width + 30;
        else if (p.x > width + 30) p.x = -30;
        if (p.y < -30) p.y = height + 30;
        else if (p.y > height + 30) p.y = -30;

        // 4. Pulsação luminescente
        p.pulse += p.pulseSpeed;
        const curRadius = Math.max(1.2, p.radius + Math.sin(p.pulse) * 0.5);
        const curGlow = p.glowRadius + Math.sin(p.pulse) * 4.5;

        // Halo de brilho amplo e radiante
        const glowGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, curGlow);
        glowGrad.addColorStop(0, p.glow1);
        glowGrad.addColorStop(0.35, p.glow2);
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, curGlow, 0, Math.PI * 2);
        ctx.fill();

        // Ponto de luz central incandescente
        ctx.fillStyle = p.coreColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, curRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(animateParticles);
    }
    requestAnimationFrame(animateParticles);
  }
  initHeroParticles();

    /* ==========================================================================
     3. DIVISÓRIA TECNOLÓGICA: CRIAÇÃO DE ADÃO EM CÓDIGO MONOSPACE (ALTA DEFINIÇÃO)
     - Matriz de alta densidade (56 linhas x 175 colunas) para definição máxima
     - Iluminação calibrada e elegante (raio controlado de 180px - 210px)
     - Destaque nítido e vivo aos caracteres sob o cursor, sem ofuscar ou clarear o fundo
     ========================================================================== */
  function initConstellationMap() {
    const canvas = document.getElementById('constellation-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    // Matriz de caracteres tipográficos de alta definição (56x175)
    const ASCII_MAP_ROWS = ["                                                                                                                                                                           DA9 ","                                                                                                                                                                        PYPY 6D","                                                                                                                                                                    SF5RZ F8GDJ","                                                                                                                                                                91TCL6 HNKT5Z1Q","                                                                                                                                                             IG28HM A8SFN8189 P","                                                                                                                                                         DI4JQ1L N5JTG3ZVD9F U0","                                                                                                                                                      9JH YB WLE5D2L P0KGU 4W2W","                                                                                                                                                  MIR2AC V6J0G65X 7DNBBC9 X23GN","                                                                                                                                              ECDF6  U 9PCU JFGAFHIJH7L GX8D378","                                                                                                                                       6T7FRK8  XM2M N32U38QWQC  L1DQ QF71P81E6","                                                                                                                              0LRZI14R   XYDPKOAQ9 39JAG30MKCONST  F  UNCTIONRE","                                                                                                                        NDERC    REATIONA DAMSYS TEMLOGICALG  ODATAASYNCAW    A","                                                                                                                    ITMESHVECTORNODE0101HEX HASHA    SCIIDOMHTML5CSS3JSUIUXBY  ","                                                                                                              T E TOKENARRA            YOBJE C TMATRIXF8QJVEL78PNQ7G           ","                                                                                                            R R3WESOXM 2M534N9SOPAITNCMECZT   OFFE CF N5 04                    ","                                                                                                          3S 8GNGR R165A J0Q053WC9B4DA9PYPY6DSF5RZF8G D                        ","                                                                                                        J91  T CL6H NKT5Z1Q IG28HMA8SFN818 9PDI4JQ1L                           ","                                                                                                      N5J TG3 ZVD 9F U09JHYBWLE  5D2LP0KG U4W 2WM                              ","                                                                                                    IR2 ACV6J  0G65X    7DNBBC9X23GNECDF 6U9P CU                               ","                                                                                                 J FG   AFHI JH  7LGX8 D3786T7FRK8 XM2MN3 2U                                   ","                                                                                                3 8QWQ CL1 DQQ F71 P8 1E60L RZI14R XY DPKO                                     ","                                                                                               AQ9 39J AG30M KC ON  STFUNCT IONREN   D                                         ","                                                                                               ERCREAT  I  O NADA M SYSTEML   O GI                                             ","                                                                                      0      1°C ALGO  DAT AAS   YNCAWAITM E                                                   ","                                                                           *                  *S H     VECTOR  N OD E 01 0                                                     ","                                                                                           0 °01HE     XHA   SHA SCII   DOM                                                    ","                                                                            °:0:++:+1 +:    0 *HT      ML5  CSS3 JS UIUXB                                                      ","                                                                     YTETO:1   ::°+0+       1°          KEN A  R   RAY  OBJECT                                                 ","                                                                M      ATR·1                             IXF8QJ  VEL78PN Q 7GRR                                                ","                                                            3WESOXM2 M     0             0                53 4N9    SOPAI    TN                                                ","                                                         CMEC Z T OF            °                         F ECF N   5  043                                                     ","                                                     S8G  NGR R165                                         A J0Q       05                                                      ","                                                  3WC 9B4DA9PYPY    6DSF5R*1                                                                                                   ","                                            ZF 8G DJ91TCL6 HNKT 5Z1QIG28H   MA8SF                                                                                              ","                                        N81 8 9PDI4JQ1LN5JTG3 ZV D9FU0      9JH  YBWL                                                                                          ","                                  E 5D2L P 0KGU4W2WMIR2ACV6J 0G6                      5X7                                                                                      ","                               DNB BC 9 X23GNECDF   6U9PCU JFG AFHIJH7LGX            8D  378                                                                                   ","                            6T7FRK8 X  M2MN32U38QWQCL                   1DQQF           71P81                                                                                  ","                          E   60  LRZI14RXYDP  KOAQ9  39JAG30MKCONSTFUNC   TION                                                                                                ","                        REND  E R CREATION ADAMS  YSTEMLOGICALGOD ATAASYNC A WAIT                                                                                              ","                     MESH VECTOR  NODE0 10 1H EXHASHASCIIDOMHT                  ML5                                                                                            ","                   CSS3 JSUI UX B YT ETOKEN  ARRAYOBJE        CTMAT RI           X F8                                                                                          ","                QJVE L78PNQ7GRR 3W ESOXM2 M534N9SOPA              I TNC           ME CZ                                                                                        ","              T OF FECF N 5 043S8GNG RR 165AJ                       0Q0             53 W                                                                                       ","           C9B4D A9PYPY6 DSF5R ZF8GD                                  J                                                                                                        ","         91TCL 6HNKT5Z1 QIG28H MA8S                                    FN8                                                                                                     ","       18  9 PDI4JQ1LN 5JTG3ZV D9F                                      U 0                                                                                                    ","    9 JHYBWLE5D2   LP0KGU4W2WM IR                                                                                                                                              ","  2ACV6J0 G65X7DNBBC9X23GNE                                                                                                                                                    ","CDF 6U9PCUJFGAF HIJH7 LGX8D3  7                                                                                                                                                ","86 T7F RK8XM2 MN32U38 Q  WQCL1D                                                                                                                                                ","Q QF 71P81E60L RZI1 4 RXYDPK O                                                                                                                                                 "," AQ939JAG30MKC  ONSTF UNCTIONR                                                                                                                                                 ","E NDERCREA TIONA DAMS YST EML                                                                                                                                                  "," OGICA LGODATAASYNCAW AI TMES                                                                                                                                                  ","H VECTORNODE0101HEX H  ASHAS                                                                                                                                                   "];

    const AMBIENT_OCEAN_CHARS = ['E', '8', 'T', 'Z', 'W', 'Q', 'V', '5', 'U', 'B', '0', 'X', 'K', '1', '7', '+'];

    const totalRows = ASCII_MAP_ROWS.length;
    let maxCols = 0;
    ASCII_MAP_ROWS.forEach(r => { if (r.length > maxCols) maxCols = r.length; });

    // Construção de grade estática de caracteres
    const gridChars = [];
    for (let r = 0; r < totalRows; r++) {
      const rowStr = ASCII_MAP_ROWS[r] || '';
      for (let c = 0; c < maxCols; c++) {
        const char = rowStr[c] || ' ';
        if (char !== ' ') {
          const isSpark = ['*', '+', '·', '°', ':', '1', '0'].includes(char);
          gridChars.push({ r, c, char, isHand: true, isSpark });
        } else if (Math.random() < 0.048) {
          // Caracteres ambientais sutis de fundo (estilo Anthracite Studio)
          const ambChar = AMBIENT_OCEAN_CHARS[Math.floor(Math.random() * AMBIENT_OCEAN_CHARS.length)];
          gridChars.push({ r, c, char: ambChar, isHand: false, isSpark: false });
        }
      }
    }

    // Estado do ponto de luz interativo (restrito à área da composição)
    let isHovering = false;
    let mouseX = -9999;
    let mouseY = -9999;
    let beaconX = -9999;
    let beaconY = -9999;
    let beaconAlpha = 0;
    let targetAlpha = 0;

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    canvas.addEventListener('mouseenter', () => {
      isHovering = true;
      targetAlpha = 1;
    });

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;

      if (!isHovering) {
        isHovering = true;
        targetAlpha = 1;
        beaconX = mouseX;
        beaconY = mouseY;
      }
    });

    canvas.addEventListener('mouseleave', () => {
      isHovering = false;
      targetAlpha = 0;
    });

    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.touches[0].clientX - rect.left;
        mouseY = e.touches[0].clientY - rect.top;
        beaconX = mouseX;
        beaconY = mouseY;
        isHovering = true;
        targetAlpha = 1;
      }
    }, { passive: true });

    canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.touches[0].clientX - rect.left;
        mouseY = e.touches[0].clientY - rect.top;
        isHovering = true;
        targetAlpha = 1;
      }
    }, { passive: true });

    canvas.addEventListener('touchend', () => {
      isHovering = false;
      targetAlpha = 0;
    });

    function renderCreationHands() {
      ctx.clearRect(0, 0, width, height);

      // Suavização do movimento e opacidade
      beaconAlpha += (targetAlpha - beaconAlpha) * 0.12;
      beaconX += (mouseX - beaconX) * 0.18;
      beaconY += (mouseY - beaconY) * 0.18;

      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

      // Área de luz calibrada: mais elegante e focada (150px a 220px)
      const lightRadius = Math.max(140, Math.min(210, width * 0.16));

      // Dimensões proporcionais em tela cheia de alta definição
      const charWidth = (width / maxCols) * 0.98;
      const charHeight = (height / totalRows) * 0.96;
      const startX = (width - maxCols * charWidth) / 2;
      const startY = (height - totalRows * charHeight) / 2;
      const fontSize = Math.max(7.2, Math.min(13.5, charHeight * 0.92));

      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';

      // 1. AURA SUAVE DE FUNDO (Transparente e sutil, para não ofuscar nem lavar os caracteres)
      if (beaconAlpha > 0.01) {
        ctx.save();
        const radialGrad = ctx.createRadialGradient(beaconX, beaconY, 0, beaconX, beaconY, lightRadius);
        if (isDark) {
          // Halo delicado em tons de azul celeste e violeta suave
          radialGrad.addColorStop(0, 'rgba(125, 185, 255, ' + (0.22 * beaconAlpha) + ')');
          radialGrad.addColorStop(0.35, 'rgba(75, 130, 245, ' + (0.12 * beaconAlpha) + ')');
          radialGrad.addColorStop(0.75, 'rgba(40, 75, 200, ' + (0.04 * beaconAlpha) + ')');
          radialGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else {
          // Modo claro: Halo translúcido em pêssego suave
          radialGrad.addColorStop(0, 'rgba(245, 187, 141, ' + (0.28 * beaconAlpha) + ')');
          radialGrad.addColorStop(0.40, 'rgba(206, 47, 47, ' + (0.10 * beaconAlpha) + ')');
          radialGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        }

        ctx.fillStyle = radialGrad;
        ctx.beginPath();
        ctx.arc(beaconX, beaconY, lightRadius, 0, Math.PI * 2);
        ctx.fill();

        // Ponto de luz estelar delicado no centro do cursor
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = isDark ? '#90C5FF' : '#F5BB8D';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(beaconX, beaconY, 3.0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 2. RENDERIZAÇÃO DOS CARACTERES TIPOGRÁFICOS DE ALTA DEFINIÇÃO
      for (let i = 0; i < gridChars.length; i++) {
        const item = gridChars[i];
        const posX = startX + item.c * charWidth + charWidth / 2;
        const posY = startY + item.r * charHeight + charHeight / 2;

        let charColor = '';
        let isHighlighted = false;

        // Quando o farol passa pelo desenho, dá DESTAQUE MÁXIMO aos caracteres, tornando-os mais nítidos e vivos
        if (beaconAlpha > 0.01) {
          const dx = posX - beaconX;
          const dy = posY - beaconY;
          const dist = Math.hypot(dx, dy);

          if (dist < lightRadius) {
            const factor = (1 - (dist / lightRadius)) * beaconAlpha;

            if (dist < 40) {
              // Núcleo: Branco brilhante com alta nitidez (faz o desenho saltar com clareza total)
              charColor = 'rgba(255, 255, 255, ' + Math.min(1, 0.96 + factor * 0.04) + ')';
              isHighlighted = true;
            } else if (dist < 100) {
              // Halo intermediário: Ciano elétrico vivo ou Vermelho rubi vibrante
              charColor = isDark
                ? 'rgba(135, 195, 255, ' + Math.min(1, 0.85 + factor * 0.15) + ')'
                : 'rgba(206, 47, 47, ' + Math.min(1, 0.85 + factor * 0.15) + ')';
              isHighlighted = true;
            } else {
              // Transição suave da luz
              charColor = isDark
                ? 'rgba(95, 145, 235, ' + (0.65 + factor * 0.25) + ')'
                : 'rgba(235, 120, 110, ' + (0.65 + factor * 0.25) + ')';
            }
          }
        }

        // Cor padrão dos caracteres fora do alcance do farol (visíveis e elegantes)
        if (!charColor) {
          if (item.isSpark) {
            charColor = isDark ? 'rgba(165, 205, 255, 0.85)' : 'rgba(206, 47, 47, 0.85)';
          } else if (item.isHand) {
            // Mãos no estado padrão: bem visíveis e contrastantes
            charColor = isDark ? 'rgba(78, 106, 155, 0.82)' : 'rgba(96, 96, 133, 0.78)';
          } else {
            // Caracteres oceânicos de fundo sutis
            charColor = isDark ? 'rgba(38, 52, 80, 0.18)' : 'rgba(155, 158, 151, 0.18)';
          }
        }

        ctx.font = (isHighlighted ? 'bold ' : '') + fontSize + 'px monospace';
        ctx.fillStyle = charColor;
        ctx.fillText(item.char, posX, posY);
      }

      requestAnimationFrame(renderCreationHands);
    }
    requestAnimationFrame(renderCreationHands);
  }
  initConstellationMap();

/* ==========================================================================
     4. SISTEMA DE TEMA (LIGHT / DARK MODE)
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;
  const THEME_STORAGE_KEY = 'anagrigolon_theme_preference';

  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);

    if (themeToggleBtn) {
      const isDark = theme === 'dark';
      themeToggleBtn.setAttribute('aria-label', isDark ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro');
      themeToggleBtn.setAttribute('title', isDark ? 'Ativar Modo Claro' : 'Ativar Modo Escuro');
    }
  }

  applyTheme(getPreferredTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  /* ==========================================================================
     5. HEADER FLUTUANTE EM PILL & MENU DE NAVEGAÇÃO
     ========================================================================== */
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const pillNav = document.getElementById('pill-nav');
  const navAnchors = document.querySelectorAll('.nav-anchor');
  const sections = document.querySelectorAll('section[id]');

  function handleHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 25) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  function highlightActiveNavLink() {
    const scrollPosition = window.scrollY + 130;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navAnchors.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', () => {
    handleHeaderScroll();
    highlightActiveNavLink();
  }, { passive: true });

  handleHeaderScroll();

  /* ==========================================================================
     6. MENU MOBILE RESPONSIVO
     ========================================================================== */
  if (mobileToggle && pillNav) {
    const toggleMenu = () => {
      const isOpen = pillNav.classList.toggle('open');
      mobileToggle.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
      mobileToggle.setAttribute('aria-label', isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
    };

    mobileToggle.addEventListener('click', toggleMenu);

    navAnchors.forEach((link) => {
      link.addEventListener('click', () => {
        if (pillNav.classList.contains('open')) {
          toggleMenu();
        }
      });
    });

    document.addEventListener('click', (event) => {
      if (
        pillNav.classList.contains('open') &&
        !pillNav.contains(event.target) &&
        !mobileToggle.contains(event.target)
      ) {
        toggleMenu();
      }
    });
  }

  /* ==========================================================================
     7. MICRO-INTERAÇÕES 3D (TILT EFFECT) NOS 10 CARDS DE PROJETOS
     Inspirado em DriveBerry & Immersive-G
     ========================================================================== */
  const tiltCards = document.querySelectorAll('[data-tilt]');

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const cardWidth = rect.width;
        const cardHeight = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = (mouseX / cardWidth) - 0.5;
        const yPct = (mouseY / cardHeight) - 0.5;

        const rotateX = (-yPct * 8).toFixed(2);
        const rotateY = (xPct * 8).toFixed(2);

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ==========================================================================
     8. SCROLL REVEAL (INTERSECTION OBSERVER)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('active'));
  }

  /* ==========================================================================
     9. FORMULÁRIO DE CONTATO & VALIDAÇÃO DINÂMICA
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');
  const submitBtn = document.getElementById('submit-btn');

  const toast = document.getElementById('toast');
  const toastTitle = document.getElementById('toast-title');
  const toastDesc = document.getElementById('toast-desc');
  const toastClose = document.getElementById('toast-close');
  let toastTimer = null;

  function showToast(title, message, isSuccess = true) {
    if (!toast) return;

    if (toastTitle) toastTitle.textContent = title;
    if (toastDesc) toastDesc.textContent = message;

    toast.style.borderLeftColor = isSuccess ? '#10B981' : '#EF4444';
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 5000);
  }

  if (toastClose) {
    toastClose.addEventListener('click', () => {
      if (toast) toast.classList.remove('show');
      if (toastTimer) clearTimeout(toastTimer);
    });
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(email.trim());
  }

  function setFieldError(input, errorElementId, message) {
    input.classList.add('has-error');
    input.classList.remove('is-valid');
    const errorEl = document.getElementById(errorElementId);
    if (errorEl) {
      errorEl.textContent = message;
    }
  }

  function clearFieldError(input, errorElementId) {
    input.classList.remove('has-error');
    input.classList.add('is-valid');
    const errorEl = document.getElementById(errorElementId);
    if (errorEl) {
      errorEl.textContent = '';
    }
  }

  if (nameInput) {
    nameInput.addEventListener('input', () => {
      if (nameInput.value.trim().length >= 3) {
        clearFieldError(nameInput, 'error-name');
      }
    });
  }

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      if (isValidEmail(emailInput.value)) {
        clearFieldError(emailInput, 'error-email');
      }
    });
  }

  if (subjectInput) {
    subjectInput.addEventListener('input', () => {
      if (subjectInput.value.trim().length >= 3) {
        clearFieldError(subjectInput, 'error-subject');
      }
    });
  }

  if (messageInput) {
    messageInput.addEventListener('input', () => {
      if (messageInput.value.trim().length >= 10) {
        clearFieldError(messageInput, 'error-message');
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isFormValid = true;
      let firstInvalidInput = null;

      if (!nameInput.value.trim()) {
        setFieldError(nameInput, 'error-name', 'Por favor, informe seu nome.');
        isFormValid = false;
        if (!firstInvalidInput) firstInvalidInput = nameInput;
      } else if (nameInput.value.trim().length < 3) {
        setFieldError(nameInput, 'error-name', 'O nome deve ter no mínimo 3 caracteres.');
        isFormValid = false;
        if (!firstInvalidInput) firstInvalidInput = nameInput;
      } else {
        clearFieldError(nameInput, 'error-name');
      }

      if (!emailInput.value.trim()) {
        setFieldError(emailInput, 'error-email', 'Por favor, informe seu e-mail.');
        isFormValid = false;
        if (!firstInvalidInput) firstInvalidInput = emailInput;
      } else if (!isValidEmail(emailInput.value)) {
        setFieldError(emailInput, 'error-email', 'Por favor, insira um e-mail válido.');
        isFormValid = false;
        if (!firstInvalidInput) firstInvalidInput = emailInput;
      } else {
        clearFieldError(emailInput, 'error-email');
      }

      if (!subjectInput.value.trim()) {
        setFieldError(subjectInput, 'error-subject', 'Por favor, informe o assunto da mensagem.');
        isFormValid = false;
        if (!firstInvalidInput) firstInvalidInput = subjectInput;
      } else if (subjectInput.value.trim().length < 3) {
        setFieldError(subjectInput, 'error-subject', 'O assunto deve ter pelo menos 3 caracteres.');
        isFormValid = false;
        if (!firstInvalidInput) firstInvalidInput = subjectInput;
      } else {
        clearFieldError(subjectInput, 'error-subject');
      }

      if (!messageInput.value.trim()) {
        setFieldError(messageInput, 'error-message', 'Por favor, escreva sua mensagem.');
        isFormValid = false;
        if (!firstInvalidInput) firstInvalidInput = messageInput;
      } else if (messageInput.value.trim().length < 10) {
        setFieldError(messageInput, 'error-message', 'A mensagem deve conter pelo menos 10 caracteres.');
        isFormValid = false;
        if (!firstInvalidInput) firstInvalidInput = messageInput;
      } else {
        clearFieldError(messageInput, 'error-message');
      }

      if (!isFormValid) {
        if (firstInvalidInput) {
          firstInvalidInput.focus();
        }
        return;
      }

      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Enviando mensagem...</span>`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;

        contactForm.reset();
        [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
          input.classList.remove('is-valid', 'has-error');
        });

        showToast(
          'Mensagem enviada com sucesso!',
          'Obrigada pelo contato, Ana Clara responderá em breve.',
          true
        );
      }, 850);
    });
  }

  /* ==========================================================================
     10. ANO ATUAL NO RODAPÉ
     ========================================================================== */
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = String(new Date().getFullYear());
  }
});
