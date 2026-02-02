import { useState } from 'react'
import { Link } from './Link.jsx'
import  styles  from './JobCard.module.css'
import { useAuthStore } from '../store/authStore.js'
import { useFavoritesStore } from '../store/favoritesStore.js'

function JobCardFavoriteButton ({ jobId }) {
  const { isFavorite, toggleFavorite } = useFavoritesStore()
  const { isLoggedIn } = useAuthStore();
  
  if (!isLoggedIn) {
    return null;
  }

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

function JobCardApplyButton () {
  const { isLoggedIn } = useAuthStore();

  const [isApplied, setIsApplied] = useState(false)
 
  const handleApplyClick = () => {
    setIsApplied(true)
  }

  const buttonClasses = isApplied ? 'button-apply-job is-applied' : 'button-apply-job'
  const buttonText = isApplied ? 'Aplicado' : 'Aplicar'

  return (
    <button className={buttonClasses} onClick={handleApplyClick} disabled={!isLoggedIn}>
      {isLoggedIn ? buttonText : 'Inicia sesión para aplicar'}
    </button>
  )
}

export function JobCard({ job }) {
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
          <JobCardApplyButton jobId={job.id} />
          <JobCardFavoriteButton jobId={job.id} />
        </div>
      </div>
    </article>
  )
}
