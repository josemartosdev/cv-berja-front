import { useEffect, useRef } from "react";

const feed = [
  {
    time: "12:09",
    title: "Ace de Sanchez!",
    text: "Saque brutal a la linea de fondo. Berja amplia la ventaja en el cuarto set.",
    featured: true,
  },
  {
    time: "11:09",
    title: "Punto CV Berja",
    text: "Gran recuperacion defensiva de Lopez y ataque rapido por el centro.",
  },
  {
    time: "10:09",
    title: "TIMEOUT: Almeria Voley",
    text: "El visitante intenta cortar la inercia del equipo local.",
    featured: true,
  },
  {
    time: "10:05",
    title: "Bloqueo punto! (10-9)",
    text: "Muro de Berja impecable. Bloqueo directo en primera linea.",
  },
  {
    time: "09:09",
    title: "Error de saque - Berja",
    text: "Servicio largo que se va por linea de fondo.",
  },
];

export default function EnDirectoShowcase() {
  const commentaryRef = useRef(null);

  useEffect(() => {
    if (!commentaryRef.current) return;
    commentaryRef.current.scrollTop = commentaryRef.current.scrollHeight;
  }, []);

  return (
    <div className="live-v3">
      <header className="live-v3__header">
        <div>
          <div className="live-v3__status-row">
            <span className="live-v3__dot" />
            <span className="live-v3__status">En Directo</span>
          </div>
          <h1>
            CV BERJA <span>VS</span> ALMERIA VOLEY
          </h1>
          <p>Spanish Superliga - Jornada 14 | Pabellon Municipal de Berja</p>
        </div>

        <div className="live-v3__header-actions">
          <button type="button">
            <span className="material-symbols-outlined">share</span>
            SHARE
          </button>
          <button type="button">
            <span className="material-symbols-outlined">
              notifications_active
            </span>
            NOTIFY
          </button>
        </div>
      </header>

      <section className="live-v3__grid">
        <div className="live-v3__main">
          <article className="live-v3__player-card">
            <div className="live-v3__player-bg" />
            <div className="live-v3__player-overlay">
              <button type="button" aria-label="Reproducir en directo">
                <span className="material-symbols-outlined">play_arrow</span>
              </button>
            </div>

            <div className="live-v3__score-mini">
              <div className="live-v3__score-box">
                <div>
                  <small>BER</small>
                  <strong>2</strong>
                </div>
                <i />
                <div>
                  <small>ALM</small>
                  <strong>1</strong>
                </div>
              </div>
              <span>SET 4 - 12-09</span>
            </div>
          </article>

          <article className="live-v3__scoreboard">
            <h3>Scoreboard Detail</h3>
            <div className="live-v3__scoreboard-wrap">
              <table>
                <thead>
                  <tr>
                    <th>TEAM</th>
                    <th>S1</th>
                    <th>S2</th>
                    <th>S3</th>
                    <th>S4</th>
                    <th>TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>CV BERJA</td>
                    <td>25</td>
                    <td>22</td>
                    <td>25</td>
                    <td className="is-live">12</td>
                    <td className="is-live">2</td>
                  </tr>
                  <tr>
                    <td>ALMERIA VOLEY</td>
                    <td>18</td>
                    <td>25</td>
                    <td>19</td>
                    <td>09</td>
                    <td>1</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </article>

          <div className="live-v3__stats">
            <article>
              <p>Aces</p>
              <div>
                <strong>08</strong>
                <span>+2 ultimo set</span>
              </div>
            </article>
            <article>
              <p>Blocks</p>
              <div>
                <strong>14</strong>
                <span>Leader: Mario S.</span>
              </div>
            </article>
            <article>
              <p>Attack %</p>
              <div>
                <strong>62</strong>
                <span>%</span>
              </div>
            </article>
          </div>
        </div>

        <aside className="live-v3__side">
          <article className="live-v3__feed-card">
            <header>
              <h3>
                <span className="material-symbols-outlined">forum</span>
                Live Feed
              </h3>
              <span>
                <i />
                2.4k Watching
              </span>
            </header>

            <div className="live-v3__feed" ref={commentaryRef}>
              {feed.map((item, idx) => (
                <div
                  key={`${item.time}-${idx}`}
                  className={item.featured ? "is-featured" : ""}
                >
                  <small>{item.time}</small>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <footer>
              <div>
                <input type="text" placeholder="Post a comment..." />
                <button type="button" aria-label="Enviar comentario">
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </footer>
          </article>

          <article className="live-v3__leader-card">
            <h3>Match Leader</h3>
            <div className="live-v3__leader-top">
              <div className="live-v3__leader-avatar" />
              <div>
                <h4>MARIO SANCHEZ</h4>
                <p>Opposite Hitter - #12</p>
              </div>
            </div>
            <div className="live-v3__leader-kpis">
              <div>
                <strong>18</strong>
                <span>Kills</span>
              </div>
              <div>
                <strong>4</strong>
                <span>Blocks</span>
              </div>
            </div>
          </article>
        </aside>
      </section>

      <section className="live-v3__sponsors">
        <h4>Proudly Supported By</h4>
        <div>
          <span>SPONSOR 1</span>
          <span>SPONSOR 2</span>
          <span>SPONSOR 3</span>
          <span>SPONSOR 4</span>
        </div>
      </section>
    </div>
  );
}
