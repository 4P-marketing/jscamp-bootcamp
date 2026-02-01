import { useNavigate, useLocation } from 'react-router'

export function useRouter() {
  const navigate = useNavigate()
  const location = useLocation()

  // TODO: Maximum update depth exceeded.
  function navigateTo(path) {
    navigate(path)
  }

  return {
    currentPath: location.pathname,
    navigateTo,
  }
}
