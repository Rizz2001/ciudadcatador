document.addEventListener('DOMContentLoaded', function () {

    // ── AOS (Animate On Scroll) ──
    AOS.init({
        duration: 1000,
        once: true,
        offset: 80,
        easing: 'ease-out-cubic'
    });

    // ── MENÚ HAMBURGUESA ──
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {

        // Toggle menú
        navToggle.addEventListener('click', function () {
            const isOpen = navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isOpen);
            navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');

            // Bloquear scroll del body cuando el menú está abierto
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // FIX: Cerrar menú al hacer clic en cualquier enlace (navegación por anclas)
        navMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.setAttribute('aria-label', 'Abrir menú');
                document.body.style.overflow = '';
            });
        });

        // Cerrar menú con tecla Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.setAttribute('aria-label', 'Abrir menú');
                document.body.style.overflow = '';
                navToggle.focus();
            }
        });
    }

    // ── NAVBAR: cambio de opacidad al hacer scroll ──
    const navbar = document.getElementById('navbar');
    if (navbar) {
        let ticking = false;
        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(function () {
                    if (window.scrollY > 60) {
                        navbar.style.background = 'rgba(2, 11, 30, 0.95)';
                    } else {
                        navbar.style.background = 'rgba(2, 11, 30, 0.85)';
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // ── BACKGROUND DINÁMICO DE TARJETAS ──
    // Asigna la variable CSS --bg-local desde data-image si existe
    document.querySelectorAll('.local-card[data-image]').forEach(function (card) {
        const img = card.getAttribute('data-image');
        if (img && !card.style.getPropertyValue('--bg-local')) {
            card.style.setProperty('--bg-local', "url('./assets/img/" + img + "')");
        }
    });

});