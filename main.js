document.addEventListener('DOMContentLoaded', function () {

    // ── AOS (Animate On Scroll) — con guard por si el CDN falla ──
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 80,
            easing: 'ease-out-cubic'
        });
    }

    // ── MENÚ HAMBURGUESA ──
    var navToggle = document.getElementById('navToggle');
    var navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {

        function closeMenu() {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Abrir menú');
            document.body.style.overflow = '';
        }

        function openMenu() {
            navMenu.classList.add('active');
            navToggle.setAttribute('aria-expanded', 'true');
            navToggle.setAttribute('aria-label', 'Cerrar menú');
            document.body.style.overflow = 'hidden';
        }

        // Toggle
        navToggle.addEventListener('click', function () {
            var isOpen = navMenu.classList.contains('active');
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Cerrar al clic en enlace
        var menuLinks = navMenu.querySelectorAll('a');
        for (var i = 0; i < menuLinks.length; i++) {
            menuLinks[i].addEventListener('click', closeMenu);
        }

        // Cerrar con Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
                navToggle.focus();
            }
        });
    }

    // ── NAVBAR: opacidad al scroll ──
    var navbar = document.getElementById('navbar');
    if (navbar) {
        var ticking = false;
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

});