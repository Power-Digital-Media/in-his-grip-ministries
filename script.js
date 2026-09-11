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

  /* --- Hero Video Controls & Autoplay --- */
  const heroVideo = document.getElementById('heroVideo');
  const heroSoundToggle = document.getElementById('heroSoundToggle');
  const heroPlayToggle = document.getElementById('heroPlayToggle');

  if (heroVideo) {
    // Attempt playback (safely catch low-power mode or browser policy blocks)
    heroVideo.play().catch(() => {
      // Browser prevented autoplay
    });

    // Sound toggle
    if (heroSoundToggle) {
      heroSoundToggle.addEventListener('click', () => {
        heroVideo.muted = !heroVideo.muted;
        const isMuted = heroVideo.muted;
        const iconMuted = heroSoundToggle.querySelector('.icon-muted');
        const iconUnmuted = heroSoundToggle.querySelector('.icon-unmuted');
        const text = heroSoundToggle.querySelector('.hero__control-text');

        if (iconMuted && iconUnmuted && text) {
          iconMuted.style.display = isMuted ? '' : 'none';
          iconUnmuted.style.display = isMuted ? 'none' : '';
          text.textContent = isMuted ? 'Sound' : 'Mute';
        }
        heroSoundToggle.setAttribute('aria-label', isMuted ? 'Unmute video sound' : 'Mute video sound');
      });
    }

    // Play/Pause toggle
    if (heroPlayToggle) {
      heroPlayToggle.addEventListener('click', () => {
        if (heroVideo.paused) {
          heroVideo.dataset.manuallyPaused = '';
          delete heroVideo.dataset.manuallyPaused;
          heroVideo.play();
        } else {
          heroVideo.dataset.manuallyPaused = 'true';
          heroVideo.pause();
        }
      });

      heroVideo.addEventListener('play', () => {
        const iconPause = heroPlayToggle.querySelector('.icon-pause');
        const iconPlay = heroPlayToggle.querySelector('.icon-play');
        const text = heroPlayToggle.querySelector('.hero__control-text');
        if (iconPause && iconPlay && text) {
          iconPause.style.display = '';
          iconPlay.style.display = 'none';
          text.textContent = 'Pause';
        }
        heroPlayToggle.setAttribute('aria-label', 'Pause background video');
      });

      heroVideo.addEventListener('pause', () => {
        const iconPause = heroPlayToggle.querySelector('.icon-pause');
        const iconPlay = heroPlayToggle.querySelector('.icon-play');
        const text = heroPlayToggle.querySelector('.hero__control-text');
        if (iconPause && iconPlay && text) {
          iconPause.style.display = 'none';
          iconPlay.style.display = '';
          text.textContent = 'Play';
        }
        heroPlayToggle.setAttribute('aria-label', 'Play background video');
      });
    }

    // Pause video when scrolled out of view to save CPU/GPU resources
    if ('IntersectionObserver' in window) {
      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (heroVideo.paused && heroVideo.dataset.manuallyPaused !== 'true') {
              heroVideo.play().catch(() => {});
            }
          } else {
            if (!heroVideo.paused) {
              heroVideo.pause();
            }
          }
        });
      }, { threshold: 0.1 });

      const heroSection = document.getElementById('hero');
      if (heroSection) heroObserver.observe(heroSection);
    }
  }

  /* --- Parallax on hero background --- */
  const heroBgMedia = document.querySelector('.hero__video') || document.querySelector('.hero__bg img');
  if (heroBgMedia && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroBgMedia.style.transform = `translateY(${scrolled * 0.25}px) scale(1.04)`;
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

  /* --- Dynamic Copyright Year --- */
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  /* --- Floating Give Button Scroll Fade-Out --- */
  const floatingGive = document.getElementById('floatingGive');
  const giveSection = document.getElementById('give');

  if (floatingGive && giveSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          floatingGive.classList.add('hidden');
        } else {
          floatingGive.classList.remove('hidden');
        }
      });
    }, {
      threshold: 0.05
    });
    observer.observe(giveSection);
  }

});
