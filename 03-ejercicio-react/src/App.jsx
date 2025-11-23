import { Header } from './components/Header.jsx'
import { HomePage } from './pages/Home.jsx'
import { SearchPage } from './pages/Search.jsx'
import { NotFoundPage } from './pages/404.jsx'
import { Route } from './components/Route.jsx'
import { Footer } from './components/Footer.jsx'

export default function App() {
  return (
    <>
      <Header />
      <Route
        routes={[
          { path: '/', component: HomePage },
          { path: '/search', component: SearchPage },
          { path: '*', component: NotFoundPage }
        ]}
      />
      <Footer />
    </>
  )
}