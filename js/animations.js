/* ==============================================
   animations.js — Scroll Reveal, Navbar, Typewriter
   ============================================== */

/* ---- 1. SCROLL REVEAL ---- */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
    observer.observe(el);
  });
}

/* ---- 2. NAVBAR SCROLL CLASS ---- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  /* Hamburger mobile menu */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });

    /* Close menu when a link is clicked */
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/* ---- 3. TYPEWRITER EFFECT ---- */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  let wordIndex = 0;
  let charIndex = 0;
  let deleting  = false;

  function tick() {
    /* Get current language from i18n module */
    const lang  = (typeof window.__currentLang === 'function') ? window.__currentLang() : 'en';
    const words = (window.__i18nWords && window.__i18nWords[lang]) ? window.__i18nWords[lang] : ['VR Experiences', 'AI Solutions', 'Digital Worlds'];

    /* Clamp wordIndex in case language switched mid-cycle */
    if (wordIndex >= words.length) wordIndex = 0;

    const current = words[wordIndex];

    if (deleting) {
      charIndex--;
      el.textContent = current.substring(0, charIndex);
    } else {
      charIndex++;
      el.textContent = current.substring(0, charIndex);
    }

    let delay = deleting ? 55 : 105;

    if (!deleting && charIndex === current.length) {
      delay = 2200;
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 380;
    }

    setTimeout(tick, delay);
  }

  tick();
}

/* ---- 4. CONTACT FORM INTERCEPT ---- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  /* Skip if not connected to real Formspree endpoint yet */
  if (form.action.includes('YOUR_FORM_ID')) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data   = new FormData(form);
    const button = form.querySelector('button[type="submit"]');

    if (button) {
      button.disabled = true;
      button.textContent = '...';
    }

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      const lang = (typeof window.__currentLang === 'function') ? window.__currentLang() : 'en';
      const successMsg = lang === 'es'
        ? '¡Mensaje enviado! Me pondré en contacto pronto.'
        : "Message sent! I'll get back to you soon.";

      if (res.ok) {
        form.innerHTML = `<p class="form-success">${successMsg}</p>`;
      } else {
        throw new Error('Form submission failed');
      }
    } catch {
      if (button) {
        button.disabled = false;
        button.textContent = form.getAttribute('data-i18n') || 'Send Message';
      }
    }
  });
}

/* ---- INIT ALL ---- */
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initNavbar();
  initTypewriter();
  initContactForm();
});
