package colecciones;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class EjemploArrayList {
    public static void main(String[] args) {
        List<String> nombres = new ArrayList<>();
        nombres.add("Ana"); nombres.add("Carlos");
        nombres.add("Beatriz"); nombres.add("David");

        System.out.println("Lista: " + nombres);
        System.out.println("Tamanio: " + nombres.size());
        System.out.println("Pos 2: " + nombres.get(2));

        Collections.sort(nombres);
        System.out.println("Ordenada: " + nombres);

        for (String n : nombres) System.out.println(" - " + n);
    }
}
