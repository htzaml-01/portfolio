/* ==========================================================================
   INTERACTIVE JAVASCRIPT - PORTFOLIO AZZAM
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --- 1. INTERACTIVE CURSOR GLOW --- */
  const cursorGlow = document.querySelector('.cursor-glow');

  if (cursorGlow) {
    // Only enable glow tracker on desktop (non-touch) devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice) {
      document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
      });

      // Enlarge cursor when hovering over interactive elements
      const interactives = document.querySelectorAll('a, button, .project-card, .service-card, .tool-badge, .form-input');
      interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursorGlow.style.width = '380px';
          cursorGlow.style.height = '380px';
          cursorGlow.style.background = 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)';
        });

        el.addEventListener('mouseleave', () => {
          cursorGlow.style.width = '300px';
          cursorGlow.style.height = '300px';
          cursorGlow.style.background = 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%)';
        });
      });
    } else {
      cursorGlow.style.display = 'none';
    }
  }

  /* --- 2. MOBILE MENU TOGGLE --- */
  const menuToggle = document.querySelector('.menu-toggle');
  const navPill = document.querySelector('.nav-pill');

  if (menuToggle && navPill) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navPill.classList.toggle('active');

      // Toggle menu icon between bars and times (close)
      const icon = menuToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navPill.classList.contains('active') && !navPill.contains(e.target) && e.target !== menuToggle) {
        navPill.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      }
    });

    // Close menu when clicking on nav link
    const navLinks = navPill.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navPill.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      });
    });
  }

  /* --- 3. SCROLL ACTIVE LINK OBSERVER --- */
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-pill a');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies the active scroll view
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  /* --- 4. MODAL INTERACTION ("LET'S TALK") --- */
  const talkModal = document.querySelector('.talk-modal');
  const openModalBtns = document.querySelectorAll('.btn-cta, .btn-open-modal');
  const closeModalBtn = document.querySelector('.modal-close');

  if (talkModal && openModalBtns.length > 0) {
    openModalBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        talkModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop background scrolling
      });
    });
  }

  if (talkModal && closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      talkModal.classList.remove('active');
      document.body.style.overflow = '';
    });

    // Close when clicking modal backdrop
    talkModal.addEventListener('click', (e) => {
      if (e.target === talkModal) {
        talkModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  /* --- 5. PROJECTS GALLERY FILTER --- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle active button
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');

          if (filterValue === 'all' || category === filterValue) {
            // Show card
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
          } else {
            // Hide card
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  /* --- 6. STATS COUNTER ANIMATION --- */
  const statsSection = document.querySelector('#about');
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  const animateStats = () => {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-count') || stat.getAttribute('data-target'), 10);
      if (!target) return;
      let current = 0;
      const duration = 2000; // 2 seconds animation
      const increment = target / (duration / 16); // ~60fps

      const updateCount = () => {
        current += increment;
        if (current < target) {
          stat.textContent = Math.ceil(current);
          requestAnimationFrame(updateCount);
        } else {
          stat.textContent = target;
        }
      };

      updateCount();
    });
  };

  if (statsSection && statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
          animateStats();
          statsAnimated = true;
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }

  /* --- 7. SKILLS PROGRESS ANIMATION --- */
  const skillsSection = document.querySelector('#skills');
  const skillFills = document.querySelectorAll('.skill-fill');
  let skillsAnimated = false;

  const animateSkills = () => {
    skillFills.forEach(fill => {
      const targetWidth = fill.getAttribute('data-width');
      fill.style.width = `${targetWidth}%`;
    });
  };

  if (skillsSection && skillFills.length > 0) {
    const skillsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !skillsAnimated) {
          animateSkills();
          skillsAnimated = true;
        }
      });
    }, { threshold: 0.2 });

    skillsObserver.observe(skillsSection);
  }

  /* --- 8. DYNAMIC FORM FEEDBACK --- */
  const contactForm = document.querySelector('#contact-form');
  const modalForm = document.querySelector('#modal-form');

  const setupFormHandling = (form) => {
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Retrieve submit button
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      // Set to loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

      // Simulate API submit delay
      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent successfully!';
        submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)'; // Emerald Green

        // Reset form input
        form.reset();

        // Reset button state after 3 seconds
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';

          // Close modal if inside modal
          if (form.id === 'modal-form' && talkModal.classList.contains('active')) {
            talkModal.classList.remove('active');
            document.body.style.overflow = '';
          }
        }, 3000);

      }, 1500);
    });
  };

  setupFormHandling(contactForm);
  setupFormHandling(modalForm);
});
