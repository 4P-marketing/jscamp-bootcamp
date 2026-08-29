# Ejercicio: Tests End-to-End con Playwright

## Objetivo

¡Hola! Bienvenido al último ejercicio del módulo de Testing.

En este ejercicio vas a aplicar todo lo aprendido sobre **tests E2E (End-to-End)** usando **Playwright**. Escribirás tests que simulan el comportamiento de un usuario real navegando por la aplicación de búsqueda de empleos que creaste en el módulo de **Estado Global y React Router**.

La idea es que pruebes tu propia aplicación de punta a punta, validando que todo funciona correctamente desde la perspectiva del usuario.

## Requisitos previos

Antes de empezar con los tests, necesitas tener tu aplicación del módulo anterior funcionando.

### Primer ejercicio: Levantar tu aplicación de React

Es necesario que tu aplicación de React esté levantada, así podrás interactuar con ella durante los tests por medio de `http://localhost:5173`.

### Segundo ejercicio: Test de navegación básica

Crea tu primer test E2E que verifique que la aplicación carga correctamente.

#### Requisitos

En el archivo `tests/jobs.spec.js` escribe un test que:

1. Navegue a la página principal (`http://localhost:5173`)
2. Verifique que existe un buscador visible

#### Ejecutar el test

```bash
npx playwright test
```

Para ver el navegador en acción:

```bash
npx playwright test --headed
```

Para ver la interfaz de depuración:

```bash
npx playwright test --ui
```

---

### Tercer ejercicio: Test de búsqueda de empleos

Escribe un test que simule a un usuario buscando empleos por tecnología.

#### Requisitos

El test debe:

1. Navegar a la página principal
2. Localizar el input de búsqueda usando `getByRole('searchbox')`
3. Escribir "React" en el buscador
4. Hacer clic en el botón "Buscar"
5. Verificar que aparecen resultados
6. Verificar que al menos el primer resultado es visible

#### Jerarquía de selectores (de mejor a peor)

1. **Roles ARIA** - `getByRole('button', { name: 'Buscar' })`
2. **Texto/labels** - `getByText('Buscar')`
3. **data-testid** - `getByTestId('search-button')`
4. **Selectores CSS** - `.search-button` (último recurso)

---

### Cuarto ejercicio: Test de flujo completo de aplicación

Escribe un test que simule el flujo completo de un usuario aplicando a una oferta.

#### Requisitos

El test debe simular estos pasos:

1. Buscar empleos con "JavaScript"
2. Hacer clic en el primer resultado
3. Verificar que se muestra el detalle del empleo
4. Hacer clic en "Iniciar sesión"
5. Hacer clic en "Aplicar"
6. Verificar que el botón cambia a "Aplicado"

---

### Quinto ejercicio: Test de filtros

Escribe tests que verifiquen los filtros de la aplicación.

#### Requisitos

1. **Filtrar por ubicación**
   - Seleccionar filtro "Remoto"
   - Verificar que todos los resultados son remotos

2. **Filtrar por nivel**
   - Seleccionar filtro "Senior"
   - Verificar que los resultados corresponden

### Sexto ejercicio: Test de paginación

Escribe un test que verifique la paginación de resultados.

#### Requisitos

1. **Verificar que aparece paginación si hay más de x resultados**
   - Hacer una búsqueda que devuelva más de x resultados
   - Verificar que aparece el componente de paginación

2. **Navegar a la siguiente página**
   - Hacer clic en "Siguiente"
   - Verificar que cambian los resultados

### Séptimo ejercicio: Test de detalle de empleo

Escribe un test que verifique el detalle de un empleo.

#### Requisitos

1. **Verificar que se muestra el detalle de un empleo**
   - Hacer clic en el primer resultado de la búsqueda
   - Verificar que se muestra el detalle del empleo

2. **Verificar que se puede aplicar a un empleo**
   - Verificar que aparece el botón "Aplicar"
   - Hacer clic en "Aplicar"
   - Verificar que el botón cambia a "Aplicado"

---

## Contenido Extra: Tests E2E con IA usando Stagehand (Opcional)

**Nota:** Esta sección es completamente opcional y requiere acceso a una API key o usar Ollama localmente (gratis pero más lento).

Si tienes acceso a una API key o puedes usar Ollama localmente, puedes animarte a hacer este ejercicio, sino no te preocupes, con los ejercicios anteriores ya tienes una excelente base de como hacer tests E2E.

#### Pasos

1. **Crear carpeta e inicializar proyecto**

```bash
mkdir stagehand-tests
cd stagehand-tests
npm init -y
```

2. **Instalar dependencias**

```bash
npm install @browserbasehq/stagehand
```

3. **Configurar ESM en `package.json`**

Asegúrate de que tu `package.json` tenga el siguiente contenido:

```json
{
  "type": "module"
}
```

4. **Crear archivo `.env`**

```
OPENAI_API_KEY=tu_api_key_aqui
```

**Importante:** Ojo de que no tengas una variable `OPENAI_API_KEY` global en tu sistema que pueda sobrescribir la del `.env`. Lo que nos pasó en la clase del módulo.

1. **Agregar `.env` al `.gitignore`**

```
node_modules/
.env
```

**Nota:** Los prompts en **inglés** suelen funcionar mejor que en español.

Ya que esta parte del ejercicio es opcional, con lo que ya has aprendido de E2E y los videos de Stagehand, dejaremos que lo explores por tu cuenta y pruebes los tests que creas necesarios.

---

## ¿Dudas?

Recuerda que puedes:

- Revisar las clases del módulo de Testing
- Preguntar en Discord
- Documentar tus dudas en `dudas.md`

¡Mucho éxito con el ejercicio final del módulo de Testing! 🚀
