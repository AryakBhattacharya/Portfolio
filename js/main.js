/**
 * AI Portfolio — Interactions & Effects
 */

(function () {
  "use strict";

  // ---- Animated Grid Background ----
  const canvas = document.getElementById("grid-canvas");
  const ctx = canvas.getContext("2d");
  let mouse = { x: -1000, y: -1000 };
  const GRID_SIZE = 60;
  const DOT_RADIUS = 1;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cols = Math.ceil(canvas.width / GRID_SIZE) + 1;
    const rows = Math.ceil(canvas.height / GRID_SIZE) + 1;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * GRID_SIZE;
        const y = j * GRID_SIZE;
        const dx = x - mouse.x;
        const dy = y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 200;
        const intensity = Math.max(0, 1 - dist / maxDist);
        const alpha = 0.15 + intensity * 0.6;
        const radius = DOT_RADIUS + intensity * 2;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${alpha})`;
        ctx.fill();
      }
    }

    requestAnimationFrame(drawGrid);
  }

  resizeCanvas();
  drawGrid();

  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // ---- Typing Effect ----
  const typedEl = document.getElementById("typed-text");
  const roles = [
    "AI Engineer",
    "ML Researcher",
    "Deep Learning Specialist",
    "Data Scientist",
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    const current = roles[roleIndex];
    const speed = isDeleting ? 40 : 80;

    if (!isDeleting) {
      typedEl.textContent = current.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(typeEffect, 2000);
        return;
      }
    } else {
      typedEl.textContent = current.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }

    setTimeout(typeEffect, speed);
  }

  typeEffect();

  // ---- Navigation Scroll ----
  const nav = document.getElementById("nav");
  const navLinks = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("section[id]");

  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 50);

    let current = "";
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
    });
  });

  // ---- Mobile Nav Toggle ----
  const navToggle = document.getElementById("nav-toggle");
  const navLinksEl = document.getElementById("nav-links");

  navToggle.addEventListener("click", () => {
    const isOpen = navLinksEl.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", isOpen);
  });

  navLinksEl.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinksEl.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  // ---- Scroll Reveal ----
  const revealElements = document.querySelectorAll(
    ".section-header, .glass-card, .about-text, .about-code, .timeline-item, .contact-form"
  );

  revealElements.forEach((el) => el.classList.add("reveal"));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // Stagger reveal for grid children
  document.querySelectorAll(".skills-grid, .projects-grid, .contact-grid").forEach((grid) => {
    grid.querySelectorAll(".glass-card, .contact-card").forEach((card, i) => {
      card.classList.add("reveal");
      card.style.transitionDelay = `${i * 0.08}s`;
      revealObserver.observe(card);
    });
  });

  // ---- Contact Form ----
  const form = document.getElementById("contact-form");
  const formNote = document.getElementById("form-note");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      formNote.textContent = "Please fill in all fields.";
      formNote.className = "form-note error";
      return;
    }

    const mailtoLink = `mailto:aryakbhattacharya@gmail.com?subject=Portfolio Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
    window.location.href = mailtoLink;

    formNote.textContent = "Opening your email client...";
    formNote.className = "form-note success";
    form.reset();
  });

  // ---- Smooth anchor offset fix on load ----
  if (window.location.hash) {
    setTimeout(() => {
      const target = document.querySelector(window.location.hash);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }
})();
