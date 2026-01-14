// Elements (guarded)
const navbar = document.getElementById("navbar");
const navContainer = document.getElementById("navContainer");
const mobileContainer = document.getElementById("mobileContainer");
const menuToggle = document.getElementById("menuToggle");
const menuIcon = document.getElementById("menuIcon");
const mainMenu = document.getElementById("mainMenu");
const menuPanel = document.getElementById("menuPanel");
const panelClose = document.getElementById("panelClose");
const panelLinks = document.querySelectorAll(".panel-link");
const mobileLinks = document.querySelectorAll(".mobile-link");
const navLinks = document.querySelectorAll(".nav-link");
const gooeyBg = document.getElementById("gooeyBg");
const navItems = document.getElementById("navItems");
const desktopBtn = document.getElementById("desktopBtn");

// GSAP intro animations (guarded)
if (typeof gsap !== "undefined") {
  // status-badge is revealed in sequence by our custom loader; skip GSAP auto animation
  // if (document.querySelector(".status-badge"))
  //   gsap.from(".status-badge", { opacity: 0, y: -20, duration: 1, ease: "power3.out" });

  if (document.querySelector("#main-title, .hero-events, h1"))
    gsap.from("#main-title, .hero-events, h1", { opacity: 0, y: 30, duration: 1.2, delay: 0.2, ease: "power3.out" });

  if (document.querySelector(".location"))
    gsap.from(".location", { opacity: 0, y: 20, duration: 1, delay: 0.4, ease: "power3.out" });

  if (document.querySelector(".address"))
    gsap.from(".address", { opacity: 0, y: 20, duration: 1, delay: 0.5, ease: "power3.out" });

  if (document.querySelector(".shiny-cta"))
    gsap.from(".shiny-cta", { opacity: 0, scale: 0.9, duration: 1, delay: 0.7, ease: "back.out(1.7)" });

  if (document.querySelector(".visualization svg"))
    gsap.from(".visualization svg", { opacity: 0, scale: 0.95, duration: 1.5, delay: 0.3, ease: "power3.out" });
}

// CTA micro-interaction
const ctaButton = document.querySelector(".shiny-cta");
if (ctaButton && typeof gsap !== "undefined") {
  ctaButton.addEventListener("click", () => {
    gsap.to(ctaButton, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1, ease: "power2.inOut" });
  });
}

// Desktop nav gooey hover (guarded)
if (navLinks && navLinks.length && navItems && gooeyBg && typeof gsap !== "undefined") {
  navLinks.forEach((link) => {
    link.addEventListener("mouseenter", function () {
      const rect = this.getBoundingClientRect();
      const parentRect = navItems.getBoundingClientRect();
      gsap.to(gooeyBg, { left: rect.left - parentRect.left, width: rect.width, opacity: 1, duration: 0.3, ease: "power2.out" });
    });
    link.addEventListener("mouseleave", function () { gsap.to(link, { color: "#d4d4d8", duration: 0.2 }); });
    link.addEventListener("mouseenter", function () { gsap.to(link, { color: "#ffffff", duration: 0.2 }); });
  });
  navItems.addEventListener("mouseleave", () => { gsap.to(gooeyBg, { opacity: 0, duration: 0.3, ease: "power2.out" }); });
}

// Desktop button hover
if (desktopBtn && typeof gsap !== "undefined") {
  desktopBtn.addEventListener("mouseenter", function () { gsap.to(this, { y: -2, duration: 0.2, ease: "power2.out" }); });
  desktopBtn.addEventListener("mouseleave", function () { gsap.to(this, { y: 0, duration: 0.2, ease: "power2.out" }); });
}

// Menu open/close logic: only the panel 'X' closes the menu via click; clicking backdrop does NOT close.
// Also: circular menu button is hidden while menu active (handled by CSS .menu-open rule).
let isMenuOpen = false;

function openMenu() {
  if (isMenuOpen) return;
  isMenuOpen = true;
  document.body.classList.add("menu-open");
  if (menuToggle) menuToggle.setAttribute("aria-expanded", "true");
  if (mainMenu) { mainMenu.classList.add("open"); mainMenu.setAttribute("aria-hidden", "false"); }

  // hide hamburger icon smoothly (CSS will hide the whole button via body.menu-open .menu-toggle)
  if (menuIcon && typeof gsap !== "undefined") gsap.to(menuIcon, { opacity: 0, duration: 0.12, onComplete: () => (menuIcon.style.visibility = "hidden") });
  else if (menuIcon) menuIcon.style.visibility = "hidden";

  if (!menuPanel) return;

  if (typeof gsap !== "undefined") {
    if (window.innerWidth >= 1024) {
      // desktop: centered pop + fast fade-in items
      gsap.fromTo(menuPanel, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.26, ease: "back.out(1.2)" });
      if (panelLinks && panelLinks.length) {
        gsap.fromTo(panelLinks, { y: 8, opacity: 0, scale: 0.985 }, { y: 0, opacity: 1, scale: 1, duration: 0.26, stagger: 0.04, ease: "back.out(1.3)" });
      }
    } else {
      // mobile: slide in + faster item fade
      gsap.set(menuPanel, { x: "100%" });
      gsap.to(menuPanel, { x: "0%", duration: 0.28, ease: "power3.out" });
      if (panelLinks && panelLinks.length) {
        gsap.fromTo(panelLinks, { x: 12, opacity: 0 }, { x: 0, opacity: 1, duration: 0.22, stagger: 0.035, ease: "power2.out" });
      }
    }
  } else {
    menuPanel.style.opacity = "1";
  }
}

function closeMenu() {
  if (!isMenuOpen) return;
  isMenuOpen = false;
  document.body.classList.remove("menu-open");
  if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");

  // restore hamburger icon visibility (CSS rule will show it again once .menu-open removed)
  if (menuIcon) { menuIcon.style.visibility = "visible"; if (typeof gsap !== "undefined") gsap.to(menuIcon, { opacity: 1, duration: 0.12 }); }

  if (!menuPanel || !mainMenu) {
    if (mainMenu) { mainMenu.classList.remove("open"); mainMenu.setAttribute("aria-hidden", "true"); }
    return;
  }

  if (typeof gsap !== "undefined") {
    const hidePanel = () => {
      if (window.innerWidth >= 1024) {
        // shrink and quick fade out panel
        gsap.to(menuPanel, {
          scale: 0.78,
          opacity: 0,
          duration: 0.22,
          ease: "power2.in",
          onComplete: () => { mainMenu.classList.remove("open"); mainMenu.setAttribute("aria-hidden", "true"); menuPanel.style.transform = ""; }
        });
      } else {
        gsap.to(menuPanel, {
          x: "100%",
          duration: 0.2,
          ease: "power2.in",
          onComplete: () => { mainMenu.classList.remove("open"); mainMenu.setAttribute("aria-hidden", "true"); }
        });
      }
    };

    if (panelLinks && panelLinks.length) {
      // faster fade out items in reverse order, then shrink panel
      gsap.to(panelLinks, {
        y: 8,
        opacity: 0,
        scale: 0.98,
        duration: 0.12,
        stagger: { each: 0.03, from: "end" },
        ease: "power2.in",
        onComplete: hidePanel,
      });
    } else {
      hidePanel();
    }
  } else {
    mainMenu.classList.remove("open");
    mainMenu.setAttribute("aria-hidden", "true");
  }
}

// wiring: only the toggle opens and panelClose closes via click.
// Do NOT close when clicking the backdrop; clicking elsewhere won't exit.
if (menuToggle) menuToggle.addEventListener("click", () => { if (isMenuOpen) closeMenu(); else openMenu(); });
if (panelClose) panelClose.addEventListener("click", closeMenu);

// remove backdrop click-to-close: intentionally do not attach any click handler that closes on overlay

// keep Escape key to close (optional accessibility)
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && isMenuOpen) closeMenu(); });

// do NOT auto-close on link click (user requested exit only via 'X'); keep links functional but menu stays open
// keep compatibility with old mobile links but do not close the menu
if (mobileLinks && mobileLinks.length) {
  mobileLinks.forEach((lnk) => { /* no auto-close */ });
}

// Smooth Scroll (preserve behavior)
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target && typeof gsap !== "undefined") {
      gsap.to(window, { scrollTo: { y: target, offsetY: 70 }, duration: 0.8, ease: "power2.inOut" });
    } else if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// Text scramble + typing effect for <h1> (faster)
(function () {
  const h1 = document.querySelector("#main-title") || document.querySelector(".hero-events") || document.querySelector("h1");
  const h2 = document.getElementById("subtitle");
  if (!h1) return;

  const originalHTML = h1.innerHTML;
  const text = h1.textContent.replace(/\s+/g, " ").trim();
  const pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*()[]{}<>?/|";
  const rand = (n) => Math.floor(Math.random() * n);

  function wait(ms) { return new Promise((res) => setTimeout(res, ms)); }

  async function scrambleType() {
    // If this is the page hero (simple centered word), use a keyboard-typing style
    const isHero = h1 && h1.classList && h1.classList.contains('hero-events');

    if (isHero) {
      const span = document.createElement('span');
      span.className = 'scramble-text';
      const caret = document.createElement('span');
      caret.className = 'scramble-caret';
      caret.textContent = '|';

      if (h1.classList) h1.classList.add('seq-visible');
      h1.innerHTML = '';
      h1.appendChild(span);
      h1.appendChild(caret);

      for (let i = 0; i < text.length; i++) {
        span.textContent = text.slice(0, i + 1);
        await wait(120 + rand(80)); // slightly slower typing speed
      }

      try {
        if (span && span.classList) {
          span.classList.add('pop');
          await new Promise((res) => setTimeout(res, 200));
        }
      } catch (e) {}

      await wait(80);
      // measure the typed width and set CSS variable so underline matches
      try {
        const rect = span.getBoundingClientRect();
        if (rect && rect.width) {
          h1.style.setProperty('--underline-width', Math.round(rect.width) + 'px');
        }
      } catch (e) { /* ignore measurement errors */ }

      if (caret && caret.parentNode) caret.parentNode.removeChild(caret);
      // restore original content then trigger underline reveal
      h1.innerHTML = originalHTML;
      if (h1.classList) {
        // slight delay to ensure layout updated before animating underline
        setTimeout(() => h1.classList.add('underline-visible'), 80);
      }
      return;
    }

    // fallback: original scramble behaviour for other headings
    const span = document.createElement("span");
    span.className = "scramble-text";
    const caret = document.createElement("span");
    caret.className = "scramble-caret";
    caret.textContent = "|";

    if (h1.classList) h1.classList.add('seq-visible');
    h1.innerHTML = "";
    h1.appendChild(span);
    h1.appendChild(caret);

    for (let i = 0; i < text.length; i++) {
      const target = text[i];
      if (/\s/.test(target)) {
        span.textContent += target;
        await wait(20);
        continue;
      }
      const rounds = 1 + rand(8);
      for (let r = 0; r < rounds; r++) {
        const char = pool[rand(pool.length)];
        span.textContent = text.slice(0, i) + char;
        await wait(10 + rand(25));
      }
      span.textContent = text.slice(0, i + 1);
      await wait(20 + rand(80));
    }

    try {
      if (span && span.classList) {
        span.classList.add('pop');
        await new Promise((res) => setTimeout(res, 260));
      }
    } catch (e) {}

    await wait(100);
    h1.innerHTML = originalHTML;
  }

  async function typeSubtitle() {
    const full = (h2.getAttribute && h2.getAttribute('data-text')) || h2.textContent || '';
    if (!full) return;

    // reveal subtitle container
    if (h2 && h2.classList) h2.classList.add('seq-visible');

    const span = document.createElement('span');
    span.className = 'scramble-text';
    const caret = document.createElement('span');
    caret.className = 'scramble-caret';
    caret.textContent = '_'; // use underscore for subtitle cursor

    h2.innerHTML = '';
    h2.appendChild(span);
    h2.appendChild(caret);
    h2.setAttribute('aria-hidden', 'false');

    for (let i = 0; i < full.length; i++) {
      span.textContent = full.slice(0, i + 1);
      await wait(28 + rand(30)); // slightly slower typing
    }

    // pop the subtitle span then clear caret
    try {
      if (span && span.classList) {
        span.classList.add('pop');
        await new Promise((res) => setTimeout(res, 260));
      }
    } catch (e) {}

    await wait(80);
    if (caret && caret.parentNode) caret.parentNode.removeChild(caret);
  }

  async function runSequence() {
    const dept = document.querySelector('.dept-badge');
    if (dept) {
      await new Promise((res) => {
        let done = false;
        const onEnd = () => { if (!done) { done = true; dept.removeEventListener('animationend', onEnd); res(); } };
        dept.addEventListener('animationend', onEnd);
        const style = getComputedStyle(dept);
        const delay = (parseFloat(style.animationDelay) || 0) * 1000;
        const dur = (parseFloat(style.animationDuration) || 0.8) * 1000;
        setTimeout(() => { if (!done) { done = true; dept.removeEventListener('animationend', onEnd); res(); } }, delay + dur + 80);
      });
    }

    await scrambleType();

    if (h2) {
      await wait(40);
      await typeSubtitle();
    }

    // reveal remaining content below at once
    const rest = document.querySelectorAll('.status-badge, .location, .address, .cta-container');
    rest.forEach((el) => {
      if (el.classList) el.classList.add('seq-visible');
      // add a small pop to each revealed element for emphasis
      if (el.classList) el.classList.add('pop');
    });
  }

  runSequence();

  // After the main sequence, run scramble on any additional elements marked .scramble-target
  (async function runExtraScrambles() {
    const targets = document.querySelectorAll('.scramble-target');
    const rand = (n) => Math.floor(Math.random() * n);
    function wait(ms) { return new Promise((res) => setTimeout(res, ms)); }

    async function scrambleElement(el) {
      if (!el) return;
      const original = el.textContent.replace(/\s+/g, ' ').trim();
      el.innerHTML = '';
      const span = document.createElement('span');
      span.className = 'scramble-text';
      const caret = document.createElement('span');
      caret.className = 'scramble-caret';
      caret.textContent = '|';
      el.appendChild(span);
      el.appendChild(caret);

      const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*()[]{}<>?/|';

      for (let i = 0; i < original.length; i++) {
        const ch = original[i];
        if (/\s/.test(ch)) {
          span.textContent += ch;
          await wait(40 + rand(40));
          continue;
        }
        const rounds = 1 + rand(4);
        for (let r = 0; r < rounds; r++) {
          span.textContent = original.slice(0, i) + pool[rand(pool.length)];
          await wait(20 + rand(60));
        }
        span.textContent = original.slice(0, i + 1);
        await wait(60 + rand(80));
      }

      try { span.classList.add('pop'); await wait(180); } catch (e) {}
      if (caret && caret.parentNode) caret.parentNode.removeChild(caret);
      el.innerHTML = original;
    }

    for (const t of targets) {
      // skip if this target was the hero already handled
      if (t.classList.contains('hero-events')) continue;
      await scrambleElement(t);
      await wait(120);
    }
  })();
})();