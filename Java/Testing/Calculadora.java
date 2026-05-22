package testing;

public class Calculadora {
    public int sumar(int a, int b) { return a + b; }
    public int restar(int a, int b) { return a - b; }
    public int multiplicar(int a, int b) { return a * b; }
    public int dividir(int a, int b) {
        if (b == 0) throw new IllegalArgumentException("Division por cero");
        return a / b;
    }
    public int factorial(int n) {
        if (n < 0) throw new IllegalArgumentException("Negativo");
        int r = 1;
        for (int i = 2; i <= n; i++) r *= i;
        return r;
    }
}
