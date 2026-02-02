// Dependencias Externas
import { useParams, useNavigate } from "react-router";
import snarkdown from 'snarkdown';

// Dependencias Internas
import { useState, useEffect } from "react";
import styles from './Detail.module.css';
import { Link } from "../components/Link";
import { useAuthStore } from '../store/authStore.js';
import { useFavoritesStore } from '../store/favoritesStore.js';

function JobSection ({ title, content }) {
  const html = snarkdown(content)

  return (
    <>
      <h2>{title}</h2>
      <div
        className={styles.sectionContent}
        dangerouslySetInnerHTML={{
          __html: html
        }}
      />
    </>
  )
}

function DetailPageBreadcrumb ({ job }) {
  return (
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
      <div className={styles.breadcrumbItem}>
        <Link href="/search">Empleos</Link>
      </div>
      <div className={styles.breadcrumbSeparator} aria-hidden="true">/</div>
      <div className={`${styles.breadcrumbItem} ${styles.breadcrumbActive}`} aria-current="page">
        {job.titulo}
      </div>
    </nav>
  )
}

function DetailPageHeader ({ job, isApplied, onApply }) {
  return (
    <header className={styles.jobHeader}>
      <div className={styles.jobHeaderTitle}>
        <h1 className={styles.jobTitle}>{job.titulo}</h1>
        <div className={styles.companyLocation}>
          {job.empresa} · {job.ubicacion}
        </div>
      </div>
      <div className={styles.jobHeaderActions}>
        <DetailApplyButton isApplied={isApplied} onApply={onApply} />
        <DetailFavoriteButton jobId={job.id} />
      </div>
    </header>
  )
}

function DetailApplyButton ({ isApplied, onApply }) {
  const { isLoggedIn } = useAuthStore();

  return (
    <button onClick={onApply} disabled={!isLoggedIn || isApplied} className={styles.applyBtn}>
      {isLoggedIn ? (isApplied ? 'Aplicado' : 'Aplicar ahora') : 'Inicia sesión para aplicar'}
    </button>
  )
}

function DetailFavoriteButton ( { jobId } ) {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
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
      {isFavorite(jobId) ? '💗' : '🤍'} Guardar oferta
    </button>
  )

}

export default function JobDetail() {
    const { id } = useParams();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isApplied, setIsApplied] = useState(false);
    const navigate = useNavigate();

    const handleApply = () => setIsApplied(true);

    useEffect(() => {
        fetch(`https://jscamp-api.vercel.app/api/jobs/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Job not found");
                }
                return response.json();
            })
            .then((json) => setJob(json))
            .catch((error) => {
                console.error("Error fetching job:", error);
                setError(error.message);
                setJob(null);
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
    return <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
        <div className={styles.loading}>
        <p className={styles.loadingText}>Cargando...</p>
        </div>
    </div>
    }

    if (error || !job) {
        return (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
            <div className={styles.error}>
            <h2 className={styles.errorTitle}>
                Oferta no encontrada
            </h2>
            <button
                onClick={() => navigate('/')}
                className={styles.errorButton}
            >
                Volver al inicio
            </button>
            </div>
        </div>
        )
    }

    return (
        <>
          <DetailPageBreadcrumb job={job} />
          <main className={styles.mainBackend}>
            <div className={styles.jobDetail}>
              <DetailPageHeader job={job} isApplied={isApplied} onApply={handleApply} />
              <div className={styles.jobDescription}>
                <JobSection title="Descripción del puesto" content={job.content.description} />
                <JobSection title="Responsabilidades" content={job.content.responsibilities} />
                <JobSection title="Requisitos" content={job.content.requirements} />
                <JobSection title="Acerca de la empresa" content={job.content.about} />
              </div>
              <hr />
              <DetailApplyButton isApplied={isApplied} onApply={handleApply} />
            </div>
          </main>
        </>
    )
}