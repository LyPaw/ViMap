package colecciones;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class EjemploStreams {
    public static void main(String[] args) {
        List<Integer> numeros = Arrays.asList(5, 3, 8, 1, 9, 2, 7, 4, 6);

        List<Integer> pares = numeros.stream()
            .filter(n -> n % 2 == 0)
            .sorted()
            .collect(Collectors.toList());
        System.out.println("Pares ordenados: " + pares);

        int suma = numeros.stream().mapToInt(Integer::intValue).sum();
        System.out.println("Suma total: " + suma);

        List<String> palabras = Arrays.asList("java", "stream", "lambda", "codigo");
        String resultado = palabras.stream()
            .map(String::toUpperCase)
            .collect(Collectors.joining(", "));
        System.out.println("Resultado: " + resultado);

        // Group by
        List<String> nombres = Arrays.asList("Ana", "Carlos", "Beatriz", "David", "Alberto");
        var grupos = nombres.stream()
            .collect(Collectors.groupingBy(n -> n.charAt(0)));
        System.out.println("Agrupados por inicial: " + grupos);
    }
}
