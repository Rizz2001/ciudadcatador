// js/ui.js
export function renderizarLocales(locales) {
    const contenedor = document.getElementById('locales-container');
    contenedor.innerHTML = '';

    if (locales.length === 0) {
        contenedor.innerHTML = '<p style="color: white; text-align: center; grid-column: 1 / -1; padding: 2rem;">No hay locales en esta categoría por ahora.</p>';
        return;
    }

    locales.forEach((local, index) => {
        const articulo = document.createElement('article');
        // Añadimos la clase para la animación y un retraso escalonado
        articulo.className = 'local-card animate-in';
        articulo.style.animationDelay = `${index * 0.05}s`;
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
    
    // Botón "Todos"
    contenedor.innerHTML = '<button class="btn btn-primary btn-filtro activo" data-categoria="todas" aria-pressed="true">Todos</button>';

    // Ordenamos las categorías alfabéticamente para que sea más fácil buscar
    const categoriasOrdenadas = [...categorias].sort((a, b) => a.nombre.localeCompare(b.nombre));

    // Botones dinámicos
    categoriasOrdenadas.forEach(cat => {
        const boton = document.createElement('button');
        // Usamos la clase btn-secondary para los que no están activos
        boton.className = 'btn btn-secondary btn-filtro'; 
        boton.setAttribute('aria-pressed', 'false');
        boton.dataset.categoria = cat.id;
        boton.textContent = cat.nombre;
        contenedor.appendChild(boton);
    });
}