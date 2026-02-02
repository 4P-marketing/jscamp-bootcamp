// Dependencias externas
import { Routes, Route } from 'react-router'
import { lazy, Suspense, useState } from 'react'

// Dependencias internas
import { Header } from './components/Header.jsx'
import { Footer } from './components/Footer.jsx'

const HomePage = lazy(() => import('./pages/Home.jsx'))
const SearchPage = lazy(() => import('./pages/Search.jsx'))
const JobDetail = lazy(() => import('./pages/Detail.jsx'))
const NotFoundPage = lazy(() => import('./pages/404.jsx'))

function App() {
  return (
    <>
      <Header />
      <Suspense fallback={
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
            Cargando...
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  )
}

export default App
