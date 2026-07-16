const heroStats = [
  { value: "1990", label: "Fundacion", detail: "Inicio oficial del club" },
  { value: "1000+", label: "Talento", detail: "Jugadores formados" },
];

export default function HistoriaResumen() {
  return (
    <section className="historia-v2__identity historia-v2__reveal">
      <article className="historia-v2__card historia-v2__card--story">
        <span className="historia-v2__pill">Club y ciudad</span>
        <h2>Un proyecto deportivo que crecio con Berja</h2>
        <div className="historia-v2__copy">
          <p>
            El club nace en octubre de 1990 para continuar el trabajo de base
            iniciado en 1983 y abrir el voleibol a todo el municipio. Ese origen
            explica una identidad muy clara: cantera, compromiso y una
            vinculacion directa con la vida deportiva virgitana.
          </p>
          <p>
            A lo largo de estas decadas se ha consolidado como el club deportivo
            mas antiguo de Berja y uno de los referentes historicos del voleibol
            almeriense, con una trayectoria estable en deporte federado y una
            presencia muy reconocible dentro y fuera de la pista.
          </p>
        </div>
        <div className="historia-v2__gallery">
          <div className="historia-v2__media">
            <img
              alt="Partido historico del Club Voleibol Berja"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0wvRW0dZ1a-j5joj76biwSZd0DMv8Dluml1i4UEP-yz41-yoGf_6X_CRw9za0DW_a9eS6ErwirlEkJ5FlahdFUL7Ja0fb0YBDVXNOxi4kl1KKNj9dMti33nZIuwDWjjrRPvV2fZJHm-NH7c9v8brnyb1X8wWjV0cK3znYj4fJxtngM0WT4Ds689Eg805zhFKnWOaaDC0SLL_sQHuYLvmK954-UWLT12fV8GPz8mCxEeecVB9EyaEDmw"
            />
          </div>
          <div className="historia-v2__media">
            <img
              alt="Entrenamiento actual del Club Voleibol Berja"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaVPXcDbBYAyQI6SxI4HbBK6G9TSUFo9-r6cp-cADFRRfqTIc1Pt0EaDgBl_lpA--P10L9Z2tJWxc7MMaQ-Qnx_1xnLsvZkge-fuqPcIk6t2mtmxRJJk5hDzSWYAnx-_o-y85Is5u_GCqxK4iDu4ZQoIrl_ymSV8ts2JYnMujwDhMbxlcaxmXt31MYepE1CCGmJf5kGYk5FMTGBKYNHF7LUujX1naw-3oDAt_bJdPudj1TPg2Fu6f2QA"
            />
          </div>
        </div>
      </article>

      <aside className="historia-v2__side">
        <article className="historia-v2__card historia-v2__card--legacy">
          <div className="historia-v2__legacy-mark" aria-hidden="true">
            <span className="material-symbols-outlined">sports_volleyball</span>
          </div>
          <span className="historia-v2__pill historia-v2__pill--light">
            Legado
          </span>
          <h3>Una cantera que deja huella</h3>
          <p>
            Mas de un millar de virgitanos y virgitanas han pasado por el club,
            construyendo una comunidad que mezcla formacion, nivel competitivo y
            orgullo local.
          </p>
        </article>

        <div className="historia-v2__stats">
          {heroStats.map((item) => (
            <article key={item.label} className="historia-v2__stat">
              <strong>{item.value}</strong>
              <span>{item.label}</span>
              <small>{item.detail}</small>
            </article>
          ))}
        </div>
      </aside>
    </section>
  );
}
