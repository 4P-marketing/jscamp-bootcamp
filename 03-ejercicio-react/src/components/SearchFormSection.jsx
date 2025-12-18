import { useId, useState } from "react"
import styles from "./SearchFormSection.module.css"


let timeoutId = null

const useSearchForm = ({ idTechnology, idLocation, idExperienceLevel, idText, onSelectFilter, onTextFilter, textToFilter, filters }) => {
  const [searchText, setSearchText] = useState(textToFilter)

  const handleChange = (event) => {
    const { name, value } = event.target

    // Gestiona el filtro de texto
    if (name === idText) {
      event.preventDefault();
      setSearchText(value)

      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(() => {
        onTextFilter(value)
      }, 500)

      return
    }

    // Gestiona los filtros select
    const nextFilters = { ...filters }

    switch (name) {
      case idTechnology:
        nextFilters.technology = value
        break
      case idLocation:
        nextFilters.location = value
        break
      case idExperienceLevel:
        nextFilters.experienceLevel = value
        break
      default:
        return
    }

    onSelectFilter(nextFilters)
  }

  const clearFilters = () => {
    onTextFilter(() => "")
    
    onSelectFilter({
      technology: '',
      location: '',
      experienceLevel: ''
    })
  }

  return {
    searchText,
    handleChange,
    clearFilters
  }
}

export function SearchFormSection ({ onTextFilter, onSelectFilter, filters, textToFilter }) {
  const idText = useId()
  const idTechnology = useId()
  const idLocation = useId()
  const idExperienceLevel = useId()

  const hasFilters = filters.technology || filters.location || filters.experienceLevel || textToFilter

  const {
    searchText,
    handleChange,
    clearFilters
  } = useSearchForm({ idTechnology, idLocation, idExperienceLevel, idText, onSelectFilter, onTextFilter, textToFilter, filters })

  // para evitar recargar la página al hacer el submit del formulario, agregamos un preventDefault. Además, evitamos que se agreguen en la URL los parámetros del formulario por Id (lo que se asigna dentro del useId())
  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <section className="jobs-search">
      <h1>Encuentra tu próximo trabajo</h1>
      <p>Explora miles de oportunidades en el sector tecnológico.</p>

      <form className={styles.searchForm} id="empleos-search-form" role="search" onSubmit={handleSubmit}>
        <div className="search-bar">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-search">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
            <path d="M21 21l-6 -6" />
          </svg>

          
          <input
            name={idText} id="empleos-search-input"
            type="text" className={styles.searchInput}
            placeholder="Buscar trabajos, empresas o habilidades"
            value={searchText}
            onChange={handleChange}
          />
        </div>

        <div className="search-filters">
          <select 
            onChange={handleChange}
            name={idTechnology} 
            id={idTechnology}
            value={filters.technology}
          >
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

          <select 
            name={idLocation} 
            id={idLocation}
            onChange={handleChange}
            value={filters.location}
          >
            <option value="">Ubicación</option>
            <option value="remoto">Remoto</option>
            <option value="cdmx">Ciudad de México</option>
            <option value="guadalajara">Guadalajara</option>
            <option value="monterrey">Monterrey</option>
            <option value="barcelona">Barcelona</option>
          </select>

          <select 
            name={idExperienceLevel} 
            id={idExperienceLevel}
            onChange={handleChange}
            value={filters.experienceLevel}
          >
            <option value="">Nivel de experiencia</option>
            <option value="junior">Junior</option>
            <option value="mid">Mid-level</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
          </select>

          {hasFilters && <button onClick={clearFilters}>Limpiar Filtros</button>}
        </div>
      </form>

      <span id="filter-selected-value"></span>
    </section>
  )
}