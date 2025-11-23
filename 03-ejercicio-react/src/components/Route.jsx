import { useRouter } from "../hooks/useRouter"
import { NotFoundPage } from "../pages/404.jsx"

export function Route ({ routes }) {
  const { currentPath } = useRouter()
  let route; 

  for (const { path, component: Component } of routes) {
    if (path === currentPath) {
       route = <Component />
    }
  }

  return route || <NotFoundPage />
}