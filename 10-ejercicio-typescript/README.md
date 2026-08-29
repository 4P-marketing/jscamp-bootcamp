# Ejercicio: TypeScript

¡Hola! Bienvenido al ejercicio del módulo de TypeScript, ¡ya queda poco! Si llegaste hasta aquí, ¡bien hecho!

En este ejercicio vas a aplicar todo lo aprendido sobre **TypeScript** creando un sistema de gestión de empleos **completamente tipado**.

Vamos a trabajar con:

- Tipos primitivos
- Objetos
- Arrays
- Funciones
- Interfaces
- Type narrowing y más.

## ¿Qué vas a construir?

Un sistema de gestión de empleos que incluye:

- Tipos para representar empleos, empresas y candidatos
- Funciones para filtrar, buscar y validar datos
- Interfaces para definir contratos claros
- Type narrowing para manejar diferentes casos
- Validaciones con el sistema de tipos

## Primer ejercicio: Tipos primitivos y literales

En el archivo `types.ts`, define los tipos literales para los siguientes tipos:

- ExperienceLevel: 'junior' | 'mid' | 'senior' | 'lead'
- WorkMode: 'remoto' | 'presencial' | 'hibrido'
- ApplicationStatus: 'pending' | 'reviewing' | 'accepted' | 'rejected'
- Technology: 'react' | 'node' | 'python' | 'java' | 'javascript' | 'typescript' | 'flutter' | 'android' | 'ios' | 'swift' | 'kotlin' | 'dart' | 'go' | 'rust' | 'php' | 'ruby' | 'c#'

---

## Segundo ejercicio: Objetos

En el archivo `objects.ts`, define los tipos para los siguientes objetos:

- Job:
  id: string
  title: string
  company: string
  location: string
  description: string
  salary?: number // Opcional
  technologies: Technology[]
  experienceLevel: ExperienceLevel
  workMode: WorkMode
  isActive: boolean
  postedDate: Date

- Company:
  id: string
  name: string
  description: string
  website?: string
  employees: number
  foundedYear: number

- Candidate:
  id: string
  name: string
  email: string
  phone?: string
  skills: Technology[]
  experienceYears: number
  resume?: string

---

## Tercer ejercicio: Arrays tipados

En el archivo `arrays.ts`, define los tipos ya creados en el archivo `objects.ts` para los arrays:

- jobs
- companies
- candidates

---

## Cuarto ejercicio: Funciones tipadas

En el archivo `functions.ts`, deberás usar los tipos creados en los ejercicios anteriores para definir los tipos de los parámetros y el valor de retorno de las funciones.

---

## Quinto ejercicio: Parámetros opcionales y valores por defecto

En el archivo `optionals.ts`, verás que ya existen dos funciones:

- advancedSearch
- getRecentJobs

Tu tarea será tipar los parámetros y el valor de retorno de estas funciones, teniendo en cuenta que los parámetros son opcionales y que algunos tienen valores por defecto.

### advancedSearch(jobs, options):

El parámetro `options` debe recibir los tipos que se definen en el interior de la función, y cada valor deberá ser opcional.

### getRecentJobs(jobs, days):

El parámetro `days` deberá ser opcional y tener un valor por defecto de 30.

---

## Sexto ejercicio: Interfaces

En el archivo `interfaces.ts`, deberás crear las interfaces para los servicios de búsqueda y aplicación a empleo.

La constante `searchService` es un objeto con las funciones de búsqueda y filtrado. Tu tarea será tipar `JobSearchService` definiendo los tipos de los parámetros y el valor de retorno de cada función dentro de la interface.

Además, deberás tipar la interfaz `JobApplication` con:

- id: string
- jobId: string
- candidateId: string
- status: ApplicationStatus
- appliedDate: Date
- coverLetter?: string

Y `DetailedJob`:

- benefits: string[]
- requirements: string[]
- applicationDeadline?: Date

**IMPORTANTE:** `DetailedJob` extiende de `Job`. Por lo que tendrás que incluir todos los tipos de `Job` en `DetailedJob`, y agregar las propiedades adicionales que mencionamos.

---

## Séptimo ejercicio: Type Narrowing

En el archivo `narrowing.ts`, deberás tipar las funciones con los tipos ya creados. Ten en cuenta que los tipos de `job.experienceLevel` son literales, por lo que tendrás que corregir el código para que funcione correctamente.

---

## Octavo ejercicio: Union Types y Type Narrowing avanzado

En el archivo `unions.ts`, deberás tipar las funciones.

El tipo `SearchResult` es un union type que puede ser:

- { success: true; jobs: Job[]; count: number }
- { success: false; error: string }

En la función `displaySearchResults` deberás usar type narrowing para mostrar los resultados, por lo que tendrás que verificar si la lógica de la función es correcta o hay algún error.

---

## Noveno ejercicio: Tuplas

En el archivo `tuples.ts`, deberás tipar las tuplas con los tipos ya creados, y usando `number` para la tupla de `SalaryRange` y `Coordinates`.

Además, deberás usar los tipos que creamos y evitar usar `any` en la función `getSalaryRange`.

---

## Décimo ejercicio: Utility Types

En el archivo `utilities.ts`, deberás tipar las funciones teniendo en cuenta que:

- updateJob(job, updates)
  Debe recibir como primer parámetro un `Job`, y como segundo parámetro cualquier opción incluida en `Job`.

- getJobSummaries(jobs)
  Debe recibir como parámetro un array de `Job` y devolver un array de `JobSummary`. Siendo `JobSummary` las propiedades `id`, `title`, `company` y `location` de `Job`.

- displayJob(job)
  Debe recibir como parámetro un `job` y devolver `void`. Teniendo en cuenta que job es un `ReadonlyJob`, por lo que hay que tiparlo para que sus propiedades sean inmutables.

---

## Probar tu código

El paso final será ejecutar `node index.ts` y verificar que todo corra correctamente.
Si todo está bien, ¡enhorabuena! Lo has hecho muy bien :)

---

## ¿Dudas?

Recuerda que puedes:

- Revisar las clases del módulo de TypeScript
- Preguntar en Discord
- Usar el archivo `dudas.md` para preguntar lo que necesites

¡Mucho éxito con el ejercicio y a disfrutar de TypeScript! 🚀
