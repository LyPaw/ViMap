# Streams y Programacion Funcional

## 1. Introduccion a la programacion funcional en Java

Java 8 introdujo las expresiones lambda y la Stream API, permitiendo un estilo de programacion funcional donde las operaciones se expresan de forma declarativa en lugar de imperativa.

**Paradigma imperativo (como):**
```java
List<String> resultado = new ArrayList<>();
for (Persona p : personas) {
    if (p.getEdad() > 18) {
        resultado.add(p.getNombre().toUpperCase());
    }
}
```

**Paradigma funcional (que):**
```java
List<String> resultado = personas.stream()
    .filter(p -> p.getEdad() > 18)
    .map(p -> p.getNombre().toUpperCase())
    .collect(Collectors.toList());
```

## 2. Expresiones lambda

Una lambda es una funcion anonima que puede ser tratada como un valor.

```java
// Sintaxis: (parametros) -> { cuerpo }
(argumentos) -> expresion
(argumentos) -> { sentencias; }

// Ejemplos
(int a, int b) -> a + b
(String s) -> s.length()
() -> System.out.println("Hola")
x -> x * 2
```

### Interfaces funcionales

Una interfaz funcional tiene exactamente un metodo abstracto.

```java
@FunctionalInterface
interface Operacion {
    int aplicar(int a, int b);
}

Operacion suma = (a, b) -> a + b;
Operacion resta = (a, b) -> a - b;

System.out.println(suma.aplicar(5, 3));  // 8
```

### Interfaces funcionales principales en java.util.function

| Interfaz | Metodo | Recibe | Devuelve |
|----------|--------|--------|----------|
| `Function<T,R>` | `R apply(T)` | T | R |
| `Predicate<T>` | `boolean test(T)` | T | boolean |
| `Consumer<T>` | `void accept(T)` | T | void |
| `Supplier<T>` | `T get()` | - | T |
| `UnaryOperator<T>` | `T apply(T)` | T | T |
| `BinaryOperator<T>` | `T apply(T, T)` | T, T | T |

```java
Function<String, Integer> longitud = String::length;
Predicate<Integer> esPar = n -> n % 2 == 0;
Consumer<String> imprimir = System.out::println;
Supplier<Double> aleatorio = Math::random;
UnaryOperator<Integer> cuadrado = n -> n * n;
BinaryOperator<Integer> maximo = Integer::max;
```

## 3. Method References

Forma abreviada de escribir lambdas cuando ya existe un metodo que hace lo necesario.

```java
// Lambda
s -> System.out.println(s)
// Method reference
System.out::println

// Lambda
p -> p.getNombre()
// Method reference
Persona::getNombre

// Lambda
(a, b) -> a.compareToIgnoreCase(b)
// Method reference
String::compareToIgnoreCase

// Constructor
() -> new ArrayList<>()
ArrayList::new
```

## 4. Stream API en profundidad

### Pipeline de operaciones

Un stream se compone de tres partes:
1. **Fuente**: origen de datos (coleccion, array, generador)
2. **Operaciones intermedias**: transforman el stream (0..N)
3. **Operacion terminal**: produce el resultado

Las operaciones intermedias son **lazy**: no se ejecutan hasta que se invoca una operacion terminal.

### Operaciones intermedias detalladas

```java
// filter: selecciona elementos que cumplen un predicado
Stream.of(1, 2, 3, 4, 5, 6)
    .filter(n -> n % 2 == 0)           // 2, 4, 6

// map: transforma cada elemento
Stream.of("a", "b", "c")
    .map(String::toUpperCase)           // "A", "B", "C"

// flatMap: aplana streams anidados
List<List<String>> anidado = Arrays.asList(
    Arrays.asList("a", "b"),
    Arrays.asList("c", "d")
);
anidado.stream()
    .flatMap(List::stream)              // "a", "b", "c", "d"

// distinct: elimina duplicados (usa equals/hashCode)
Stream.of(1, 1, 2, 2, 3).distinct()    // 1, 2, 3

// sorted: ordena
Stream.of(3, 1, 2).sorted()            // 1, 2, 3
Stream.of("z", "a", "m").sorted(Comparator.reverseOrder()) // "z", "m", "a"

// limit: limita el numero de elementos
Stream.iterate(0, n -> n + 1).limit(5) // 0, 1, 2, 3, 4

// skip: salta n elementos
Stream.of(1, 2, 3, 4, 5).skip(2)      // 3, 4, 5

// peek: para depuracion, ejecuta accion sin modificar
Stream.of("a", "b")
    .peek(System.out::println)
    .map(String::toUpperCase)
    .forEach(System.out::println);
```

### Operaciones terminales detalladas

```java
// collect: convierte a coleccion
List<String> lista = stream.collect(Collectors.toList());
Set<String> set = stream.collect(Collectors.toSet());
Map<Integer, String> mapa = stream.collect(
    Collectors.toMap(Persona::getId, Persona::getNombre));

// reduce: combina elementos en un solo valor
int suma = Stream.of(1, 2, 3, 4, 5)
    .reduce(0, Integer::sum);           // 15
Optional<String> concat = Stream.of("a", "b", "c")
    .reduce((a, b) -> a + b);           // "abc"

// forEach: ejecuta para cada elemento
Stream.of("a", "b").forEach(System.out::println);

// count: cuenta elementos
long total = stream.count();

// anyMatch/allMatch/noneMatch: tests booleanos
boolean hayMayor = personas.stream().anyMatch(p -> p.getEdad() > 18);
boolean todosAdultos = personas.stream().allMatch(p -> p.getEdad() >= 18);

// findFirst/findAny: obtiene un elemento
Optional<Persona> primero = personas.stream().findFirst();
```

### Collectors avanzados

```java
// groupingBy: agrupar por clave
Map<String, List<Persona>> porCiudad = personas.stream()
    .collect(Collectors.groupingBy(Persona::getCiudad));

// groupingBy con downstream collector
Map<String, Long> conteoPorCiudad = personas.stream()
    .collect(Collectors.groupingBy(
        Persona::getCiudad,
        Collectors.counting()
    ));

Map<String, Double> mediaPorCiudad = personas.stream()
    .collect(Collectors.groupingBy(
        Persona::getCiudad,
        Collectors.averagingInt(Persona::getEdad)
    ));

// partitioningBy: particiona en true/false
Map<Boolean, List<Persona>> mayoresYMenores = personas.stream()
    .collect(Collectors.partitioningBy(p -> p.getEdad() >= 18));

// mapping: transforma antes de recolectar
List<String> nombres = personas.stream()
    .collect(Collectors.mapping(Persona::getNombre, Collectors.toList()));

// summarizing: estadisticas
IntSummaryStatistics stats = personas.stream()
    .collect(Collectors.summarizingInt(Persona::getEdad));
System.out.println("Media: " + stats.getAverage());
System.out.println("Max: " + stats.getMax());
```

## 5. Optional en profundidad

```java
Optional<String> opt = Optional.of("valor");
Optional<String> optNull = Optional.ofNullable(podriaSerNull);
Optional<String> vacio = Optional.empty();

// Map con Optional
Optional<Integer> longitud = opt.map(String::length);

// FlatMap con Optional (evita Optional<Optional>)
Optional<String> resultado = opt.flatMap(valor -> Optional.of(valor.toUpperCase()));

// Filter
Optional<String> largo = opt.filter(s -> s.length() > 3);

// OrElse
String valor = opt.orElse("default");
String valor2 = opt.orElseGet(() -> computarDefault());
String valor3 = opt.orElseThrow(() -> new RuntimeException("No presente"));

// IfPresent
opt.ifPresent(v -> System.out.println("Valor: " + v));

// IfPresentOrElse (Java 9+)
opt.ifPresentOrElse(
    v -> System.out.println("Valor: " + v),
    () -> System.out.println("No presente")
);
```

## 6. Streams paralelos

Los streams paralelos dividen la carga entre multiples hilos.

```java
lista.parallelStream()
    .filter(p -> p.getEdad() > 18)
    .forEach(System.out::println);

// O convertir un stream secuencial a paralelo
lista.stream()
    .parallel()
    .map(tareaPesada())
    .sequential()  // volver a secuencial
    .collect(Collectors.toList());
```

**Precauciones con streams paralelos:**
- No usar con operaciones con estado (como `limit()`, `findFirst()` puede ser costoso)
- El orden de procesamiento no esta garantizado
- Solo beneficia para colecciones grandes y operaciones costosas
- El `forEachOrdered()` preserva el orden si es necesario
