import { useRouter } from "../hooks/useRouter"
import { NotFoundPage } from "../pages/404.jsx"

export function Route ({ routes }) {
  const { currentPath } = useRouter()

  for (const { path, component: Component } of routes) {
    const isWildcard = path === '*'

    if (isWildcard) {
      return <NotFoundPage />
    }

    if (path === currentPath) {
      return <Component />
    }
  }
}