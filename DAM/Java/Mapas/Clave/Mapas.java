void main() {
    
    // =====================================================================
    // SECCIÓN 1: CREACIÓN Y MÉTODOS BÁSICOS DE MAP (HashMap)
    // =====================================================================
    System.out.println("=== SECCIÓN 1: Creación y métodos básicos de Map ===");
    Map<Integer, String> mapa = new HashMap<>();

    // put(clave, valor) - Añade o reemplaza
    mapa.put(1, "Ana");
    mapa.put(2, "Carlos");
    mapa.put(3, "Beatriz");
    System.out.println("Mapa inicial: " + mapa);

    // get(clave) - Obtiene valor
    System.out.println("Valor de clave 2: " + mapa.get(2));

    // containsKey(clave) - Verifica existencia de clave
    System.out.println("¿Contiene clave 3? " + mapa.containsKey(3));

    // containsValue(valor) - Verifica existencia de valor
    System.out.println("¿Contiene valor 'Ana'? " + mapa.containsValue("Ana"));

    // size() e isEmpty()
    System.out.println("Tamaño del mapa: " + mapa.size());
    System.out.println("¿Está vacío? " + mapa.isEmpty());
    System.out.println();

    // =====================================================================
    // SECCIÓN 2: REEMPLAZO Y ELIMINACIÓN
    // =====================================================================
    System.out.println("=== SECCIÓN 2: Reemplazo y eliminación ===");

    // put() reemplaza valor existente
    System.out.println("Antes de reemplazar clave 1: " + mapa.get(1));
    mapa.put(1, "Andrea"); // Reemplaza "Ana" por "Andrea"
    System.out.println("Después de reemplazar: " + mapa.get(1));

    // remove(clave) - Elimina entrada
    System.out.println("\nMapa antes de remove(2): " + mapa);
    mapa.remove(2);
    System.out.println("Mapa después de remove(2): " + mapa);

    // clear() - Limpia todo el mapa
    Map<Integer, String> temporal = new HashMap<>(mapa);
    temporal.clear();
    System.out.println("\nMapa temporal después de clear(): " + temporal);
    System.out.println("¿Está vacío? " + temporal.isEmpty());
    System.out.println();

    // =====================================================================
    // SECCIÓN 3: VISTAS DEL MAPA (keySet, values, entrySet)
    // =====================================================================
    System.out.println("=== SECCIÓN 3: Vistas del mapa ===");
    mapa.put(4, "David");
    mapa.put(5, "Elena");

    // keySet() - Conjunto de claves
    System.out.println("Claves del mapa: " + mapa.keySet());

    // values() - Colección de valores
    System.out.println("Valores del mapa: " + mapa.values());

    // entrySet() - Pares clave-valor
    System.out.println("\nPares clave-valor:");
    for (Map.Entry<Integer, String> entrada : mapa.entrySet()) {
        System.out.println("  Clave: " + entrada.getKey() + " → Valor: " + entrada.getValue());
    }
    System.out.println();

    // =====================================================================
    // SECCIÓN 4: MÉTODOS MODERNOS (Java 8+)
    // =====================================================================
    System.out.println("=== SECCIÓN 4: Métodos modernos (Java 8+) ===");

    // putIfAbsent - Solo añade si no existe
    System.out.println("Antes de putIfAbsent(6, 'Fernando'): " + mapa.containsKey(6));
    mapa.putIfAbsent(6, "Fernando");
    System.out.println("Después: " + mapa.get(6));

    // Intento de añadir clave existente (no reemplaza)
    mapa.putIfAbsent(1, "NUEVO_NOMBRE");
    System.out.println("putIfAbsent en clave existente (1): " + mapa.get(1)); // Mantiene "Andrea"

    // getOrDefault - Valor por defecto si no existe
    System.out.println("\ngetOrDefault(7, 'Desconocido'): " + mapa.getOrDefault(7, "Desconocido"));
    System.out.println("getOrDefault(3, 'Desconocido'): " + mapa.getOrDefault(3, "Desconocido"));

    // replace - Reemplaza solo si existe
    System.out.println("\nAntes de replace(3, 'Beatriz_Mod'): " + mapa.get(3));
    mapa.replace(3, "Beatriz_Mod");
    System.out.println("Después: " + mapa.get(3));

    // replace con verificación de valor antiguo
    boolean reemplazado = mapa.replace(3, "Beatriz_Mod", "Beatriz_Final");
    System.out.println("replace(3, 'Beatriz_Mod', 'Beatriz_Final'): " + reemplazado);
    System.out.println("Valor final de clave 3: " + mapa.get(3));

    // forEach - Iteración funcional
    System.out.println("\nIteración con forEach:");
    mapa.forEach((clave, valor) ->
            System.out.println("  [" + clave + "] = " + valor)
    );
    System.out.println();

    // =====================================================================
    // SECCIÓN 5: TIPOS ESPECIALES DE MAPAS
    // =====================================================================
    System.out.println("=== SECCIÓN 5: Tipos especiales de mapas ===");

    // LinkedHashMap - Mantiene orden de inserción
    Map<Integer, String> linkedMap = new LinkedHashMap<>();
    linkedMap.put(3, "Tres");
    linkedMap.put(1, "Uno");
    linkedMap.put(2, "Dos");
    System.out.println("LinkedHashMap (orden inserción): " + linkedMap);

    // TreeMap - Orden natural de claves
    Map<Integer, String> treeMap = new TreeMap<>();
    treeMap.put(3, "Tres");
    treeMap.put(1, "Uno");
    treeMap.put(2, "Dos");
    System.out.println("TreeMap (orden natural): " + treeMap);

    // TreeMap con Comparator personalizado (orden descendente)
    Map<Integer, String> treeMapDesc = new TreeMap<>(Collections.reverseOrder());
    treeMapDesc.put(3, "Tres");
    treeMapDesc.put(1, "Uno");
    treeMapDesc.put(2, "Dos");
    System.out.println("TreeMap (orden descendente): " + treeMapDesc);
    System.out.println();

    // =====================================================================
    // SECCIÓN 6: OPERACIONES AVANZADAS
    // =====================================================================
    System.out.println("=== SECCIÓN 6: Operaciones avanzadas ===");

    // computeIfAbsent - Calcula valor si no existe
    Map<String, Integer> contador = new HashMap<>();
    contador.computeIfAbsent("manzana", k -> 0);
    contador.computeIfAbsent("manzana", k -> 0); // No cambia
    contador.put("manzana", contador.get("manzana") + 1);
    System.out.println("Contador 'manzana': " + contador.get("manzana"));

    // compute - Actualiza valor basado en clave y valor actual
    contador.compute("manzana", (k, v) -> (v == null) ? 1 : v + 1);
    System.out.println("Contador 'manzana' después de compute: " + contador.get("manzana"));

    // merge - Combina valores existentes
    contador.merge("naranja", 1, Integer::sum); // Primera vez: 1
    contador.merge("naranja", 2, Integer::sum); // Segunda vez: 1+2=3
    System.out.println("Contador 'naranja' después de merge: " + contador.get("naranja"));
    System.out.println();

    // =====================================================================
    // SECCIÓN 7: MAPAS INMUTABLES (Java 9+)
    // =====================================================================
    System.out.println("=== SECCIÓN 7: Mapas inmutables ===");

    // Map.of - Hasta 10 pares
    Map<String, Integer> mapaInmutable = Map.of(
            "Ana", 25,
            "Carlos", 30,
            "Beatriz", 28
    );
    System.out.println("Mapa inmutable: " + mapaInmutable);

    // Map.ofEntries - Más de 10 pares
    Map<String, Integer> mapaGrande = Map.ofEntries(
            Map.entry("Ana", 25),
            Map.entry("Carlos", 30),
            Map.entry("Beatriz", 28),
            Map.entry("David", 35)
    );
    System.out.println("Mapa grande inmutable: " + mapaGrande);

    // Conversión a mutable
    Map<String, Integer> mapaMutable = new HashMap<>(mapaInmutable);
    mapaMutable.put("Elena", 22);
    System.out.println("Mapa mutable (después de añadir): " + mapaMutable);
    System.out.println();

    // =====================================================================
    // RESUMEN FINAL
    // =====================================================================
    System.out.println("=== RESUMEN DE MÉTODOS DE MAP DEMOSTRADOS ===");
    System.out.println("• put(k, v)              : Añade/reemplaza par clave-valor");
    System.out.println("• get(k)                 : Obtiene valor por clave");
    System.out.println("• remove(k)              : Elimina entrada por clave");
    System.out.println("• containsKey(k)         : Verifica existencia de clave");
    System.out.println("• containsValue(v)       : Verifica existencia de valor");
    System.out.println("• size()                 : Número de entradas");
    System.out.println("• isEmpty()              : Verifica si está vacío");
    System.out.println("• clear()                : Elimina todas las entradas");
    System.out.println("• keySet()               : Conjunto de claves");
    System.out.println("• values()               : Colección de valores");
    System.out.println("• entrySet()             : Conjunto de pares clave-valor");
    System.out.println("• putIfAbsent(k, v)      : Añade solo si no existe (Java 8+)");
    System.out.println("• getOrDefault(k, def)   : Obtiene valor o por defecto (Java 8+)");
    System.out.println("• replace(k, v)          : Reemplaza solo si existe (Java 8+)");
    System.out.println("• replace(k, old, new)   : Reemplaza con verificación de valor antiguo");
    System.out.println("• forEach((k,v)->...)    : Iteración funcional (Java 8+)");
    System.out.println("• computeIfAbsent(k,f)   : Calcula valor si no existe (Java 8+)");
    System.out.println("• compute(k,bif)         : Actualiza valor con función (Java 8+)");
    System.out.println("• merge(k,v,bif)         : Combina valores (Java 8+)");
    System.out.println("• Map.of(...)            : Crea mapa inmutable (Java 9+)");
    System.out.println("• LinkedHashMap          : Mantiene orden de inserción");
    System.out.println("• TreeMap                : Ordena claves automáticamente");
}
