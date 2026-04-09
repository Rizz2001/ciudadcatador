// js/api.js
export async function obtenerDirectorio() {
    try {
        const respuesta = await fetch('./data/directorio.json');
        if (!respuesta.ok) throw new Error('Error al cargar el JSON');
        const datos = await respuesta.json();
        return datos;
    } catch (error) {
        console.error("Hubo un problema obteniendo los datos:", error);
        return null;
    }
}