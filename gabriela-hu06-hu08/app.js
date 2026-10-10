/* ==========================================================================
   APP.JS - LÓGICA DE INTERACCIÓN Y NAVEGACIÓN
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. NAVEGACIÓN ENTRE PANTALLAS (Redirección al hacer clic en botones)
     ------------------------------------------------------------------------ */
  
  // Botones "Ver curso" (Nos llevan desde Cursos hacia el detalle del curso)
  const viewCourseBtns = document.querySelectorAll('.btn-view-course');
  viewCourseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.href = 'curso-ux.html';
    });
  });

  // Enlace o botón "Ver todos" en Inicio / Menú lateral
  const viewAllCoursesLinks = document.querySelectorAll('.metric-link[href="index.html"]');
  viewAllCoursesLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Si usas un botón sin href o deseas redirigir explícitamente:
      // window.location.href = 'index.html';
    });
  });


  /* ------------------------------------------------------------------------
     2. MÓDULO ACORDEÓN (Desplegar / Plegar contenido de Semana 5)
     ------------------------------------------------------------------------ */
  
  // Seleccionamos todas las tarjetas de semanas
  const weekCards = document.querySelectorAll('.week-card');

  weekCards.forEach(card => {
    card.addEventListener('click', () => {
      // Buscamos si la tarjeta actual tiene un panel de contenido justo debajo
      const accordionContent = card.nextElementSibling;

      if (accordionContent && accordionContent.classList.contains('accordion-content')) {
        // Alternamos la clase CSS activa en la tarjeta (cambia color de fondo/texto)
        card.classList.toggle('accordion-active');

        // Alternamos la orientación del icono de flecha (derecha vs arriba)
        const arrowIcon = card.querySelector('.arrow-icon');
        if (arrowIcon) {
          arrowIcon.classList.toggle('bi-chevron-right');
          arrowIcon.classList.toggle('bi-chevron-up');
        }

        // Alternamos la visibilidad del contenedor de la semana (flex vs none)
        if (accordionContent.style.display === 'flex') {
          accordionContent.style.display = 'none';
        } else {
          accordionContent.style.display = 'flex';
        }
      }
    });
  });


  /* ------------------------------------------------------------------------
     3. VENTANA EMERGENTE / MODAL (Pendientes extendidos por urgencia)
     ------------------------------------------------------------------------ */
  
  const btnVerTodosPendientes = document.querySelector('.btn-all-pending');
  const modalPendientes = document.getElementById('modalPendientes');
  const btnIconClose = document.getElementById('btnIconClose');
  const btnTextClose = document.getElementById('btnTextClose');

  // Función para abrir la ventana emergente
  if (btnVerTodosPendientes && modalPendientes) {
    btnVerTodosPendientes.addEventListener('click', () => {
      modalPendientes.classList.add('active');
    });
  }

  // Función genérica para cerrar la ventana emergente
  const cerrarModal = () => {
    if (modalPendientes) {
      modalPendientes.classList.remove('active');
    }
  };

  // Asignar evento de cierre al botón X y al botón "Cerrar" del pie
  if (btnIconClose) btnIconClose.addEventListener('click', cerrarModal);
  if (btnTextClose) btnTextClose.addEventListener('click', cerrarModal);

  // Cerrar el modal si el usuario hace clic fuera de la caja blanca (en la zona oscura)
  if (modalPendientes) {
    modalPendientes.addEventListener('click', (e) => {
      if (e.target === modalPendientes) {
        cerrarModal();
      }
    });
  }

});