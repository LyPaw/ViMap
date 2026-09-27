// Configuracion de la aplicacion (constantes publicas del cliente).
// No hay config remota: todo lo de esta capa se sirve estatico mismo origen.

const CONFIG = {
  version: 2,
  appName: "ViMap",
  description: "Vault personal cifrado con visor de lenguaje",
  defaultTheme: "system",

  // Parametros del vault cifrado (deben coincidir con el backend al crear usuarios).
  passwordIterations: 100000,

  // Limites de la interfaz / sesion.
  versionLimit: 25, // versiones conservadas por archivo
  trashRetentionDays: 30, // dias que la papelera conserva antes de purgar
  maxBlobBytes: 32 * 1024 * 1024, // tope del backend: un archivo (sobre cifrado) no puede pasar de 32 MB
  defaultQuotaBytes: 100 * 1024 * 1024, // 100 MiB (la DB D1 free se comparte entre todos los usuarios)
  search: { maxContentScan: 300, maxResults: 80 },
};

export function loadConfig() {
  return CONFIG;
}

export function getConfig() {
  return CONFIG;
}