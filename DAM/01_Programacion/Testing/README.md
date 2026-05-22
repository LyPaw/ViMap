## Material de Estudio

El temario oficial completo de este modulo esta disponible en el siguiente archivo PDF local:

- [Temario: Testing (PDF)](../temario_testing.pdf)

# Testing y Pruebas Unitarias

## Tipos de pruebas

1.  **Pruebas unitarias**: verifican el comportamiento de una unidad aislada (metodo o clase).
2.  **Pruebas de integracion**: verifican la interaccion entre varias unidades o modulos.
3.  **Pruebas funcionales**: verifican que el sistema cumple los requisitos desde la perspectiva del usuario.
4.  **Pruebas de regresion**: verifican que cambios recientes no rompen funcionalidad existente.

## JUnit 5

JUnit es el framework de testing mas usado en Java.

### Anotaciones principales

-   `@Test`: marca un metodo como prueba.
-   `@BeforeEach`: se ejecuta antes de cada test.
-   `@AfterEach`: se ejecuta despues de cada test.
-   `@BeforeAll`: se ejecuta una vez antes de todos los tests (metodo static).
-   `@AfterAll`: se ejecuta una vez despues de todos los tests (metodo static).

### Aserciones (Assertions)

-   `assertEquals(esperado, actual)`
-   `assertTrue(condicion)`, `assertFalse(condicion)`
-   `assertNull(objeto)`, `assertNotNull(objeto)`
-   `assertThrows(exception.class, () -> codigo)`
-   `assertAll("mensaje", () -> asercion1, () -> asercion2)`

### Ciclo de vida de un test

1.  `@BeforeAll` (una vez al inicio)
2.  `@BeforeEach` -> `@Test` -> `@AfterEach` (por cada test)
3.  `@AfterAll` (una vez al final)

## TDD (Test-Driven Development)

Ciclo: Escribir test fallido -> Escribir codigo minimo para pasar el test -> Refactorizar.

## Ejercicios propuestos

1.  Escribe tests unitarios para una clase `Calculadora` con metodos sumar, restar, multiplicar, dividir.
2.  Prueba el metodo dividir lanzando una excepcion cuando el divisor es cero.
3.  Escribe tests parametrizados que prueben una funcion con multiples entradas.
4.  Implementa una clase `ValidadorDNI` y escribe tests que verifiquen DNI validos e invalidos.
5.  Usa `assertAll` para agrupar multiples aserciones en un mismo test.

