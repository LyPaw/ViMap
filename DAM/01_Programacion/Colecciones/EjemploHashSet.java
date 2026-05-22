package colecciones;

import java.util.HashSet;
import java.util.Set;
import java.util.TreeSet;

public class EjemploHashSet {
    public static void main(String[] args) {
        Set<String> frutas = new HashSet<>();

        frutas.add("Manzana");
        frutas.add("Banana");
        frutas.add("Naranja");
        frutas.add("Manzana");
        frutas.add("Uva");
        frutas.add("Banana");

        System.out.println("HashSet (sin orden, sin duplicados): " + frutas);
        System.out.println("Tamanio: " + frutas.size());
        System.out.println("Contiene 'Uva'? " + frutas.contains("Uva"));

        frutas.remove("Naranja");
        System.out.println("Tras eliminar Naranja: " + frutas);

        // TreeSet ordena naturalmente
        Set<Integer> numeros = new TreeSet<>();
        int[] valores = { 5, 3, 8, 1, 8, 3, 9, 2, 5, 7 };
        for (int v : valores) {
            numeros.add(v);
        }
        System.out.println("\nTreeSet (ordenado, sin duplicados): " + numeros);

        // Operaciones de conjunto
        Set<Integer> a = new HashSet<>(Set.of(1, 2, 3, 4, 5));
        Set<Integer> b = new HashSet<>(Set.of(4, 5, 6, 7, 8));

        Set<Integer> union = new HashSet<>(a);
        union.addAll(b);
        System.out.println("\nUnion A y B: " + union);

        Set<Integer> interseccion = new HashSet<>(a);
        interseccion.retainAll(b);
        System.out.println("Interseccion A y B: " + interseccion);

        Set<Integer> diferencia = new HashSet<>(a);
        diferencia.removeAll(b);
        System.out.println("Diferencia A - B: " + diferencia);
    }
}
