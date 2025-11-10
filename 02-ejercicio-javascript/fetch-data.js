/* Aquí va la lógica para mostrar los resultados de búsqueda */
const container = document.querySelector('.jobs-listings');
const emptyState = container.querySelector('.jobs-empty');
const paginationNav = document.querySelector('.pagination');
const pagesContainer = paginationNav.querySelector('.pagination-pages');
const prevButton = paginationNav.querySelector('#prev-page');
const nextButton = paginationNav.querySelector('#next-page');

const RESULTS_PER_PAGE = 3;

/**
 * Estado de la paginación.
 * 
 * Items: Array con cada trabajo.
 * Filters: Objeto con cada uno de los 4 filtros
 * currentPage: Página actual.
 * totalPages: Total de páginas.
 */
const paginationState = {
  jobItems: [],
  filters: {
    location: '',
    experience: '',
    technology: '',
    search: '',
  },
  currentPage: 1,
  totalPages: 0,
};

// Guardamos el estado a nivel global para poder usarlo en filters.js.
window.jobsPagination = paginationState;

/** Función para renderizar un trabajo.
 * Recibe: un objeto de tipo trabajo.
 * Devuelve toedos los datos del trabajo. Nos va a servir para la paginación y filtrado.
 */
const renderJobArticle = (jobItem) => {
  const listItem = document.createElement('li');

  const article = document.createElement('article');
  article.className = 'job-listing-card';

  // Convertimos tecnología a array.
  const rawTechnologies = jobItem.data.technology;
  const technologies = Array.isArray(rawTechnologies) ? rawTechnologies : [rawTechnologies];
  const title = jobItem.titulo;
  // Forzamos el título a minúsculas según las instruciones del cuarto ejercicio.
  const searchTitle = title.toLowerCase();
  article.dataset.technology = technologies.join('|');
  article.dataset.location = jobItem.data.modalidad;
  article.dataset.experience = jobItem.data.nivel;

  article.innerHTML = `
        <div class="job-info">
          <h3 class="job-title">
            ${title}
          </h3>
          <small class="company-location">
            ${jobItem.empresa} | ${jobItem.ubicacion}
          </small>
          <p class="job-desc">${jobItem.descripcion}</p>
        </div>
        <button class="button-apply-job">Aplicar</button>`;

  listItem.appendChild(article);

  container.insertBefore(listItem, emptyState);

  return {
    job: listItem,
    location: article.dataset.location,
    experience: article.dataset.experience,
    technologies,
    title,
    searchTitle
  };
};

/**
 * Función para mostrar los botones de paginación.
 * 
 * Recibe: total de páginas y página actual.
 * Devuelve: Nada
 */
const renderPaginationButtons = (totalPages, currentPage) => {
  if (!pagesContainer) {
    return;
  }

  pagesContainer.innerHTML = '';

  for (let page = 1; page <= totalPages; page += 1) {
    const button = document.createElement('button');
    button.className = 'pagination-page';
    button.textContent = String(page);
    button.dataset.page = String(page);

    if (page === currentPage) {
      button.classList.add('is-active');
    }

    pagesContainer.appendChild(button);
  }
};

/**
 * Función para mostrar la navegación de paginación (< y >).
 * 
 * Recibe: total de páginas y página actual.
 * Devuelve: Nada
 */
const renderPaginationNav = (totalPages, currentPage) => {
  if (prevButton) {
    if (!totalPages) {
      prevButton.setAttribute('hidden', '');
    } else {
      prevButton.removeAttribute('hidden');
      prevButton.disabled = currentPage <= 1;
    }
  }

  if (nextButton) {
    if (!totalPages) {
      nextButton.setAttribute('hidden', '');
    } else {
      nextButton.removeAttribute('hidden');
      nextButton.disabled = currentPage >= totalPages;
    }
  }
};


/**
 * Función para actualizar la lista de trabajos según los filtros y paginación.
 * 
 * Recibe: Nada.
 * Devuelve: Nada.
 */
const updateJobsView = () => {
  const { jobItems, filters } = paginationState;
  const searchFilter = filters.search || '';

  // Se filtran los trabajos con los filtros activos
  const filteredItems = jobItems.filter((jobItem) => {
    const matchesLocation = !filters.location || jobItem.location === filters.location;
    const matchesExperience = !filters.experience || jobItem.experience === filters.experience;
    const matchesTechnology = !filters.technology || jobItem.technologies.includes(filters.technology);
    const matchesSearch = !searchFilter || jobItem.searchTitle.includes(searchFilter);

    return matchesLocation && matchesExperience && matchesTechnology && matchesSearch;
  });

  // Se ocultan todos los trabajos primero
  jobItems.forEach(({ job }) => {
    job.style.display = 'none';
  });

  // Si no hay trabajos que mostar, early return con el mensaje de no hay resultados.
  if (!filteredItems.length) {
    emptyState?.removeAttribute('hidden');
    renderPaginationNav(0, 1);
    pagesContainer && (pagesContainer.innerHTML = '');
    return;
  } else {
    emptyState?.setAttribute('hidden', '');
  }

  // Si hay trabajos que mostrar, se calcula el número de páginas y se posiciona en la página correcta.
  paginationState.totalPages = filteredItems.length ? Math.ceil(filteredItems.length / RESULTS_PER_PAGE) : 0;

  if (paginationState.totalPages && paginationState.currentPage > paginationState.totalPages) {
    paginationState.currentPage = paginationState.totalPages;
  } else if (!paginationState.totalPages) {
    paginationState.currentPage = 1;
  }

  // Se muestran los trabajos de la página que corresponde.
  const start = (paginationState.currentPage - 1) * RESULTS_PER_PAGE;
  const end = start + RESULTS_PER_PAGE;

  filteredItems.slice(start, end).forEach(({ job }) => {
    job.style.display = '';
  });

  // Se muestran los botones de paginación.
  renderPaginationButtons(paginationState.totalPages, paginationState.currentPage);
  renderPaginationNav(paginationState.totalPages, paginationState.currentPage);
};

window.updateJobsView = updateJobsView;

// Fetch de datos y renderizado inicial.
try {
  const response = await fetch('./data.json');
  const jobs = await response.json();

  const jobItems = [];

  jobs.forEach((job) => {
    const jobItem = renderJobArticle(job);
    jobItems.push(jobItem);
  });

  paginationState.jobItems = jobItems;

  updateJobsView();

} catch (error) {
  console.error('Error fetching jobs data:', error);
}

// Evento para los botones de paginación numéricos.
pagesContainer.addEventListener('click', (event) => {
  const target = event.target;
  const button = target.closest('.pagination-page');
  const page = Number(button.dataset.page);

  paginationState.currentPage = page;
  updateJobsView();
});

// Eventos para los botones de anterior y siguiente.
prevButton.addEventListener('click', () => {
  paginationState.currentPage -= 1;
  updateJobsView();
});

nextButton.addEventListener('click', () => {
  paginationState.currentPage += 1;
  updateJobsView();
});