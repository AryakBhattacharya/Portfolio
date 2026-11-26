/**
 * ==========================================================================
 * Aryak Bhattacharya — Portfolio Interactions & Animation Scripts
 * Features: Interactive Hero Canvas, Bi-Directional Scroll Reveals,
 *           Progress Tracking, View Switcher & Micro-Interactions
 * ==========================================================================
 */

(function () {
  "use strict";

  // ---- 0. Light / Dark Mode Theme Toggle ----
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const mobileThemeToggle = document.getElementById("mobile-theme-toggle");

  function syncThemeUI(theme) {
    const isLight = theme === "light";
    const label = isLight ? "Switch to dark mode" : "Switch to light mode";
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute("aria-label", label);
      themeToggleBtn.setAttribute("title", label);
    }
    if (mobileThemeToggle) {
      mobileThemeToggle.textContent = isLight ? "☾ Switch to Dark Mode" : "☀ Switch to Light Mode";
    }
  }

  function toggleTheme() {
    const currentIsLight = document.documentElement.getAttribute("data-theme") === "light";
    const nextTheme = currentIsLight ? "dark" : "light";

    if (nextTheme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }

    try {
      localStorage.setItem("portfolio-theme", nextTheme);
    } catch (e) {}

    syncThemeUI(nextTheme);
  }

  const initialTheme = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  syncThemeUI(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", toggleTheme);
  }
  if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener("click", toggleTheme);
  }

  // ---- 1. Interactive Dynamic Hero Canvas (Item 1) ----
  const heroSection = document.getElementById("hero");
  const heroCanvas = document.getElementById("hero-interactive-canvas");

  if (heroCanvas && heroSection) {
    const ctx = heroCanvas.getContext("2d");
    let width = (heroCanvas.width = heroSection.offsetWidth);
    let height = (heroCanvas.height = heroSection.offsetHeight);

    let mouse = {
      x: width / 2,
      y: height / 2,
      active: false,
      radius: 190,
    };

    function resizeCanvas() {
      if (!heroSection || !heroCanvas) return;
      width = heroCanvas.width = heroSection.offsetWidth;
      height = heroCanvas.height = heroSection.offsetHeight;
    }

    window.addEventListener("resize", resizeCanvas, { passive: true });

    heroSection.addEventListener("mousemove", (e) => {
      const rect = heroSection.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });

    heroSection.addEventListener("mouseleave", () => {
      mouse.active = false;
    });

    // Particle nodes definition
    const nodeCount = Math.min(Math.floor((width * height) / 17500), 55);
    const nodes = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        baseRadius: Math.random() * 1.5 + 1,
        radius: 1.5,
        alpha: Math.random() * 0.35 + 0.15,
      });
    }

    let isHeroVisible = true;
    const heroObserver = new IntersectionObserver((entries) => {
      isHeroVisible = entries[0].isIntersecting;
    }, { threshold: 0.05 });
    heroObserver.observe(heroSection);

    function renderHeroCanvas() {
      if (!isHeroVisible) {
        requestAnimationFrame(renderHeroCanvas);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      const nodeRgb = isLight ? "37, 99, 235" : "56, 189, 248";

      // Soft interactive radial spotlight glow at cursor position
      if (mouse.active) {
        const glowGradient = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          10,
          mouse.x,
          mouse.y,
          mouse.radius
        );
        if (isLight) {
          glowGradient.addColorStop(0, "rgba(2, 132, 199, 0.14)");
          glowGradient.addColorStop(0.5, "rgba(37, 99, 235, 0.06)");
          glowGradient.addColorStop(1, "rgba(246, 248, 252, 0)");
        } else {
          glowGradient.addColorStop(0, "rgba(56, 189, 248, 0.14)");
          glowGradient.addColorStop(0.5, "rgba(37, 99, 235, 0.06)");
          glowGradient.addColorStop(1, "rgba(9, 10, 13, 0)");
        }

        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i];

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            p.x -= (dx / dist) * force * 1.6;
            p.y -= (dy / dist) * force * 1.6;
            p.radius = p.baseRadius + force * 1.6;
          } else {
            p.radius = p.baseRadius;
          }
        } else {
          p.radius = p.baseRadius;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${nodeRgb}, ${isLight ? p.alpha * 1.15 : p.alpha})`;
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const p2 = nodes[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 135) {
            const lineAlpha = (1 - dist / 135) * (isLight ? 0.20 : 0.16);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${nodeRgb}, ${lineAlpha})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(renderHeroCanvas);
    }

    renderHeroCanvas();
  }

  // ---- 2. Scroll Progress Line & Floating Back-To-Top Indicator ----
  const progressBar = document.getElementById("scroll-progress-bar");
  const floatingScrollBtn = document.getElementById("floating-scroll-btn");
  const scrollPercentageText = document.getElementById("scroll-percentage-text");
  const navbarEl = document.getElementById("navbar");

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;

    if (progressBar) {
      progressBar.style.width = `${scrollPercent.toFixed(1)}%`;
    }

    if (floatingScrollBtn && scrollPercentageText) {
      scrollPercentageText.textContent = `${Math.round(scrollPercent)}%`;
      if (scrollTop > 350) {
        floatingScrollBtn.classList.add("visible");
      } else {
        floatingScrollBtn.classList.remove("visible");
      }
    }

    if (navbarEl) {
      navbarEl.classList.toggle("is-scrolled", scrollTop > 80);
    }
  }, { passive: true });

  if (floatingScrollBtn) {
    floatingScrollBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ---- 3. BI-DIRECTIONAL SCROLL REVEALS (50% Window Opening Threshold) ----
  // Timing triggers when section opens 50% in the website window,
  // and reverses ("vice versa") when scrolling back up past that threshold.
  const sectionsToReveal = document.querySelectorAll("section[id]");

  let ticking = false;

  function updateBiDirectionalReveals() {
    const vh = window.innerHeight;
    const cardTriggerThreshold = vh * 0.50; // Section is 50% into viewport window
    const headerTriggerThreshold = vh * 0.85; // Section header announces gently as section approaches

    sectionsToReveal.forEach((sec) => {
      if (sec.id === "hero") return;

      const rect = sec.getBoundingClientRect();
      
      // When scrolling down, card animations start when section top reaches 50% of viewport window.
      // As long as user is reading inside the section (rect.bottom >= 60), cards stay revealed.
      // Vice versa: when scrolling back up and section top leaves below 50% of window (rect.top > cardTriggerThreshold),
      // or when scrolling completely past section, cards reverse and retract.
      const is50PercentOpen = rect.top <= cardTriggerThreshold && rect.bottom >= 60;
      const isHeaderInView = rect.top <= headerTriggerThreshold && rect.bottom >= 60;

      const headerEl = sec.querySelector(".section-header.reveal-element");
      const cardElements = sec.querySelectorAll(".reveal-element:not(.section-header)");

      // Header reveal (introductory cue)
      if (headerEl) {
        if (isHeaderInView) {
          headerEl.classList.add("is-revealed");
        } else {
          headerEl.classList.remove("is-revealed");
        }
      }

      // Card reveals (strictly synchronized to 50% window opening & bi-directional reverse)
      if (is50PercentOpen) {
        sec.classList.add("section-in-view");
        cardElements.forEach((el) => {
          el.classList.add("is-revealed");
        });
      } else {
        // Reverse animation when scrolling back up above 50% line
        sec.classList.remove("section-in-view");
        cardElements.forEach((el) => {
          el.classList.remove("is-revealed");
        });
      }
    });

    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(updateBiDirectionalReveals);
      ticking = true;
    }
  }, { passive: true });

  // Initial trigger on load
  setTimeout(updateBiDirectionalReveals, 80);

  // ---- 4. Typewriter Effect for Hero Role ----
  const typedEl = document.getElementById("typed-role");
  const roles = [
    "AI Engineer & Researcher",
    "Computer Vision Specialist",
    "Full-Stack ML Systems Builder",
    "Reinforcement Learning & World Models",
  ];
  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function typeRole() {
    if (!typedEl) return;
    const currentRole = roles[roleIdx];
    const speed = isDeleting ? 30 : 65;

    if (!isDeleting) {
      typedEl.textContent = currentRole.slice(0, charIdx + 1);
      charIdx++;

      if (charIdx === currentRole.length) {
        isDeleting = true;
        setTimeout(typeRole, 2200);
        return;
      }
    } else {
      typedEl.textContent = currentRole.slice(0, charIdx - 1);
      charIdx--;

      if (charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
    }

    setTimeout(typeRole, speed);
  }

  typeRole();

  // ---- 5. Interactive Copy Email with Toast Notice ----
  const toastNotice = document.getElementById("toast-notice");
  const toastMsg = document.getElementById("toast-msg");
  let toastTimer = null;

  function showToast(message) {
    if (!toastNotice) return;
    if (toastMsg) toastMsg.textContent = message;
    toastNotice.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotice.classList.remove("show");
    }, 3200);
  }

  function copyEmailToClipboard(email = "aryakbhattacharya@gmail.com") {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(() => {
        showToast("Copied to clipboard: " + email);
      }).catch(() => {
        showToast("Email: " + email);
      });
    } else {
      showToast("Email: " + email);
    }
  }

  const copyTopBtn = document.getElementById("copy-email-top");
  if (copyTopBtn) {
    copyTopBtn.addEventListener("click", () => copyEmailToClipboard());
  }

  const contactEmailLink = document.getElementById("contact-email-link");
  if (contactEmailLink) {
    contactEmailLink.addEventListener("click", () => {
      copyEmailToClipboard();
    });
  }

  // ---- 6. DUAL VIEW SWITCHER & SCROLL-DRIVEN HORIZONTAL PROJECTS TRACK ----
  const projectsSection = document.getElementById("projects");
  const projectsRunway = document.getElementById("projects-scroll-runway");
  const trackViewport = document.getElementById("projects-track-viewport");
  const projectsTrack = document.getElementById("projects-grid-root");
  const controlsBar = document.getElementById("projects-controls-bar");
  const hudProgressFill = document.getElementById("hud-progress-fill");
  const hudProgressPercent = document.getElementById("hud-progress-percent");
  const hudPrevBtn = document.getElementById("hud-prev-btn");
  const hudNextBtn = document.getElementById("hud-next-btn");

  const btnViewFilter = document.getElementById("btn-view-filter");
  const btnViewTimeline = document.getElementById("btn-view-timeline");
  const containerFilter = document.getElementById("view-filter-container");
  const containerTimeline = document.getElementById("view-timeline-container");

  let maxTranslate = 0;
  let targetTranslateX = 0;
  let currentTranslateX = 0;
  let isAnimatingTrack = false;

  function animateTrack() {
    if (!projectsTrack || !projectsSection) {
      isAnimatingTrack = false;
      return;
    }
    if (window.innerWidth <= 768 || projectsSection.classList.contains("timeline-mode-active")) {
      isAnimatingTrack = false;
      return;
    }

    const diff = targetTranslateX - currentTranslateX;
    if (Math.abs(diff) < 0.35) {
      currentTranslateX = targetTranslateX;
      projectsTrack.style.transform = `translate3d(${currentTranslateX.toFixed(2)}px, 0, 0)`;
      isAnimatingTrack = false;
      return;
    }

    currentTranslateX += diff * 0.18;
    projectsTrack.style.transform = `translate3d(${currentTranslateX.toFixed(2)}px, 0, 0)`;
    requestAnimationFrame(animateTrack);
  }

  function startTrackAnimation() {
    if (!isAnimatingTrack) {
      isAnimatingTrack = true;
      requestAnimationFrame(animateTrack);
    }
  }

  function computeHorizontalTarget() {
    if (!projectsRunway || !projectsSection || !projectsTrack) return;
    if (window.innerWidth <= 768 || projectsSection.classList.contains("timeline-mode-active")) {
      return;
    }

    const rect = projectsRunway.getBoundingClientRect();
    const vh = window.innerHeight;
    const totalScrollable = Math.max(1, projectsRunway.offsetHeight - vh);
    const rawProgress = maxTranslate > 0 ? (-rect.top / totalScrollable) : 0;
    const progress = Math.max(0, Math.min(1, rawProgress));

    targetTranslateX = -(progress * maxTranslate);

    if (hudProgressFill) {
      hudProgressFill.style.width = `${(progress * 100).toFixed(1)}%`;
    }
    if (hudProgressPercent) {
      hudProgressPercent.textContent = `${Math.round(progress * 100)}%`;
    }

    startTrackAnimation();
  }

  function updateProjectsTrackLayout() {
    if (!projectsRunway || !projectsSection || !trackViewport || !projectsTrack) return;

    if (window.innerWidth <= 768 || projectsSection.classList.contains("timeline-mode-active")) {
      projectsRunway.style.height = "auto";
      projectsTrack.style.transform = "";
      maxTranslate = 0;
      targetTranslateX = 0;
      currentTranslateX = 0;
      return;
    }

    const trackWidth = projectsTrack.scrollWidth;
    const viewportWidth = trackViewport.clientWidth;
    maxTranslate = Math.max(0, trackWidth - viewportWidth);

    const vh = window.innerHeight;
    projectsRunway.style.height = `${vh + maxTranslate}px`;
    computeHorizontalTarget();
  }

  window.addEventListener("scroll", computeHorizontalTarget, { passive: true });
  window.addEventListener("resize", () => {
    updateProjectsTrackLayout();
    updateBiDirectionalReveals();
  }, { passive: true });

  if (hudPrevBtn) {
    hudPrevBtn.addEventListener("click", () => {
      window.scrollBy({ top: -440, behavior: "smooth" });
    });
  }

  if (hudNextBtn) {
    hudNextBtn.addEventListener("click", () => {
      window.scrollBy({ top: 440, behavior: "smooth" });
    });
  }

  function setProjectView(viewName) {
    if (viewName === "timeline") {
      btnViewTimeline?.classList.add("active");
      btnViewFilter?.classList.remove("active");
      containerTimeline?.classList.add("active-view");
      containerFilter?.classList.remove("active-view");

      projectsSection?.classList.add("timeline-mode-active");
      projectsSection?.classList.remove("projects-horizontal-mode");
      controlsBar?.classList.add("is-hidden");

      containerTimeline?.querySelectorAll(".reveal-element").forEach((el) => {
        el.classList.add("is-revealed");
      });
    } else {
      btnViewFilter?.classList.add("active");
      btnViewTimeline?.classList.remove("active");
      containerFilter?.classList.add("active-view");
      containerTimeline?.classList.remove("active-view");

      projectsSection?.classList.remove("timeline-mode-active");
      projectsSection?.classList.add("projects-horizontal-mode");
      controlsBar?.classList.remove("is-hidden");

      containerFilter?.querySelectorAll(".reveal-element").forEach((el) => {
        el.classList.add("is-revealed");
      });
    }

    requestAnimationFrame(() => {
      updateProjectsTrackLayout();
      updateBiDirectionalReveals();
    });
  }

  if (btnViewFilter && btnViewTimeline) {
    btnViewFilter.addEventListener("click", () => setProjectView("filter"));
    btnViewTimeline.addEventListener("click", () => setProjectView("timeline"));
  }

  // ---- 7. Projects Filter Pills (for View A Horizontal Track) ----
  const filterPills = document.querySelectorAll(".filter-pill");
  const projectCards = document.querySelectorAll("#projects-grid-root .project-card");

  filterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      filterPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");

      const category = pill.getAttribute("data-filter");

      projectCards.forEach((card) => {
        const cardCats = (card.getAttribute("data-category") || "").split(/\s+/);
        if (category === "all" || cardCats.includes(category)) {
          card.style.display = "flex";
          card.style.opacity = "1";
          card.style.transform = "";
          card.classList.add("is-revealed");
        } else {
          card.style.display = "none";
        }
      });

      updateProjectsTrackLayout();

      // Snap cleanly back to the start of the horizontal track if user scrolled past it
      if (projectsRunway && projectsSection && window.innerWidth > 768) {
        const runwayRect = projectsRunway.getBoundingClientRect();
        if (runwayRect.top < -20) {
          window.scrollTo({ top: projectsSection.offsetTop, behavior: "smooth" });
        }
      }
    });
  });

  // Initialize horizontal track measurements after layout & fonts settle
  window.addEventListener("load", updateProjectsTrackLayout);
  setTimeout(updateProjectsTrackLayout, 100);

  // ---- 8. Interactive 3D Tilt for Portrait Card ----
  const portraitCard = document.getElementById("portrait-card");
  if (portraitCard) {
    portraitCard.addEventListener("mousemove", (e) => {
      const rect = portraitCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const midX = rect.width / 2;
      const midY = rect.height / 2;

      const rotateY = ((x - midX) / midX) * 7;
      const rotateX = -((y - midY) / midY) * 7;

      portraitCard.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    portraitCard.addEventListener("mouseleave", () => {
      portraitCard.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)";
    });
  }

  // ---- 9. Interactive Tactile Stickers (Hero) ----
  const stickers = document.querySelectorAll(".interactive-sticker");
  stickers.forEach((sticker) => {
    sticker.addEventListener("mouseenter", () => {
      const randomDeg = (Math.random() * 8 - 4).toFixed(1);
      sticker.style.transform = `translateY(-4px) rotate(${randomDeg}deg) scale(1.05)`;
    });

    sticker.addEventListener("mouseleave", () => {
      sticker.style.transform = "translateY(0) rotate(0deg) scale(1)";
    });
  });

  // ---- 10. Navigation ScrollSpy & Mobile Drawer ----
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");

  window.addEventListener("scroll", () => {
    let currentId = "";
    const scrollPos = window.scrollY + 200;

    sections.forEach((sec) => {
      if (scrollPos >= sec.offsetTop) {
        currentId = sec.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
    });
  }, { passive: true });

  const mobileToggle = document.getElementById("mobile-toggle");
  const mobileDrawer = document.getElementById("mobile-drawer");

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener("click", () => {
      const isVisible = mobileDrawer.style.display !== "none";
      mobileDrawer.style.display = isVisible ? "none" : "flex";
      mobileToggle.textContent = isVisible ? "☰" : "✕";
    });

    document.querySelectorAll(".mobile-link").forEach((link) => {
      link.addEventListener("click", () => {
        mobileDrawer.style.display = "none";
        mobileToggle.textContent = "☰";
      });
    });
  }

  // ---- 11. Contact Form Email Trigger ----
  const contactForm = document.getElementById("contact-form");
  const formNote = document.getElementById("form-note");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();

      if (!name || !email || !message) {
        if (formNote) {
          formNote.textContent = "Please fill in all fields.";
          formNote.className = "form-note error";
        }
        return;
      }

      const mailtoLink = `mailto:aryakbhattacharya@gmail.com?subject=Portfolio Inquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${message}`)}`;
      window.location.href = mailtoLink;

      if (formNote) {
        formNote.textContent = "Opening your email client...";
        formNote.className = "form-note success";
      }

      contactForm.reset();
    });
  }

})();
