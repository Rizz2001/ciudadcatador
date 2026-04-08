document.addEventListener('DOMContentLoaded', function () {

    /* ─────────────────────────────────────────────────────────
       AOS — Animaciones al scroll
       Documentación: https://michalsnik.github.io/aos/
    ───────────────────────────────────────────────────────── */
    AOS.init({
        duration: 900,
        once: true,      // Solo anima la primera vez (no se repite al volver a subir)
        offset: 80,
        easing: 'ease-out'
    });


    /* ─────────────────────────────────────────────────────────
       CURSOR PERSONALIZADO
       ─────────────────────────────────────────────────────────
       BUG FIX 1: El cursor empieza con opacity:0 en CSS.
       Aquí lo hacemos visible solo al primer mousemove para
       evitar que aparezca en la esquina (0,0) al cargar.

       Solo se activa en dispositivos con puntero preciso
       (ratón de escritorio) — no en touch/móvil.
    ───────────────────────────────────────────────────────── */
    const cursor     = document.querySelector('.cursor');
    const cursorRing = document.querySelector('.cursor-ring');

    const isFinePonter = window.matchMedia('(pointer: fine)').matches;

    if (cursor && cursorRing && isFinePonter) {

        let mouseX = 0, mouseY = 0;
        let ringX  = 0, ringY  = 0;
        let cursorVisible = false;

        document.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Posición del punto (inmediata)
            cursor.style.left = mouseX + 'px';
            cursor.style.top  = mouseY + 'px';

            // FIX: Primera vez que el ratón se mueve → mostrar cursores
            if (!cursorVisible) {
                cursor.classList.add('visible');
                cursorRing.classList.add('visible');
                cursorVisible = true;
            }
        });

        // Ocultar al salir de la ventana
        document.addEventListener('mouseleave', function () {
            cursor.classList.remove('visible');
            cursorRing.classList.remove('visible');
        });

        document.addEventListener('mouseenter', function () {
            if (cursorVisible) {
                cursor.classList.add('visible');
                cursorRing.classList.add('visible');
            }
        });

        // Anillo con efecto de inercia (lerp)
        function animateRing() {
            // Interpolación suave: 12% del camino restante por frame
            ringX += (mouseX - ringX) * 0.12;
            ringY += (mouseY - ringY) * 0.12;
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top  = ringY + 'px';
            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Estado hover: agrandar el cursor al pasar sobre elementos interactivos
        document.querySelectorAll('a, button, .local-card, .gallery-img').forEach(function (el) {
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


    /* ─────────────────────────────────────────────────────────
       NAVBAR — Se oscurece al hacer scroll
    ───────────────────────────────────────────────────────── */
    const navbar = document.querySelector('.navbar');

    if (navbar) {
        window.addEventListener('scroll', function () {
            navbar.classList.toggle('scrolled', window.scrollY > 60);
        }, { passive: true });
    }


    /* ─────────────────────────────────────────────────────────
       MENÚ HAMBURGUESA (mobile)
       ─────────────────────────────────────────────────────────
       BUG FIX 3: Al abrir el menú se bloquea el scroll
       del body agregando la clase .menu-open al <body>.
       Al cerrar, se remueve.
    ───────────────────────────────────────────────────────── */
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu   = document.querySelector('.nav-links');
    const iconOpen  = navToggle ? navToggle.querySelector('.icon-open')  : null;
    const iconClose = navToggle ? navToggle.querySelector('.icon-close') : null;

    function openMenu() {
        navMenu.classList.add('active');
        document.body.classList.add('menu-open');   // FIX 3: bloquea scroll
        navToggle.setAttribute('aria-expanded', 'true');
        if (iconOpen)  iconOpen.style.display  = 'none';
        if (iconClose) iconClose.style.display = 'block';
    }

    function closeMenu() {
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open'); // FIX 3: restaura scroll
        navToggle.setAttribute('aria-expanded', 'false');
        if (iconOpen)  iconOpen.style.display  = 'block';
        if (iconClose) iconClose.style.display = 'none';
    }

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            const isOpen = navMenu.classList.contains('active');
            isOpen ? closeMenu() : openMenu();
        });

        // Cerrar al hacer click en cualquier enlace del menú
        navMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });

        // Cerrar con la tecla Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    }


    /* ─────────────────────────────────────────────────────────
       FONDO DINÁMICO — Tarjetas de locales
       ─────────────────────────────────────────────────────────
       Cada .local-card tiene un atributo data-image="foto.jpg".
       Este script lo convierte en una variable CSS --bg-local
       que usa el ::before de la tarjeta como fondo blureado.

       Para cambiar la foto de fondo de una tarjeta:
       → Edita el atributo data-image="nueva-foto.jpg" en el HTML
       → La imagen debe estar en ./assets/img/
    ───────────────────────────────────────────────────────── */
    document.querySelectorAll('.local-card').forEach(function (card) {
        const img = card.dataset.image;
        if (img) {
            card.style.setProperty('--bg-local', "url('./assets/img/" + img + "')");
        }
    });


    /* ─────────────────────────────────────────────────────────
       COUNTER ANIMATION — Números animados en el hero
       ─────────────────────────────────────────────────────────
       Los elementos con clase .stat-number y atributo
       data-count="N" se animan contando desde 0 hasta N
       cuando entran en el viewport.

       Atributos disponibles en el HTML:
       • data-count="300"    → número objetivo
       • data-suffix="+"     → texto después del número
    ───────────────────────────────────────────────────────── */
    function animateCounter(el, target, suffix) {
        const duration = 1800; // ms
        const start    = performance.now();

        function update(now) {
            const elapsed  = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Curva ease-out quart: desacelera al final
            const eased = 1 - Math.pow(1 - progress, 4);
            el.textContent = Math.round(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }

    const statNumbers = document.querySelectorAll('.stat-number[data-count]');

    if (statNumbers.length && 'IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const el     = entry.target;
                    const target = parseInt(el.dataset.count, 10);
                    const suffix = el.dataset.suffix || '';
                    animateCounter(el, target, suffix);
                    counterObserver.unobserve(el); // Solo una vez
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(function (el) { counterObserver.observe(el); });
    }

});