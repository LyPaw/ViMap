import java.util.*;

public class Array_List {
    public static void main(String[] args) {
        Random rand = new Random();

        // =====================================================================
        // SECCIÓN 1: CREACIÓN Y ADICIÓN BÁSICA DE ELEMENTOS (método add)
        // =====================================================================
        System.out.println("=== SECCIÓN 1: Creación y adición básica de elementos ===");
        ArrayList<String> nombres = new ArrayList<>();
        nombres.add("Juanito");
        nombres.add("Pedro");
        nombres.add("Maria");
        nombres.add("Jose");
        nombres.add("Juanito");
        nombres.add("Pedro");
        nombres.add("Manuel");

        System.out.println("Lista inicial de nombres: " + nombres);
        System.out.println("Cantidad de elementos: " + nombres.size());
        System.out.println();

        // =====================================================================
        // SECCIÓN 2: INSERCIÓN EN POSICIÓN ESPECÍFICA (método add con índice)
        // =====================================================================
        System.out.println("=== SECCIÓN 2: Inserción en posición específica ===");
        // Insertamos "Nicolas" en la posición 5 (índice 5)
        // Los elementos desde esa posición se desplazan hacia la derecha
        nombres.add(5, "Nicolas");
        System.out.println("Lista después de insertar 'Nicolas' en posición 5: " + nombres);
        System.out.println("Verificación: posición 5 = '" + nombres.get(5) + "', posición 6 = '" + nombres.get(6) + "'");
        System.out.println();

        // =====================================================================
        // SECCIÓN 3: LIMPIEZA DE LISTA (método clear)
        // =====================================================================
        System.out.println("=== SECCIÓN 3: Limpieza completa de la lista ===");
        nombres.clear();
        System.out.println("Lista después de clear(): " + nombres);
        System.out.println("¿La lista está vacía? " + nombres.isEmpty());
        System.out.println();

        // =====================================================================
        // SECCIÓN 4: VERIFICACIÓN DE EXISTENCIA (método contains)
        // =====================================================================
        System.out.println("=== SECCIÓN 4: Verificación de existencia de elementos ===");
        ArrayList<Integer> numeros = new ArrayList<>();
        numeros.add(5);
        numeros.add(1);
        numeros.add(3);

        System.out.println("Lista de números: " + numeros);
        System.out.println("¿Contiene el número 4? " + numeros.contains(4));
        System.out.println("¿Contiene el número 5? " + numeros.contains(5));
        System.out.println();

        // =====================================================================
        // SECCIÓN 5: ACCESO POR ÍNDICE (método get)
        // =====================================================================
        System.out.println("=== SECCIÓN 5: Acceso a elementos por índice ===");
        System.out.println("Elemento en posición 0: " + numeros.get(0));
        System.out.println("Elemento en posición 2: " + numeros.get(2));
        System.out.println("Total de elementos: " + numeros.size());
        System.out.println();

        // =====================================================================
        // SECCIÓN 6: VERIFICACIÓN DE LISTA VACÍA (método isEmpty)
        // =====================================================================
        System.out.println("=== SECCIÓN 6: Verificación de lista vacía ===");
        ArrayList<String> listaVacia = new ArrayList<>();
        System.out.println("Lista vacía: " + listaVacia);
        System.out.println("¿Está vacía? " + listaVacia.isEmpty());

        listaVacia.add("Elemento temporal");
        System.out.println("Después de agregar un elemento: " + listaVacia);
        System.out.println("¿Está vacía? " + listaVacia.isEmpty());
        System.out.println();

        // =====================================================================
        // SECCIÓN 7: ÚLTIMA OCURRENCIA DE UN ELEMENTO (método lastIndexOf)
        // =====================================================================
        System.out.println("=== SECCIÓN 7: Última posición de un elemento ===");
        ArrayList<String> nombresRepetidos = new ArrayList<>();
        nombresRepetidos.add("Juanito");
        nombresRepetidos.add("Pedro");
        nombresRepetidos.add("Juanito");  // Duplicado para demostrar lastIndexOf
        nombresRepetidos.add("Maria");

        System.out.println("Lista con duplicados: " + nombresRepetidos);
        System.out.println("Primera posición de 'Juanito': " + nombresRepetidos.indexOf("Juanito"));
        System.out.println("Última posición de 'Juanito': " + nombresRepetidos.lastIndexOf("Juanito"));
        System.out.println();

        // =====================================================================
        // SECCIÓN 8: ELIMINACIÓN POR ÍNDICE (método remove con índice)
        // =====================================================================
        System.out.println("=== SECCIÓN 8: Eliminación por índice ===");
        System.out.println("Lista original de números: " + numeros);
        System.out.println("Eliminando elemento en posición 0 (valor: " + numeros.get(0) + ")");
        numeros.remove(0);
        System.out.println("Lista después de remove(0): " + numeros);
        System.out.println();

        // =====================================================================
        // SECCIÓN 9: ELIMINACIÓN POR VALOR (método remove con objeto)
        // =====================================================================
        System.out.println("=== SECCIÓN 9: Eliminación por valor ===");
        ArrayList<String> listaNombres = new ArrayList<>();
        listaNombres.add("Manuel");
        listaNombres.add("Juanito");
        listaNombres.add("Pedro");
        listaNombres.add("Manuel");  // Duplicado para demostrar eliminación

        System.out.println("Lista antes de remove('Manuel'): " + listaNombres);
        System.out.println("Eliminando PRIMERA ocurrencia de 'Manuel'");
        listaNombres.remove("Manuel");
        System.out.println("Lista después de remove('Manuel'): " + listaNombres);
        System.out.println();

        // =====================================================================
        // SECCIÓN 10: REEMPLAZO DE ELEMENTO (método set)
        // =====================================================================
        System.out.println("=== SECCIÓN 10: Reemplazo de elemento en posición específica ===");
        ArrayList<String> listaParaModificar = new ArrayList<>();
        listaParaModificar.add("Manuel");
        listaParaModificar.add("Juanito");
        listaParaModificar.add("Pedro");
        listaParaModificar.add("Jose");

        System.out.println("Lista original: " + listaParaModificar);
        System.out.println("Reemplazando elemento en posición 2 ('" + listaParaModificar.get(2) + "') por 'Luis'");
        listaParaModificar.set(2, "Luis");
        System.out.println("Lista modificada: " + listaParaModificar);
        System.out.println();

        // =====================================================================
        // SECCIÓN 11: OBTENCIÓN DE TAMAÑO (método size)
        // =====================================================================
        System.out.println("=== SECCIÓN 11: Obtención del tamaño de la lista ===");
        System.out.println("Lista actual: " + listaParaModificar);
        System.out.println("Número de elementos: " + listaParaModificar.size());
        System.out.println();

        // =====================================================================
        // SECCIÓN 12: LISTAS INMUTABLES Y CONVERSIÓN A MUTABLES
        // =====================================================================
        System.out.println("=== SECCIÓN 12: Listas inmutables y conversión ===");

        // Creación de lista inmutable (Java 9+)
        List<String> listaInmutable = List.of("Manuel", "Pedro", "Ana");
        System.out.println("Lista inmutable: " + listaInmutable);
        System.out.println("¿Es modificable? Intentando add() -> UnsupportedOperationException esperado");

        // Conversión a lista mutable para permitir modificaciones
        List<Integer> listaInmutableNumeros = List.of(5, 1, 3);
        System.out.println("\nLista inmutable de números: " + listaInmutableNumeros);

        // Creación de nueva ArrayList a partir de la inmutable
        List<Integer> listaMutable = new ArrayList<>(listaInmutableNumeros);
        listaMutable.add(4);  // Operación permitida en lista mutable
        System.out.println("Lista mutable (después de agregar 4): " + listaMutable);
        System.out.println();

        // =====================================================================
        // SECCIÓN 13: CLONACIÓN DE LISTAS (método clone)
        // =====================================================================
        System.out.println("=== SECCIÓN 13: Clonación de listas ===");
        ArrayList<String> original = new ArrayList<>();
        original.add("Madrid");
        original.add("Barcelona");
        original.add("Valencia");

        // Clonar la lista (nota: devuelve Object, requiere casting)
        ArrayList<String> clon = (ArrayList<String>) original.clone();

        System.out.println("Lista original: " + original);
        System.out.println("Lista clonada: " + clon);

        // Modificamos la lista original
        original.add("Sevilla");
        System.out.println("\nDespués de modificar la original:");
        System.out.println("Lista original: " + original);
        System.out.println("Lista clonada: " + clon);
        System.out.println("¿Son iguales? " + original.equals(clon));
        System.out.println();

        // =====================================================================
        // SECCIÓN 14: ADICIÓN DE MÚLTIPLES ELEMENTOS (método addAll)
        // =====================================================================
        System.out.println("=== SECCIÓN 14: Adición de múltiples elementos ===");
        ArrayList<String> ciudades1 = new ArrayList<>();
        ciudades1.add("Madrid");
        ciudades1.add("Barcelona");

        ArrayList<String> ciudades2 = new ArrayList<>();
        ciudades2.add("Valencia");
        ciudades2.add("Sevilla");

        System.out.println("Lista 1 (ciudades1): " + ciudades1);
        System.out.println("Lista 2 (ciudades2): " + ciudades2);

        // Añadir todos los elementos de ciudades2 al final de ciudades1
        ciudades1.addAll(ciudades2);
        System.out.println("\nDespués de addAll(ciudades2) en ciudades1: " + ciudades1);

        // Añadir elementos de otra lista en una posición específica
        ArrayList<String> ciudades3 = new ArrayList<>();
        ciudades3.add("Bilbao");
        ciudades3.add("Zaragoza");

        ciudades1.addAll(1, ciudades3); // Inserta en la posición 1
        System.out.println("Después de addAll(1, ciudades3): " + ciudades1);
        System.out.println();

        // =====================================================================
        // SECCIÓN 15: OPERACIÓN DE INTERSECCIÓN (método retainAll)
        // =====================================================================
        System.out.println("=== SECCIÓN 15: Operación de intersección ===");
        ArrayList<String> listaA = new ArrayList<>(Arrays.asList("Madrid", "Barcelona", "Valencia", "Sevilla"));
        ArrayList<String> listaB = new ArrayList<>(Arrays.asList("Barcelona", "Sevilla", "Bilbao", "Zaragoza"));

        System.out.println("Lista A: " + listaA);
        System.out.println("Lista B: " + listaB);

        // Mantener solo los elementos comunes
        listaA.retainAll(listaB);
        System.out.println("\nDespués de retainAll(listaB) en listaA: " + listaA);
        System.out.println("Elementos comunes: " + listaA);
        System.out.println();

        // =====================================================================
        // SECCIÓN 16: OPERACIÓN DE DIFERENCIA (método removeAll)
        // =====================================================================
        System.out.println("=== SECCIÓN 16: Operación de diferencia ===");
        ArrayList<String> listaC = new ArrayList<>(Arrays.asList("Madrid", "Barcelona", "Valencia", "Sevilla"));
        ArrayList<String> listaD = new ArrayList<>(Arrays.asList("Barcelona", "Sevilla", "Bilbao", "Zaragoza"));

        System.out.println("Lista C: " + listaC);
        System.out.println("Lista D: " + listaD);

        // Eliminar elementos presentes en listaD de listaC
        listaC.removeAll(listaD);
        System.out.println("\nDespués de removeAll(listaD) en listaC: " + listaC);
        System.out.println("Elementos restantes en listaC: " + listaC);
        System.out.println();

        // =====================================================================
        // SECCIÓN 17: ORDENAMIENTO (sort y reverseOrder)
        // =====================================================================
        System.out.println("=== SECCIÓN 17: Ordenamiento de listas ===");
        ArrayList<Integer> numerosOrdenar = new ArrayList<>(Arrays.asList(5, 3, 1, 4, 2));

        System.out.println("Lista original: " + numerosOrdenar);

        // Ordenamiento ascendente
        Collections.sort(numerosOrdenar);
        System.out.println("Orden ascendente: " + numerosOrdenar);

        // Ordenamiento descendente
        Collections.sort(numerosOrdenar, Collections.reverseOrder());
        System.out.println("Orden descendente: " + numerosOrdenar);
        System.out.println();

        // =====================================================================
        // SECCIÓN 18: BÚSQUEDA BINARIA (binarySearch)
        // =====================================================================
        System.out.println("=== SECCIÓN 18: Búsqueda binaria ===");
        // La lista debe estar ordenada para usar binarySearch
        ArrayList<Integer> numerosBinaria = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5));

        System.out.println("Lista ordenada: " + numerosBinaria);
        System.out.println("Posición de 3: " + Collections.binarySearch(numerosBinaria, 3));
        System.out.println("Posición de 6: " + Collections.binarySearch(numerosBinaria, 6));

        // Para Strings
        ArrayList<String> palabras = new ArrayList<>(Arrays.asList("apple", "banana", "cherry", "date"));
        Collections.sort(palabras);
        System.out.println("\nLista de palabras ordenada: " + palabras);
        System.out.println("Posición de 'cherry': " + Collections.binarySearch(palabras, "cherry"));
        System.out.println();

        // =====================================================================
        // SECCIÓN 19: INVERSIÓN DE LISTA (reverse)
        // =====================================================================
        System.out.println("=== SECCIÓN 19: Inversión de lista ===");
        ArrayList<String> listaInversa = new ArrayList<>(Arrays.asList("A", "B", "C", "D"));
        System.out.println("Lista original: " + listaInversa);

        Collections.reverse(listaInversa);
        System.out.println("Lista invertida: " + listaInversa);
        System.out.println();

        // =====================================================================
        // SECCIÓN 20: BARAJEO DE LISTA (shuffle)
        // =====================================================================
        System.out.println("=== SECCIÓN 20: Barajeo de lista ===");
        ArrayList<String> listaBarajar = new ArrayList<>(Arrays.asList("1", "2", "3", "4", "5"));
        System.out.println("Lista original: " + listaBarajar);

        Collections.shuffle(listaBarajar);
        System.out.println("Lista barajada: " + listaBarajar);
        System.out.println();

        // =====================================================================
        // SECCIÓN 21: BARAJEO CON SEMILLA (shuffle con Random)
        // =====================================================================
        System.out.println("=== SECCIÓN 21: Barajeo con semilla ===");
        ArrayList<String> listaBarajarSemilla = new ArrayList<>(Arrays.asList("1", "2", "3", "4", "5"));
        System.out.println("Lista original: " + listaBarajarSemilla);

        // Usando una semilla fija para reproducibilidad
        Collections.shuffle(listaBarajarSemilla, new Random(42));
        System.out.println("Lista barajada (semilla 42): " + listaBarajarSemilla);

        // Si usamos la misma semilla, el resultado será idéntico
        ArrayList<String> listaBarajarSemilla2 = new ArrayList<>(Arrays.asList("1", "2", "3", "4", "5"));
        Collections.shuffle(listaBarajarSemilla2, new Random(42));
        System.out.println("Segunda lista barajada (semilla 42): " + listaBarajarSemilla2);
        System.out.println();

        // =====================================================================
        // SECCIÓN 22: COPIA DE LISTAS (copy)
        // =====================================================================
        System.out.println("=== SECCIÓN 22: Copia de listas ===");
        ArrayList<String> origen = new ArrayList<>(Arrays.asList("A", "B", "C"));
        ArrayList<String> destino = new ArrayList<>(Arrays.asList("X", "Y", "Z"));

        System.out.println("Lista origen: " + origen);
        System.out.println("Lista destino: " + destino);

        // Realiza una copia superficial de los elementos
        Collections.copy(destino, origen);
        System.out.println("\nDespués de copy:");
        System.out.println("Lista destino: " + destino);
        System.out.println("Nota: Requiere que ambas listas tengan el mismo tamaño");
        System.out.println();

        // =====================================================================
        // SECCIÓN 23: CREACIÓN DE LISTAS CON MÚLTIPLES COPIAS (nCopies)
        // =====================================================================
        System.out.println("=== SECCIÓN 23: Creación de listas con múltiples copias ===");
        List<String> cincoCopias = Collections.nCopies(5, "Hola");
        System.out.println("5 copias de 'Hola': " + cincoCopias);
        System.out.println("¿Es inmutable? " + cincoCopias );
        System.out.println();

        // =====================================================================
        // SECCIÓN 24: LLENADO DE LISTA (fill)
        // =====================================================================
        System.out.println("=== SECCIÓN 24: Llenado de lista ===");
        ArrayList<String> listaLlenar = new ArrayList<>(Arrays.asList("1", "2", "3"));
        System.out.println("Lista original: " + listaLlenar);

        Collections.fill(listaLlenar, "X");
        System.out.println("Lista después de fill(): " + listaLlenar);
        System.out.println();

        // =====================================================================
        // SECCIÓN 25: MÁXIMO Y MÍNIMO (max y min)
        // =====================================================================
        System.out.println("=== SECCIÓN 25: Máximo y mínimo ===");
        ArrayList<Integer> numerosExtremos = new ArrayList<>(Arrays.asList(5, 31, 4, 2));
        System.out.println("Lista: " + numerosExtremos);

        System.out.println("Máximo: " + Collections.max(numerosExtremos));
        System.out.println("Mínimo: " + Collections.min(numerosExtremos));

        // Con Comparator (ejemplo de orden inverso)
        System.out.println("Máximo (orden inverso): " + Collections.max(numerosExtremos, Collections.reverseOrder()));
        System.out.println("Mínimo (orden inverso): " + Collections.min(numerosExtremos, Collections.reverseOrder()));
        System.out.println();

        // =====================================================================
        // SECCIÓN 26: CONJUNTOS DISJUNTOS (disjoint)
        // =====================================================================
        System.out.println("=== SECCIÓN 26: Conjuntos disjuntos ===");
        ArrayList<String> lista1 = new ArrayList<>(Arrays.asList("A", "B", "C"));
        ArrayList<String> lista2 = new ArrayList<>(Arrays.asList("D", "E", "F"));
        ArrayList<String> lista3 = new ArrayList<>(Arrays.asList("B", "E", "G"));

        System.out.println("Lista 1: " + lista1);
        System.out.println("Lista 2: " + lista2);
        System.out.println("Lista 3: " + lista3);

        System.out.println("\n¿Son disjuntos lista1 y lista2? " + Collections.disjoint(lista1, lista2));
        System.out.println("¿Son disjuntos lista1 y lista3? " + Collections.disjoint(lista1, lista3));
        System.out.println();

        // =====================================================================
        // SECCIÓN 27: FRECUENCIA DE ELEMENTOS (frequency)
        // =====================================================================
        System.out.println("=== SECCIÓN 27: Frecuencia de elementos ===");
        ArrayList<String> listaFrecuencia = new ArrayList<>(Arrays.asList("A", "B", "A", "C", "A", "B"));
        System.out.println("Lista: " + listaFrecuencia);

        System.out.println("Frecuencia de 'A': " + Collections.frequency(listaFrecuencia, "A"));
        System.out.println("Frecuencia de 'B': " + Collections.frequency(listaFrecuencia, "B"));
        System.out.println("Frecuencia de 'Z': " + Collections.frequency(listaFrecuencia, "Z"));
        System.out.println();

        // =====================================================================
        // RESUMEN FINAL
        // =====================================================================
        System.out.println("=== RESUMEN DE MÉTODOS DEMOSTRADOS ===");
        System.out.println("• add(elemento)          : Añade al final de la lista");
        System.out.println("• add(índice, elemento)  : Inserta en posición específica");
        System.out.println("• clear()                : Elimina todos los elementos");
        System.out.println("• contains(elemento)     : Verifica existencia");
        System.out.println("• get(índice)            : Obtiene elemento por posición");
        System.out.println("• isEmpty()              : Verifica si está vacía");
        System.out.println("• lastIndexOf(elemento)  : Última posición de un elemento");
        System.out.println("• remove(índice)         : Elimina por posición");
        System.out.println("• remove(elemento)       : Elimina primera ocurrencia");
        System.out.println("• set(índice, elemento)  : Reemplaza elemento existente");
        System.out.println("• size()                 : Retorna cantidad de elementos");
        System.out.println("• List.of(...)           : Crea lista inmutable (Java 9+)");
        System.out.println("• clone()                : Crea una copia superficial de la lista");
        System.out.println("• addAll(collection)     : Añade todos los elementos de otra colección");
        System.out.println("• retainAll(collection)  : Mantiene solo los elementos comunes (intersección)");
        System.out.println("• removeAll(collection)  : Elimina los elementos presentes en otra colección (diferencia)");
        System.out.println("• sort()                 : Ordena ascendente");
        System.out.println("• sort(reverseOrder)     : Ordena descendente");
        System.out.println("• binarySearch()         : Búsqueda binaria en lista ordenada");
        System.out.println("• reverse()              : Invierte el orden de la lista");
        System.out.println("• shuffle()              : Baraja los elementos aleatoriamente");
        System.out.println("• copy()                 : Copia elementos entre listas");
        System.out.println("• nCopies()              : Crea lista inmutable con n copias");
        System.out.println("• fill()                 : Llena la lista con un valor");
        System.out.println("• max()/min()            : Obtiene máximo/mínimo elemento");
        System.out.println("• disjoint()             : Verifica si dos colecciones son disjuntas");
        System.out.println("• frequency()            : Cuenta ocurrencias de un elemento");
    }
}
