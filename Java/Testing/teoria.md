# Testing en Java

## JUnit 5

Framework de pruebas unitarias.

```java
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;
```

## Anotaciones

| Anotacion | Descripcion |
|-----------|-------------|
| `@Test` | Metodo de prueba |
| `@BeforeEach` | Ejecuta antes de cada test |
| `@AfterEach` | Ejecuta despues de cada test |
| `@BeforeAll` | Ejecuta una vez antes de todos |
| `@AfterAll` | Ejecuta una vez despues de todos |

## Aserciones

```java
assertEquals(4, calculadora.sumar(2, 2));
assertTrue(lista.isEmpty());
assertNotNull(objeto);
assertThrows(ArithmeticException.class,
    () -> calculadora.dividir(1, 0));
assertAll("multi",
    () -> assertEquals(4, calc.sumar(2,2)),
    () -> assertEquals(0, calc.restar(2,2))
);
```

## TDD (Test Driven Development)

1. Escribir test que falla
2. Implementar codigo minimo para que pase
3. Refactorizar

## Buenas Practicas

- Una asercion por test (o agrupar con assertAll)
- Nombres descriptivos: `testSumaPositivos()`
- No depender de orden de ejecucion
- Usar mocks para dependencias externas
