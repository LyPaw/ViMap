package colecciones;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class EjemploArrayList {
    public static void main(String[] args) {
        List<String> nombres = new ArrayList<>();

        nombres.add("Ana");
        nombres.add("Carlos");
        nombres.add("Beatriz");
        nombres.add("David");
        nombres.add("Ana");

        System.out.println("Lista: " + nombres);
        System.out.println("Tamanio: " + nombres.size());
        System.out.println("Posicion 2: " + nombres.get(2));
        System.out.println("Contiene 'Carlos'? " + nombres.contains("Carlos"));

        nombres.remove("Ana");
        System.out.println("Tras eliminar 'Ana': " + nombres);

        Collections.sort(nombres);
        System.out.println("Ordenada: " + nombres);

        System.out.println("\nRecorrido con for-each:");
        for (String n : nombres) {
            System.out.println(" - " + n);
        }

        List<Integer> numeros = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            numeros.add((int) (Math.random() * 100));
        }
        System.out.println("\nNumeros aleatorios: " + numeros);
        Collections.sort(numeros);
        System.out.println("Ordenados: " + numeros);
        System.out.println("Maximo: " + Collections.max(numeros));
        System.out.println("Minimo: " + Collections.min(numeros));
    }
}
