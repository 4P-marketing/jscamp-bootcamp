/* Aquí va la lógica para filtrar los resultados de búsqueda */
import { $ } from './utils.js';

const filterLocation = $('#filter-location');
const filterExperience = $('#filter-experience-level');
const filterTechnology = $('#filter-technology');
const searchInput = $('#empleos-search-input');

const handleFiltersChange = () => {
  const paginationState = window.jobsPagination

  paginationState.filters.location = filterLocation.value;
  paginationState.filters.experience = filterExperience.value;
  paginationState.filters.technology = filterTechnology.value;
  paginationState.currentPage = 1;

  window.updateJobsView();
}

filterLocation.addEventListener('change', handleFiltersChange)
filterExperience.addEventListener('change', handleFiltersChange)
filterTechnology.addEventListener('change', handleFiltersChange)

const applySearchFilter = (value) => {
    const paginationState = window.jobsPagination;

    if (!paginationState) {
        return;
    }

    paginationState.filters.search = value;
    paginationState.currentPage = 1;

    window.updateJobsView();
};

const handleInput = () => {
    const { value } = searchInput;
    applySearchFilter(value);
};

searchInput.addEventListener('input', handleInput);
