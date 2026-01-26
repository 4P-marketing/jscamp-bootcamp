# Bienvenido al Cuarto Ejercicio de React con React Router y Zustand ⚛️

¡Enhorabuena por haber llegado hasta aquí! Sabemos que el ejercicio anterior con React fue desafiante, y aún así lo superaste. ¡Sigue así!

En este ejercicio vamos a integrar todo lo que has aprendido sobre React Router, estado global con Zustand y optimización de aplicaciones.

## Antes de empezar

Te dejamos el enlace a los estilos de referencia de la página para que puedas ver cómo deberían verse las diferentes secciones que pediremos en el ejercicio. Recuerda que siempre puedes modificar los estilos para personalizarlos a tu gusto.

👉 [Estilos de DevJobs](https://stitch.withgoogle.com/projects/7508115667617706440)

## Primera parte | Configurar React Router

Si exploras el código que te hemos dejado, verás que tiene un sistema de enrutamiento creado por nosotros. El objetivo de este ejercicio es sustituirlo por React Router.

### Tareas

- Instalar React Router en el proyecto (`npm i react-router`)
- En `main.jsx`, importar `BrowserRouter` y envolver la aplicación con él
- En `App.jsx`, importar `Routes` y `Route` para crear las rutas principales de la app (`/` y `/search`)
- Modificar el componente `Link` existente para que use internamente el `Link` de React Router. **Importante**: la modificación debe hacerse dentro del componente existente, no reemplazar todas las instancias en la app.
- Modificar el hook `useRouter` para que use `useNavigate` y `useLocation` de React Router, manteniendo la misma interfaz que ya devolvía

## Segunda parte | Crear página de Detalles

Ahora vamos a crear la página de detalles para cada uno de los empleos con información dinámica.

### Tareas

1. Crear la página `Detail` en `src/pages/Detail.jsx`
2. Crear la ruta `/job/:id` en `src/App.jsx`
3. En el componente `JobCard`, además de poder aplicar a un empleo, añadir la posibilidad de navegar hacia su detalle usando el componente `Link` modificado. Aquí tienes libertad a la hora de implementarlo. Lo importante es que aún siga funcionando el botón de aplicar.

### Obtener datos dinámicos

Para que cada página muestre el contenido específico del empleo:

- Usa el hook `useParams` de React Router para obtener el `id` del empleo desde la URL (Dentro del componente `Detail`)
- Haz fetch a la API con ese ID para obtener los datos

**Endpoint de la API:**

```
https://jscamp-api.vercel.app/api/jobs/:id
```

**Ejemplo:**

```
https://jscamp-api.vercel.app/api/jobs/7a4d1d8b-1e45-4d8c-9f1a-8c2f9a9121a4
```

### Renderizar contenido Markdown

El contenido de texto que devuelve la API está en formato Markdown. Necesitas convertirlo a HTML para mostrarlo en la página.

**💡 Tip:** Puedes usar la librería `snarkdown` para convertir Markdown a HTML, y luego renderizarlo con la propiedad `dangerouslySetInnerHTML`.

## Tercera parte | Sincronización de filtros con useSearchParams

Gracias a React Router estamos simplificando la navegación en nuestro sitio. Ahora vamos a dar un paso más: modificar la página de búsqueda para manejar los filtros de manera más declarativa y sincronizada con la URL.

### Tareas

1. **Leer filtros de la URL**
   - Usa el hook `useSearchParams` de React Router para obtener los filtros desde la URL

2. **Actualizar la URL al cambiar filtros**
   - Usa el setter que devuelve `useSearchParams` para actualizar los parámetros cuando el usuario modifique los filtros

3. **Persistir estado al recargar**
   - Mantén el estado de los filtros al recargar la página
   - Si el usuario filtra por tecnología "react", al recargar:
     - Los resultados deben seguir filtrados
     - El select debe mostrar "react" como seleccionado

### Resultado esperado

Cuando el usuario modifique los filtros, la URL se actualizará automáticamente y los filtros se sincronizarán con ella, haciendo el código más declarativo y las búsquedas compartibles.

## Cuarta parte | Optimización

Una de las claves de la optimización web es **no cargar código que no se va a usar**. Actualmente, si visitas la página inicial y abres la pestaña **Coverage** en las DevTools de Chrome, verás que se cargan todos los archivos de todas las páginas, incluso las que no estás visitando.

### Tareas

1. **Carga diferida de páginas**
   - Usa `React.lazy()` para cargar las páginas de manera dinámica (lazy loading)

2. **Añadir estado de carga**
   - Envuelve las rutas con `Suspense`
   - Muestra un loader mientras se carga la página

### Resultado esperado

Cada página se cargará solo cuando el usuario navegue a ella, mejorando significativamente el tiempo de carga inicial.

## Quinta parte | Mejoras en la UI

Ahora que el sistema de rutas funciona correctamente, vamos a mejorar la experiencia visual y preparar la interfaz para el estado global con Zustand.

### Tarea 1: Links activos en la navegación

- Usa `NavLink` de React Router para los links principales del menú
- Aplica estilos diferentes cuando el link esté activo
- Ejemplo: si estamos en `/search`, ese link debe verse diferente a los demás

### Tarea 2: Botón de inicio de sesión

- En el componente `Header`, añade un botón con el texto "Iniciar sesión"
- Por ahora, sin funcionalidad (lo implementaremos en la siguiente parte)

### Tarea 3: Botón de favoritos

- En el componente `JobCard`, añade un botón "Agregar a favoritos"
- Por ahora, sin funcionalidad (lo implementaremos con Zustand)

## Sexta parte | Estado global con Zustand

Ahora vamos a implementar estado global usando Zustand para manejar la autenticación y los favoritos.

El primer paso es instalar Zustand.
Lo puedes hacer con el siguiente comando:

```bash
npm i zustand
```

### Tarea 1: Store de autenticación

Crea `src/store/authStore.js` con:

- **Estado `isLoggedIn`** (boolean) - indica si hay sesión activa
- **Acción `login()`** - simula inicio de sesión
- **Acción `logout()`** - cierra sesión

Estas dos acciones lo que hacen es cambiar el valor de `isLoggedIn` a `true` o `false`.

**💡 Ejemplo de estructura:**

```js
import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  isLoggedIn: false,
  login: () => set({ isLoggedIn: true }),
  logout: () => set({ isLoggedIn: false }),
}))
```

### Tarea 2: Store de favoritos

Crea `src/store/favoritesStore.js` con:

- **Estado `favorites`** (array de IDs)
- **Acción `addFavorite(jobId)`** - añade un favorito
- **Acción `removeFavorite(jobId)`** - elimina un favorito
- **Acción `toggleFavorite(jobId)`** - añade o quita según el estado actual
- **Helper `isFavorite(jobId)`** - verifica si un job está en favoritos

### Tarea 3: Conectar botones con las stores

- Conecta el botón de login/logout con `useAuthStore`
- Conecta el botón de favoritos con `useFavoritesStore`
- El botón de favoritos debe mostrar si el empleo ya está guardado

## Recursos útiles

- [Documentación de React Router](https://reactrouter.com/home)
- [Documentación de Zustand](https://zustand-demo.pmnd.rs/)

---

## ¿Dudas?

Recuerda que puedes:

- Revisar las clases del módulo
- Consultar en Discord
- Documentar tus dudas en `dudas.md`

¡Mucho éxito con el ejercicio! 🚀
