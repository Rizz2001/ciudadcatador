// js/main.js
import { obtenerDirectorio } from './api.js';
import { renderizarLocales, renderizarFiltros } from './ui.js';
import { inicializarFiltros } from './filtros.js';

// --- 1. LÓGICA DE DATOS DEL MALL ---
let directorioGlobal = [];

async function iniciarAplicacion() {
    const datos = await obtenerDirectorio();
    
    if (datos) {
        directorioGlobal = datos.locales;
        
        // Dibujar la interfaz
        renderizarFiltros(datos.categorias);
        renderizarLocales(directorioGlobal);
        
        // Activar botones
        inicializarFiltros(directorioGlobal);
    }
}

// --- 2. FUNCIÓN DE OPTIMIZACIÓN (THROTTLE) ---
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// --- 3. LÓGICA DE UI EXISTENTE (NAVBAR Y MENÚ) ---
function inicializarUI() {
    // Scroll de la Navbar y Botón Volver Arriba
    const navbar = document.getElementById('navbar');
    const btnVolverArriba = document.getElementById('btn-volver-arriba');
    
    // Optimizamos el evento de scroll con throttle para no sobrecargar el navegador
    const handleScroll = () => {
        if (navbar) {
             if (window.scrollY > 60) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Mostrar/Ocultar el botón Volver Arriba después de bajar 300px
        if (btnVolverArriba) {
            if (window.scrollY > 300) {
                btnVolverArriba.classList.add('visible');
            } else {
                btnVolverArriba.classList.remove('visible');
            }
        }
    };
    window.addEventListener('scroll', throttle(handleScroll, 100)); // Se ejecuta max cada 100ms

    // Acción al hacer clic en el botón Volver Arriba
    if (btnVolverArriba) {
        btnVolverArriba.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Menú Móvil (Hamburguesa)
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            if (isExpanded) {
                // Cerrar
                navToggle.setAttribute('aria-label', 'Abrir menú');
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('no-scroll');
            } else {
                // Abrir
                navToggle.setAttribute('aria-label', 'Cerrar menú');
                navMenu.classList.add('active');
                navToggle.setAttribute('aria-expanded', 'true');
                document.body.classList.add('no-scroll');
            }
        });

        // Cerrar menú al hacer clic en un enlace del móvil
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-label', 'Abrir menú');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // --- 4. MOTOR DE CARRUSEL (AUTO-SCROLL + MANUAL) ---
    const localesGrid = document.getElementById('locales-container');
    if (localesGrid) {
        let isPaused = false;
        let scrollDirection = 1; // 1 = derecha, -1 = izquierda
        let resumeTimer;

        // VIGILANTE: Detecta si la sección del carrusel está visible en la pantalla
        let isVisible = true;
        if (window.IntersectionObserver) {
            const observer = new IntersectionObserver((entries) => {
                isVisible = entries[0].isIntersecting;
            }, { threshold: 0 }); // 0 = Avisa en cuanto asome aunque sea 1 pixel
            
            // Observamos toda la sección de locales
            observer.observe(document.getElementById('locales'));
        }

        function autoScrollLocales() {
            // Solo hace auto-scroll si no está pausado, NO está expandido, Y está VISIBLE
            if (!isPaused && !localesGrid.classList.contains('expanded') && isVisible) {
                localesGrid.scrollLeft += scrollDirection; // Se mueve 1px por frame
                
                // Si llega al final derecho, cambia dirección a la izquierda
                if (Math.ceil(localesGrid.scrollLeft) >= localesGrid.scrollWidth - localesGrid.clientWidth - 2) {
                    scrollDirection = -1;
                } 
                // Si llega al inicio izquierdo, cambia dirección a la derecha
                else if (localesGrid.scrollLeft <= 0) {
                    scrollDirection = 1;
                }
            }
            requestAnimationFrame(autoScrollLocales);
        }

        // Arrancamos el bucle JS del carrusel
        requestAnimationFrame(autoScrollLocales);

        // Funciones para pausar y reanudar dándole tiempo a la inercia táctil
        const pauseScroll = () => { isPaused = true; clearTimeout(resumeTimer); };
        const resumeScroll = () => { clearTimeout(resumeTimer); resumeTimer = setTimeout(() => isPaused = false, 1500); };

        // Eventos táctiles (Móvil) y de ratón (PC)
        localesGrid.addEventListener('touchstart', pauseScroll, { passive: true });
        localesGrid.addEventListener('touchend', resumeScroll, { passive: true });
        localesGrid.addEventListener('mouseenter', pauseScroll);
        localesGrid.addEventListener('mouseleave', resumeScroll);

        // --- FUNCIONALIDAD "VER TODOS" ---
        const btnVerTodos = document.getElementById('btn-ver-todos');
        if (btnVerTodos) {
            btnVerTodos.addEventListener('click', () => {
                localesGrid.classList.toggle('expanded');
                
                if (localesGrid.classList.contains('expanded')) {
                    btnVerTodos.textContent = 'Ver menos locales';
                } else {
                    btnVerTodos.textContent = 'Ver todos los locales';
                }
            });
        }
    }

    // Iniciar animaciones de la librería AOS si está cargada en el HTML
    if (typeof AOS !== 'undefined') {
        AOS.init({
            once: true, // Las animaciones se ejecutan solo 1 vez al bajar. Evita lag al subir y bajar rápido.
            offset: 50, // Lanza la animación un poco antes para que se sienta más rápido
            disable: 'mobile' // Opcional: Descomenta esto si notas tirones en teléfonos muy antiguos
        });
    }
}

// --- 5. INICIO GENERAL ---
document.addEventListener('DOMContentLoaded', () => {
    inicializarUI();       // Arranca tu navbar y menú
    iniciarAplicacion();   // Arranca la carga de locales
});