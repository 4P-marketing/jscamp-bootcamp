import { JobListings } from "./JobListings.jsx"
import { Pagination } from "./Pagination.jsx"
import { LoadingSpinner } from "./LoadingSpinner.jsx"
import { NotOnlineError } from "./NotOnlineError.jsx"
 
 export function SearchResultsSection ({ jobs, loading, error, currentPage, totalPages, handlePageChange, handleRetry }) {
  return (
    <section>
        <h2 style={{ textAlign: 'center' }}>Resultados de búsqueda</h2>

        {
          loading ? <LoadingSpinner /> : error ? (
            <NotOnlineError message={error} onRetry={handleRetry} />
          ) : <JobListings jobs={jobs} />
        }
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </section>
  )
}