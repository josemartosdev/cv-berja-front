/** Datos demo — sustituir `image` por logos en /public/img/patrocinadores/ */

const base = import.meta.env.BASE_URL;

export const SPONSORS = [
  {
    id: "black-spike",
    name: "Black Spike",
    tagline: "Material y equipación deportiva",
    description:
      "Apoyan al club con material de competición, balones y equipación para categorías inferiores. Su compromiso permite que nuestros equipos compitan con la mejor preparación posible.",
    image: `${base}img/patrocinadores/black-spike.svg`,
    initials: "BS",
    since: "2022",
    url: "mailto:info@cvberja.es",
  },
  {
    id: "rojo-club",
    name: "Rojo Club",
    tagline: "Hostelería y eventos",
    description:
      "Colaboran en celebraciones del club, comidas de equipo y eventos sociales que unen a familias y jugadores después de los partidos.",
    image: `${base}img/patrocinadores/rojo-club.svg`,
    initials: "RC",
    since: "2023",
    url: "#",
  },
  {
    id: "arenas-tech",
    name: "Arenas Tech",
    tagline: "Tecnología y digitalización",
    description:
      "Impulsan la presencia digital del club: web, redes y herramientas que acercan la información a jugadores, familias y afición.",
    image: `${base}img/patrocinadores/arenas-tech.svg`,
    initials: "AT",
    since: "2024",
    url: "#",
  },
  {
    id: "zona-voley",
    name: "Zona Voley",
    tagline: "Tienda especializada",
    description:
      "Asesoran a familias en material técnico y calzado, con condiciones especiales para la cantera del CV Berja.",
    image: `${base}img/patrocinadores/zona-voley.svg`,
    initials: "ZV",
    since: "2021",
    url: "#",
  },
  {
    id: "decathlon",
    name: "Decathlon Berja",
    tagline: "Deporte para todos",
    description:
      "Referente local en deporte de base: apoyan actividades abiertas, campus y la difusión del voleibol en el municipio.",
    image: `${base}img/patrocinadores/decathlon.svg`,
    initials: "DB",
    since: "2020",
    url: "#",
  },
  {
    id: "gimnasio",
    name: "Gimnasio Berja",
    tagline: "Preparación física",
    description:
      "Trabajan la condición física de jugadores y jugadoras con programas adaptados a la temporada competitiva.",
    image: `${base}img/patrocinadores/gimnasio.svg`,
    initials: "GB",
    since: "2024",
    url: "#",
  },
  {
    id: "farmacia",
    name: "Farmacia Central",
    tagline: "Salud y bienestar",
    description:
      "Colaboran en la salud de la plantilla, primeros auxilios y consejo a familias en el día a día del club.",
    image: `${base}img/patrocinadores/farmacia.svg`,
    initials: "FC",
    since: "2019",
    url: "#",
  },
  {
    id: "paseo",
    name: "Hostelería El Paseo",
    tagline: "Restauración local",
    description:
      "Acogen encuentros del club y refuerzan el vínculo entre comercio local y deporte federado en Berja.",
    image: `${base}img/patrocinadores/paseo.svg`,
    initials: "EP",
    since: "2022",
    url: "#",
  },
];

export const MARQUEE_SPONSORS = SPONSORS.map((s) => s.name);

export const SPONSOR_STATS = [
  { value: `${SPONSORS.length}+`, label: "Empresas colaboradoras" },
  { value: "2025/26", label: "Temporada activa" },
  { value: "800+", label: "Impactos en redes / mes" },
  { value: "100%", label: "Compromiso local" },
];
