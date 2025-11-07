# Ejercicio de JavaScript

- [Diseño](https://stitch.withgoogle.com/projects/7508115667617706440)

¡Hola! Si llegaste hasta aquí es que pudiste hacer el ejercicio de HTML y CSS correctamente, ¡enhorabuena!

Para el desafío de hoy, vamos a tener diferentes retos, cada uno de ellos más complejo que el anterior, así que no te apresures y trata de ir a tu ritmo, repasando y practicando cada contenido que hemos dado.

---

## Primer desafío | Mostrar los resultados de búsqueda ⭐️

En el archivo `data.json` tienen la lista de todos los resultados de búsqueda.
Muestra la lista dentro del elemento `ul` en `empleos.html`

```html
<ul class="jobs-listings">
  <!-- Aquí se insertan los empleos dinámicamente -->
</ul>
```

Ten en cuenta:

- Debes usar `fetch`, tal como lo dimos en la lección [Renderizando datos con fetch](https://www.jscamp.dev/javascript/fetch-mostrar-datos)
- El script debe ir en el archivo `fetch-data.js`

Para simplificar el ejercicio, aquí te dejamos el código de cada elemento de la lista:

```html
<li>
  <article class="job-listing-card">
    <div>
      <h3>{job.titulo}</h3>
      <small>{job.empresa} | {job.ubicacion}</small>
      <p>{job.descripcion}</p>
    </div>
    <button class="button-apply-job">Aplicar</button>
  </article>
</li>
```

---

## Segundo desafío | Dar funcionalidad al botón de "Aplicar" ⭐️⭐️

Al darle click al botón "Aplicar", debe pasar lo siguiente:

- Debe cambiar el texto del botón a "¡Aplicado!"
- Debe cambiar el color del botón a verde
- Debe deshabilitar el botón

Ten en cuenta:

- El script debe ir en el archivo `apply-button.js`

---

## Tercer desafío | Filtrar resultados por ubicación y nivel de experiencia ⭐️⭐️⭐️

En el archivo `empleos.html` tienen los filtros para buscar por ubicación y nivel de experiencia.

```html
<select name="location" id="filter-location">
  <option value="">Ubicación</option>
  <option value="remoto">Remoto</option>
  <option value="cdmx">Ciudad de México</option>
  <option value="guadalajara">Guadalajara</option>
  <option value="monterrey">Monterrey</option>
  <option value="barcelona">Barcelona</option>
</select>

<select name="experience-level" id="filter-experience-level">
  <option value="">Nivel de experiencia</option>
  <option value="junior">Junior</option>
  <option value="mid">Mid-level</option>
  <option value="senior">Senior</option>
  <option value="lead">Lead</option>
</select>
```

El desafío es que cuando el usuario elige una ubicación o nivel de experiencia, solo se muestren las ofertas que coincidan con el filtro seleccionado.

Ten en cuenta:

- El script debe ir en el archivo `filters.js`
- Si el usuario elige "remoto", solo se mostrarán las ofertas que sean remotas
- Si el usuario elige "cdmx", solo se mostrarán las ofertas que sean para la Ciudad de México
- Si el usuario elige "junior", solo se mostrarán las ofertas que sean para Junior
- Si el usuario elige los campos por defecto (""), se mostrarán todas las ofertas

---

## Cuarto desafío | Buscar por título ⭐️⭐️⭐️

En el archivo `empleos.html` tienen el input de búsqueda:

```html
<input
  name="search"
  id="empleos-search-input"
  type="text"
  placeholder="Buscar trabajos, empresas o habilidades"
/>
```

Tienen que filtrar los resultados de búsqueda por título.

Ten en cuenta:

- El script debe ir en el archivo `filters.js`
- No tiene que ser sensible a las mayúsculas y minúsculas, el usuario puede escribir el título en mayúsculas o minúsculas y obtener el mismo resultado.
- Si escribo “analista”, solo debería mostrar ofertas que incluyan esa palabra en el título
- Si escribo “desarrollador”, solo las que tengan esa palabra
- Si borro el texto, deberían aparecer todas las ofertas de nuevo

---

## Quinto desafío | Filtrar por tecnología ⭐️⭐️⭐️⭐️

En el archivo `empleos.html` tienen los filtros para buscar por tecnología.

```html
<select name="technology" id="filter-technology">
  <option value="">Tecnología</option>
  <optgroup label="Tecnologías populares">
    <option value="javascript">JavaScript</option>
    <option value="python">Python</option>
    <option value="react">React</option>
    <option value="nodejs">Node.js</option>
  </optgroup>
  <option value="java">Java</option>
  <hr />
  <option value="csharp">C#</option>
  <option value="c">C</option>
  <option value="c++">C++</option>
  <hr />
  <option value="ruby">Ruby</option>
  <option value="php">PHP</option>
</select>
```

Ten en cuenta:

- El script debe ir en el archivo `filters.js`
- En `data.json`, las tecnologías se muestran como un array de strings, por ejemplo: `"technology": ["javascript", "react"]`. Lo que tienes que hacer es que cuando el usuario elige una tecnología, solo se muestren las ofertas que contengan esa tecnología.
