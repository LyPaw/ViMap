package testing;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

@DisplayName("Tests para Calculadora")
class CalculadoraTest {
    private Calculadora calc;

    @BeforeEach
    void setUp() {
        calc = new Calculadora();
    }

    @Test
    @DisplayName("Suma de dos numeros")
    void testSumar() {
        assertEquals(5, calc.sumar(2, 3));
        assertEquals(-1, calc.sumar(2, -3));
        assertEquals(0, calc.sumar(0, 0));
    }

    @Test
    @DisplayName("Resta de dos numeros")
    void testRestar() {
        assertEquals(3, calc.restar(5, 2));
        assertEquals(-1, calc.restar(2, 3));
    }

    @Test
    @DisplayName("Multiplicacion de dos numeros")
    void testMultiplicar() {
        assertEquals(6, calc.multiplicar(2, 3));
        assertEquals(0, calc.multiplicar(5, 0));
        assertEquals(-6, calc.multiplicar(2, -3));
    }

    @Test
    @DisplayName("Division exacta")
    void testDividir() {
        assertEquals(4, calc.dividir(8, 2));
        assertEquals(3, calc.dividir(10, 3));
    }

    @Test
    @DisplayName("Division por cero lanza excepcion")
    void testDividirPorCero() {
        assertThrows(IllegalArgumentException.class, () -> calc.dividir(5, 0));
    }

    @Test
    @DisplayName("Factorial de varios numeros")
    void testFactorial() {
        assertAll("factorial",
            () -> assertEquals(1, calc.factorial(0)),
            () -> assertEquals(1, calc.factorial(1)),
            () -> assertEquals(2, calc.factorial(2)),
            () -> assertEquals(6, calc.factorial(3)),
            () -> assertEquals(24, calc.factorial(4)),
            () -> assertEquals(120, calc.factorial(5))
        );
    }

    @Test
    @DisplayName("Factorial de negativo lanza excepcion")
    void testFactorialNegativo() {
        assertThrows(IllegalArgumentException.class, () -> calc.factorial(-3));
    }

    @Test
    @DisplayName("Verificar numeros pares")
    void testEsPar() {
        assertAll("par",
            () -> assertTrue(calc.esPar(2)),
            () -> assertTrue(calc.esPar(0)),
            () -> assertFalse(calc.esPar(3))
        );
    }

    @Test
    @DisplayName("Maximo de un array")
    void testMaximo() {
        assertEquals(9, calc.maximo(new int[]{1, 5, 3, 9, 2}));
        assertEquals(-1, calc.maximo(new int[]{-5, -1, -3}));
        assertThrows(IllegalArgumentException.class, () -> calc.maximo(new int[]{}));
    }
}
