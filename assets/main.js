(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Theme ---------- */

  var themeButtons = Array.prototype.slice.call(document.querySelectorAll("[data-theme-toggle]"));
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  var themeColors = { light: "#F1EDE2", dark: "#14130E" };

  function applyTheme(theme, persist) {
    root.dataset.theme = theme;

    themeButtons.forEach(function (button) {
      var isDark = theme === "dark";
      button.setAttribute("aria-pressed", String(isDark));

      var label = button.querySelector(".theme-btn__label");
      if (label) {
        label.textContent = isDark ? "tema terang" : "tema gelap";
      } else {
        button.setAttribute("aria-label", isDark ? "Ganti ke tema terang" : "Ganti ke tema gelap");
      }
    });

    if (themeMeta) {
      themeMeta.setAttribute("content", themeColors[theme]);
    }

    if (persist) {
      try {
        localStorage.setItem("theme", theme);
      } catch (error) {
        /* Preferensi tidak bisa disimpan, tema tetap berlaku untuk sesi ini. */
      }
    }
  }

  themeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      applyTheme(root.dataset.theme === "dark" ? "light" : "dark", true);
    });
  });

  applyTheme(root.dataset.theme === "dark" ? "dark" : "light", false);

  /* ---------- Mobile menu ---------- */

  var menu = document.getElementById("menu");
  var menuButton = document.querySelector(".menu-btn");
  var menuLabel = menuButton ? menuButton.querySelector(".menu-btn__text") : null;
  var menuLinks = menu ? Array.prototype.slice.call(menu.querySelectorAll("a")) : [];

  function setMenu(open) {
    if (!menu || !menuButton) return;

    menu.hidden = !open;
    menuButton.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("no-scroll", open);

    if (menuLabel) {
      menuLabel.textContent = open ? "tutup" : "menu";
    }

    if (open && menuLinks.length) {
      menuLinks[0].focus();
    }
  }

  if (menuButton) {
    menuButton.addEventListener("click", function () {
      setMenu(menu.hidden);
    });
  }

  menuLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      setMenu(false);
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && menu && !menu.hidden) {
      setMenu(false);
      if (menuButton) menuButton.focus();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 1080 && menu && !menu.hidden) {
      setMenu(false);
    }
  });

  /* ---------- Scroll reveal ---------- */

  var revealItems = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  if (!("IntersectionObserver" in window) || reduceMotion.matches) {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  }

  /* ---------- Scroll spy ---------- */

  var navLinks = Array.prototype.slice.call(document.querySelectorAll('a[href^="#"]'));
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var id = entry.target.getAttribute("id");
        navLinks.forEach(function (link) {
          if (link.getAttribute("href") === "#" + id) {
            link.setAttribute("aria-current", "true");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

    sections.forEach(function (section) {
      spy.observe(section);
    });
  }

  /* ---------- Lightbox ---------- */

  var lightbox = document.getElementById("lightbox");
  var lightboxImage = document.getElementById("lightbox-img");
  var lightboxCaption = document.getElementById("lightbox-caption");
  var triggers = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));

  if (lightbox && lightboxImage && lightboxCaption && triggers.length) {
    var activeIndex = 0;
    var previousFocus = null;

    function renderSlide(index) {
      activeIndex = (index + triggers.length) % triggers.length;
      var trigger = triggers[activeIndex];
      var inner = trigger.querySelector("img");

      lightboxImage.src = trigger.getAttribute("data-full");
      lightboxImage.alt = inner ? inner.alt : "";
      lightboxCaption.textContent = trigger.getAttribute("data-caption") || "";
    }

    function openLightbox(index) {
      previousFocus = document.activeElement;
      renderSlide(index);
      lightbox.showModal();
      document.body.classList.add("no-scroll");
    }

    function closeLightbox() {
      lightbox.close();
    }

    triggers.forEach(function (trigger, index) {
      trigger.addEventListener("click", function () {
        openLightbox(index);
      });
    });

    lightbox.querySelector("[data-prev]").addEventListener("click", function () {
      renderSlide(activeIndex - 1);
    });

    lightbox.querySelector("[data-next]").addEventListener("click", function () {
      renderSlide(activeIndex + 1);
    });

    lightbox.querySelector("[data-close]").addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    lightbox.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        renderSlide(activeIndex - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        renderSlide(activeIndex + 1);
      }
    });

    lightbox.addEventListener("close", function () {
      document.body.classList.remove("no-scroll");
      if (previousFocus && typeof previousFocus.focus === "function") {
        previousFocus.focus();
      }
    });
  }

  /* ---------- Year ---------- */

  var year = document.querySelector("[data-year]");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
})();
