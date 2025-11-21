function App() {
  return (
    <>
      <header>
        <a href="/" style={{ textDecoration: 'none' }}>
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
        </a>

        <nav>
          <a href="#">Empleos</a>
        </nav>
      </header>

      <main>
        <section className="jobs-search">
          <h1>Encuentra tu próximo trabajo</h1>
          <p>Explora miles de oportunidades en el sector tecnológico.</p>

          <form id="empleos-search-form" role="search">
            <div className="search-bar">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                <path d="M21 21l-6 -6" />
              </svg>

              <input
                id="empleos-search-input"
                type="text"
                name="search-value"
                placeholder="Buscar trabajos, empresas o habilidades"
              />
            </div>

            <div className="search-filters">
              <select name="technology-value" id="filter-technology">
                <option value="">Tecnología</option>
                <optgroup label="Tecnologías populares">
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="react">React</option>
                  <option value="nodejs">Node.js</option>
                </optgroup>
                <option value="java">Java</option>
                <hr />
                <option value="csharp">C#</option>
                <option value="c">C</option>
                <option value="c++">C++</option>
                <hr />
                <option value="ruby">Ruby</option>
                <option value="php">PHP</option>
              </select>

              <select name="location-value" id="filter-location">
                <option value="">Ubicación</option>
                <option value="remoto">Remoto</option>
                <option value="cdmx">Ciudad de México</option>
                <option value="guadalajara">Guadalajara</option>
                <option value="monterrey">Monterrey</option>
                <option value="barcelona">Barcelona</option>
              </select>

              <select name="experience-level-value" id="filter-experience-level">
                <option value="">Nivel de experiencia</option>
                <option value="junior">Junior</option>
                <option value="mid">Mid-level</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead</option>
              </select>
            </div>
          </form>

          <span id="filter-selected-value"></span>
        </section>

        <section>
          <h2 style={{ textAlign: 'center' }}>Resultados de búsqueda</h2>

          <div className="jobs-listings">
            <article
              className="job-listing-card"
              data-modalidad="remoto"
              data-nivel="senior"
              data-technology="javascript"
            >
              <div>
                <h3>Desarrollador de Software Senior</h3>
                <small>Tech Solutions Inc. | Remoto</small>
                <p>
                  Buscamos un ingeniero de software con experiencia en desarrollo web y
                  conocimientos en JavaScript, React y Node.js. El candidato ideal debe ser capaz de
                  trabajar en equipo y tener buenas habilidades de comunicación.
                </p>
              </div>
              <button className="button-apply-job">Aplicar</button>
            </article>
          </div>
          <nav className="pagination">
            <a href="#">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M15 6l-6 6l6 6" />
              </svg>
            </a>
            <a data-page="1" href="#">
              1
            </a>
            <a data-page="2" href="#">
              2
            </a>
            <a data-page="3" href="#">
              3
            </a>
            <a data-page="4" href="#">
              4
            </a>
            <a data-page="5" href="#">
              5
            </a>
            <a href="#">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M9 6l6 6l-6 6" />
              </svg>
            </a>
          </nav>
        </section>
      </main>
      <footer>
        <small>&copy; 2025 DevJobs. Todos los derechos reservados.</small>
      </footer>
    </>
  )
}

export default App
