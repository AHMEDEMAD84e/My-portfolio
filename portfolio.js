document.addEventListener("DOMContentLoaded", () => {
  // Reveal elements on scroll
  const revealElements = [
    document.querySelector(".home-content"),
    document.querySelector(".home-image"),
    ...document.querySelectorAll(".skill-card"),
    ...document.querySelectorAll(".project-card"),
    ...document.querySelectorAll(".section-title"),
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
});
