/* ==========================================================================
   RAYYAN SOHAIL — PORTFOLIO
   Interactions
   ========================================================================== */
(function(){
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Preloader ---------------- */
  window.addEventListener('load', () => {
    const pre = document.getElementById('preloader');
    setTimeout(() => pre && pre.classList.add('loaded'), 500);
  });

  /* ---------------- Navbar scroll state ---------------- */
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scrollTop');
  function onScroll(){
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 40);
    scrollTopBtn.classList.toggle('show', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top:0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ---------------- Mobile menu ---------------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuBackdrop = document.getElementById('menuBackdrop');

  function toggleMenu(open){
    const isOpen = open !== undefined ? open : !mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open', isOpen);
    menuBackdrop.classList.toggle('open', isOpen);
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }
  hamburger.addEventListener('click', () => toggleMenu());
  menuBackdrop.addEventListener('click', () => toggleMenu(false));
  document.querySelectorAll('.mobile-menu a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

  /* ---------------- Active nav link on scroll ---------------- */
  const sections = Array.from(document.querySelectorAll('main section[id], section#home'));
  const navAnchors = document.querySelectorAll('a[data-nav]');

  function setActiveNav(id){
    navAnchors.forEach(a => {
      const match = a.getAttribute('href') === `#${id}`;
      a.classList.toggle('active', match);
    });
  }

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        setActiveNav(entry.target.id);
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  document.querySelectorAll('section[id]').forEach(s => navObserver.observe(s));

  /* ---------------- Scroll reveal ---------------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if(reduceMotion){
    revealEls.forEach(el => el.classList.add('in'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold:0.15, rootMargin:'0px 0px -60px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ---------------- Animated counters ---------------- */
  const counters = document.querySelectorAll('.counter');
  function animateCounter(el){
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();
    function tick(now){
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if(p < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    }
    if(reduceMotion){ el.textContent = target + suffix; return; }
    requestAnimationFrame(tick);
  }
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold:0.6 });
  counters.forEach(c => counterObserver.observe(c));

  /* ---------------- Skill bars + rings ---------------- */
  const skillSection = document.getElementById('skills');
  let skillsAnimated = false;
  function animateSkills(){
    if(skillsAnimated) return;
    skillsAnimated = true;
    document.querySelectorAll('.bar-fill').forEach(bar => {
      requestAnimationFrame(() => { bar.style.width = bar.dataset.width + '%'; });
    });
    document.querySelectorAll('.ring-fg').forEach(ring => {
      const val = parseInt(ring.dataset.ring, 10);
      const circumference = 264;
      const offset = circumference - (val/100) * circumference;
      requestAnimationFrame(() => { ring.style.strokeDashoffset = offset; });
    });
  }
  if(skillSection){
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if(entry.isIntersecting) animateSkills(); });
    }, { threshold:0.3 });
    skillObserver.observe(skillSection);
  }

  /* ---------------- Growth chart draw-in ---------------- */
  const chartLine = document.getElementById('chartLine');
  const chartArea = document.getElementById('chartArea');
  let chartAnimated = false;
  function animateChart(){
    if(chartAnimated || !chartLine) return;
    chartAnimated = true;
    const length = chartLine.getTotalLength();
    chartLine.style.strokeDasharray = length;
    chartLine.style.strokeDashoffset = length;
    requestAnimationFrame(() => {
      chartLine.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(.22,1,.36,1)';
      chartLine.style.strokeDashoffset = 0;
    });
    setTimeout(() => {
      chartArea.style.transition = 'opacity 1s ease';
      chartArea.style.opacity = 1;
    }, 600);
  }
  const chartEl = document.getElementById('growthChart');
  if(chartEl){
    const chartObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if(entry.isIntersecting) animateChart(); });
    }, { threshold:0.4 });
    chartObserver.observe(chartEl);
  }

  /* ---------------- Hero floating particles ---------------- */
  const heroVisual = document.getElementById('heroVisual');
  if(heroVisual && !reduceMotion){
    const count = 14;
    for(let i=0;i<count;i++){
      const p = document.createElement('span');
      p.className = 'particle';
      const size = 2 + Math.random()*3;
      p.style.width = size+'px';
      p.style.height = size+'px';
      p.style.left = (Math.random()*100)+'%';
      p.style.top = (40 + Math.random()*50)+'%';
      p.style.animationDuration = (5 + Math.random()*6)+'s';
      p.style.animationDelay = (Math.random()*5)+'s';
      heroVisual.appendChild(p);
    }
  }

  /* ---------------- Magnetic buttons ---------------- */
  if(!reduceMotion && window.matchMedia('(hover:hover)').matches){
    document.querySelectorAll('[data-magnetic]').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width/2;
        const y = e.clientY - r.top - r.height/2;
        btn.style.transform = `translate(${x*0.18}px, ${y*0.35}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  /* ---------------- Service card glow follow ---------------- */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left)+'px');
      card.style.setProperty('--my', (e.clientY - r.top)+'px');
    });
  });

  /* ---------------- Project filter ---------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterableCards = document.querySelectorAll('[data-category]');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      filterableCards.forEach(card => {
        const cats = card.dataset.category.split(' ');
        const show = filter === 'all' || cats.includes(filter);
        card.style.display = show ? '' : 'none';
        if(show){
          card.style.animation = 'none';
          requestAnimationFrame(() => { card.style.animation = ''; card.classList.add('in'); });
        }
      });
    });
  });

  /* ---------------- Project modal ---------------- */
  const pmodalBackdrop = document.getElementById('pmodalBackdrop');
  const pmodalImg = document.getElementById('pmodalImg');
  const pmodalTitle = document.getElementById('pmodalTitle');
  const pmodalDesc = document.getElementById('pmodalDesc');
  const pmodalTags = document.getElementById('pmodalTags');
  const pmodalClose = document.getElementById('pmodalClose');

  document.querySelectorAll('[data-project-modal]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      pmodalImg.src = trigger.dataset.img;
      pmodalImg.alt = trigger.dataset.title;
      pmodalTitle.textContent = trigger.dataset.title;
      pmodalDesc.textContent = trigger.dataset.desc;
      pmodalTags.innerHTML = trigger.dataset.tags.split(',').map(t => `<span class="badge-chip">${t.trim()}</span>`).join('');
      pmodalBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
  function closeModal(){
    pmodalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }
  pmodalClose.addEventListener('click', closeModal);
  pmodalBackdrop.addEventListener('click', (e) => { if(e.target === pmodalBackdrop) closeModal(); });
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeModal(); });

  /* ---------------- Testimonials carousel ---------------- */
  const track = document.getElementById('testiTrack');
  const dotsWrap = document.getElementById('testiDots');
  const slides = track ? track.children : [];
  let activeSlide = 0;
  let testiTimer;

  if(track){
    Array.from(slides).forEach((_, i) => {
      const dot = document.createElement('button');
      if(i === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Go to testimonial ${i+1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsWrap.appendChild(dot);
    });

    function goToSlide(i){
      activeSlide = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${activeSlide * 100}%)`;
      Array.from(dotsWrap.children).forEach((d, idx) => d.classList.toggle('active', idx === activeSlide));
    }
    function nextSlide(){ goToSlide(activeSlide + 1); }

    function startAutoplay(){
      if(reduceMotion) return;
      testiTimer = setInterval(nextSlide, 5500);
    }
    function stopAutoplay(){ clearInterval(testiTimer); }

    track.parentElement.addEventListener('mouseenter', stopAutoplay);
    track.parentElement.addEventListener('mouseleave', startAutoplay);
    startAutoplay();

    // Basic swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; stopAutoplay(); }, { passive:true });
    track.addEventListener('touchend', (e) => {
      const diff = e.changedTouches[0].clientX - touchStartX;
      if(diff > 40) goToSlide(activeSlide - 1);
      else if(diff < -40) goToSlide(activeSlide + 1);
      startAutoplay();
    }, { passive:true });
  }

  /* ---------------- Toast notifications ---------------- */
  const toastWrap = document.getElementById('toastWrap');
  function showToast(title, msg, icon = 'fa-circle-check'){
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span class="t-ic"><i class="fa-solid ${icon}"></i></span><div><b>${title}</b><p>${msg}</p></div>`;
    toastWrap.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 450);
    }, 4200);
  }

  /* ---------------- Contact form validation (frontend-only) ---------------- */
  const contactForm = document.getElementById('contactForm');
  if(contactForm){
    const fields = {
      'cf-name':   v => v.trim().length >= 2 ? '' : 'Please enter your name.',
      'cf-email':  v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email.',
      'cf-subject':v => v.trim().length >= 3 ? '' : 'Please add a short subject.',
      'cf-message':v => v.trim().length >= 10 ? '' : 'Message should be at least 10 characters.'
    };

    function validateField(id){
      const el = document.getElementById(id);
      const errEl = contactForm.querySelector(`[data-error-for="${id}"]`);
      const msg = fields[id] ? fields[id](el.value) : '';
      el.classList.toggle('invalid', !!msg);
      if(errEl) errEl.textContent = msg;
      return !msg;
    }

    Object.keys(fields).forEach(id => {
      const el = document.getElementById(id);
      el.addEventListener('blur', () => validateField(id));
      el.addEventListener('input', () => { if(el.classList.contains('invalid')) validateField(id); });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const results = Object.keys(fields).map(validateField);
      const allValid = results.every(Boolean);
      if(!allValid){
        showToast('Please check the form', 'A few fields need your attention.', 'fa-triangle-exclamation');
        return;
      }
      const name = document.getElementById('cf-name').value.trim();
      showToast('Message sent!', `Thanks ${name.split(' ')[0]}, I'll get back to you shortly.`);
      contactForm.reset();
      Object.keys(fields).forEach(id => document.getElementById(id).classList.remove('invalid'));
    });
  }

  /* ---------------- Download resume placeholder ---------------- */
  const downloadResume = document.getElementById('downloadResume');
  if(downloadResume){
    downloadResume.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Resume unavailable', 'Add your PDF resume link to this button to enable downloads.', 'fa-file-arrow-down');
    });
  }

})();