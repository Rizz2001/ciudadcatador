document.addEventListener('DOMContentLoaded', function () {

    // ── Animaciones AOS ──────────────────────────────────────────
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // ── Menú hamburguesa (mobile) ─────────────────────────────────
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu   = document.querySelector('.nav-links');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            const isOpen = navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isOpen);
        });

        // Cerrar menú al hacer click en un link
        navMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ── Fondo dinámico en tarjetas de locales ─────────────────────
    // Cada .local-card tiene data-image="nombre-foto.jpg"
    // Este script aplica esa imagen como variable CSS --bg-local
    document.querySelectorAll('.local-card').forEach(function (card) {
        const img = card.dataset.image;
        if (img) {
            card.style.setProperty('--bg-local', `url('../assets/img/${img}')`);
        }
    });

});