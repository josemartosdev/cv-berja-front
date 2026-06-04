import { Link } from "react-router-dom"
import Logo from "../assets/logo.jpg"

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <img src={Logo} alt="Escudo CV Berja" className="footer-logo" />
              <div className="footer-title">CV BERJA</div>
            </div>
            <p className="footer-desc">
              Club Voleibol Berja. Formación, competición y pasión por el voleibol en
              cada categoría.
            </p>
            <p className="footer-email">Email: info@cvberja.es</p>
            <div className="footer-social">
              <a href="https://twitter.com" target="_blank" rel="noreferrer noopener" className="footer-social-icon" title="Twitter/X">
                𝕏
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer noopener" className="footer-social-icon" title="Instagram">
                📷
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer noopener" className="footer-social-icon" title="YouTube">
                ▶
              </a>
              <a href="https://www.tiktok.com" target="_blank" rel="noreferrer noopener" className="footer-social-icon" title="TikTok">
                💬
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h3>Club</h3>
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/historia">Historia</Link></li>
              <li><Link to="/equipos">Equipos</Link></li>
              <li><Link to="/patrocinadores">Patrocinadores</Link></li>
              <li><Link to="/partidos">Partidos</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Competición</h3>
            <ul>
              <li><Link to="/resultados">Resultados</Link></li>
              <li><Link to="/calendario">Calendario</Link></li>
              <li><Link to="/login">Área privada</Link></li>
              <li><a href="mailto:info@cvberja.es">Contacto</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Newsletter</h3>
            <p className="footer-desc" style={{ marginBottom: '20px' }}>
              Recibe noticias de partidos, cantera y eventos del club.
            </p>
            <form className="footer-newsletter">
              <input
                type="email"
                placeholder="Tu correo"
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-btn">
                Suscribirme
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">&copy; {new Date().getFullYear()} Club Voleibol Berja. Todos los derechos reservados.</p>
          <div className="footer-links">
            <a href="mailto:info@cvberja.es">Aviso legal</a>
            <a href="mailto:info@cvberja.es">Política de privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  )
}