# Testing en Java

## 1. Importancia de las pruebas unitarias

Las pruebas unitarias verifican el comportamiento de unidades individuales de codigo (metodos, clases) de forma aislada. Beneficios:

- Detectan errores temprano en el desarrollo
- Facilitan la refactorizacion
- Sirven como documentacion viva del comportamiento esperado
- Reducen el costo de mantenimiento

## 2. JUnit 5 (Jupiter)

JUnit 5 es el framework de pruebas unitarias mas utilizado en Java.

### Anotaciones principales

```java
import org.junit.jupiter.api.*;

@Test                    // Marca un metodo como prueba
@BeforeEach              // Se ejecuta antes de cada @Test
@AfterEach               // Se ejecuta despues de cada @Test
@BeforeAll               // Se ejecuta una vez antes de todos los tests (static)
@AfterAll                // Se ejecuta una vez despues de todos los tests (static)
@Disabled                // Deshabilita un test o clase
@DisplayName("texto")    // Nombre descriptivo para el test
@Tag("rapido")           // Etiqueta para filtrar tests
@Nested                  // Clase interna con sub-tests
@RepeatedTest(n)         // Repite el test n veces
@ParameterizedTest       // Test con parametros (con @ValueSource, @CsvSource, etc.)
```

### Ciclo de vida

```java
class CalculadoraTest {
    private Calculadora calc;

    @BeforeAll
    static void initAll() {
        System.out.println("Antes de todos los tests");
    }

    @BeforeEach
    void init() {
        calc = new Calculadora();
        System.out.println("Antes de cada test");
    }

    @Test
    void testSuma() {
        assertEquals(5, calc.sumar(2, 3));
    }

    @AfterEach
    void tearDown() {
        System.out.println("Despues de cada test");
    }

    @AfterAll
    static void tearDownAll() {
        System.out.println("Despues de todos los tests");
    }
}
```

### Aserciones (Assertions)

```java
import static org.junit.jupiter.api.Assertions.*;

// Igualdad
assertEquals(4, calculadora.sumar(2, 2));
assertEquals(0.3, 0.1 + 0.2, 0.0001);  // con delta para doubles

// Booleano
assertTrue(lista.isEmpty());
assertFalse(usuario.isBloqueado());

// Nulos
assertNull(objetoNoInicializado);
assertNotNull(objeto);

// Misma referencia / Diferente referencia
assertSame(instancia, singleton.getInstancia());
assertNotSame(obj1, obj2);

// Arrays
assertArrayEquals(new int[]{1, 2, 3}, resultado);

// Excepciones
assertThrows(IllegalArgumentException.class,
    () -> calculadora.dividir(1, 0));

assertThrows(ArithmeticException.class,
    () -> { int x = 1 / 0; });

// Multiples aserciones agrupadas (todas se ejecutan, no se detienen en la primera)
assertAll("operaciones",
    () -> assertEquals(4, calc.sumar(2, 2)),
    () -> assertEquals(0, calc.restar(2, 2)),
    () -> assertEquals(6, calc.multiplicar(2, 3)),
    () -> assertEquals(2, calc.dividir(4, 2))
);

// Fallo directo
fail("Este test deberia fallar");
```

### Tests parametrizados

```java
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.*;

@ParameterizedTest
@ValueSource(ints = {1, 2, 3, 4, 5})
void testPositivos(int numero) {
    assertTrue(numero > 0);
}

@ParameterizedTest
@CsvSource({"1,1,2", "2,3,5", "10,20,30"})
void testSuma(int a, int b, int esperado) {
    assertEquals(esperado, calc.sumar(a, b));
}

@ParameterizedTest
@MethodSource("proveerDatos")
void testConMetodo(int a, int b, int esperado) {
    assertEquals(esperado, calc.sumar(a, b));
}

static Stream<Arguments> proveerDatos() {
    return Stream.of(
        Arguments.of(1, 1, 2),
        Arguments.of(2, 3, 5),
        Arguments.of(10, 20, 30)
    );
}
```

## 3. TDD (Test Driven Development)

Ciclo **Red-Green-Refactor**:

1. **Red**: Escribir un test que falle (la funcionalidad no existe aun)
2. **Green**: Escribir el codigo minimo para que pase
3. **Refactor**: Mejorar el codigo manteniendo los tests verdes

```
Escribir test fallido → Implementar codigo → Ejecutar tests
                                              ↓
                                       ¿Pasan? → NO → Implementar mas
                                              ↓
                                           SI
                                              ↓
                                       Refactorizar
                                              ↓
                                       Repetir ciclo
```

## 4. Mocks con Mockito

Mockito permite crear objetos simulados para aislar la unidad bajo prueba.

```java
import static org.mockito.Mockito.*;

// Crear mock
UsuarioRepository repoMock = mock(UsuarioRepository.class);

// Definir comportamiento
when(repoMock.buscarPorId(1)).thenReturn(new Usuario("Ana"));
when(repoMock.buscarPorId(99)).thenThrow(new RuntimeException("No encontrado"));

// Verificar interacciones
verify(repoMock).buscarPorId(1);
verify(repoMock, times(1)).guardar(any(Usuario.class));
verify(repoMock, never()).eliminar(anyInt());

// Argument matchers
when(repoMock.buscarPorId(anyInt())).thenReturn(defaultUser);
```

## 5. Cobertura de codigo

La cobertura mide que porcentaje del codigo es ejecutado por los tests. Herramientas: JaCoCo, Cobertura.

Metricas comunes:
- **Line coverage**: lineas de codigo ejecutadas
- **Branch coverage**: ramas condicionales (if/else) cubiertas
- **Method coverage**: metodos invocados

**Regla practica**: busca al menos 80% de cobertura en logica de negocio. No obsesionarse con getters/setters o codigo trivial.

## 6. Buenas practicas

- Una asercion conceptual por test (o varias con `assertAll`)
- Nombres descriptivos: `testSumaConNumerosPositivos()`
- Aislar pruebas: no dependan del orden de ejecucion
- Usar `@BeforeEach` para inicializar el estado
- No escribir tests para codigo trivial (getters, setters)
- Probar casos limite: valores nulos, vacios, negativos, cero
- Mantener los tests independientes entre si
- Ejecutar tests frecuentemente durante el desarrollo
