// js/filtros.js
import { renderizarLocales } from './ui.js';

export function inicializarFiltros(locales) {
    const contenedorFiltros = document.getElementById('filtros-container');

    contenedorFiltros.addEventListener('click', (e) => {
        // Asegurarnos de que solo reaccionamos a los botones de filtro
        if (e.target.classList.contains('btn-filtro')) {
            const categoriaSeleccionada = e.target.dataset.categoria;

            // Actualizar estado visual y de accesibilidad de los botones
            const botones = contenedorFiltros.querySelectorAll('.btn-filtro');
            botones.forEach(boton => {
                const esActivo = boton.dataset.categoria === categoriaSeleccionada;
                boton.classList.toggle('activo', esActivo);
                boton.classList.toggle('btn-primary', esActivo);
                boton.classList.toggle('btn-secondary', !esActivo);
                boton.setAttribute('aria-pressed', esActivo);
            });

            // Filtrar y renderizar los locales
            if (categoriaSeleccionada === 'todas') {
                renderizarLocales(locales);
            } else {
                const localesFiltrados = locales.filter(local => local.categoria_id === categoriaSeleccionada);
                renderizarLocales(localesFiltrados);
            }
        }
    });
}