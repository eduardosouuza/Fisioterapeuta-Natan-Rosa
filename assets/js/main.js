/* ═══════════════════════════════════════════════════════════
   NR Fisioterapeuta — Main JavaScript
   ═══════════════════════════════════════════════════════════ */

// ─── DOM Elements ───
const menuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const overlay = document.getElementById('mobile-overlay');
const navInner = document.getElementById('nav-inner');
const mainNav = document.getElementById('main-nav');
const navWrapper = document.getElementById('nav-wrapper');
const navLinks = document.querySelectorAll('.nav-link-item');

// ─── Mobile Menu ───
menuBtn.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  menuBtn.classList.toggle('menu-open', isOpen);
  menuBtn.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  overlay.classList.toggle('opacity-0', !isOpen);
  overlay.classList.toggle('pointer-events-none', !isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  menuBtn.classList.remove('menu-open');
  menuBtn.setAttribute('aria-label', 'Abrir menu');
  overlay.classList.add('opacity-0', 'pointer-events-none');
  document.body.style.overflow = '';
}

overlay.addEventListener('click', closeMobileMenu);

// ─── Scroll-based Navbar Effect ───
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollY > 50) {
    mainNav.classList.add('nav-scrolled');
    navInner.classList.remove('rounded-2xl');
    navInner.classList.add('rounded-xl');
    navWrapper.classList.remove('pt-5');
    navWrapper.classList.add('pt-2');
  } else {
    mainNav.classList.remove('nav-scrolled');
    navInner.classList.add('rounded-2xl');
    navInner.classList.remove('rounded-xl');
    navWrapper.classList.add('pt-5');
    navWrapper.classList.remove('pt-2');
  }
});

// ─── Active Section Tracking ───
const sections = document.querySelectorAll('section[id]');
const observerOptions = { rootMargin: '-20% 0px -60% 0px' };

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.section === id);
      });
    }
  });
}, observerOptions);

sections.forEach(section => observer.observe(section));

// Highlight "Início" when at the top of the page
window.addEventListener('scroll', () => {
  if (window.scrollY < 200) {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === 'inicio');
    });
  }
}, { passive: true });

// ─── Smooth Scroll for Anchor Links ───
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') {
      e.preventDefault();
      closeMobileMenu();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      history.pushState(null, null, ' ');
      return;
    }
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      closeMobileMenu();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, null, targetId);
    }
  });
});

// ─── Parallax Scroll Reveal ───
const revealEls = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// ─── Parallax Blob / Background Movement ───
const parallaxEls = document.querySelectorAll('[data-parallax]');
let ticking = false;
function updateParallax() {
  const scrollY = window.scrollY;
  parallaxEls.forEach(el => {
    const speed = parseFloat(el.dataset.parallax) || 0.15;
    const rect = el.closest('section')?.getBoundingClientRect();
    if (rect && rect.bottom > -200 && rect.top < window.innerHeight + 200) {
      const offset = (scrollY - (el.closest('section')?.offsetTop || 0)) * speed;
      el.style.transform = `translateY(${offset}px)`;
    }
  });
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; }
}, { passive: true });

// ─── Auto-apply Reveal to Major Elements ───
function autoReveal() {
  // Section headers
  document.querySelectorAll('section .text-center:first-child, section > div > .text-center:first-child').forEach(el => {
    if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', 'up');
  });
  // Grid cards
  document.querySelectorAll('.grid > div, .grid > a').forEach((el, i) => {
    if (!el.hasAttribute('data-reveal')) {
      el.setAttribute('data-reveal', 'up');
      el.setAttribute('data-reveal-delay', String(Math.min(i % 4 + 1, 4)));
    }
  });
  // Decorative blobs get parallax
  document.querySelectorAll('[class*="blur-["]').forEach((el, i) => {
    if (!el.hasAttribute('data-parallax')) {
      el.setAttribute('data-parallax', String(0.08 + (i % 3) * 0.06));
    }
  });
  // Re-observe newly tagged elements
  document.querySelectorAll('[data-reveal]:not(.revealed)').forEach(el => revealObserver.observe(el));
}
autoReveal();
