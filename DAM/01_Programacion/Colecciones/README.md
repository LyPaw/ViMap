# Colecciones en Java

## Material de Estudio

El temario oficial completo de este modulo esta disponible en el siguiente archivo PDF local:

- [Temario: Colecciones (PDF)](../temario_colecciones.pdf)

## Java Collections Framework

El framework de colecciones proporciona arquitecturas unificadas para almacenar y manipular grupos de objetos.

### Listas (List)

-   **ArrayList**: implementacion basada en array redimensionable. Acceso O(1), insercion/eliminacion O(n).
-   **LinkedList**: implementacion basada en lista doblemente enlazada. Insercion/eliminacion O(1), acceso O(n).

### Conjuntos (Set)

-   **HashSet**: basado en tabla hash. Sin orden, sin duplicados. Operaciones O(1).
-   **TreeSet**: basado en arbol rojo-negro. Ordenado naturalmente. Operaciones O(log n).
-   **LinkedHashSet**: mantiene orden de insercion.

### Mapas (Map)

-   **HashMap**: tabla hash. Clave-valor. Operaciones O(1).
-   **TreeMap**: arbol rojo-negro. Claves ordenadas. Operaciones O(log n).
-   **LinkedHashMap**: mantiene orden de insercion.

### Metodos comunes

-   `add()`, `remove()`, `contains()`, `size()`, `isEmpty()`
-   `iterator()`, `forEach()` (lambda)
-   `stream()` para programacion funcional con Stream API

## Ejercicios propuestos

1.  Crea un programa que lea una lista de palabras y cuente cuantas veces aparece cada una usando un HashMap.
2.  Implementa un sistema de cola de impresion usando LinkedList como Queue.
3.  Usa un TreeSet para almacenar numeros aleatorios y mostrarlos ordenados sin duplicados.
4.  Dadas dos listas de enteros, encuentra los elementos comunes y los que estan solo en una de ellas.
5.  Implementa una agenda telefonica usando HashMap donde la clave sea el nombre y el valor el telefono.
