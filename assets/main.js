"use strict";
/*
 * Interaksi halaman portofolio: tema, menu seluler, scroll reveal,
 * scroll spy, lightbox, dan tahun pada footer.
 * Dikompilasi dengan `npm run compile` menjadi assets/main.js.
 */
(function () {
    "use strict";
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const themeButtons = Array.from(document.querySelectorAll("[data-theme-toggle]"));
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    const themeColors = { light: "#F1EDE2", dark: "#14130E" };
    function applyTheme(theme, persist) {
        root.dataset.theme = theme;
        const isDark = theme === "dark";
        themeButtons.forEach((button) => {
            button.setAttribute("aria-pressed", String(isDark));
            const label = button.querySelector(".theme-btn__label");
            if (label) {
                label.textContent = isDark ? "tema terang" : "tema gelap";
            }
            else {
                button.setAttribute("aria-label", isDark ? "Ganti ke tema terang" : "Ganti ke tema gelap");
            }
        });
        if (themeMeta) {
            themeMeta.setAttribute("content", themeColors[theme]);
        }
        if (persist) {
            try {
                localStorage.setItem("theme", theme);
            }
            catch (error) {
                /* Preferensi tidak bisa disimpan, tema tetap berlaku untuk sesi ini. */
            }
        }
    }
    themeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            applyTheme(root.dataset.theme === "dark" ? "light" : "dark", true);
        });
    });
    applyTheme(root.dataset.theme === "dark" ? "dark" : "light", false);
    /* ---------- Menu seluler ---------- */
    const menu = document.getElementById("menu");
    const menuButton = document.querySelector(".menu-btn");
    const menuLabel = menuButton ? menuButton.querySelector(".menu-btn__text") : null;
    const menuLinks = menu
        ? Array.from(menu.querySelectorAll("a"))
        : [];
    function setMenu(open) {
        if (!menu || !menuButton)
            return;
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
    if (menuButton && menu) {
        menuButton.addEventListener("click", () => {
            setMenu(menu.hidden);
        });
    }
    menuLinks.forEach((link) => {
        link.addEventListener("click", () => {
            setMenu(false);
        });
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && menu && !menu.hidden) {
            setMenu(false);
            if (menuButton)
                menuButton.focus();
        }
    });
    window.addEventListener("resize", () => {
        if (window.innerWidth > 1080 && menu && !menu.hidden) {
            setMenu(false);
        }
    });
    /* ---------- Scroll reveal ---------- */
    const revealItems = Array.from(document.querySelectorAll(".reveal"));
    if (!("IntersectionObserver" in window) || reduceMotion.matches) {
        revealItems.forEach((item) => {
            item.classList.add("is-visible");
        });
    }
    else {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
        revealItems.forEach((item) => {
            revealObserver.observe(item);
        });
    }
    /* ---------- Scroll spy ---------- */
    const navLinks = Array.from(document.querySelectorAll('a[href^="#"]'));
    const sections = Array.from(document.querySelectorAll("main section[id]"));
    if ("IntersectionObserver" in window && sections.length) {
        const spy = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting)
                    return;
                const id = entry.target.getAttribute("id");
                navLinks.forEach((link) => {
                    if (id && link.getAttribute("href") === `#${id}`) {
                        link.setAttribute("aria-current", "true");
                    }
                    else {
                        link.removeAttribute("aria-current");
                    }
                });
            });
        }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
        sections.forEach((section) => {
            spy.observe(section);
        });
    }
    /* ---------- Lightbox ---------- */
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const triggers = Array.from(document.querySelectorAll("[data-lightbox]"));
    if (lightbox && lightboxImage && lightboxCaption && triggers.length) {
        let activeIndex = 0;
        let previousFocus = null;
        function renderSlide(index) {
            activeIndex = (index + triggers.length) % triggers.length;
            const trigger = triggers[activeIndex];
            const inner = trigger.querySelector("img");
            lightboxImage.src = trigger.getAttribute("data-full") ?? "";
            lightboxImage.alt = inner ? inner.alt : "";
            lightboxCaption.textContent = trigger.getAttribute("data-caption") ?? "";
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
        triggers.forEach((trigger, index) => {
            trigger.addEventListener("click", () => {
                openLightbox(index);
            });
        });
        lightbox.querySelector("[data-prev]")?.addEventListener("click", () => {
            renderSlide(activeIndex - 1);
        });
        lightbox.querySelector("[data-next]")?.addEventListener("click", () => {
            renderSlide(activeIndex + 1);
        });
        lightbox.querySelector("[data-close]")?.addEventListener("click", closeLightbox);
        lightbox.addEventListener("click", (event) => {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });
        lightbox.addEventListener("keydown", (event) => {
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                renderSlide(activeIndex - 1);
            }
            if (event.key === "ArrowRight") {
                event.preventDefault();
                renderSlide(activeIndex + 1);
            }
        });
        lightbox.addEventListener("close", () => {
            document.body.classList.remove("no-scroll");
            if (previousFocus && typeof previousFocus.focus === "function") {
                previousFocus.focus();
            }
        });
    }
    /* ---------- Tahun footer ---------- */
    const year = document.querySelector("[data-year]");
    if (year) {
        year.textContent = String(new Date().getFullYear());
    }
})();
