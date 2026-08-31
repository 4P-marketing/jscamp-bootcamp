// @ts-check
import { expect, test } from '@playwright/test'


// Test de navegación básica
test('la aplicación carga y muestra el buscador', async ({ page }) => {
  await page.goto('http://localhost:5173')

  const searchInput = page.getByRole('searchbox', { name: 'Buscar empleos' })

  await expect(searchInput).toBeVisible()
})

// Test de búsqueda de empleos
test('la aplicación permite buscar empleos', async ({ page }) => {
  await page.goto('http://localhost:5173')

  const searchInput = page.getByRole('searchbox')
  await searchInput.fill('React')

  await page.getByRole('button', { name: 'Buscar' }).click()

  await expect(page.getByRole('heading', { name: 'Resultados de búsqueda' })).toBeVisible()

  const results = page.getByRole('article')
  await expect(results.first()).toBeVisible()
})

// Test de flujo completo de aplicación
test('un usuario puede aplicar a una oferta', async ({ page }) => {
  await page.goto('http://localhost:5173')

  const searchInput = page.getByRole('searchbox')
  await searchInput.fill('JavaScript')

  await page.getByRole('button', { name: 'Buscar' }).click()

  // getByRole('article') usa el rol ARIA del <article> de cada oferta: más robusto que la clase CSS. Siempre tenemos que evitar obtener elementos por medio de selectores débiles, como lo es clases de CSS
  const jobCards = page.getByRole('article')

  await expect(jobCards.first()).toBeVisible()

  const firstJobTitle = jobCards.first().locator('h3')
  await expect(firstJobTitle).toHaveText('Desarrollador de Software Senior')

  await firstJobTitle.getByRole('link').click()

  await expect(page.getByRole('heading', { name: 'Descripción del puesto' })).toBeVisible()

  await page.getByRole('button', { name: 'Iniciar sesión' }).click()

  const applyButton = page.getByRole('button', { name: 'Aplicar' }).first()
  await applyButton.click()

  const appliedButton = page.getByRole('button', { name: 'Aplicado' }).first()
  await expect(appliedButton).toBeVisible()
})

// Test de filtros
test('los filtros permiten filtrar empleos', async ({ page }) => {
  await page.goto('http://localhost:5173/search')

  const jobCards = page.getByRole('article')
  await expect(jobCards.first()).toBeVisible()

  // 1. Filtrar por ubicación
  // getByLabel usa el aria-label del <select>, si no podemos capturar por getByRole, usaremos getByLabel
  const locationFilter = page.getByLabel('Ubicación')
  await locationFilter.selectOption('remoto')

  await expect(page).toHaveURL(/type=remoto/)

  const count = await jobCards.count()
  for (let i = 0; i < count; i++) {
    await expect(jobCards.nth(i)).toContainText('Remoto')
  }

  // 2. Filtrar por nivel
  const levelFilter = page.getByLabel('Nivel de experiencia')
  await levelFilter.selectOption('senior')

  await expect(page).toHaveURL(/level=senior/)

  // Verificamos que TODOS los resultados son Senior con el atributo data-nivel del <article>
  const countSenior = await jobCards.count()
  for (let i = 0; i < countSenior; i++) {
    await expect(jobCards.nth(i)).toHaveAttribute('data-nivel', 'senior')
  }
})

// Test de paginación
test('la paginación permite navegar entre páginas de resultados', async ({ page }) => {
  await page.goto('http://localhost:5173/search')

  const jobCards = page.getByRole('article')
  await expect(jobCards.first()).toBeVisible()

  // 1. Verificar que aparece paginación si hay más de x resultados
  const pagination = page.getByRole('main').getByRole('navigation')
  await expect(pagination).toBeVisible()

  const firstJobTitle = jobCards.first().locator('h3')
  await expect(firstJobTitle).toHaveText('Desarrollador de Software Senior')

  // 2. Navegar a la siguiente página
  // Modificamos el archivo de `04-ejercicio-react-router-y-estado-global/src/components/Pagination.jsx` para que use el nombre accesible de "Siguiente". Con esto mejoramos la accesibilidad y por ende el test.
  // Hay algo importante: Es linealmente proporcional el tener una buena accesibilidad y un buen sistema de tests. Cuanto más accesible es nuestra aplicación, más robusto y fácil y mantenible es nuestro test
  const nextButton = pagination.getByRole('link', { name: 'Siguiente' })
  await nextButton.click()

  await expect(page).toHaveURL(/page=2/)

  await expect(firstJobTitle).not.toHaveText('Desarrollador de Software Senior')
})

// Test de detalle de empleo
test('el detalle de un empleo permite aplicar a la oferta', async ({ page }) => {
  await page.goto('http://localhost:5173/search')

  const jobCards = page.getByRole('article')
  await expect(jobCards.first()).toBeVisible()

  // 1. Verificar que se muestra el detalle de un empleo
  const firstJobTitle = jobCards.first().locator('h3')
  await firstJobTitle.getByRole('link').click()

  const jobDetailTitle = page.locator('main h1')
  await expect(jobDetailTitle).toHaveText('Desarrollador de Software Senior')

  const jobDescriptionTitle = page.getByRole('heading', { name: 'Descripción del puesto' })
  await expect(jobDescriptionTitle).toBeVisible()

  // 2. Verificar que se puede aplicar a un empleo
  await page.getByRole('button', { name: 'Iniciar sesión' }).click()

  const applyButton = page.getByRole('button', { name: 'Aplicar' }).first()
  await expect(applyButton).toBeVisible()
  await applyButton.click()

  const appliedButton = page.getByRole('button', { name: 'Aplicado' }).first()
  await expect(appliedButton).toBeVisible()
})