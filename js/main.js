// Esperamos a que la página cargue completa
document.addEventListener('DOMContentLoaded', function() {
    
    // Encendemos las animaciones AOS
    AOS.init({
        duration: 1000,  // Cuánto dura la animación (1 segundo)
        once: true,      // Solo se anima la primera vez que bajas (así no marea)
        offset: 100      // Empieza a animarse un poquito antes de aparecer en pantalla
    });

});