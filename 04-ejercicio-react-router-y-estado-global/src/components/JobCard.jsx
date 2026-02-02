import { useState } from 'react'
import { Link } from './Link.jsx'
import  styles  from './JobCard.module.css'
import { useFavoritesStore } from '../store/favoritesStore.js'

function JobCardFavoriteButton ({ jobId }) {
  const { isFavorite, toggleFavorite } = useFavoritesStore()

  return (
    <button
      className={isFavorite(jobId) ? styles.unfavoriteButton : styles.favoriteButton}
      onClick={() => toggleFavorite(jobId)}
      aria-label={isFavorite(jobId) ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
    >
      {isFavorite(jobId) ? '💗' : '🤍'}
    </button>
  )
}

export function JobCard({ job }) {
  const [isApplied, setIsApplied] = useState(false)
 
  const handleApplyClick = () => {
    setIsApplied(true)
  }

  const buttonClasses = isApplied ? 'button-apply-job is-applied' : 'button-apply-job'
  const buttonText = isApplied ? 'Aplicado' : 'Aplicar'

  return (
    <article
      className="job-listing-card"
      data-modalidad={job.data.modalidad}
      data-nivel={job.data.nivel}
      data-technology={job.data.technology}
    >
      <div>
        <h3><Link className={styles.title} to={`/jobs/${job.id}`}>{job.titulo}</Link></h3>
        <small>
          {job.empresa} | {job.ubicacion}
        </small>
        <p>{job.descripcion}</p>
      </div>
      <div>
        <div className={styles.actions}>
          <Link to={`/jobs/${job.id}`} className={styles.details}>
            Ver Detalles
          </Link>
          <button className={buttonClasses} onClick={handleApplyClick}>
            {buttonText}
          </button>
          <JobCardFavoriteButton jobId={job.id} />
        </div>
      </div>
    </article>
  )
}
