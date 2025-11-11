<!-- Aquí puedes introducir tus dudas sobre el ejercicio, la consigna, la corrección, etc -->
He tenido que meter algunos estilos y algunas etiquetas HTML adicionales para adaptar el ejercicio a mi versión original:
1. Por un lado, la paginación no estaba especificada en la consigna, pero había sido una propuesta de midu y ya la tenía integrada en mi versión.
2. Para la paginación creo que los botones son más apropiados porque tienen más propiedades que los anchors no tienen, como la propiedad `disabled`. 

---

Hola genio! Me parece genial :) Estuve viendo el ejercicio y está muy bien hecho, enhorabuena!
Me gustó como manejaste el objeto `window` para guardar el estado de los datos.

Una cosa que agregaría para simplificar la lectura del código es generar una utilidad para no tener que repetir `document.querySelector` o `document.querySelectorAll`. Y a su vez, las variables que son para almacenar las referencias al DOM, las escribiría con `$` al inicio. Esto, es una convención nuestra con la que creemos que queda más claro el código, pero no es necesario y a gustos colores:

``` js
// utilidad
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const $container = $('.jobs-listings');
const $emptyState = $('.jobs-empty');
const $paginationNav = $('.pagination');
const $pagesContainer = $('.pagination-pages');
const $prevButton = $('#prev-page');
const $nextButton = $('#next-page');

// Así cuando tengamos código con variables mezcladas, podremos distinguir mejor qué son variables del DOM y qué son variables de estado:
const renderPaginationNav = (totalPages, currentPage) => {
  // esta función en la que usas en `fetch-data.js`, cambiamos un poco el código para que sea más limpio.
  // siempre es interesante pensar en las condiciones de salida para evitar código innecesario. Esto hace que no nos preocupemos de los if anidados, y que el código no tenga tantos escalones.
  if(!$prevButton || !$nextButton) {
    return;
  }

  if (!totalPages) {
    $prevButton.setAttribute('hidden', '');
    $nextButton.setAttribute('hidden', '');
    return;
  }

  $prevButton.removeAttribute('hidden');
  $nextButton.removeAttribute('hidden');

  $prevButton.disabled = currentPage <= 1;
  $nextButton.disabled = currentPage >= totalPages;
};
```