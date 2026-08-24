document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;

  // =============================================
  // 1. DARK / LIGHT MODE TOGGLE
  // =============================================
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon   = document.getElementById("theme-icon");

  const savedTheme = localStorage.getItem("portfolio-theme") || "dark";
  html.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    themeIcon.className = theme === "dark" ? "bx bx-moon" : "bx bx-sun";
    if (themeToggle) {
      themeToggle.title = theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode";
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
      html.setAttribute("data-theme", next);
      localStorage.setItem("portfolio-theme", next);
      updateThemeIcon(next);
    });
  }

  // =============================================
  // 2. TYPEWRITER EFFECT (Vanilla JS, 100% Reliable)
  // =============================================
  const typewriterPhrases = {
    en: [
      "Ahmed Emad Ibrahim",
      "Front-End Developer",
      "React.js & Next.js Developer"
    ],
    ar: [
      "أحمد عماد إبراهيم",
      "مطور واجهة أمامية",
      "مطور React.js و Next.js"
    ]
  };

  let currentPhraseIdx = 0;
  let currentCharIdx  = 0;
  let isDeleting      = false;
  let typewriterTimer  = null;
  const typedTextEl    = document.getElementById("typed-text");

  function runTypewriter() {
    if (!typedTextEl) return;

    const currentLang = html.getAttribute("data-lang") || "en";
    const phrases     = typewriterPhrases[currentLang] || typewriterPhrases.en;

    // Safety check if index out of bounds on language switch
    if (currentPhraseIdx >= phrases.length) {
      currentPhraseIdx = 0;
    }

    const fullText = phrases[currentPhraseIdx];

    if (isDeleting) {
      currentCharIdx--;
      typedTextEl.textContent = fullText.substring(0, currentCharIdx);
    } else {
      currentCharIdx++;
      typedTextEl.textContent = fullText.substring(0, currentCharIdx);
    }

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && currentCharIdx === fullText.length) {
      // Pause at full word
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && currentCharIdx === 0) {
      isDeleting = false;
      currentPhraseIdx = (currentPhraseIdx + 1) % phrases.length;
      typeSpeed = 400;
    }

    typewriterTimer = setTimeout(runTypewriter, typeSpeed);
  }

  function resetTypewriter() {
    if (typewriterTimer) clearTimeout(typewriterTimer);
    currentPhraseIdx = 0;
    currentCharIdx  = 0;
    isDeleting      = false;
    if (typedTextEl) typedTextEl.textContent = "";
    runTypewriter();
  }

  // Start typewriter on initial load
  resetTypewriter();

  // =============================================
  // 3. ARABIC / ENGLISH LANGUAGE TOGGLE
  // =============================================
  const langToggle = document.getElementById("lang-toggle");
  const langLabel  = document.getElementById("lang-label");

  const savedLang = localStorage.getItem("portfolio-lang") || "en";
  applyLanguage(savedLang);

  function applyLanguage(lang) {
    const isAr = lang === "ar";

    // Set attributes
    html.setAttribute("data-lang", lang);
    html.setAttribute("lang", lang);
    html.setAttribute("dir", isAr ? "rtl" : "ltr");

    // Toggle button label
    if (langLabel) {
      langLabel.textContent = isAr ? "EN" : "AR";
    }

    // Translate all elements with data-en & data-ar
    document.querySelectorAll("[data-en][data-ar]").forEach((el) => {
      const text = isAr ? el.getAttribute("data-ar") : el.getAttribute("data-en");
      if (text) {
        el.innerHTML = text;
      }
    });

    // Reset typewriter for new language
    resetTypewriter();
  }

  if (langToggle) {
    langToggle.addEventListener("click", () => {
      const current = html.getAttribute("data-lang");
      const next    = current === "en" ? "ar" : "en";
      localStorage.setItem("portfolio-lang", next);
      applyLanguage(next);
    });
  }

  // =============================================
  // 4. ANIMATED STAT COUNTERS (Guaranteed numbers)
  // =============================================
  function animateCounters() {
    document.querySelectorAll(".stat-number").forEach((el) => {
      const target = parseInt(el.dataset.target, 10) || 0;
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 20));

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          el.textContent = target;
          clearInterval(timer);
        } else {
          el.textContent = current;
        }
      }, 50);
    });
  }

  // Trigger counters on load & intersection
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounters();
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll(".stat-number").forEach((el) => statObserver.observe(el));

  // =============================================
  // 5. SCROLL REVEAL ANIMATIONS
  // =============================================
  const revealSelectors = [
    ".home-content", ".home-image",
    ".skill-card", ".project-card",
    ".section-title", ".about-card",
    ".edu-card", ".about-text",
    ".testimonial-card", ".contact-card",
  ];

  revealSelectors.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => {
      el.classList.add("reveal-hidden");
    });
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll(revealSelectors.join(",")).forEach((el) => {
    revealObserver.observe(el);
  });

  // =============================================
  // 6. MOBILE MENU & NAV HIGHLIGHT
  // =============================================
  const nav      = document.getElementById("main-nav");
  const menuIcon = document.getElementById("menu-icon");

  if (menuIcon && nav) {
    menuIcon.addEventListener("click", () => {
      nav.classList.toggle("active");
      const icon = menuIcon.querySelector("i");
      if (icon) {
        icon.className = nav.classList.contains("active") ? "bx bx-x" : "bx bx-menu";
      }
    });
  }

  document.querySelectorAll("#main-nav a").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      if (nav) {
        nav.classList.remove("active");
        const icon = menuIcon ? menuIcon.querySelector("i") : null;
        if (icon) icon.className = "bx bx-menu";
      }

      const targetId = this.getAttribute("href");
      if (targetId && targetId.startsWith("#")) {
        e.preventDefault();
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          window.scrollTo({
            top: targetEl.getBoundingClientRect().top + window.scrollY - 80,
            behavior: "smooth",
          });
          document.querySelectorAll("#main-nav a").forEach((l) => l.classList.remove("active"));
          this.classList.add("active");
        }
      }
    });
  });

  const sections = document.querySelectorAll("section[id]");
  const navAnchors = document.querySelectorAll("#main-nav a[href^='#']");

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navAnchors.forEach((l) => l.classList.remove("active"));
        const active = document.querySelector(`#main-nav a[href="#${entry.target.id}"]`);
        if (active) active.classList.add("active");
      }
    });
  }, { threshold: 0.3, rootMargin: "-60px 0px -40% 0px" });

  sections.forEach((s) => sectionObserver.observe(s));

  // =============================================
  // 7. PROJECT DETAILS MODAL
  // =============================================
  const modalOverlay = document.getElementById("project-modal");
  const modalClose   = document.getElementById("modal-close-btn");
  const modalImg     = document.getElementById("modal-img");
  const modalTitle   = document.getElementById("modal-title");
  const modalDesc    = document.getElementById("modal-desc");
  const modalChallLbl= document.getElementById("modal-challenges-label");
  const modalChall   = document.getElementById("modal-challenges");
  const modalGithub  = document.getElementById("modal-github");
  const modalLive    = document.getElementById("modal-live");
  const modalLiveLbl = document.getElementById("modal-live-label");

  function openModal(card) {
    const isAr    = html.getAttribute("data-lang") === "ar";
    const titleEn = card.dataset.titleEn || "";
    const title   = isAr ? card.dataset.titleAr  : titleEn;
    const desc    = isAr ? card.dataset.descAr    : card.dataset.descEn;
    const chall   = isAr ? card.dataset.challengesAr : card.dataset.challengesEn;
    const github  = card.dataset.github || "#";
    const live    = card.dataset.live   || "#";

    const cardImg = card.querySelector(".project-img");
    const imgSrc  = cardImg ? cardImg.src : (card.dataset.img || "");
    if (modalImg) { modalImg.src = imgSrc; modalImg.alt = title; }

    if (modalTitle) modalTitle.textContent = title;
    if (modalDesc)  modalDesc.textContent  = desc;

    if (modalChall)   modalChall.textContent   = chall;
    if (modalChallLbl)modalChallLbl.textContent = isAr ? "التحديات والحلول"    : "Challenges & Solutions";
    if (modalLiveLbl) modalLiveLbl.textContent  = isAr ? "عرض حي"               : "Live Demo";

    if (modalGithub) modalGithub.href = github;
    if (modalLive)   modalLive.href   = live;

    if (modalOverlay) {
      modalOverlay.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".btn-details").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const card = btn.closest(".project-card");
      if (card) openModal(card);
    });
  });

  if (modalClose)   modalClose.addEventListener("click", closeModal);
  if (modalOverlay) modalOverlay.addEventListener("click", (e) => { if (e.target === modalOverlay) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  // =============================================
  // 8. WHATSAPP — Right click copy fallback
  // =============================================
  const whatsappCard = document.getElementById("whatsapp-card");
  if (whatsappCard) {
    whatsappCard.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      const isAr = html.getAttribute("data-lang") === "ar";
      navigator.clipboard.writeText("+201123564849").then(() => {
        showToast(isAr ? "تم نسخ الرقم! 📋" : "Number copied! 📋");
      }).catch(() => {});
    });
  }

  function showToast(message) {
    const old = document.querySelector(".copy-toast");
    if (old) old.remove();

    const toast = document.createElement("div");
    toast.className = "copy-toast";
    toast.textContent = message;
    Object.assign(toast.style, {
      position:     "fixed",
      bottom:       "30px",
      left:         "50%",
      transform:    "translateX(-50%) translateY(20px)",
      background:   "var(--primary-color)",
      color:        "#000",
      padding:      "10px 24px",
      borderRadius: "50px",
      fontWeight:   "700",
      fontSize:     "0.9rem",
      zIndex:       "99999",
      boxShadow:    "0 8px 25px rgba(0,0,0,0.35)",
      transition:   "transform 0.3s ease, opacity 0.3s ease",
      opacity:      "0",
      fontFamily:   "inherit",
      pointerEvents:"none",
    });

    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity   = "1";
      toast.style.transform = "translateX(-50%) translateY(0)";
    });
    setTimeout(() => {
      toast.style.opacity   = "0";
      toast.style.transform = "translateX(-50%) translateY(20px)";
      setTimeout(() => toast.remove(), 350);
    }, 2500);
  }
});
