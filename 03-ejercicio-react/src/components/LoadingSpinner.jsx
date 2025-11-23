import styles from './LoadingSpinner.module.css'

export function LoadingSpinner ({ label = 'Cargando empleos...' }) {
  return (
    <div className={styles.loadingSpinner}>
      <span className={styles.loader} />
      <span>{label}</span>
    </div>
  )
}
