package colecciones;

import java.util.HashMap;
import java.util.Map;

public class EjemploHashMap {
    public static void main(String[] args) {
        Map<String, Integer> edades = new HashMap<>();

        edades.put("Ana", 25);
        edades.put("Carlos", 30);
        edades.put("Beatriz", 22);
        edades.put("David", 35);

        System.out.println("Mapa de edades: " + edades);
        System.out.println("Edad de Carlos: " + edades.get("Carlos"));
        System.out.println("Contiene clave 'Ana'? " + edades.containsKey("Ana"));
        System.out.println("Contiene valor 30? " + edades.containsValue(30));

        edades.put("Ana", 26);
        System.out.println("Edad de Ana actualizada: " + edades.get("Ana"));

        System.out.println("\nRecorrido por clave-valor:");
        for (Map.Entry<String, Integer> entry : edades.entrySet()) {
            System.out.println(entry.getKey() + " -> " + entry.getValue() + " anios");
        }

        // Conteo de frecuencias
        String texto = "hola mundo hola java hola mundo programacion java";
        Map<String, Integer> frecuencias = new HashMap<>();
        for (String palabra : texto.split(" ")) {
            frecuencias.put(palabra, frecuencias.getOrDefault(palabra, 0) + 1);
        }
        System.out.println("\nFrecuencia de palabras: " + frecuencias);

        // Metodos utiles
        System.out.println("Claves: " + edades.keySet());
        System.out.println("Valores: " + edades.values());
        System.out.println("Tamanio: " + edades.size());
        edades.remove("David");
        System.out.println("Tras eliminar David: " + edades);
    }
}
