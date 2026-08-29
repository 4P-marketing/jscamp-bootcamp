// @ts-check
import { test, expect } from '@playwright/test'


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

  const jobCards = page.locator('.job-listing-card')

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

  const jobCards = page.locator('.job-listing-card')
  await expect(jobCards.first()).toBeVisible()

  // 1. Filtrar por ubicación
  const locationFilter = page.locator('#filter-location')
  await locationFilter.selectOption('remoto')

  await expect(page).toHaveURL(/type=remoto/)

  const count = await jobCards.count()
  for (let i = 0; i < count; i++) {
    await expect(jobCards.nth(i)).toContainText('Remoto')
  }

  // 2. Filtrar por nivel
  const levelFilter = page.locator('#filter-experience-level')
  await levelFilter.selectOption('senior')

  await expect(page).toHaveURL(/level=senior/)

  const firstJobTitle = jobCards.first().locator('h3')
  await expect(firstJobTitle).toHaveText('Desarrollador de Software Senior')
})

// Test de paginación
test('la paginación permite navegar entre páginas de resultados', async ({ page }) => {
  await page.goto('http://localhost:5173/search')

  const jobCards = page.locator('.job-listing-card')
  await expect(jobCards.first()).toBeVisible()

  // 1. Verificar que aparece paginación si hay más de x resultados
  const pagination = page.getByRole('main').getByRole('navigation')
  await expect(pagination).toBeVisible()

  const firstJobTitle = jobCards.first().locator('h3')
  await expect(firstJobTitle).toHaveText('Desarrollador de Software Senior')

  // 2. Navegar a la siguiente página
  const nextButton = pagination.getByRole('link').last()
  await nextButton.click()

  await expect(page).toHaveURL(/page=2/)

  await expect(firstJobTitle).not.toHaveText('Desarrollador de Software Senior')
})

// Test de detalle de empleo
test('el detalle de un empleo permite aplicar a la oferta', async ({ page }) => {
  await page.goto('http://localhost:5173/search')

  const jobCards = page.locator('.job-listing-card')
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