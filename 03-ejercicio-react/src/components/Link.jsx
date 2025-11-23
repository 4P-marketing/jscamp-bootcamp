import style from "./Link.module.css"
import { useRouter } from "../hooks/useRouter"

export function Link ({ href, children, ...restOfProps }) {
  const { currentPath, navigateTo } = useRouter()

  const handleClick = (event) => {
    event.preventDefault()
    navigateTo(href)
  }

  return (
    <a className={currentPath === href ? style.active : ""} href={href} {...restOfProps} onClick={handleClick}>
      {children}
    </a>
  )
}