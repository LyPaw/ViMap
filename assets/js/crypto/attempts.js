// Contador de intentos fallidos SOLO como ayuda de interfaz.
// No es una medida de seguridad: se puede eludir desde las herramientas del navegador
// y el ciphertext puede atacarse offline por cualquier visitante.

let failures = 0;

export function registerFailure() {
  failures += 1;
  return failures;
}

export function resetAttempts() {
  failures = 0;
}

export function getAttempts() {
  return failures;
}