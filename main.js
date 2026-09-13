const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
/* Animation runs only when GSAP is actually loaded and motion is allowed.
   Otherwise the page stays fully readable (CSS initial-hidden states sit
   behind html.js-anim, which is added only here). */
let canAnimate = false;
try {
    canAnimate = !reduced && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
    if (canAnimate) gsap.registerPlugin(ScrollTrigger);
} catch (e) { canAnimate = false; }
if (canAnimate) document.documentElement.classList.add('js-anim');
const CRAYON = ['#e4574d', '#e8a93d', '#2f9e8f', '#4d7dd1', '#f2a0b5'];

/* ---------- marquee ---------- */
const words = ['happy 25th hema', 'quarter-century cutie', 'twenty-five & glowing', 'make a wish, hema'];
document.getElementById('marquee').innerHTML = [...words, ...words].map(w => `<span><b>★</b> ${w}</span>`).join('');

/* ---------- ink dots drift ---------- */
(() => {
    const c = document.getElementById('stars'), x = c.getContext('2d'); let s = [];
    const size = () => {
        c.width = innerWidth; c.height = innerHeight;
        s = Array.from({ length: innerWidth < 600 ? 40 : 90 }, () => ({ x: Math.random() * c.width, y: Math.random() * c.height, r: Math.random() * 1.6 + .4, t: Math.random() * Math.PI * 2 }));
    };
    size(); addEventListener('resize', size);
    (function tw(t) {
        if (document.hidden) { if (!reduced) requestAnimationFrame(tw); return; }
        x.clearRect(0, 0, c.width, c.height);
        s.forEach(p => {
            p.t += .02; x.globalAlpha = .08 + Math.abs(Math.sin(p.t)) * .16; x.fillStyle = '#3c342c';
            x.beginPath(); x.arc(p.x, p.y, p.r, 0, 7); x.fill();
        });
        x.globalAlpha = 1; if (!reduced) requestAnimationFrame(tw);
    })(0);
})();

/* ---------- crayon confetti rain ---------- */
(() => {
    const c = document.getElementById('petals'), x = c.getContext('2d'); let p = [];
    const size = () => { c.width = innerWidth; c.height = innerHeight; };
    size(); addEventListener('resize', size);
    const mk = () => ({
        x: Math.random() * c.width, y: -20, s: 4 + Math.random() * 7, v: .5 + Math.random() * 1.1,
        a: Math.random() * Math.PI * 2, va: (Math.random() - .5) * .03, col: CRAYON[Math.random() * CRAYON.length | 0],
        o: .45 + Math.random() * .5, sq: Math.random() > .5
    });
    p = Array.from({ length: innerWidth < 600 ? 24 : 40 }, mk);
    (function fall() {
        if (document.hidden) { if (!reduced) requestAnimationFrame(fall); return; }
        x.clearRect(0, 0, c.width, c.height);
        p.forEach((q, i) => {
            q.y += q.v; q.x += Math.sin(q.a += q.va) * .7; if (q.y > c.height + 20) p[i] = mk();
            x.save(); x.globalAlpha = q.o; x.translate(q.x, q.y); x.rotate(q.a); x.fillStyle = q.col;
            if (q.sq) x.fillRect(-q.s * .5, -q.s * .5, q.s, q.s * .7);
            else { x.beginPath(); x.ellipse(0, 0, q.s, q.s * .55, 0, 0, 7); x.fill(); }
            x.restore();
        });
        if (!reduced) requestAnimationFrame(fall);
    })();
})();

/* ---------- progress ---------- */
addEventListener('scroll', () => {
    const h = document.documentElement;
    document.getElementById('progress').style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
}, { passive: true });

/* ---------- gate (vanilla JS on purpose: must work even if a CDN fails) ---------- */
const gate = document.getElementById('gate');
const bgMusic = document.getElementById('bgMusic');
const openBtn = document.getElementById('openBtn');
const sealBtn = document.getElementById('sealBtn');
function openGate() {
    if (gate) gate.classList.add('hidden');
    document.body.style.overflow = '';
    if (bgMusic) {
        bgMusic.volume = 0.7;
        try { const pr = bgMusic.play(); if (pr && pr.catch) pr.catch(() => { }); } catch (e) { }
    }
    try { burst(.7); setTimeout(() => burst(1), 600); } catch (e) { }
    if (canAnimate) {
        try { gsap.fromTo('#hero .wrap', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }); } catch (e) { }
    }
}
if (openBtn) openBtn.onclick = openGate;
if (sealBtn) sealBtn.onclick = openGate;
if (gate) document.body.style.overflow = 'hidden';

/* ---------- hero heart sketch ---------- */
try {
    const hp = document.getElementById('heart-path');
    if (hp && hp.getTotalLength) {
        const len = hp.getTotalLength();
        hp.style.strokeDasharray = len;
        hp.style.strokeDashoffset = canAnimate ? len : 0;
        if (canAnimate) gsap.to(hp, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut', delay: 1 });
    }
} catch (e) { }

/* ================= SCROLL FX SUITE (GSAP only) ================= */
/* --- buttery smooth scrolling (Lenis + GSAP ticker) --- */
let lenis = null;
if (canAnimate && window.Lenis) {
    try {
        lenis = new Lenis({ duration: 1.15, smoothWheel: true });
        document.documentElement.classList.add('lenis');
        document.documentElement.style.scrollBehavior = 'auto';
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((t) => lenis.raf(t * 1000));
        gsap.ticker.lagSmoothing(0);
        lenis.stop(); // sealed until she opens the envelope
        const kick = () => lenis && lenis.start();
        if (openBtn) openBtn.addEventListener('click', kick);
        if (sealBtn) sealBtn.addEventListener('click', kick);
    } catch (e) { lenis = null; }
}

/* --- smooth anchor glides (Lenis-aware) --- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (id && id.length > 1) {
            const t = document.querySelector(id);
            if (t) { e.preventDefault(); lenis ? lenis.scrollTo(t, { offset: -60 }) : t.scrollIntoView({ behavior: 'smooth' }); }
        }
    });
});
const glideTop = () => lenis ? lenis.scrollTo(0) : scrollTo({ top: 0, behavior: 'smooth' });
const toTopBtn = document.getElementById('toTop');
if (toTopBtn) toTopBtn.onclick = glideTop;

/* --- split-text helper (wraps words in overflow masks, keeps <em>/<br>) --- */
function splitWords(el) {
    const process = (node) => {
        if (node.nodeType === 3) {
            const frag = document.createDocumentFragment();
            node.textContent.split(/(\s+)/).forEach(part => {
                if (!part) return;
                if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); }
                else {
                    const m = document.createElement('span'); m.className = 'w-mask';
                    const w = document.createElement('span'); w.className = 'w'; w.textContent = part;
                    m.appendChild(w); frag.appendChild(m);
                }
            });
            node.replaceWith(frag);
        } else if (node.nodeType === 1 && node.tagName !== 'BR') {
            [...node.childNodes].forEach(process);
        }
    };
    [...el.childNodes].forEach(process);
    return el.querySelectorAll('.w');
}

/* --- assign reveal variants --- */
if (canAnimate) {
    document.querySelectorAll('#reasons .reason').forEach((r, i) => {
        r.classList.add('reveal'); r.dataset.reveal = i % 2 ? 'right' : 'left';
    });
    document.querySelectorAll('.eyebrow').forEach(e => { if (e.classList.contains('reveal')) e.dataset.reveal = 'blur'; });
    document.querySelectorAll('.glass').forEach(g => { if (!g.dataset.reveal) g.dataset.reveal = 'fade'; });
}

/* --- variant reveals (up / left / right / scale / blur / fade) --- */
if (canAnimate) {
    gsap.utils.toArray('.reveal').forEach(el => {
        const v = el.dataset.reveal || 'up';
        const to = {
            opacity: 1, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%' }
        };
        if (v === 'left' || v === 'right') to.x = 0;
        else if (v === 'scale') { to.scale = 1; to.rotation = 0; }
        else if (v === 'blur') { to.y = 0; to.filter = 'blur(0px)'; }
        else if (v !== 'fade') to.y = 0;
        gsap.to(el, to);
    });
}

/* --- masked word-rise for every section heading --- */
if (canAnimate) {
    document.querySelectorAll('h2.display').forEach(h => {
        try {
            const words = splitWords(h);
            gsap.set(words, { yPercent: 115 });
            gsap.to(words, {
                yPercent: 0, duration: .9, ease: 'power3.out', stagger: .07,
                scrollTrigger: { trigger: h, start: 'top 86%' }
            });
        } catch (e) { }
    });
}

/* --- doodle line-draw scrubbed by scroll (the sketch signature!) --- */
if (canAnimate) {
    document.querySelectorAll('[data-draw]').forEach(p => {
        try {
            const L = p.getTotalLength ? p.getTotalLength() : 300;
            p.style.strokeDasharray = L;
            p.style.strokeDashoffset = L;
            gsap.to(p, {
                strokeDashoffset: 0, ease: 'none',
                scrollTrigger: { trigger: p.closest('section') || p, start: 'top 85%', end: 'center 40%', scrub: 1 }
            });
        } catch (e) { }
    });
}

/* --- hero parallax exit + heart drift --- */
if (canAnimate) {
    gsap.to('#hero .wrap', {
        yPercent: -14, opacity: .15, ease: 'none',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    gsap.to('.heart-draw', {
        y: -70, rotate: 6, ease: 'none',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    gsap.to('.aurora', {
        yPercent: 14, ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1.5 }
    });
    gsap.to('#stars', {
        yPercent: -10, ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1.5 }
    });
}

/* --- polaroid + paper-card parallax drift (rotation preserved by GSAP) --- */
if (canAnimate) {
    gsap.utils.toArray('.polaroid').forEach((card, i) => {
        gsap.fromTo(card, { y: i % 2 ? -34 : 34 }, {
            y: i % 2 ? 34 : -34, ease: 'none',
            scrollTrigger: { trigger: '#gallery', start: 'top bottom', end: 'bottom top', scrub: 1 }
        });
    });
    gsap.utils.toArray('.glass').forEach(g => {
        if (g.closest('#poem')) return; // pinned section: parallax drift fights the pin and judders
        gsap.fromTo(g, { y: 46 }, {
            y: -46, ease: 'none',
            scrollTrigger: { trigger: g, start: 'top bottom', end: 'bottom top', scrub: 1 }
        });
    });
}

/* --- poem: pinned reading-room with scrubbed lines + progress (desktop), gentle fallback (mobile) --- */
/* Without animation the lines + progress bar are simply visible (see CSS). */
const poemLines = (canAnimate && window.gsap) ? gsap.utils.toArray('#poem .line') : [];
const poemBar = document.getElementById('poemBar');
if (canAnimate && poemLines.length) {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 700px)', () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: '#poem', start: 'top top', end: '+=160%', scrub: 1, pin: true } });
        tl.to(poemLines, { opacity: 1, y: 0, stagger: .35, ease: 'power1.out' }, 0);
        if (poemBar) tl.to(poemBar, { width: '100%', ease: 'none' }, 0);
    });
    mm.add('(max-width: 699px)', () => {
        poemLines.forEach(l => {
            gsap.to(l, {
                opacity: 1, y: 0, duration: .6, ease: 'power1.out',
                scrollTrigger: { trigger: l, start: 'top 90%' }
            });
        });
        if (poemBar) gsap.to(poemBar, {
            width: '100%', ease: 'none',
            scrollTrigger: { trigger: '#poem', start: 'top 70%', end: 'bottom 60%', scrub: true }
        });
    });
} else {
    if (poemBar) poemBar.style.width = '100%';
}

/* --- wish text: word-by-word illumination on scrub --- */
const wb = document.querySelector('.wish-big');
if (wb && canAnimate) {
    const words = splitWords(wb);
    gsap.set(words, { opacity: .13 });
    gsap.to(words, {
        opacity: 1, stagger: .12, ease: 'none',
        scrollTrigger: { trigger: '#wishes .glass', start: 'top 78%', end: 'center 45%', scrub: 1 }
    });
}

/* --- finale: scrubbed cake entrance + staggered flame pop + giant word drift --- */
const fin = document.getElementById('finale');
if (fin) {
    const g = document.createElement('div');
    g.className = 'giant'; g.textContent = 'Hema 25 ♡ Hema 25 ♡ Hema 25';
    fin.appendChild(g);
}
if (canAnimate && fin) {
    const ftl = gsap.timeline({ scrollTrigger: { trigger: '#finale', start: 'top 78%', end: 'top 22%', scrub: 1 } });
    ftl.fromTo('#finale .cake', { y: 90, scale: .9 }, { y: 0, scale: 1, ease: 'power1.out' }, 0)
        .fromTo('.flame-btn', { scale: 0, transformOrigin: '50% 100%' }, { scale: 1, stagger: .14, ease: 'back.out(2)' }, .15);
    gsap.to('#finale .giant', {
        xPercent: -18, ease: 'none',
        scrollTrigger: { trigger: '#finale', start: 'top bottom', end: 'bottom top', scrub: 1 }
    });
}

/* --- velocity-reactive marquee (speeds + tilts as you scroll) --- */
const track = document.getElementById('marquee');
if (track && canAnimate) {
    track.style.animation = 'none';
    track.style.paddingRight = getComputedStyle(track).gap || '2.5rem';
    const loop = gsap.fromTo(track, { x: 0 }, { x: () => -(track.scrollWidth / 2), ease: 'none', duration: 20, repeat: -1 });
    let decay;
    ScrollTrigger.create({
        onUpdate: self => {
            const v = gsap.utils.clamp(-5, 5, (self.getVelocity() || 0) / -250);
            loop.timeScale(1 + Math.abs(v) * .7);
            gsap.to(track, { skewX: gsap.utils.clamp(-8, 8, v * -2), duration: .3, overwrite: true });
            clearTimeout(decay);
            decay = setTimeout(() => { gsap.to(loop, { timeScale: 1, duration: .6, overwrite: true }); gsap.to(track, { skewX: 0, duration: .5 }); }, 140);
        }
    });
}

/* --- subtle velocity skew on the grids --- */
if (canAnimate) {
    const skewTargets = [...document.querySelectorAll('.polaroid-grid,.reasons-grid')];
    if (skewTargets.length) {
        const setSkew = gsap.quickSetter(skewTargets, 'skewY', 'deg');
        const clampS = gsap.utils.clamp(-5, 5);
        const cur = { v: 0 };
        ScrollTrigger.create({
            onUpdate: self => {
                const s = clampS((self.getVelocity() || 0) / -350);
                if (Math.abs(s) > Math.abs(cur.v)) {
                    cur.v = s;
                    gsap.to(cur, { v: 0, duration: .8, ease: 'power3', overwrite: true, onUpdate: () => setSkew(cur.v) });
                }
            }
        });
    }
}

/* --- drifting hand-drawn wave dividers injected per section --- */
const waveSVG = '<svg viewBox="0 0 1440 70" preserveAspectRatio="none"><path d="M0,35 Q120,5 240,35 T480,35 T720,35 T960,35 T1200,35 T1440,35" fill="none" stroke="rgba(38,34,29,.3)" stroke-width="2.5"/></svg>';
['poem', 'gallery', 'reasons', 'wishes', 'finale'].forEach((id, i) => {
    const s = document.getElementById(id); if (!s) return;
    const w = document.createElement('div'); w.className = 'wave'; w.innerHTML = waveSVG; s.prepend(w);
    if (canAnimate) gsap.fromTo(w, { x: i % 2 ? 50 : -50 }, {
        x: i % 2 ? -50 : 50, ease: 'none',
        scrollTrigger: { trigger: s, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
    });
});

/* --- scroll-spy dots + floating to-top + auto-hiding nav --- */
const dots = [...document.querySelectorAll('#dots a')];
if (canAnimate) {
    dots.forEach(d => {
        const s = document.querySelector(d.getAttribute('href')); if (!s) return;
        ScrollTrigger.create({
            trigger: s, start: 'top center', end: 'bottom center',
            onToggle: self => { if (self.isActive) dots.forEach(x => x.classList.toggle('active', x === d)); }
        });
    });
}
const toTop = document.getElementById('toTop');
const onScrollY = (y) => { if (toTop) toTop.classList.toggle('show', y > innerHeight * .9); };
addEventListener('scroll', () => onScrollY(scrollY), { passive: true });
if (lenis) lenis.on('scroll', ({ scroll }) => onScrollY(scroll));
const navEl = document.querySelector('nav');
if (navEl && canAnimate) {
    ScrollTrigger.create({
        start: 0, end: 'max', onUpdate: self => {
            gsap.to(navEl, {
                yPercent: (self.direction === 1 && self.scroll() > 140) ? -130 : 0,
                duration: .35, ease: 'power2.out', overwrite: true
            });
        }
    });
}

/* --- magnetic buttons (fine pointers only) --- */
if (canAnimate && matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.btn-solid,.open-btn').forEach(b => {
        b.addEventListener('mousemove', e => {
            const r = b.getBoundingClientRect();
            gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .18, y: (e.clientY - r.top - r.height / 2) * .28, duration: .4, ease: 'power2.out' });
        });
        b.addEventListener('mouseleave', () => gsap.to(b, { x: 0, y: 0, duration: .5, ease: 'elastic.out(1,.5)' }));
    });
}

if (canAnimate) {
    addEventListener('load', () => { try { ScrollTrigger.refresh(); } catch (e) { } });
    /* Caveat swaps in late (display=swap) and shifts word widths — recalc
       triggers once fonts settle so masked headings don't jump mid-rise */
    try {
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => { try { ScrollTrigger.refresh(); } catch (e) { } });
        }
    } catch (e) { }
    gsap.utils.toArray('.polaroid').forEach((card, i) => {
        gsap.to(card, {
            opacity: 1, duration: .7, delay: (i % 2) * .1, ease: 'back.out(1.5)',
            scrollTrigger: { trigger: card, start: 'top 90%' }
        });
    });
}
// ---- Reasons list ---- handled by the variant-reveal suite above (alternating left/right)

/* ---------- lightbox ---------- */
const lb = document.getElementById('lightbox'), lbImg = document.getElementById('lightboxImg'), lbCap = document.getElementById('lightboxCap');
if (lb && lbImg) {
    document.querySelectorAll('.polaroid').forEach(f => {
        f.onclick = () => {
            const im = f.querySelector('img'), cp = f.querySelector('figcaption');
            if (im) lbImg.src = im.src;
            if (lbCap && cp) lbCap.textContent = cp.textContent;
            lb.classList.add('show');
        };
    });
    lb.onclick = () => lb.classList.remove('show');
}



/* ---------- finale flames + confetti ---------- */
function burst(power = 1) {
    if (typeof confetti === 'undefined') return;
    confetti({ particleCount: 90 * power, spread: 100, origin: { y: .6 }, colors: [...CRAYON, '#ffffff'] });
    setTimeout(() => confetti({ particleCount: 60 * power, angle: 60, spread: 60, origin: { x: 0, y: .7 }, colors: CRAYON }), 200);
    setTimeout(() => confetti({ particleCount: 60 * power, angle: 120, spread: 60, origin: { x: 1, y: .7 }, colors: CRAYON }), 350);
}
const flames = [...document.querySelectorAll('.flame')];
const countEl = document.getElementById('flame-count'), msg = document.getElementById('wish-msg');
let blown = 0;
function showWishMsg() {
    if (!msg) return;
    if (canAnimate) { try { gsap.to(msg, { opacity: 1, y: 0, duration: .8, ease: 'power2.out' }); return; } catch (e) { } }
    msg.style.opacity = '1'; msg.style.transform = 'none';
}
flames.forEach(f => f.closest('.flame-btn').addEventListener('click', () => {
    if (f.classList.contains('out')) return;
    f.classList.add('out'); blown++;
    const left = flames.length - blown;
    if (countEl) countEl.textContent = left ? `${left} flame${left > 1 ? 's' : ''} still burning` : 'all wishes sealed with a kiss ♡';
    if (left === 0) {
        burst(1.4);
        showWishMsg();
    }
}));
const replayBtn = document.getElementById('replayBtn');
if (replayBtn) replayBtn.onclick = () => {
    blown = 0; flames.forEach(f => f.classList.remove('out'));
    if (msg) { if (canAnimate) { try { gsap.set(msg, { opacity: 0 }); } catch (e) { msg.style.opacity = '0'; } } else msg.style.opacity = '0'; }
    if (countEl) countEl.textContent = '3 flames still burning'; burst(1);
};
const topBtn = document.getElementById('topBtn');
if (topBtn) topBtn.onclick = glideTop;

/* ---------- background music (SRC/Blue-Yung-Kai.mp3, auto-started on gate open) ---------- */

/* finale auto-confetti */
if (canAnimate) ScrollTrigger.create({ trigger: '#finale', start: 'top 60%', once: true, onEnter: () => burst(1) });