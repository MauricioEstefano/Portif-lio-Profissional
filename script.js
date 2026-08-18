(function () {
  "use strict";

  /* ---------------------------------------------------
     FOOTER YEAR
  --------------------------------------------------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------------------------------------------------
     LANGUAGE TOGGLE (PT / EN)
  --------------------------------------------------- */
  var STORAGE_KEY = "portfolio-lang";
  var html = document.documentElement;
  var langToggle = document.getElementById("langToggle");
  var langButtons = document.querySelectorAll("[data-lang-btn]");

  var typedPhrases = {
    pt: ["construo sites.", "automatizo processos.", "crio ferramentas."],
    en: ["I build websites.", "I automate processes.", "I create tools."]
  };

  function applyLanguage(lang) {
    html.setAttribute("data-lang", lang);
    html.setAttribute("lang", lang === "pt" ? "pt-BR" : "en");

    document.querySelectorAll("[data-pt][data-en]").forEach(function (el) {
      el.textContent = el.getAttribute("data-" + lang);
    });

    langButtons.forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-lang-btn") === lang);
    });

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }

    restartTypedLine(lang);
  }

  langToggle.addEventListener("click", function () {
    var current = html.getAttribute("data-lang") || "pt";
    applyLanguage(current === "pt" ? "en" : "pt");
  });

  var initialLang = "pt";
  try {
    initialLang = localStorage.getItem(STORAGE_KEY) || "pt";
  } catch (e) { /* ignore */ }
  applyLanguage(initialLang);

  /* ---------------------------------------------------
     MOBILE MENU
  --------------------------------------------------- */
  var menuToggle = document.getElementById("menuToggle");
  var mainNav = document.getElementById("mainNav");

  menuToggle.addEventListener("click", function () {
    var isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  mainNav.querySelectorAll(".nav-link").forEach(function (link) {
    link.addEventListener("click", function () {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------------------------------------------------
     ACTIVE NAV LINK ON SCROLL
  --------------------------------------------------- */
  var sections = document.querySelectorAll(".section[id]");
  var navLinks = document.querySelectorAll(".nav-link");

  var navObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute("id");
          navLinks.forEach(function (link) {
            link.classList.toggle("active", link.getAttribute("href") === "#" + id);
          });
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
  );
  sections.forEach(function (section) { navObserver.observe(section); });

  /* ---------------------------------------------------
     SCROLL REVEAL
  --------------------------------------------------- */
  var revealTargets = document.querySelectorAll(
    ".skill-card, .project-card, .timeline li, .resume-card, .contact-btn"
  );
  revealTargets.forEach(function (el) { el.classList.add("reveal"); });

  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealTargets.forEach(function (el) { revealObserver.observe(el); });

  /* ---------------------------------------------------
     TYPED ROTATING LINE IN HERO
  --------------------------------------------------- */
  var typedEl = document.getElementById("typedLine");
  var typedTimeoutId = null;
  var typedState = { phraseIndex: 0, charIndex: 0, deleting: false };

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function typeStep(lang) {
    var phrases = typedPhrases[lang];
    var current = phrases[typedState.phraseIndex % phrases.length];

    if (!typedState.deleting) {
      typedState.charIndex++;
      typedEl.textContent = current.slice(0, typedState.charIndex);
      if (typedState.charIndex === current.length) {
        typedState.deleting = true;
        typedTimeoutId = setTimeout(function () { typeStep(lang); }, 1500);
        return;
      }
    } else {
      typedState.charIndex--;
      typedEl.textContent = current.slice(0, typedState.charIndex);
      if (typedState.charIndex === 0) {
        typedState.deleting = false;
        typedState.phraseIndex++;
      }
    }

    var delay = typedState.deleting ? 35 : 65;
    typedTimeoutId = setTimeout(function () { typeStep(lang); }, delay);
  }

  function restartTypedLine(lang) {
    if (typedTimeoutId) clearTimeout(typedTimeoutId);
    typedState = { phraseIndex: 0, charIndex: 0, deleting: false };

    if (prefersReducedMotion) {
      typedEl.textContent = typedPhrases[lang][0];
      return;
    }
    typeStep(lang);
  }
})();
