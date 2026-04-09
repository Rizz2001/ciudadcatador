// js/ui.js
export function renderizarLocales(locales) {
    const contenedor = document.getElementById('locales-container');
    contenedor.innerHTML = '';

    if (locales.length === 0) {
        contenedor.innerHTML = '<p style="color: white; text-align: center; grid-column: 1 / -1; padding: 2rem;">No hay locales en esta categoría por ahora.</p>';
        return;
    }

    locales.forEach(local => {
        const articulo = document.createElement('article');
        articulo.className = 'local-card';
        // Inyectamos la variable CSS para el fondo como lo tenías originalmente
        articulo.style.setProperty('--bg-local', `url('${local.imagenes.fondo}')`);
        
        articulo.innerHTML = `
            <a href="${local.redes.instagram}" target="_blank" rel="noopener noreferrer" class="local-link" aria-label="Visitar ${local.nombre} en Instagram">
                <div class="local-logo">
                    <img src="${local.imagenes.logo}" alt="Logo ${local.nombre}" loading="lazy" width="110" height="110">
                </div>
                <div class="local-info">
                    <h3>${local.nombre}</h3>
                    <p>${local.descripcion}</p>
                </div>
            </a>
        `;
        contenedor.appendChild(articulo);
    });
}

export function renderizarFiltros(categorias) {
    const contenedor = document.getElementById('filtros-container');
    
    // Agregamos un poco de estilo directo al contenedor para que los botones se vean bien alineados
    contenedor.style.display = 'flex';
    contenedor.style.gap = '1rem';
    contenedor.style.justifyContent = 'center';
    contenedor.style.flexWrap = 'wrap';
    contenedor.style.marginBottom = '2rem';

    // Botón "Todos"
    contenedor.innerHTML = '<button class="btn btn-primary btn-filtro activo" data-categoria="todas">Todos</button>';

    // Botones dinámicos
    categorias.forEach(cat => {
        const boton = document.createElement('button');
        // Usamos la clase btn-secondary para los que no están activos
        boton.className = 'btn btn-secondary btn-filtro'; 
        boton.dataset.categoria = cat.id;
        boton.textContent = cat.nombre;
        contenedor.appendChild(boton);
    });
}