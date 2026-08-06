document.addEventListener("DOMContentLoaded", () => {
  // Reveal elements on scroll
  const revealElements = [
    document.querySelector(".home-content"),
    document.querySelector(".home-image"),
    ...document.querySelectorAll(".skill-card"),
    ...document.querySelectorAll(".project-card"),
    ...document.querySelectorAll(".section-title"),
    ...document.querySelectorAll(".about-card"),
    ...document.querySelectorAll(".edu-card"),
    document.querySelector(".about-text"),
    document.querySelector(".feedback-form"),
  ];

  const revealOnScroll = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
        }
      });
    },
    { threshold: 0.1 },
  );

  revealElements.forEach((el) => {
    if (el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
      revealOnScroll.observe(el);
    }
  });

  // Custom class for revealed state
  const style = document.createElement("style");
  style.textContent = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
  document.head.appendChild(style);

  // Smooth scroll and sliding nav indicator
  const nav = document.querySelector("nav");
  const menuIcon = document.getElementById("menu-icon");
  let indicator = null;

  if (nav) {
    indicator = document.createElement("div");
    indicator.classList.add("nav-indicator");
    nav.appendChild(indicator);
  }

  function moveIndicator() {
    if (!indicator || window.innerWidth <= 991) return;
    const activeLink = document.querySelector("nav a.active");
    if (activeLink) {
      indicator.style.left = `${activeLink.offsetLeft}px`;
      indicator.style.width = `${activeLink.offsetWidth}px`;
      indicator.style.opacity = "1";
    } else {
      indicator.style.opacity = "0";
    }
  }

  if (menuIcon && nav) {
    menuIcon.addEventListener("click", () => {
      nav.classList.toggle("active");
      const icon = menuIcon.querySelector("i");
      if (nav.classList.contains("active")) {
        icon.className = "bx bx-x";
      } else {
        icon.className = "bx bx-menu";
      }
    });
  }

  document.querySelectorAll("nav a").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      if (nav) {
        nav.classList.remove("active");
        const icon = menuIcon ? menuIcon.querySelector("i") : null;
        if (icon) icon.className = "bx bx-menu";
      }

      const targetId = this.getAttribute("href");
      if (targetId && targetId.startsWith("#")) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: "smooth",
          });
          
          document.querySelectorAll("nav a").forEach((link) => link.classList.remove("active"));
          this.classList.add("active");
          moveIndicator();
        }
      }
    });
  });

  // Active nav link highlight on scroll
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll("nav a[href^='#']");

  const activateNavLink = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => link.classList.remove("active"));
          const activeLink = document.querySelector(
            `nav a[href="#${entry.target.id}"]`
          );
          if (activeLink) {
            activeLink.classList.add("active");
            moveIndicator();
          }
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((section) => activateNavLink.observe(section));

  // Initial update and resize handler
  window.addEventListener("resize", moveIndicator);
  setTimeout(moveIndicator, 200);

  // Scroll Restoration on Refresh
  if (window.history.scrollRestoration) {
    window.history.scrollRestoration = "manual";
  }

  window.addEventListener("beforeunload", () => {
    sessionStorage.setItem("scrollPosition", window.scrollY);
  });

  const savedPosition = sessionStorage.getItem("scrollPosition");
  if (window.location.hash) {
    const targetElement = document.querySelector(window.location.hash);
    if (targetElement) {
      setTimeout(() => {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "auto",
        });
      }, 100);
    }
  } else if (savedPosition !== null) {
    setTimeout(() => {
      window.scrollTo({
        top: parseInt(savedPosition, 10),
        behavior: "auto",
      });
    }, 100);
  }

  // ========== Feedback Star Rating ==========
  const starsContainer = document.getElementById("feedback-stars");
  let currentRating = 0;

  if (starsContainer) {
    const stars = starsContainer.querySelectorAll("i");

    stars.forEach((star) => {
      star.addEventListener("mouseenter", () => {
        const rating = parseInt(star.dataset.rating);
        stars.forEach((s) => {
          const r = parseInt(s.dataset.rating);
          if (r <= rating) {
            s.classList.add("hovered");
          } else {
            s.classList.remove("hovered");
          }
        });
      });

      star.addEventListener("mouseleave", () => {
        stars.forEach((s) => s.classList.remove("hovered"));
      });

      star.addEventListener("click", () => {
        currentRating = parseInt(star.dataset.rating);
        stars.forEach((s) => {
          const r = parseInt(s.dataset.rating);
          if (r <= currentRating) {
            s.classList.add("active");
          } else {
            s.classList.remove("active");
          }
        });
      });
    });
  }

  // ========== Feedback Form Submission ==========
  const feedbackForm = document.getElementById("feedback-form");
  const feedbackSuccess = document.getElementById("feedback-success");

  if (feedbackForm) {
    feedbackForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Animate button
      const submitBtn = document.getElementById("feedback-submit");
      submitBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> <span>Sending...</span>';
      submitBtn.disabled = true;

      // Simulate sending (replace with actual API call)
      setTimeout(() => {
        feedbackForm.style.display = "none";
        feedbackSuccess.classList.add("show");

        // Reset form after a delay
        setTimeout(() => {
          feedbackForm.reset();
          currentRating = 0;
          if (starsContainer) {
            starsContainer.querySelectorAll("i").forEach((s) => s.classList.remove("active"));
          }
          submitBtn.innerHTML = '<i class="bx bx-send"></i> <span>Send Feedback</span>';
          submitBtn.disabled = false;
        }, 1000);
      }, 1500);
    });
  }

  // ========== Animated Stat Counters ==========
  const statNumbers = document.querySelectorAll(".stat-number");

  if (statNumbers.length > 0) {
    const animateCounter = (el) => {
      const target = parseInt(el.dataset.target);
      const duration = 1500;
      const start = performance.now();

      const update = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased);

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };
      requestAnimationFrame(update);
    };

    const statObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            statObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach((num) => statObserver.observe(num));
  }
});
