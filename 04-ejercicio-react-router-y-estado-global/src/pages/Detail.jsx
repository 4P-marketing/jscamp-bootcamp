// Dependencias Externas
import { useParams, useNavigate } from "react-router";
import snarkdown from 'snarkdown';

// Dependencias Internas
import { useState, useEffect } from "react";
import styles from './Detail.module.css';
import { Link } from "../components/Link";
import { useAuthStore } from '../store/authStore.js';

function JobSection ({ title, content }) {
  const html = snarkdown(content)

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>
        {title}
      </h2>

      <div
        className={`${styles.sectionContent} prose`}
        dangerouslySetInnerHTML={{
          __html: html
        }}
      />

    </section>
  )
}

function DetailPageBreadcrumb ({ job }) {
  return (
    <div className={styles.container}>
      <nav className={styles.breadcrumb}>
        <Link 
          href="/search"
          className={styles.breadcrumbButton}
        >
          Empleos
        </Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>{job.titulo}</span>
      </nav>
    </div>
  )
}

function DetailPageHeader ({ job }) {
  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.title}>
          {job.titulo}
        </h1>
        <p className={styles.meta}>
          {job.empresa} · {job.ubicacion}
        </p>
      </header>

      <DetailApplyButton />
    </>
  )
}

function DetailApplyButton () {
  const { isLoggedIn } = useAuthStore();

  return (
    <button disabled={!isLoggedIn} className={styles.applyButton}>
      {isLoggedIn ? 'Aplicar ahora' : 'Inicia sesión para aplicar'}
    </button>
  )
}

export default function JobDetail() {
    const { id } = useParams();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
        <DetailPageBreadcrumb job={job} />
        <DetailPageHeader job={job} />

        <JobSection title="Descripción del puesto" content={job.content.description} />
        <JobSection title="Responsabilidades" content={job.content.responsibilities} />
        <JobSection title="Requisitios" content={job.content.requirements} />
        <JobSection title="Acerca de la empresa" content={job.content.about} />
        </div>
    )
}