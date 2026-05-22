package colecciones;

import java.util.HashMap;
import java.util.Map;

public class EjemploHashMap {
    public static void main(String[] args) {
        Map<String, Integer> edades = new HashMap<>();
        edades.put("Ana", 25); edades.put("Carlos", 30);
        edades.put("Beatriz", 22); edades.put("David", 35);

        System.out.println("Edades: " + edades);
        System.out.println("Edad de Carlos: " + edades.get("Carlos"));

        for (Map.Entry<String, Integer> e : edades.entrySet())
            System.out.println(e.getKey() + " -> " + e.getValue());

        // Conteo frecuencias
        String texto = "hola mundo hola java hola mundo";
        Map<String, Integer> freq = new HashMap<>();
        for (String p : texto.split(" "))
            freq.put(p, freq.getOrDefault(p, 0) + 1);
        System.out.println("Frecuencias: " + freq);
    }
}
