# Bienvenido al Tercer Ejercicio de React ⚛️

¡Felicidades por llegar hasta aquí! Es un camino difícil, lleno de desafíos y conceptos nuevos.

¡Lo estás haciendo muy bien!

El ejercicio de este módulo se divide en varias partes. Es importante que todas las dudas que surjan nos las puedas compartir en el archivo `dudas.md` o hablando por Discord.

## Primera parte | Componetización

En `src/App.jsx` encontrarás el HTML de la página de empleos. La idea es que:

- Puedas separar el HTML en secciones:
  - Header
  - Sección de búsqueda
  - Sección de resultados
  - Footer

Cada componente debe ser creado en `src/components/[nombre-del-componente].jsx` y hacer un export nombrado hacia `src/App.jsx`.

La página deberá verse así:

```jsx
/* Puedes elegir el nombre que quieras en los componentes */
import { Header } from './components/Header'
import { SearchFormSection } from './components/SearchFormSection'
import { SearchResultsSection } from './components/SearchResultsSection'
import { Footer } from './components/Footer'

function App() {
  return (
    <>
      <Header />
      <main>
        <SearchFormSection />
        <SearchResultsSection />
      </main>
      <Footer />
    </>
  )
}
```

## Segunda parte | Renderizados condicionales y mapeo de datos

En la primera parte trabajamos con componentización. Ahora vamos a ir un paso más allá y trabajar con renderizados condicionales y mapeo de datos.

Una vez que hayas creado tu componente `SearchResultsSection`, la idea es traer los datos de `src/data.json` y mostrarlos mediante un `.map()`.

El ejercicio consiste en:

- Traer el archivo `src/data.json`, sin necesidad de hacer un fetch.
- Mostrar la lista completa de empleos renderizando cada uno de ellos dentro de `data.map()`.
- Si `data` es un array vacío, mostrar un mensaje de "No se han encontrado empleos que coincidan con los criterios de búsqueda".

## Tercera parte | Uso de Props

Una vez tengamos nuestra sección componentizada y con los empleos mapeados, vamos a trabajar en el uso de Props.

Si vemos nuestro `SearchResultsSection`, seguramente haya quedado algo así:

```jsx
<section>
  <h2 style={{ textAlign: 'center' }}>Resultados de búsqueda</h2>
  <div className="jobs-listings">
    {jobs.length === 0 && (
      <p>No se han encontrado empleos que coincidan con los criterios de búsqueda.</p>
    )}

    {jobs.map((job) => (
      <article
        className="job-listing-card"
        data-modalidad={job.data.modalidad}
        data-nivel={job.data.nivel}
        data-technology={job.data.technology}
      >
        <div>
          <h3>{job.titulo}</h3>
          <small>
            {job.empresa} | {job.ubicacion}
          </small>
          <p>{job.descripcion}</p>
        </div>
        <button className={buttonClasses} onClick={handleApplyClick}>
          {buttonText}
        </button>
      </article>
    ))}
  </div>
  /* AQUÍ NUESTRO HTML DE PAGINACIÓN */
</section>
```

Tu tarea será crear un nuevo componente llamado `JobCard.jsx` que remplace el HTML que se encuentra dentro del `.map()`.

La idea es que:

- Este componente reciba por props todas las propiedades necesarias para renderizar el HTML de un job.
- Sea creado en la carpeta `src/components` y exportado de manera nombrada.

Una vez hecho esto, vamos a crear un componente para la **lista de empleos**. Para eso, crearemos otro componente llamado `JobListings.jsx` que tendrá el HTML tanto de la lista de empleos como su renderizado condicional.

```jsx
export function JobListings({ jobs }) {
  return (
    <div className="jobs-listings">
      {jobs.length === 0 && (
        <p>No se han encontrado empleos que coincidan con los criterios de búsqueda.</p>
      )}

      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  )
}
```

De esta forma, no solo vamos viendo cómo podemos componentizar estructuras HTML que se pueden reutilizar, sino también sub secciones de la página con condicionales y lógica.

Otra ventaja es que podemos separar nuestro componente padre `SearchResultsSection` en responsabilidades, donde cada componente, además de ser algo posiblemente reutilizable, también se encargue de una sola cosa.

## Cuarta parte | Paginación

¡Muy bien! Si llegaste hasta aquí, habrás visto que tu componente de `SearchResultsSection` se ha vuelto considerablemente más pequeño y declarativo. Pero tenemos un pequeño desafío extra: la paginación.

Siguiendo con lo que ya hemos visto, la idea es que:

- Crees un componente `Pagination.jsx` que reciba por props la cantidad de páginas totales y la actual.
- Hacer un `.map()` sobre el rango de páginas totales y mostrar un botón por cada una.
- Si la página actual es la primera, deshabilitar el botón de la página anterior.
- Si la página actual es la última, deshabilitar el botón de la página siguiente.
- Destacar la página actual con un color diferente.

Esta tarea se explica muy bien [en la clase de Paginación](https://www.jscamp.dev/introduccion-a-react/paginacion-props-comunicacion). Puedes usarla de referencia para acompañarte en el desarrollo.

Una cosa que te pediremos una vez termines con estos puntos es que puedas dar interactividad visual a los botones, indicando cuál es el activo y que cambie a medida que le des clic.

Esto lo puedes hacer con `useState` y pasando funciones como parámetro, tal como vimos en [esta clase](https://www.jscamp.dev/introduccion-a-react/estado-por-props-lifting-state).

---

## Pausa para respirar...

¡Felicidades por llegar hasta aquí! Sabemos que es un ejercicio complicado, así que tómalo con calma y si tienes dudas, no dudes en preguntarnos.

¡Estamos para acompañarte!

---

## Quinta parte | Dar funcionalidad al filtrado

¡Ahora toca dar funcionalidad al filtrado! En el ejercicio `01-javascript` trabajamos mucho en esto. Con React hay algunas cuestiones que cambian.

Tu tarea es:

- Dar funcionalidad al filtro de búsqueda y a cada uno de los selects que hay.
- Volver a la página 1 cada vez que se hace una nueva búsqueda.
- Agregar un debounce al filtro de búsqueda para que no se haga una nueva búsqueda cada vez que se escribe.
- Actualizar el total de páginas en la paginación dependiendo de la cantidad de resultados nuevos.
- El resultado de la búsqueda se debe reflejar en la URL por medio de search params.

## Sexta parte | Dar funcionalidad a la paginación

La idea del ejercicio es:

- Ocultar la paginación si no se encontraron resultados.
- Dar funcionalidad real a los botones. Si aparecen 5 páginas, al darle clic a la página 2, se deben mostrar los resultados de búsqueda que coincidan con la página 2.

> Puedes limitar el número de resultados por página en el valor que desees. La idea es que puedan aparecer varias páginas, así que 5 resultados está bien.

## Séptima parte | SPA

¡Ya está todo funcionando! Ahora nos queda hacer algo con las rutas de nuestra página.

En la carpeta `/pages` hemos dejado un archivo `404.jsx`, `Home.jsx` y `Search.jsx`. Cada componente representa una página diferente.

Tu tarea será:

- Crear el contenido de la página 404.
- Mover el contenido de `src/App.jsx` a la página `Search`.
- Siguiendo los pasos de [esta clase](https://www.jscamp.dev/introduccion-a-react/creando-una-spa-desde-cero), crear el componente `Link` y un custom hook para manejar las rutas.
- En `src/pages/Home.jsx`, darle funcionalidad al formulario para que, al hacer una búsqueda de empleos, se redirija a la página de búsqueda con los search params del resultado esperado.
- Crear un componente `Route.jsx` para usar en `src/App.jsx` y controlar las redirecciones por página desde ahí.

---

## Extras

1. Si lo deseas (recuerda que es opcional), puedes modificar el llamado de los datos desde un archivo JSON a un llamado a una API.

Aquí te dejamos una API real con los datos:
https://jscamp-api.vercel.app/api/jobs

2. También puedes hacer que el filtrado se haga desde la propia API, pasándole los parámetros de búsqueda como search params.

La API soporta los siguientes parámetros de búsqueda:

| Parámetro    | Tipo   | Descripción                       | Ejemplo                |
| ------------ | ------ | --------------------------------- | ---------------------- |
| `limit`      | number | Cantidad de resultados por página | `10`                   |
| `offset`     | number | Desde qué resultado empezar       | `0`, `10`, `20`        |
| `text`       | string | Búsqueda por texto libre          | `"react"`              |
| `technology` | string | Filtrar por tecnología            | `"react"`, `"node"`    |
| `type`       | string | Filtrar por modalidad/ubicación   | `"remoto"`, `"madrid"` |
| `level`      | string | Filtrar por nivel de experiencia  | `"junior"`, `"senior"` |

1. Debemos hacer que la paginación funcione correctamente con la API.
2. En la página `Search.jsx`, debes hacer que el título de la pestaña se actualice con el valor de los resultados. Ej: `Resultados 10 | Página 2 | DevJobs`
