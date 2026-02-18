/* ============================================================
   PAWS & STROLLS – Refined Interactive JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ─── ELEMENTS ───
  const navbar      = document.getElementById('navbar');
  const hamburger   = document.getElementById('hamburger');
  const navLinks    = document.getElementById('navLinks');
  const backToTop   = document.getElementById('backToTop');
  const contactForm = document.getElementById('contactForm');
  const modal       = document.getElementById('successModal');
  const closeModal  = document.getElementById('closeModal');
  const prevBtn     = document.getElementById('prevBtn');
  const nextBtn     = document.getElementById('nextBtn');

  // ─── MOBILE MENU ───
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // ─── NAVBAR SCROLL ───
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    backToTop.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  // ─── BACK TO TOP ───
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ─── SCROLL REVEAL ───
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings slightly
        const delay = entry.target.dataset.revealDelay || 0;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  revealElements.forEach((el, i) => {
    // Add stagger delay to cards in grids
    const parent = el.parentElement;
    if (parent && (parent.classList.contains('services-grid') ||
        parent.classList.contains('features-grid') ||
        parent.classList.contains('gallery-mosaic'))) {
      const siblings = [...parent.children].filter(c => c.classList.contains('reveal'));
      const idx = siblings.indexOf(el);
      el.dataset.revealDelay = idx * 80;
    }
    revealObserver.observe(el);
  });

  // ─── ANIMATED COUNTERS ───
  const counters = document.querySelectorAll('.counter-number');
  let counterStarted = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counterStarted) {
        counterStarted = true;
        counters.forEach(counter => animateCounter(counter));
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2200;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4); // ease-out quart
      el.textContent = Math.round(target * ease).toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // ─── TESTIMONIALS CAROUSEL ───
  const cards = document.querySelectorAll('.testimonial-card');
  const dotsContainer = document.getElementById('carouselDots');
  let currentSlide = 0;
  let autoSlideTimer;

  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('carousel-dot');
    if (i === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', `Go to review ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  function goToSlide(index) {
    const prev = currentSlide;
    currentSlide = index;

    cards.forEach((card, i) => {
      card.classList.remove('active', 'exit-left');
      if (i === prev && prev !== index) card.classList.add('exit-left');
      if (i === index) card.classList.add('active');
    });

    dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    resetAutoSlide();
  }

  function nextSlide() { goToSlide((currentSlide + 1) % cards.length); }
  function prevSlide() { goToSlide((currentSlide - 1 + cards.length) % cards.length); }

  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(nextSlide, 5500);
  }
  resetAutoSlide();

  // Swipe support
  let touchStartX = 0;
  const track = document.getElementById('carouselTrack');
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide();
  });

  // ─── CONTACT FORM ───
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    contactForm.querySelectorAll('[required]').forEach(input => {
      input.classList.remove('error');
      if (!input.value.trim()) {
        input.classList.add('error');
        valid = false;
      }
    });

    const emailField = document.getElementById('email');
    if (emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      emailField.classList.add('error');
      valid = false;
    }

    if (valid) {
      modal.classList.add('show');
      contactForm.reset();
    }
  });

  contactForm.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => field.classList.remove('error'));
  });

  closeModal.addEventListener('click', () => modal.classList.remove('show'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('show');
  });

  // ─── SUBTLE 3D TILT ON SERVICE CARDS ───
  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.15s ease';
    });
  });

  // ─── MAGNETIC BUTTON EFFECT ───
  const magneticBtns = document.querySelectorAll('.magnetic');

  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'transform 0.12s ease';
    });
  });

  // ─── AMBIENT FLOATING DOTS ───
  const ambientContainer = document.getElementById('ambient-dots');

  function createAmbientDot() {
    const dot = document.createElement('div');
    dot.classList.add('ambient-dot');

    const size = 3 + Math.random() * 5;
    const colors = ['rgba(232,114,92,0.2)', 'rgba(124,182,157,0.2)', 'rgba(212,168,83,0.18)', 'rgba(91,127,199,0.15)'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const duration = 4 + Math.random() * 6;

    dot.style.width = size + 'px';
    dot.style.height = size + 'px';
    dot.style.background = color;
    dot.style.left = Math.random() * 100 + 'vw';
    dot.style.top = 20 + Math.random() * 80 + 'vh';
    dot.style.animationDuration = duration + 's';

    ambientContainer.appendChild(dot);
    dot.addEventListener('animationend', () => dot.remove());
  }

  // Spawn dots periodically (subtle, not overwhelming)
  setInterval(createAmbientDot, 2000);
  // Initial batch
  for (let i = 0; i < 4; i++) setTimeout(createAmbientDot, i * 400);

  // ─── ACTIVE NAV HIGHLIGHT ───
  const sections = document.querySelectorAll('.section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a:not(.btn-nav)');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) current = section.getAttribute('id');
    });

    navAnchors.forEach(a => {
      a.classList.remove('nav-active');
      if (a.getAttribute('href') === '#' + current) a.classList.add('nav-active');
    });
  }, { passive: true });

  // ─── GALLERY CLICK SCALE ───
  document.querySelectorAll('.mosaic-item').forEach(item => {
    item.addEventListener('click', () => {
      item.style.transition = 'none';
      item.style.transform = 'scale(0.97)';
      requestAnimationFrame(() => {
        item.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        item.style.transform = 'scale(1)';
      });
    });
  });

  // ─── PARALLAX HERO ORBS ON MOUSE ───
  const orbs = document.querySelectorAll('.hero-orb');
  const hero = document.getElementById('hero');

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    orbs.forEach((orb, i) => {
      const speed = (i + 1) * 12;
      orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
  });

  hero.addEventListener('mouseleave', () => {
    orbs.forEach(orb => {
      orb.style.transition = 'transform 1s ease';
      orb.style.transform = 'translate(0, 0)';
    });
  });

  // ─── DYNAMIC STYLES ───
  const style = document.createElement('style');
  style.textContent = `
    .nav-active {
      color: var(--clr-dark) !important;
      background: rgba(26,26,46,0.04) !important;
    }
  `;
  document.head.appendChild(style);
});
