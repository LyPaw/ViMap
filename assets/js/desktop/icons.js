// Iconos SVG inline (24x24) reutilizados por escritorio, ventanas, menus y taskbar.
// Se pintan con currentColor; el tamano lo controla el CSS.

const s = (inner, extra) =>
  '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"' + (extra || "") + ">" + inner + "</svg>";

export const ICON = {
  folder: s('<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" fill="none" stroke="currentColor" stroke-width="1.8"/>'),
  folderOpen: s('<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v1H5a2 2 0 0 1-2-2V7Z" fill="currentColor" opacity=".55"/><path d="M3 9h18l-2 10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2L3 9Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>'),
  file: s('<path d="M13 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-7-6Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M13 3v6h6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>'),
  note: s('<path d="M6 3h8l4 4v14H6V3Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 12h6M9 15h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'),
  code: s('<path d="m8 7-5 5 5 5M16 7l5 5-5 5M13 5l-2 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'),
  image: s('<rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="9" cy="10" r="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m5 19 5-5 3 3 3-3 3 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'),
  pdf: s('<path d="M6 3h8l4 4v14H6V3Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 12h.01M12 12h.01M15 12h.01M9 15h.01M12 15h.01M15 15h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),
  binary: s('<rect x="5" y="5" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>'),
  search: s('<circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="m20.5 20.5-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),
  trash: s('<path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 13h8l1-13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'),
  save: s('<path d="M4 4h13l3 3v13H4V4Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M8 4v6h8V4M8 20v-6h8v6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>'),
  download: s('<path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'),
  upload: s('<path d="M12 15V3m0 0 4 4m-4-4L8 7M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'),
  up: s('<path d="M12 19V5m0 0-6 6m6-6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'),
  newFile: s('<path d="M13 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-7-6Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 11v6M9 14h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'),
  newFolder: s('<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 12v6M9 15h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'),
  copy: s('<rect x="8" y="8" width="12" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" stroke="currentColor" stroke-width="1.8" fill="none"/>'),
  cut: s('<path d="M6 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm12 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M7.5 5.5 21 19M7.5 18.5 21 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'),
  paste: s('<path d="M9 5h6v3H9V5Z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M9 4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2V4Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>'),
  users: s('<circle cx="9" cy="8" r="3.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3.5 20c.5-3.4 2.6-5 5.5-5s5 1.6 5.5 5M16 5.6a3.1 3.1 0 0 1 0 5.6M17.5 15c2 .6 3.2 2.2 3.5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'),
  gear: s('<path d="M10 4.8V2m0 20v-2.8M4.8 10H2m20 0h-2.8M6.2 6.2 4 4m16 16-2.2-2.2M17.8 6.2 20 4M4 20l2.2-2.2M12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" fill="none"/>'),
  power: s('<path d="M12 2v9M6.3 4.6a8.5 8.5 0 1 0 11.4 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'),
  edit: s('<path d="M4 20h4L19.5 8.5a2.1 2.1 0 0 0-3-3L5 17v3Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>'),
  rename: s('<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>'),
  move: s('<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" fill="none" stroke="currentColor" stroke-width="1.8"/>'),
  clock: s('<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'),
  shield: s('<path d="M12 2 4 5v6c0 5 3.4 9.2 8 11 4.6-1.8 8-6 8-11V5l-8-3Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="m9 12 2 2 4-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'),
  check: s('<path d="m5 13 4 4L19 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'),
  moon: s('<path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" fill="currentColor"/>'),
  sun: s('<circle cx="12" cy="12" r="4.5" fill="currentColor"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),
  monitor: s('<rect x="3" y="4" width="18" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9 21h6M12 17v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'),
  palette: s('<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="9" cy="10" r="1.4" fill="currentColor"/><circle cx="14.5" cy="9" r="1.4" fill="currentColor"/><circle cx="16" cy="14" r="1.4" fill="currentColor"/><circle cx="11" cy="15.5" r="1.4" fill="currentColor"/>'),
  star: s('<path d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-3-5.4 3 1.1-6L3.2 9.4l6.1-.8L12 3Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>'),
  viewGrid: s('<rect x="4" y="4" width="7" height="7" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="13" y="4" width="7" height="7" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="4" y="13" width="7" height="7" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="13" y="13" width="7" height="7" fill="none" stroke="currentColor" stroke-width="1.8"/>'),
  viewList: s('<path d="M8 6h12M8 12h12M8 18h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="4.5" cy="6" r="1.3" fill="currentColor"/><circle cx="4.5" cy="12" r="1.3" fill="currentColor"/><circle cx="4.5" cy="18" r="1.3" fill="currentColor"/>'),
  info: s('<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 11v5M12 8.2v.1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),
};

export function iconSvg(name, cls) {
  const svg = ICON[name] || ICON.file;
  return cls ? svg.replace("<svg ", '<svg class="' + cls + '" ') : svg;
}