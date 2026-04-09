// js/filtros.js
import { renderizarLocales } from './ui.js';

export function inicializarFiltros(todosLosLocales) {
    const contenedorFiltros = document.getElementById('filtros-container');

    contenedorFiltros.addEventListener('click', (evento) => {
        if (evento.target.classList.contains('btn-filtro')) {
            
            // Apagar todos los botones (volverlos secundarios)
            document.querySelectorAll('.btn-filtro').forEach(btn => {
                btn.classList.remove('activo');
                btn.classList.replace('btn-primary', 'btn-secondary');
            });
            
            // Encender el botón clickeado (volverlo primario)
            evento.target.classList.add('activo');
            evento.target.classList.replace('btn-secondary', 'btn-primary');

            // Filtrar y renderizar
            const categoriaSeleccionada = evento.target.dataset.categoria;
            
            if (categoriaSeleccionada === 'todas') {
                renderizarLocales(todosLosLocales);
            } else {
                const filtrados = todosLosLocales.filter(local => local.categoria_id === categoriaSeleccionada);
                renderizarLocales(filtrados);
            }
        }
    });
}