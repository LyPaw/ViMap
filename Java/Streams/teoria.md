# Streams y Programacion Funcional

## Stream API

Secuencia de elementos sobre la que aplicar operaciones funcionales.

```java
Stream.of("a", "b", "c")
    .map(String::toUpperCase)
    .forEach(System.out::println);
```

## Creacion de Streams

```java
lista.stream();
Stream.of(1, 2, 3);
Arrays.stream(array);
IntStream.range(0, 10);
```

## Operaciones Intermedias

Devuelven un nuevo Stream (lazy).

- `filter(Predicate)`: filtra elementos
- `map(Function)`: transforma cada elemento
- `flatMap(Function)`: aplana streams anidados
- `sorted()`: ordena
- `distinct()`: elimina duplicados
- `limit(n)`: toma n elementos
- `peek(Consumer)`: inspecciona sin modificar

## Operaciones Terminales

Producen un resultado o efecto lateral.

- `collect(Collector)`: reduce a coleccion
- `forEach(Consumer)`: itera
- `count()`: cuenta elementos
- `reduce(BinaryOperator)`: reduce a un valor
- `anyMatch/allMatch/noneMatch(Predicate)`: tests
- `findFirst/findAny()`: obtiene elemento

## Collectors

```java
.collect(Collectors.toList())
.collect(Collectors.groupingBy(Persona::getCiudad))
.collect(Collectors.joining(", "))
```

## Optional

Contenedor que evita NullPointerException.

```java
Optional<String> nombre = Optional.ofNullable(null);
String resultado = nombre.orElse("default");
```
