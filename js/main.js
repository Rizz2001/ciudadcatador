document.addEventListener('DOMContentLoaded', function () {

    /* ─────────────────────────────────────────
       AOS — Animaciones al scroll
    ───────────────────────────────────────── */
    AOS.init({
        duration: 900,
        once: true,
        offset: 80,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
    });


    /* ─────────────────────────────────────────
       CURSOR PERSONALIZADO
    ───────────────────────────────────────── */
    const cursor     = document.querySelector('.cursor');
    const cursorRing = document.querySelector('.cursor-ring');

    if (cursor && cursorRing && window.matchMedia('(pointer: fine)').matches) {
        let mouseX = 0, mouseY = 0;
        let ringX  = 0, ringY  = 0;

        document.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top  = mouseY + 'px';
        });

        // Ring sigue con lag (lerp)
        function animateRing() {
            ringX += (mouseX - ringX) * 0.12;
            ringY += (mouseY - ringY) * 0.12;
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top  = ringY + 'px';
            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Hover state en elementos interactivos
        const hoverTargets = document.querySelectorAll('a, button, .local-card, .gallery-img');
        hoverTargets.forEach(function (el) {
            el.addEventListener('mouseenter', function () {
                cursor.classList.add('is-hovering');
                cursorRing.classList.add('is-hovering');
            });
            el.addEventListener('mouseleave', function () {
                cursor.classList.remove('is-hovering');
                cursorRing.classList.remove('is-hovering');
            });
        });
    }


    /* ─────────────────────────────────────────
       NAVBAR — Shrink al scroll
    ───────────────────────────────────────── */
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function () {
            navbar.classList.toggle('scrolled', window.scrollY > 60);
        }, { passive: true });
    }


    /* ─────────────────────────────────────────
       MENÚ HAMBURGUESA
    ───────────────────────────────────────── */
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu   = document.querySelector('.nav-links');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            const isOpen = navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', String(isOpen));
            // Cambiar ícono a X
            navToggle.querySelector('.icon-open').style.display = isOpen ? 'none'  : 'block';
            navToggle.querySelector('.icon-close').style.display = isOpen ? 'block' : 'none';
        });

        navMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.querySelector('.icon-open').style.display  = 'block';
                navToggle.querySelector('.icon-close').style.display = 'none';
            });
        });
    }


    /* ─────────────────────────────────────────
       FONDO DINÁMICO — Tarjetas locales
    ───────────────────────────────────────── */
    document.querySelectorAll('.local-card').forEach(function (card) {
        const img = card.dataset.image;
        if (img) {
            card.style.setProperty('--bg-local', "url('../assets/img/" + img + "')");
        }
    });


    /* ─────────────────────────────────────────
       COUNTER ANIMATION — Stats en el hero
    ───────────────────────────────────────── */
    function animateCounter(el, target, suffix) {
        const duration = 1800;
        const start    = performance.now();

        function update(now) {
            const elapsed  = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quart
            const eased = 1 - Math.pow(1 - progress, 4);
            el.textContent = Math.round(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }

    // Usamos IntersectionObserver para disparar solo al entrar en viewport
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    if (statNumbers.length && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const el     = entry.target;
                    const target = parseInt(el.dataset.count);
                    const suffix = el.dataset.suffix || '';
                    animateCounter(el, target, suffix);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(function (el) { observer.observe(el); });
    }

});