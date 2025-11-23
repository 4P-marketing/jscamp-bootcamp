import styles from './NotOnlineError.module.css';

export function NotOnlineError({ message, onRetry }) {
    return (
        <article className={styles.retryBox}>
            <h3 style={{ marginTop: 0 }}>No pudimos cargar las vacantes</h3>
            <p>{message}</p>
            <button type="button" onClick={onRetry} style={{ marginTop: '1rem' }}>
            Reintentar búsqueda
            </button>
        </article>
    );
}