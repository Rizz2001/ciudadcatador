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
    // Scroll de la Navbar
    const navbar = document.getElementById('navbar');
    if (navbar) {
        // Optimizamos el evento de scroll con throttle para no sobrecargar el navegador
        const handleScroll = () => {
            if (window.scrollY > 60) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', throttle(handleScroll, 100)); // Se ejecuta max cada 100ms
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

    // Iniciar animaciones de la librería AOS si está cargada en el HTML
    if (typeof AOS !== 'undefined') {
        AOS.init();
    }
}

// --- 4. INICIO GENERAL ---
document.addEventListener('DOMContentLoaded', () => {
    inicializarUI();       // Arranca tu navbar y menú
    iniciarAplicacion();   // Arranca la carga de locales
});