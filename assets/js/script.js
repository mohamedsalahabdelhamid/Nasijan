/**
 * script.js
 * Main JavaScript for Nasijan Website
 * Features: Theme Toggle | Language Toggle | Scroll Effects | Particles | Form Handling
 */

(function () {
  'use strict';

  /* ─── STATE ──────────────────────────────────── */
  let currentLang = localStorage.getItem('nasijan-lang') || 'en';
  let currentTheme = localStorage.getItem('nasijan-theme') || 'dark';

  /* ─── ELEMENTS ───────────────────────────────── */
  const htmlEl      = document.documentElement;
  const bodyEl      = document.body;
  const navbar      = document.getElementById('navbar');
  const themeToggle = document.getElementById('themeToggle');
  const langToggle  = document.getElementById('langToggle');
  const hamburger   = document.getElementById('hamburger');
  const navLinks    = document.getElementById('navLinks');
  const backToTop   = document.getElementById('backToTop');
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn   = document.getElementById('submitBtn');

  /* ─── INIT ───────────────────────────────────── */
  function init() {
    applyTheme(currentTheme);
    applyLanguage(currentLang);
    generateParticles();
    setupScrollHandlers();
    setupNavLinks();
    setupHamburger();
    setupForm();
    setupRevealObserver();
    // Trigger hero section reveal on load
    setTimeout(() => {
      document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('revealed'));
    }, 200);
  }

  /* ─── THEME ──────────────────────────────────── */
  function applyTheme(theme) {
    currentTheme = theme;
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem('nasijan-theme', theme);
  }

  themeToggle.addEventListener('click', () => {
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });

  /* ─── LANGUAGE ───────────────────────────────── */
  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('nasijan-lang', lang);

    if (lang === 'ar') {
      bodyEl.classList.add('lang-ar');
      htmlEl.setAttribute('lang', 'ar');
      htmlEl.setAttribute('dir', 'rtl');
    } else {
      bodyEl.classList.remove('lang-ar');
      htmlEl.setAttribute('lang', 'en');
      htmlEl.setAttribute('dir', 'ltr');
    }

    translatePage(lang);
  }

  function translatePage(lang) {
    const dict = translations[lang];
    if (!dict) return;

    // Translate elements with data-key attribute
    document.querySelectorAll('[data-key]').forEach(el => {
      const key = el.getAttribute('data-key');
      if (dict[key] !== undefined) {
        // Handle select options differently
        if (el.tagName === 'OPTION') {
          el.textContent = dict[key];
        } else {
          el.textContent = dict[key];
        }
      }
    });

    // Translate placeholder attributes
    document.querySelectorAll('[data-placeholder-key]').forEach(el => {
      const key = el.getAttribute('data-placeholder-key');
      if (dict[key] !== undefined) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    // Update page title & meta
    if (lang === 'ar') {
      document.title = 'نسيجان | هوية الملابس والإكسسوارات';
      document.querySelector('meta[name="description"]').setAttribute(
        'content',
        'نسيجان — متخصصون في تصنيع إكسسوارات الملابس الفاخرة: ليبلات منسوجة، شارات، هانج تاق، أشرطة وحلول مخصصة في مصر.'
      );
    } else {
      document.title = 'Nasijan | Garment Identity & Accessories';
      document.querySelector('meta[name="description"]').setAttribute(
        'content',
        'Nasijan – Premium garment accessories including woven labels, badges, hang tags, ribbons and custom solutions for brands and factories in Egypt.'
      );
    }
  }

  langToggle.addEventListener('click', () => {
    applyLanguage(currentLang === 'en' ? 'ar' : 'en');
  });

  /* ─── SCROLL HANDLERS ────────────────────────── */
  function setupScrollHandlers() {
    let lastScrollY = 0;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;

      // Navbar scroll effect
      if (scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      // Back to top button visibility
      if (scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }

      // Active nav link based on section in view
      updateActiveNavLink();

      lastScrollY = scrollY;
    }, { passive: true });
  }

  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);

      if (link) {
        if (scrollPos >= top && scrollPos < bottom) {
          document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  }

  /* ─── BACK TO TOP ────────────────────────────── */
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ─── HAMBURGER MENU ─────────────────────────── */
  function setupHamburger() {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
      bodyEl.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
  }

  /* ─── NAV LINKS ──────────────────────────────── */
  function setupNavLinks() {
    document.querySelectorAll('.nav-link, footer a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            const offset = navbar.offsetHeight + 20;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
          }
          // Close mobile menu if open
          hamburger.classList.remove('open');
          navLinks.classList.remove('open');
          bodyEl.style.overflow = '';
        }
      });
    });
  }

  /* ─── INTERSECTION OBSERVER (REVEAL) ─────────── */
  function setupRevealObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  /* ─── PARTICLES ──────────────────────────────── */
  function generateParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const count = 25;

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.classList.add('particle');

      const size = Math.random() * 4 + 1.5;
      const left = Math.random() * 100;
      const delay = Math.random() * 8;
      const duration = Math.random() * 12 + 8;
      const opacity = Math.random() * 0.4 + 0.1;

      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
        opacity: ${opacity};
      `;
      container.appendChild(p);
    }
  }

  /* ─── CONTACT FORM ───────────────────────────── */
  function setupForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Simple client-side validation
      const name = contactForm.querySelector('#name').value.trim();
      const email = contactForm.querySelector('#email').value.trim();
      const message = contactForm.querySelector('#message').value.trim();
      const lang = currentLang;

      if (!name || !email || !message) {
        const errMsg = lang === 'ar'
          ? 'يرجى ملء جميع الحقول المطلوبة'
          : 'Please fill in all required fields.';
        alert(errMsg);
        return;
      }

      if (!isValidEmail(email)) {
        const errMsg = lang === 'ar'
          ? 'يرجى إدخال بريد إلكتروني صالح'
          : 'Please enter a valid email address.';
        alert(errMsg);
        return;
      }

      // Simulate sending (UI feedback only)
      const btnSpan = submitBtn.querySelector('span');
      const originalText = btnSpan.textContent;
      submitBtn.disabled = true;
      btnSpan.textContent = lang === 'ar' ? 'جارٍ الإرسال...' : 'Sending...';

      try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action || 'https://formsubmit.co/ajax/mohamedsalahacc5050@gmail.com', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        // Show success
        contactForm.reset();
        submitBtn.disabled = false;
        btnSpan.textContent = originalText;
        formSuccess.classList.add('show');
        setTimeout(() => formSuccess.classList.remove('show'), 5000);
      } catch (error) {
        console.error('Error submitting form:', error);
        alert(lang === 'ar' ? 'حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى لاحقاً.' : 'An error occurred while sending. Please try again later.');
        submitBtn.disabled = false;
        btnSpan.textContent = originalText;
      }
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function simulateDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /* ─── COUNTER ANIMATION ──────────────────────── */
  function animateCounters() {
    document.querySelectorAll('.stat-num').forEach(el => {
      const target = el.textContent.replace(/[^0-9]/g, '');
      const suffix = el.textContent.replace(/[0-9]/g, '');
      if (!target) return;

      const num = parseInt(target, 10);
      const duration = 1800;
      const startTime = performance.now();

      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
        el.textContent = Math.round(eased * num) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    });
  }

  // Trigger counter animation when hero stats are visible
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);

  /* ─── START ──────────────────────────────────── */
  init();

})();
