package fundamentos;

public class Variables {
    public static void main(String[] args) {
        // Tipos primitivos
        byte edad = 25;
        short poblacion = 12000;
        int saldo = 1000000;
        long distancia = 300000000L;
        float altura = 1.75f;
        double peso = 72.5;
        char inicial = 'M';
        boolean activo = true;

        System.out.println("Edad: " + edad);
        System.out.println("Poblacion: " + poblacion);
        System.out.println("Saldo: " + saldo);
        System.out.println("Distancia: " + distancia);
        System.out.println("Altura: " + altura);
        System.out.println("Peso: " + peso);
        System.out.println("Inicial: " + inicial);
        System.out.println("Activo: " + activo);

        // Casting
        int entero = (int) altura;
        System.out.println("Casting de float a int: " + entero);

        // Wrappers y autoboxing
        Integer numero = 42;
        Double precio = 29.99;
        Boolean bandera = true;
        System.out.println("Wrapper Integer: " + numero);
        System.out.println("Wrapper Double: " + precio);
        System.out.println("Wrapper Boolean: " + bandera);
    }
}
