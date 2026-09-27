// Catalogo central de temas visuales. El selector, las vistas previas y la
// migracion de preferencias antiguas se generan desde aqui: no duplicar.

export const CATEGORIES = [
  { id: "clasicos", title: "Clásicos del escritorio" },
  { id: "universos", title: "Universos y géneros" },
];

export const THEMES = [
  { id: "win95", cat: "clasicos", name: "Windows 95/98", desc: "Gris clasico, biseles 3D y azul marino." },
  { id: "xp-luna", cat: "clasicos", name: "Windows XP Luna", desc: "Azul brillante, verde y naranja alegres." },
  { id: "vista-aero", cat: "clasicos", name: "Windows Vista Aero", desc: "Cristal esmerilado y reflejos fluidos." },
  { id: "win7-aero", cat: "clasicos", name: "Windows 7 Aero", desc: "Pulido sobrio con transparencias ligeras." },
  { id: "terminal", cat: "clasicos", name: "Terminal retro", desc: "Fosforo verde, monoespaciada y CRT sutil." },
  { id: "cyberpunk", cat: "clasicos", name: "Cyberpunk neon", desc: "Magenta, cian y violeta sobre negro." },
  { id: "minimal-macos", cat: "clasicos", name: "Minimalismo macOS", desc: "Claro calido, glassmorphism y pastel." },
  { id: "dark-pro", cat: "clasicos", name: "Oscuro profesional", desc: "Grafito de alto contraste, sin ruido." },
  { id: "y2k", cat: "clasicos", name: "Y2K / Web 2000", desc: "Celeste, plata, gel y brillo nostalgico." },
  { id: "future", cat: "clasicos", name: "Futurista limpio", desc: "Blanco hielo, paneles translucidos." },
  { id: "horizonte-neon", cat: "universos", name: "Horizonte Neón", desc: "Retrofuturismo nocturno de arcades y ciencia ficción ochentera." },
  { id: "terminal-nave", cat: "universos", name: "Terminal de Nave", desc: "Interfaz industrial de nave: paneles, oliva y telemetría." },
  { id: "archivo-anomalo", cat: "universos", name: "Archivo Anómalo", desc: "Investigación paranormal ficticia, sellos y escáner." },
  { id: "reino-pixeles", cat: "universos", name: "Reino de Píxeles", desc: "Aventura de fantasía en pixel art original." },
  { id: "ciudad-lluviosa", cat: "universos", name: "Ciudad Lluviosa", desc: "Neo-noir urbano: lluvia, neones y asfalto mojado." },
  { id: "sector-galactico", cat: "universos", name: "Sector Galáctico", desc: "Exploración espacial con mapa estelar procedural." },
  { id: "bunker-analogico", cat: "universos", name: "Búnker Analógico", desc: "Consola retro 1950–1970: CRT, ámbar y botones físicos." },
  { id: "operacion-tactica", cat: "universos", name: "Operación Táctica", desc: "Misión estratégica ficticia sobre cuadrícula." },
  { id: "sueno-sintetico", cat: "universos", name: "Sueño Sintético", desc: "Futuro onírico: lavanda, burbujas y calma." },
  { id: "metropolis-mecanica", cat: "universos", name: "Metrópolis Mecánica", desc: "Dieselpunk industrial: acero, cobre y remaches." },
  { id: "colonia-submarina", cat: "universos", name: "Colonia Submarina", desc: "Estación oceánica ficticia bajo el mar." },
  { id: "mundo-carton", cat: "universos", name: "Mundo de Cartón", desc: "Recortes de papel juguetones estilo stop motion." },
];

export const THEME_IDS = new Set(THEMES.map((t) => t.id));

// Preferencias heredadas (claro/oscuro/sistema) y su equivalencia actual.
export const LEGACY_MAP = { light: "xp-luna", dark: "dark-pro" };
export const SYSTEM_LIGHT_THEME = "minimal-macos";
export const SYSTEM_DARK_THEME = "dark-pro";
export const FALLBACK_THEME = "dark-pro";
