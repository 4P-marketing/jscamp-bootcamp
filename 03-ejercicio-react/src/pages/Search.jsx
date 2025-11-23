import { useEffect, useState } from 'react'

import { SearchFormSection } from '../components/SearchFormSection.jsx'
import { SearchResultsSection } from '../components/SearchResultsSection.jsx'

const RESULTS_PER_PAGE = 5
const STORAGE_KEY = 'devjobs-search-state'

const defaultFilters = () => ({
  technology: '',
  location: '',
  experienceLevel: ''
})

const getSearchState = () => { 
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
}
const saveSearchState = (state) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

const useFilters = () => {
  const [filters, setFilters] = useState(() => getSearchState()?.filters ?? defaultFilters())
  const [textToFilter, setTextToFilter] = useState(() => getSearchState()?.textToFilter ?? '')
  const [currentPage, setCurrentPage] = useState(() => getSearchState()?.currentPage ?? 1)

  const [jobs, setJobs] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch de trabajos
  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams()
        if (textToFilter) params.append('text', textToFilter)
        if (filters.technology) params.append('technology', filters.technology)
        if (filters.location) params.append('type', filters.location)
        if (filters.experienceLevel) params.append('level', filters.experienceLevel)

        const offset = (currentPage - 1) * RESULTS_PER_PAGE
        params.append('limit', RESULTS_PER_PAGE)
        params.append('offset', offset)

        const queryParams = params.toString()
      
        const response = await fetch(`https://jscamp-api.vercel.app/api/jobs?${queryParams}`)

        if (!response.ok) {
          console.log(response);
          throw new Error(`El servidor respondió con un error ${response.status}.`)
        }

        const json = await response.json()

        setJobs(json.data)
        setTotal(json.total)
      } catch (error) {
        const fallbackMessage = 'No pudimos cargar los trabajos. Revisa tu conexión e inténtalo de nuevo.'
        const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true
        const finalErrorMessage = !isOnline
          ? 'No hay conexión a internet. Intenta otra vez.'
          : error?.message || fallbackMessage

        setError('Error: ' + finalErrorMessage)
        setJobs([])
        setTotal(0)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [filters, textToFilter, currentPage])

  // Local Storage
  useEffect(() => {
    saveSearchState({ filters, textToFilter, currentPage })
  }, [filters, textToFilter, currentPage])

  // Gestión del Pagination
  const totalPages = Math.ceil(total / RESULTS_PER_PAGE)

  const handlePageChange = (page) => {
    setCurrentPage(() => page)
  }

  // Gestión de Filtros
  const handleSearch = (filters) => {
    setFilters(filters)
    setCurrentPage(() => 1)
  }

  const handleTextFilter = (newTextToFilter) => {
    setTextToFilter(() => newTextToFilter)
    setCurrentPage(() => 1)
  }

  // Gestión de Errores
  const handleRetry = () => {
    setFilters(getSearchState()?.filters ?? defaultFilters())
    setTextToFilter(getSearchState()?.textToFilter ?? '')
    setCurrentPage(getSearchState()?.currentPage ?? 1)
    setError(null)
  }

  return {
    loading,
    jobs,
    total,
    error,
    filters,
    textToFilter,
    totalPages,
    currentPage,
    handlePageChange,
    handleSearch,
    handleTextFilter,
    handleRetry
  }
}

export function SearchPage() {
  const {
    jobs,
    total,
    loading,
    error,
    totalPages,
    filters,
    textToFilter,
    currentPage,
    handlePageChange,
    handleSearch,
    handleTextFilter,
    handleRetry
  } = useFilters()

  const title = loading
    ? `Cargando... - DevJobs`
    : `Resultados: ${total}, Página ${currentPage} - DevJobs`

  return (
    <main>
      <title>{title}</title>
      <SearchFormSection onSelectFilter={handleSearch} onTextFilter={handleTextFilter} filters={filters} textToFilter={textToFilter} />
      <SearchResultsSection jobs={jobs} loading={loading} error={error} currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} handleRetry={handleRetry} />
    </main>
  )
}
