import { useMemo, useState } from "react";

const standings = [
  { pos: 1, team: "Granada VBC", pts: 24 },
  { pos: 2, team: "CV Berja", pts: 21, highlighted: true },
  { pos: 3, team: "AD Almeria", pts: 18 },
  { pos: 4, team: "Costa del Sol", pts: 15 },
];

const matches = [
  {
    id: 1,
    competition: "LIGA REGIONAL - OCT 24, 2024",
    status: "WIN",
    home: "CV BERJA",
    away: "AD ALMERIA",
    scoreHome: 3,
    scoreAway: 1,
    sets: "25-21, 22-25, 25-18, 25-20",
    team: "Senior Men",
  },
  {
    id: 2,
    competition: "CUP FINAL - OCT 12, 2024",
    status: "LOSS",
    home: "CV BERJA",
    away: "GRANADA VBC",
    scoreHome: 2,
    scoreAway: 3,
    sets: "25-23, 25-27, 25-20, 20-25, 13-15",
    team: "Senior Men",
  },
  {
    id: 3,
    competition: "YOUTH LEAGUE - OCT 03, 2024",
    status: "WIN",
    home: "CV BERJA U18",
    away: "MALAGA VC U18",
    scoreHome: 3,
    scoreAway: 0,
    sets: "25-19, 25-17, 25-14",
    team: "U18 Youth",
  },
];

const seasons = ["All Seasons", "Season 2023/24", "Season 2022/23"];
const teams = ["All Teams", "Senior Men", "Senior Women", "U18 Youth"];

const bottomStats = [
  { value: "12", label: "Wins in Row" },
  { value: "88%", label: "Home Win Rate" },
  { value: "4.2", label: "Avg Sets / Game" },
  { value: "215", label: "Total Service Aces" },
];

function MatchCard({ item }) {
  return (
    <article className="results-v3__match-card">
      <header>
        <span>{item.competition}</span>
        <b className={item.status === "WIN" ? "is-win" : "is-loss"}>
          {item.status}
        </b>
      </header>

      <div className="results-v3__match-main">
        <div className="results-v3__club">
          <div className="results-v3__club-badge">
            <span className="material-symbols-outlined">sports_volleyball</span>
          </div>
          <strong>{item.home}</strong>
        </div>

        <div className="results-v3__score">
          <div>
            <span>{item.scoreHome}</span>
            <i>:</i>
            <span>{item.scoreAway}</span>
          </div>
          <small>{item.sets}</small>
        </div>

        <div className="results-v3__club">
          <div className="results-v3__club-badge">
            <span className="material-symbols-outlined">shield</span>
          </div>
          <strong>{item.away}</strong>
        </div>
      </div>
    </article>
  );
}

export default function ResultadosShowcase() {
  const [season, setSeason] = useState("Season 2023/24");
  const [team, setTeam] = useState("All Teams");
  const [viewMode, setViewMode] = useState("grid");

  const visibleMatches = useMemo(() => {
    if (team === "All Teams") return matches;
    return matches.filter((m) => m.team === team);
  }, [team]);

  return (
    <div className="results-v3">
      <header className="results-v3__hero">
        <span>SEASON 2023/24 STATS</span>
        <h1>Performance Dashboard</h1>
        <p>
          Explore the competitive legacy of CV Berja. From league standings to
          individual player masterclasses, every point tells our story.
        </p>
      </header>

      <section className="results-v3__filters">
        <label>
          <span className="material-symbols-outlined">filter_list</span>
          <select value={season} onChange={(e) => setSeason(e.target.value)}>
            {seasons.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>

        <label>
          <select value={team} onChange={(e) => setTeam(e.target.value)}>
            {teams.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>

        <div className="results-v3__view-toggle">
          <button
            type="button"
            className={viewMode === "grid" ? "is-active" : ""}
            onClick={() => setViewMode("grid")}
            aria-label="Vista cuadricula"
          >
            <span className="material-symbols-outlined">grid_view</span>
          </button>
          <button
            type="button"
            className={viewMode === "list" ? "is-active" : ""}
            onClick={() => setViewMode("list")}
            aria-label="Vista lista"
          >
            <span className="material-symbols-outlined">list</span>
          </button>
        </div>
      </section>

      <section className="results-v3__layout">
        <div className="results-v3__left">
          <h2>
            <span className="material-symbols-outlined">history</span>
            Recent Matches
          </h2>

          <div
            className={
              viewMode === "list"
                ? "results-v3__matches is-list"
                : "results-v3__matches"
            }
          >
            {visibleMatches.map((item) => (
              <MatchCard item={item} key={item.id} />
            ))}
          </div>

          <button type="button" className="results-v3__load-more">
            LOAD MORE HISTORICAL RESULTS
          </button>
        </div>

        <aside className="results-v3__right">
          <article className="results-v3__table-card">
            <header>
              <h3>League Table</h3>
              <p>GRUPO ANDALUCIA ORIENTAL</p>
            </header>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>TEAM</th>
                  <th>PTS</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((row) => (
                  <tr
                    key={row.pos}
                    className={row.highlighted ? "is-highlighted" : ""}
                  >
                    <td>{row.pos}</td>
                    <td>
                      {row.team}
                      {row.highlighted ? <i /> : null}
                    </td>
                    <td>{row.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <a href="#">VIEW FULL STANDINGS</a>
          </article>

          <article className="results-v3__mvp-card">
            <h3>MVP OF THE MONTH</h3>
            <div className="results-v3__mvp-top">
              <div className="results-v3__mvp-photo" />
              <div>
                <h4>M. Rodriguez</h4>
                <p>MIDDLE BLOCKER</p>
              </div>
            </div>
            <div className="results-v3__mvp-kpis">
              <div>
                <strong>42</strong>
                <span>KILLS</span>
              </div>
              <div>
                <strong>15</strong>
                <span>BLOCKS</span>
              </div>
              <div>
                <strong>94%</strong>
                <span>SRV %</span>
              </div>
            </div>
          </article>

          <article className="results-v3__live-card">
            <div>
              <span className="material-symbols-outlined">live_tv</span>
            </div>
            <h4>Next Match Live</h4>
            <p>Catch the action against Malaga VC this Sunday at 18:00 CET.</p>
            <button type="button">SET REMINDER</button>
          </article>
        </aside>
      </section>

      <section className="results-v3__bottom">
        <h2>Season Progression</h2>
        <div>
          {bottomStats.map((stat) => (
            <article key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
