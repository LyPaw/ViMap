package testing;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class CalculadoraTest {
    private Calculadora c;

    @BeforeEach
    void setUp() { c = new Calculadora(); }

    @Test
    void testSumar() { assertEquals(5, c.sumar(2, 3)); }

    @Test
    void testRestar() { assertEquals(3, c.restar(5, 2)); }

    @Test
    void testMultiplicar() { assertEquals(6, c.multiplicar(2, 3)); }

    @Test
    void testDividir() { assertEquals(4, c.dividir(8, 2)); }

    @Test
    void testDividirCero() { assertThrows(IllegalArgumentException.class, () -> c.dividir(5, 0)); }

    @Test
    void testFactorial() {
        assertAll(
            () -> assertEquals(1, c.factorial(0)),
            () -> assertEquals(1, c.factorial(1)),
            () -> assertEquals(6, c.factorial(3)),
            () -> assertEquals(120, c.factorial(5))
        );
    }

    @Test
    void testFactorialNegativo() { assertThrows(IllegalArgumentException.class, () -> c.factorial(-3)); }
}
