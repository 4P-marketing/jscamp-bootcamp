import { Link } from './Link'
import { NavLink } from 'react-router'
import { useAuthStore } from '../store/authStore.js'
import { useFavoritesStore } from '../store/favoritesStore.js'

export function Header() {

  const { isLoggedIn } = useAuthStore();
  const { countFavorites } = useFavoritesStore();
  const favoriteJobs = countFavorites();

  return (
    <header>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <h1 style={{ color: 'white' }}>
          <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
          DevJobs
        </h1>
      </Link>

      <nav>
        <NavLink 
        className={({ isActive }) => isActive ? 'nav-link-active' : undefined}
        to="/search"> 
          Empleos
        </NavLink>
        { 
          isLoggedIn && (
            <span>Favoritos (💗 {favoriteJobs} )</span>
          )
        }

        <a href="/search">Sin SPA</a>
      </nav>

      <HeaderUserButton />
    </header>
  )
}

const HeaderUserButton = () => {
  const { isLoggedIn, login, logout } = useAuthStore();

  return isLoggedIn
      ? <button onClick={logout}>Cerrar sesión</button>
      : <button onClick={login}>Iniciar sesión</button>
}