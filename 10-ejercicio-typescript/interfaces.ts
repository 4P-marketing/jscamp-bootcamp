/* En este archivo deberás tipar las interfaces de los servicios de búsqueda y aplicación a empleo */

import {
  filterByExperience,
  filterByMinSalary,
  filterByTechnology,
  searchJobs,
} from './functions.ts'

// Interface para servicios de búsqueda
export interface JobSearchService {
  /* Deberás definir los tipos de las funciones */
}

export const searchService: JobSearchService = {
  searchJobs,
  filterByExperience,
  filterByMinSalary,
  filterByTechnology,
}

// Interface para aplicación a empleo
export interface JobApplication {}

// Interface que extiende Job con propiedades adicionales
export interface DetailedJob {}
