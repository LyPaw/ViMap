void main() {

    // =====================================================================
    // SECCIÓN 1: HashSet - Conjunto sin orden garantizado
    // =====================================================================
    System.out.println("=== SECCIÓN 1: HashSet (sin orden garantizado) ===");
    Set<String> hashSet = new HashSet<>();

    // add(elemento) - Añade elemento (no duplicados)
    hashSet.add("Manzana");
    hashSet.add("Banana");
    hashSet.add("Naranja");
    hashSet.add("Manzana"); // Duplicado - será ignorado

    System.out.println("HashSet inicial: " + hashSet);
    System.out.println("Tamaño: " + hashSet.size());
    System.out.println("¿Contiene 'Banana'? " + hashSet.contains("Banana"));
    System.out.println("¿Está vacío? " + hashSet.isEmpty());
    System.out.println();

    // =====================================================================
    // SECCIÓN 2: LinkedHashSet - Mantiene orden de inserción
    // =====================================================================
    System.out.println("=== SECCIÓN 2: LinkedHashSet (orden de inserción) ===");
    Set<String> linkedHashSet = new LinkedHashSet<>();
    linkedHashSet.add("Z");
    linkedHashSet.add("A");
    linkedHashSet.add("M");
    linkedHashSet.add("A"); // Duplicado ignorado

    System.out.println("LinkedHashSet: " + linkedHashSet);
    System.out.println("Mantiene orden de inserción: Z → A → M");
    System.out.println();

    // =====================================================================
    // SECCIÓN 3: TreeSet - Orden natural y personalizado
    // =====================================================================
    System.out.println("=== SECCIÓN 3: TreeSet (orden automático) ===");

    // Orden natural (alfabético para Strings)
    Set<String> treeSet = new TreeSet<>();
    treeSet.add("Zanahoria");
    treeSet.add("Manzana");
    treeSet.add("Banana");

    System.out.println("TreeSet (orden natural): " + treeSet);

    // Primer y último elemento
    System.out.println("Primer elemento: " + ((TreeSet<String>) treeSet).first());
    System.out.println("Último elemento: " + ((TreeSet<String>) treeSet).last());

    // Subconjuntos
    System.out.println("Elementos menores que 'N': " +
            ((TreeSet<String>) treeSet).headSet("N"));
    System.out.println("Elementos mayores/iguales a 'M': " +
            ((TreeSet<String>) treeSet).tailSet("M"));
    System.out.println();

    // TreeSet con Comparator personalizado (longitud de cadena)
    Set<String> treeSetLongitud = new TreeSet<>(Comparator.comparingInt(String::length));
    treeSetLongitud.add("A");
    treeSetLongitud.add("Perro");
    treeSetLongitud.add("Gato");
    treeSetLongitud.add("Elefante");

    System.out.println("TreeSet (orden por longitud): " + treeSetLongitud);
    System.out.println();

    // =====================================================================
    // SECCIÓN 4: OPERACIONES DE CONJUNTOS
    // =====================================================================
    System.out.println("=== SECCIÓN 4: Operaciones de conjuntos ===");

    Set<Integer> conjuntoA = new HashSet<>(Arrays.asList(1, 2, 3, 4, 5));
    Set<Integer> conjuntoB = new HashSet<>(Arrays.asList(4, 5, 6, 7, 8));

    System.out.println("Conjunto A: " + conjuntoA);
    System.out.println("Conjunto B: " + conjuntoB);

    // Unión (addAll)
    Set<Integer> union = new HashSet<>(conjuntoA);
    union.addAll(conjuntoB);
    System.out.println("\nUnión (A ∪ B): " + union);

    // Intersección (retainAll)
    Set<Integer> interseccion = new HashSet<>(conjuntoA);
    interseccion.retainAll(conjuntoB);
    System.out.println("Intersección (A ∩ B): " + interseccion);

    // Diferencia (removeAll)
    Set<Integer> diferencia = new HashSet<>(conjuntoA);
    diferencia.removeAll(conjuntoB);
    System.out.println("Diferencia (A - B): " + diferencia);

    // Diferencia simétrica
    Set<Integer> difSimetrica = new HashSet<>(conjuntoA);
    difSimetrica.addAll(conjuntoB);
    Set<Integer> temp = new HashSet<>(conjuntoA);
    temp.retainAll(conjuntoB);
    difSimetrica.removeAll(temp);
    System.out.println("Diferencia simétrica (A △ B): " + difSimetrica);

    // Subconjunto (containsAll)
    Set<Integer> subconjunto = new HashSet<>(Arrays.asList(2, 3));
    System.out.println("\n¿A contiene a {2,3}? " + conjuntoA.containsAll(subconjunto));
    System.out.println("¿{2,3} contiene a A? " + subconjunto.containsAll(conjuntoA));
    System.out.println();

    // =====================================================================
    // SECCIÓN 5: MÉTODOS ESPECÍFICOS DE CONJUNTOS
    // =====================================================================
    System.out.println("=== SECCIÓN 5: Métodos específicos ===");

    // remove(elemento) - Elimina elemento específico
    Set<String> frutas = new HashSet<>(Arrays.asList("Manzana", "Banana", "Naranja"));
    System.out.println("Conjunto inicial: " + frutas);
    frutas.remove("Banana");
    System.out.println("Después de remove('Banana'): " + frutas);

    // removeAll(colección) - Elimina múltiples elementos
    frutas.removeAll(Arrays.asList("Manzana", "Pera")); // "Pera" no existe, se ignora
    System.out.println("Después de removeAll([Manzana, Pera]): " + frutas);

    // retainAll(colección) - Mantiene solo elementos especificados
    Set<String> mantener = new HashSet<>(Arrays.asList("Naranja", "Uva"));
    frutas.retainAll(mantener);
    System.out.println("Después de retainAll([Naranja, Uva]): " + frutas);

    // clear() - Limpia el conjunto
    frutas.clear();
    System.out.println("Después de clear(): " + frutas);
    System.out.println("¿Está vacío? " + frutas.isEmpty());
    System.out.println();

    // =====================================================================
    // SECCIÓN 6: CONJUNTOS INMUTABLES (Java 9+)
    // =====================================================================
    System.out.println("=== SECCIÓN 6: Conjuntos inmutables ===");

    // Set.of - Crea conjunto inmutable
    Set<String> inmutable = Set.of("Rojo", "Verde", "Azul");
    System.out.println("Conjunto inmutable: " + inmutable);

    // Intento de modificación (lanzaría UnsupportedOperationException)
    // inmutable.add("Amarillo"); // ❌ No permitido

    // Conversión a mutable
    Set<String> mutable = new HashSet<>(inmutable);
    mutable.add("Amarillo");
    System.out.println("Conjunto mutable (después de añadir): " + mutable);
    System.out.println();

    // =====================================================================
    // SECCIÓN 7: ITERACIÓN Y OPERACIONES FUNCIONALES
    // =====================================================================
    System.out.println("=== SECCIÓN 7: Iteración y operaciones funcionales ===");

    Set<Integer> numeros = new HashSet<>(Arrays.asList(10, 20, 30, 40, 50));

    // Iteración tradicional
    System.out.println("Iteración con for-each:");
    for (Integer num : numeros) {
        System.out.print(num + " ");
    }
    System.out.println("\n");

    // forEach con lambda (Java 8+)
    System.out.println("Iteración con forEach:");
    numeros.forEach(n -> System.out.print(n + " "));
    System.out.println("\n");

    // Stream API - filtrado y transformación
    System.out.println("Números mayores que 25:");
    numeros.stream()
            .filter(n -> n > 25)
            .forEach(n -> System.out.print(n + " "));
    System.out.println("\n");

    // Stream API - suma
    int suma = numeros.stream().mapToInt(Integer::intValue).sum();
    System.out.println("Suma de todos los números: " + suma);
    System.out.println();

    // =====================================================================
    // SECCIÓN 8: CASOS PRÁCTICOS - ELIMINACIÓN DE DUPLICADOS
    // =====================================================================
    System.out.println("=== SECCIÓN 8: Caso práctico - Eliminación de duplicados ===");

    List<String> listaConDuplicados = Arrays.asList(
            "Ana", "Carlos", "Ana", "Beatriz", "Carlos", "David"
    );

    System.out.println("Lista original: " + listaConDuplicados);
    Set<String> sinDuplicados = new LinkedHashSet<>(listaConDuplicados);
    System.out.println("Sin duplicados (LinkedHashSet): " + sinDuplicados);
    System.out.println("Nota: LinkedHashSet mantiene orden de primera aparición");
    System.out.println();

    // =====================================================================
    // RESUMEN FINAL
    // =====================================================================
    System.out.println("=== RESUMEN DE MÉTODOS DE SET DEMOSTRADOS ===");
    System.out.println("• add(elemento)          : Añade elemento (ignora duplicados)");
    System.out.println("• remove(elemento)       : Elimina elemento específico");
    System.out.println("• contains(elemento)     : Verifica existencia");
    System.out.println("• size()                 : Número de elementos únicos");
    System.out.println("• isEmpty()              : Verifica si está vacío");
    System.out.println("• clear()                : Elimina todos los elementos");
    System.out.println("• addAll(colección)      : Añade múltiples elementos");
    System.out.println("• removeAll(colección)   : Elimina elementos especificados");
    System.out.println("• retainAll(colección)   : Mantiene solo elementos especificados");
    System.out.println("• containsAll(colección) : Verifica si contiene todos los elementos");
    System.out.println("• HashSet                : Sin orden garantizado, máximo rendimiento");
    System.out.println("• LinkedHashSet          : Mantiene orden de inserción");
    System.out.println("• TreeSet                : Ordena elementos automáticamente");
    System.out.println("• first()/last()         : Primer/último elemento (TreeSet)");
    System.out.println("• headSet()/tailSet()    : Subconjuntos (TreeSet)");
    System.out.println("• Set.of(...)            : Crea conjunto inmutable (Java 9+)");
    System.out.println("• forEach(consumidor)    : Iteración funcional (Java 8+)");
    System.out.println("• Stream API             : Operaciones avanzadas con streams");
    }
