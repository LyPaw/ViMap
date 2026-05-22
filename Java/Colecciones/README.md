# Colecciones en Java

## 1. El Java Collections Framework (JCF)

El JCF proporciona una arquitectura unificada para almacenar y manipular grupos de objetos. Incluye:

- **Interfaces**: tipos abstractos de colecciones (List, Set, Map, Queue)
- **Implementaciones**: clases concretas que implementan las interfaces
- **Algoritmos**: metodos estaticos en `Collections` para ordenar, buscar, mezclar

Jerarquia de interfaces principales:

```
Collection (interface raiz)
  ├── List (ordenada, permite duplicados)
  │   ├── ArrayList
  │   └── LinkedList
  ├── Set (sin duplicados)
  │   ├── HashSet
  │   ├── LinkedHashSet
  │   └── TreeSet
  └── Queue (cola FIFO)
      ├── LinkedList
      └── PriorityQueue

Map (clave-valor, NO hereda de Collection)
  ├── HashMap
  ├── LinkedHashMap
  └── TreeMap
```

## 2. List

Coleccion ordenada que permite elementos duplicados y acceso posicional.

### ArrayList

Basado en un array redimensionable. Acceso por indice O(1). Insercion/eliminacion en medio O(n).

```java
List<String> lista = new ArrayList<>();
lista.add("Java");
lista.add("Python");
lista.add("JavaScript");

// Acceso por indice
String lenguaje = lista.get(1);  // "Python"

// Iteracion
for (String s : lista) {
    System.out.println(s);
}

// Iteracion con indice
for (int i = 0; i < lista.size(); i++) {
    System.out.println(i + ": " + lista.get(i));
}

// Ordenacion natural
Collections.sort(lista);

// Ordenacion con comparador
lista.sort((a, b) -> a.length() - b.length());

// Busqueda binaria (requiere lista ordenada)
int pos = Collections.binarySearch(lista, "Java");
```

### LinkedList

Basado en una lista doblemente enlazada. Insercion/eliminacion en extremos O(1). Acceso por indice O(n).

```java
Queue<String> cola = new LinkedList<>();
cola.offer("Primero");
cola.offer("Segundo");
String primero = cola.poll();  // "Primero"

Deque<String> pila = new LinkedList<>();
pila.push("A");
pila.push("B");
String cima = pila.pop();  // "B"
```

## 3. Set

Coleccion que no permite elementos duplicados. La igualdad se determina mediante `equals()` y `hashCode()`.

### HashSet

Basado en una tabla hash. O(1) promedio para insercion, busqueda y eliminacion. Sin orden garantizado.

```java
Set<Integer> numeros = new HashSet<>();
numeros.add(10);
numeros.add(5);
numeros.add(10);  // ignorado
numeros.add(3);

System.out.println(numeros);  // orden arbitrario
```

### TreeSet

Basado en un TreeMap (arbol rojo-negro). Ordenado segun el orden natural o un Comparator. O(log n).

```java
Set<String> ordenado = new TreeSet<>();
ordenado.add("Carlos");
ordenado.add("Ana");
ordenado.add("Beatriz");
// "Ana", "Beatriz", "Carlos" - orden alfabetico

// Con comparador personalizado
Set<String> porLongitud = new TreeSet<>((a, b) -> a.length() - b.length());
```

### LinkedHashSet

Mantiene el orden de insercion. Rendimiento similar a HashSet.

```java
Set<String> ordenInsercion = new LinkedHashSet<>();
ordenInsercion.add("Primero");
ordenInsercion.add("Segundo");
ordenInsercion.add("Tercero");
// Mantiene: "Primero", "Segundo", "Tercero"
```

## 4. Map

Almacena pares clave-valor. Las claves son unicas.

### HashMap

O(1) promedio para insercion, busqueda y eliminacion.

```java
Map<String, Integer> edades = new HashMap<>();
edades.put("Ana", 28);
edades.put("Carlos", 35);
edades.put("Beatriz", 22);

// Recorrer entradas
for (Map.Entry<String, Integer> entrada : edades.entrySet()) {
    System.out.println(entrada.getKey() + " -> " + entrada.getValue());
}

// getOrDefault: valor por defecto si no existe
int edad = edades.getOrDefault("David", 0);

// computeIfAbsent: calcula valor solo si ausente
edades.computeIfAbsent("Elena", k -> 30);

// Merge: combina valores existentes
edades.merge("Ana", 1, Integer::sum);

// Contar frecuencias de palabras
String texto = "hola mundo hola java hola mundo";
Map<String, Integer> frecuencias = new HashMap<>();
for (String palabra : texto.split(" ")) {
    frecuencias.merge(palabra, 1, Integer::sum);
}
System.out.println(frecuencias);  // {hola=3, mundo=2, java=1}
```

### TreeMap

Ordenado por clave. O(log n).

```java
Map<String, Double> productos = new TreeMap<>();
productos.put("Zapatillas", 89.95);
productos.put("Camiseta", 29.99);
productos.put("Pantalon", 49.99);
// Ordenado alfabeticamente por clave
```

### ConcurrentHashMap

HashMap thread-safe para uso en entornos concurrentes. No permite null como clave ni valor.

```java
Map<String, Integer> concurrente = new ConcurrentHashMap<>();
concurrente.put("clave", 1);
concurrente.computeIfAbsent("otra", k -> calcularValor(k));
```

## 5. Stream API (Java 8+)

Los streams permiten procesar colecciones de forma declarativa, similar a las operaciones funcionales.

### Creacion de Streams

```java
// Desde una coleccion
lista.stream();

// Desde valores
Stream.of("a", "b", "c");

// Desde un array
Arrays.stream(array);

// Rangos numericos
IntStream.range(0, 10);
LongStream.rangeClosed(1, 100);

// Stream infinito
Stream.generate(Math::random).limit(5);
Stream.iterate(0, n -> n + 2).limit(10);
```

### Operaciones Intermedias (devolucion Stream)

| Operacion | Descripcion | Ejemplo |
|-----------|-------------|---------|
| `filter(Predicate)` | Filtra elementos | `filter(p -> p.getEdad() > 18)` |
| `map(Function)` | Transforma cada elemento | `map(Persona::getNombre)` |
| `flatMap(Function)` | Aplana streams anidados | `flatMap(lista -> lista.stream())` |
| `sorted()` | Ordena naturalmente | `sorted()` |
| `sorted(Comparator)` | Ordena con comparador | `sorted((a,b) -> b - a)` |
| `distinct()` | Elimina duplicados | `distinct()` |
| `limit(long)` | Toma n elementos | `limit(5)` |
| `skip(long)` | Salta n elementos | `skip(2)` |
| `peek(Consumer)` | Inspecciona sin modificar | `peek(System.out::println)` |

### Operaciones Terminales (producen resultado)

| Operacion | Descripcion | Ejemplo |
|-----------|-------------|---------|
| `collect(Collector)` | Reduce a coleccion | `collect(toList())` |
| `forEach(Consumer)` | Itera | `forEach(System.out::println)` |
| `count()` | Cuenta | `count()` |
| `reduce(BinaryOperator)` | Reduce a un valor | `reduce(0, Integer::sum)` |
| `anyMatch(Predicate)` | Alguno cumple | `anyMatch(p -> p > 5)` |
| `allMatch(Predicate)` | Todos cumplen | `allMatch(p -> p > 0)` |
| `noneMatch(Predicate)` | Ninguno cumple | `noneMatch(p -> p < 0)` |
| `findFirst()` | Primer elemento | `findFirst()` |
| `findAny()` | Cualquier elemento | `findAny()` |
| `toArray()` | A array | `toArray()` |

### Collectors

```java
// A lista
.collect(Collectors.toList())

// A set
.collect(Collectors.toSet())

// A mapa
.collect(Collectors.toMap(Persona::getId, Function.identity()))

// Agrupar
.collect(Collectors.groupingBy(Persona::getCiudad))

// Particionar
.collect(Collectors.partitioningBy(p -> p.getEdad() >= 18))

// Joining
.collect(Collectors.joining(", "))

// Sumarizar
.collect(Collectors.summingInt(Persona::getEdad))
.collect(Collectors.averagingDouble(Producto::getPrecio))
```

## 6. Optional

Contenedor que puede o no contener un valor, eliminando los NullPointerException.

```java
public Optional<String> buscarNombre(int id) {
    if (id > 0) return Optional.of("Nombre encontrado");
    else return Optional.empty();
}

Optional<String> resultado = buscarNombre(1);
String nombre = resultado.orElse("default");
String nombre2 = resultado.orElseGet(() -> calcularDefault());
resultado.ifPresent(System.out::println);
resultado.orElseThrow(() -> new RuntimeException("No encontrado"));
```
