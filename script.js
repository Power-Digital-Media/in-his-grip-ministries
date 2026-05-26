/* ============================================
   IN HIS GRIP MINISTRIES — Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Navbar scroll effect --- */
  const nav = document.getElementById('nav');
  const handleNavScroll = () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* --- Mobile toggle --- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile nav on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', false);
      });
    });
  }

  /* --- Scroll reveal (Intersection Observer) --- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: show everything
    revealEls.forEach(el => el.classList.add('revealed'));
  }

  /* --- Smooth scroll for anchor links --- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = nav.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* --- Active nav link highlighting --- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav__links a[href^="#"]');

  const highlightNav = () => {
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const top = section.offsetTop - 100;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < bottom) {
        navAnchors.forEach(a => {
          a.style.opacity = a.getAttribute('href') === `#${id}` ? '1' : '';
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });

  /* --- Parallax on hero background --- */
  const heroBg = document.querySelector('.hero__bg img');
  if (heroBg && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrolled * 0.3}px) scale(1.05)`;
      }
    }, { passive: true });
  }

  /* --- Gallery Lightbox --- */
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const bentoItems = document.querySelectorAll('.bento__item[data-lightbox]');
  let currentLightboxIndex = 0;

  function openLightbox(index) {
    currentLightboxIndex = index;
    const item = bentoItems[index];
    const img = item.querySelector('img');
    const caption = item.querySelector('.bento__caption');

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = caption ? caption.textContent : '';

    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function nextLightbox() {
    currentLightboxIndex = (currentLightboxIndex + 1) % bentoItems.length;
    openLightbox(currentLightboxIndex);
  }

  function prevLightbox() {
    currentLightboxIndex = (currentLightboxIndex - 1 + bentoItems.length) % bentoItems.length;
    openLightbox(currentLightboxIndex);
  }

  if (lightbox && bentoItems.length > 0) {
    bentoItems.forEach((item, i) => {
      item.addEventListener('click', () => openLightbox(i));
    });

    lightbox.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox__prev').addEventListener('click', prevLightbox);
    lightbox.querySelector('.lightbox__next').addEventListener('click', nextLightbox);

    // Close on backdrop click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
    });
  }

  /* --- Zelle Click to Copy --- */
  const zelleCard = document.getElementById('zelleCard');
  const zelleAction = document.getElementById('zelleAction');

  if (zelleCard && zelleAction) {
    zelleCard.addEventListener('click', () => {
      const copyText = zelleCard.getAttribute('data-copy');
      if (copyText) {
        navigator.clipboard.writeText(copyText).then(() => {
          zelleAction.innerHTML = '<span style="color: #B388FF; font-weight: 700;">✅ Copied to Clipboard!</span>';
          zelleAction.style.letterSpacing = '0.5px';
          zelleCard.style.borderColor = '#B388FF';
          
          setTimeout(() => {
            zelleAction.innerHTML = 'Tap to Copy Number →';
            zelleAction.style.letterSpacing = '';
            zelleCard.style.borderColor = '';
          }, 2500);
        }).catch(err => {
          console.error('Could not copy Zelle text: ', err);
        });
      }
    });
  }

});
