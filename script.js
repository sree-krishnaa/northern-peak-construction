'use strict';

/* ==========================================================
   NORTHERN PEAK CONSTRUCTION
   SCRIPT.JS
   PART 1
========================================================== */

/* ==========================================
   Utility Functions
========================================== */

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];


/* ==========================================
   1. Loader
========================================== */

(() => {

    const loader = $("#loader");

    if (!loader) return;

    document.body.style.overflow = "hidden";

    window.addEventListener("load", () => {

        setTimeout(() => {

            loader.classList.add("hidden");

            document.body.style.overflow = "";

        }, 1600);

    });

})();


/* ==========================================
   2. Scroll Progress Bar
========================================== */

(() => {

    const progress = $("#scroll-progress");

    if (!progress) return;

    function updateProgress() {

        const scrollTop = window.scrollY;

        const maxHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;

        const percentage = (scrollTop / maxHeight) * 100;

        progress.style.width = `${percentage}%`;

    }

    updateProgress();

    window.addEventListener("scroll", updateProgress, {
        passive: true
    });

})();


/* ==========================================
   3. Sticky Navbar
========================================== */

(() => {

    const nav = $("#navbar");

    if (!nav) return;

    function navbarState() {

        if (window.scrollY > 60) {

            nav.classList.add("scrolled");

        } else {

            nav.classList.remove("scrolled");

        }

    }

    navbarState();

    window.addEventListener("scroll", navbarState, {
        passive: true
    });

})();


/* ==========================================
   4. Mobile Navigation
========================================== */

(() => {

    const hamburger = $("#hamburger");
    const drawer = $("#nav-drawer");

    if (!hamburger || !drawer) return;

    function openDrawer() {

        drawer.classList.add("open");
        hamburger.classList.add("open");

        hamburger.setAttribute("aria-expanded", "true");

        document.body.style.overflow = "hidden";

    }

    function closeDrawer() {

        drawer.classList.remove("open");
        hamburger.classList.remove("open");

        hamburger.setAttribute("aria-expanded", "false");

        document.body.style.overflow = "";

    }

    hamburger.addEventListener("click", () => {

        drawer.classList.contains("open")
            ? closeDrawer()
            : openDrawer();

    });

    $$(".drawer-link").forEach(link => {

        link.addEventListener("click", closeDrawer);

    });

    document.addEventListener("keydown", e => {

        if (e.key === "Escape") {

            closeDrawer();

        }

    });

})();


/* ==========================================
   5. Smooth Scrolling
========================================== */

(() => {

    function navHeight() {

        return $("#navbar").offsetHeight;

    }

    document.addEventListener("click", e => {

        const link = e.target.closest("[data-scroll], a[href^='#']");

        if (!link) return;

        const id =
            link.dataset.scroll ||
            link.getAttribute("href").replace("#", "");

        const section = document.getElementById(id);

        if (!section) return;

        e.preventDefault();

        window.scrollTo({

            top: section.offsetTop - navHeight(),

            behavior: "smooth"

        });

    });

})();


/* ==========================================
   Hero Form Scroll
========================================== */

(() => {

    const form = $("#hero-form");

    if (!form) return;

    form.addEventListener("submit", e => {

        e.preventDefault();

        const contact = $("#contact");

        if (!contact) return;

        window.scrollTo({

            top: contact.offsetTop - $("#navbar").offsetHeight,

            behavior: "smooth"

        });

    });

})();


/* ==========================================
   6. Scroll Spy
========================================== */

(() => {

    const sections = $$("section[id]");
    const navLinks = $$(".nav-link");

    if (!sections.length) return;

    function activeLink() {

        let current = "";

        sections.forEach(section => {

            if (

                window.scrollY >=
                section.offsetTop -
                ($("#navbar").offsetHeight + 120)

            ) {

                current = section.id;

            }

        });

        navLinks.forEach(link => {

            const target =
                link.dataset.scroll ||
                link.getAttribute("href").replace("#", "");

            link.classList.toggle(
                "active",
                current === target
            );

        });

    }

    activeLink();

    window.addEventListener("scroll", activeLink, {
        passive: true
    });

})();


/* ==========================================
   7. Hero Parallax
========================================== */

(() => {

    if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;

    const hero = $(".hero-media");

    if (!hero) return;

    let ticking = false;

    function parallax() {

        hero.style.transform =
            `translateY(${window.scrollY * 0.3}px)`;

        ticking = false;

    }

    window.addEventListener("scroll", () => {

        if (!ticking) {

            requestAnimationFrame(parallax);

            ticking = true;

        }

    }, {
        passive: true
    });

})();


/* ==========================================
   8. Reveal Animation
========================================== */

(() => {

    const reveals = $$(
        ".reveal-up, .reveal-left, .reveal-right"
    );

    if (!reveals.length) return;

    const observer = new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                entry.target.classList.add("revealed");

                observer.unobserve(entry.target);

            });

        },

        {

            threshold: 0.15,

            rootMargin: "0px 0px -40px"

        }

    );

    reveals.forEach(item => observer.observe(item));

})();


/* ==========================================
   9. Animated Counters
========================================== */

(() => {

    const counters = $$(".counter");

    if (!counters.length) return;

    function animate(counter) {

        const target =
            Number(counter.dataset.target);

        const duration = 1800;

        const start = performance.now();

        function update(now) {

            const progress =
                Math.min(
                    (now - start) / duration,
                    1
                );

            const eased =
                1 - Math.pow(1 - progress, 3);

            counter.textContent =
                Math.floor(target * eased);

            if (progress < 1) {

                requestAnimationFrame(update);

            }

        }

        requestAnimationFrame(update);

    }

    const observer = new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                animate(entry.target);

                observer.unobserve(entry.target);

            });

        },

        {

            threshold: 0.5

        }

    );

    counters.forEach(counter => {

        observer.observe(counter);

    });

})();
/* ==========================================================
   NORTHERN PEAK CONSTRUCTION
   SCRIPT.JS
   PART 2
========================================================== */


/* ==========================================
   10. FAQ ACCORDION
========================================== */

(() => {

    const items = $$(".faq-item");

    if (!items.length) return;

    items.forEach(item => {

        const button = $(".faq-q", item);
        const answer = $(".faq-a", item);

        if (!button || !answer) return;

        button.addEventListener("click", () => {

            const opened = item.classList.contains("open");

            items.forEach(other => {

                other.classList.remove("open");

                const btn = $(".faq-q", other);

                if (btn) btn.setAttribute("aria-expanded", "false");

            });

            if (!opened) {

                item.classList.add("open");

                button.setAttribute("aria-expanded", "true");

            }

        });

    });

})();



/* ==========================================
   11. TESTIMONIAL SLIDER
========================================== */

(() => {

    const slider = $("#tslider");

    const prev = $("#t-prev");

    const next = $("#t-next");

    const dotsWrap = $("#tslider-dots");

    if (!slider) return;

    const cards = $$(".tcard", slider);

    if (!cards.length) return;

    let current = 0;

    let interval;

    cards.forEach((card, index) => {

        const dot = document.createElement("button");

        dot.className = "tslider-dot";

        if (index === 0) dot.classList.add("active");

        dot.addEventListener("click", () => {

            go(index);

            reset();

        });

        dotsWrap?.appendChild(dot);

    });

    const dots = $$(".tslider-dot");

    function updateDots() {

        dots.forEach((dot, i) => {

            dot.classList.toggle("active", i === current);

        });

    }

    function go(index) {

        current =

            (index + cards.length) %

            cards.length;

        slider.style.transform =

            `translateX(-${current * 100}%)`;

        updateDots();

    }

    function start() {

        interval = setInterval(() => {

            go(current + 1);

        }, 6000);

    }

    function reset() {

        clearInterval(interval);

        start();

    }

    prev?.addEventListener("click", () => {

        go(current - 1);

        reset();

    });

    next?.addEventListener("click", () => {

        go(current + 1);

        reset();

    });

    slider.addEventListener("mouseenter", () => {

        clearInterval(interval);

    });

    slider.addEventListener("mouseleave", start);

    let startX = 0;

    slider.addEventListener("touchstart", e => {

        startX = e.touches[0].clientX;

    }, { passive: true });

    slider.addEventListener("touchend", e => {

        const diff =

            startX -

            e.changedTouches[0].clientX;

        if (Math.abs(diff) < 50) return;

        diff > 0 ? go(current + 1) : go(current - 1);

        reset();

    }, { passive: true });

    start();

})();



/* ==========================================
   12. BACK TO TOP BUTTON
========================================== */

(() => {

    const button = $("#back-to-top");

    if (!button) return;

    function toggle() {

        button.classList.toggle(

            "visible",

            window.scrollY > 500

        );

    }

    toggle();

    window.addEventListener("scroll", toggle, {

        passive: true

    });

    button.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

})();



/* ==========================================
   13. CONTACT FORM VALIDATION
========================================== */

(() => {

    const form = $("#contact-form");

    const success = $("#cform-success");

    const submit = $("#csubmit");

    if (!form) return;

    const emailRegex =

        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validate(group) {

        const input =

            $("input, textarea, select", group);

        if (!input) return true;

        let valid = true;

        if (input.required && !input.value.trim())

            valid = false;

        if (

            input.type === "email" &&

            input.value &&

            !emailRegex.test(input.value)

        ) {

            valid = false;

        }

        group.classList.toggle(

            "has-err",

            !valid

        );

        return valid;

    }

    $$(".cform-group", form).forEach(group => {

        const field =

            $("input, textarea, select", group);

        if (!field) return;

        field.addEventListener("blur", () => {

            validate(group);

        });

        field.addEventListener("input", () => {

            if (

                group.classList.contains("has-err")

            ) {

                validate(group);

            }

        });

    });

    form.addEventListener("submit", e => {

        e.preventDefault();

        let ok = true;

        $$(".cform-group", form).forEach(group => {

            if (!validate(group)) ok = false;

        });

        if (!ok) return;

        submit.disabled = true;

        $(".btn-label").hidden = true;

        $(".btn-loading").hidden = false;

        setTimeout(() => {

            submit.disabled = false;

            $(".btn-loading").hidden = true;

            $(".btn-label").hidden = false;

            form.hidden = true;

            success.hidden = false;

        }, 1800);

    });

})();



/* ==========================================
   14. LAZY IMAGE FADE-IN
========================================== */

(() => {

    const images = $$("img[loading='lazy']");

    if (!images.length) return;

    const observer = new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                const img = entry.target;

                img.style.opacity = "1";

                observer.unobserve(img);

            });

        },

        {

            threshold: 0.05

        }

    );

    images.forEach(img => {

        img.style.opacity = "0";

        img.style.transition =

            "opacity .5s ease";

        if (img.complete) {

            img.style.opacity = "1";

        } else {

            img.addEventListener("load", () => {

                img.style.opacity = "1";

            });

        }

        observer.observe(img);

    });

})();



/* ==========================================
   15. PROJECT CARD 3D TILT
========================================== */

(() => {

    if (

        !window.matchMedia("(pointer:fine)").matches ||

        window.matchMedia(

            "(prefers-reduced-motion:reduce)"

        ).matches

    ) {

        return;

    }

    $$(".proj-card").forEach(card => {

        card.addEventListener("mousemove", e => {

            const rect =

                card.getBoundingClientRect();

            const x =

                ((e.clientX - rect.left) /

                    rect.width -

                    0.5) *

                10;

            const y =

                ((e.clientY - rect.top) /

                    rect.height -

                    0.5) *

                -10;

            card.style.transform =

                `perspective(900px)
                 rotateX(${y}deg)
                 rotateY(${x}deg)
                 scale(1.02)`;

        });

        card.addEventListener("mouseleave", () => {

            card.style.transform = "";

        });

    });

})();



/* ==========================================
   16. SERVICE CARD ICON EFFECT
========================================== */

(() => {

    $$(".svc-card").forEach(card => {

        card.addEventListener("mouseenter", () => {

            const icon = $(".svc-icon", card);

            const svg = $("svg", icon);

            if (icon) icon.style.background = "#111";

            if (svg) svg.style.stroke = "#FAFAF8";

        });

        card.addEventListener("mouseleave", () => {

            const icon = $(".svc-icon", card);

            const svg = $("svg", icon);

            if (icon) icon.style.background = "";

            if (svg) svg.style.stroke = "";

        });

    });

})();



/* ==========================================
   17. PROCESS STEP REVEAL
========================================== */

(() => {

    const steps = $$(".pstep");

    if (!steps.length) return;

    const observer = new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                const index =

                    steps.indexOf(entry.target);

                setTimeout(() => {

                    entry.target.classList.add(

                        "revealed"

                    );

                }, index * 120);

                observer.unobserve(entry.target);

            });

        },

        {

            threshold: 0.1

        }

    );

    steps.forEach(step => {

        step.classList.add("reveal-up");

        observer.observe(step);

    });

})();



/* ==========================================
   18. MARQUEE PAUSE
========================================== */

(() => {

    const marquee = $(".marquee-content");

    const section = $(".marquee-section");

    if (!marquee || !section) return;

    section.addEventListener("mouseenter", () => {

        marquee.style.animationPlayState =

            "paused";

    });

    section.addEventListener("mouseleave", () => {

        marquee.style.animationPlayState =

            "running";

    });

})();
/* ==========================================================
   NORTHERN PEAK CONSTRUCTION
   SCRIPT.JS
   PART 3
========================================================== */


/* ==========================================
   19. BUTTON RIPPLE EFFECT
========================================== */

(() => {

    const buttons = $$(
        ".btn-primary, .btn-cta, .btn-ghost"
    );

    buttons.forEach(button => {

        button.style.position = "relative";
        button.style.overflow = "hidden";

        button.addEventListener("click", e => {

            const ripple = document.createElement("span");

            const rect = button.getBoundingClientRect();

            const size = Math.max(rect.width, rect.height);

            ripple.style.width = ripple.style.height =
                `${size}px`;

            ripple.style.position = "absolute";

            ripple.style.left =
                `${e.clientX - rect.left - size / 2}px`;

            ripple.style.top =
                `${e.clientY - rect.top - size / 2}px`;

            ripple.style.borderRadius = "50%";

            ripple.style.background =
                "rgba(255,255,255,.25)";

            ripple.style.pointerEvents = "none";

            ripple.style.transform = "scale(0)";

            ripple.style.transition =
                "transform .6s ease, opacity .6s ease";

            button.appendChild(ripple);

            requestAnimationFrame(() => {

                ripple.style.transform = "scale(3)";
                ripple.style.opacity = "0";

            });

            setTimeout(() => {

                ripple.remove();

            }, 600);

        });

    });

})();


/* ==========================================
   20. NAVBAR AUTO HIDE
========================================== */

(() => {

    const navbar = $("#navbar");

    if (!navbar) return;

    let lastScroll = 0;

    window.addEventListener("scroll", () => {

        const current = window.scrollY;

        if (current < 100) {

            navbar.style.transform = "translateY(0)";
            lastScroll = current;
            return;

        }

        if (current > lastScroll) {

            navbar.style.transform =
                "translateY(-100%)";

        } else {

            navbar.style.transform =
                "translateY(0)";

        }

        lastScroll = current;

    }, { passive: true });

})();




/* ==========================================
   22. IMAGE HOVER ZOOM
========================================== */

(() => {

    $$("img").forEach(img => {

        img.addEventListener("mouseenter", () => {

            img.style.transition =
                "transform .7s ease";

            img.style.transform =
                "scale(1.05)";

        });

        img.addEventListener("mouseleave", () => {

            img.style.transform =
                "scale(1)";

        });

    });

})();


/* ==========================================
   23. CURRENT YEAR
========================================== */

(() => {

    const year = $("#year");

    if (year) {

        year.textContent =
            new Date().getFullYear();

    }

})();


/* ==========================================
   24. FORM FIELD ANIMATION
========================================== */

(() => {

    const fields = $$(
        "input, textarea, select"
    );

    fields.forEach(field => {

        field.addEventListener("focus", () => {

            field.parentElement?.classList.add(
                "focused"
            );

        });

        field.addEventListener("blur", () => {

            if (!field.value.trim()) {

                field.parentElement?.classList.remove(
                    "focused"
                );

            }

        });

    });

})();


/* ==========================================
   25. KEYBOARD ACCESSIBILITY
========================================== */

(() => {

    document.addEventListener("keyup", e => {

        if (e.key !== "Tab") return;

        document.body.classList.add(
            "using-keyboard"
        );

    });

    document.addEventListener("mousedown", () => {

        document.body.classList.remove(
            "using-keyboard"
        );

    });

})();


/* ==========================================
   26. SECTION FADE STAGGER
========================================== */

(() => {

    $$(".section").forEach(section => {

        const children = [...section.children];

        children.forEach((child, index) => {

            child.style.transitionDelay =
                `${index * 80}ms`;

        });

    });

})();


/* ==========================================
   27. PERFORMANCE
========================================== */

(() => {

    let ticking = false;

    function optimize() {

        ticking = false;

    }

    window.addEventListener("resize", () => {

        if (!ticking) {

            requestAnimationFrame(optimize);

            ticking = true;

        }

    });

})();


/* ==========================================
   28. PREVENT DOUBLE FORM SUBMIT
========================================== */

(() => {

    const form = $("#contact-form");

    if (!form) return;

    let submitted = false;

    form.addEventListener("submit", e => {

        if (submitted) {

            e.preventDefault();

            return;

        }

        submitted = true;

    });

})();


/* ==========================================
   29. PRELOAD HERO IMAGE
========================================== */

(() => {

    const hero = $(".hero-img");

    if (!hero) return;

    const preload = new Image();

    preload.src = hero.src;

})();


/* ==========================================
   30. PAGE READY
========================================== */

(() => {

    document.documentElement.classList.add(
        "js-loaded"
    );

    console.log(
        "%cNorthern Peak Construction",
        "font-size:18px;font-weight:bold;color:#C4703E;"
    );

    console.log(
        "%cWebsite initialized successfully.",
        "color:#8A9E8C;font-size:13px;"
    );

})();
