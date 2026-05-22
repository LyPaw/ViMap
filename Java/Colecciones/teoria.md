# Colecciones en Java

## List

Ordenada, permite duplicados.

```java
List<String> lista = new ArrayList<>();
lista.add("A");
lista.get(0);
```

- **ArrayList**: acceso O(1), insercion lenta
- **LinkedList**: insercion O(1), acceso O(n)

## Set

Sin duplicados.

```java
Set<Integer> set = new HashSet<>();
set.add(1);
```

- **HashSet**: O(1), sin orden
- **TreeSet**: ordenado, O(log n)
- **LinkedHashSet**: orden de insercion

## Map

Clave-valor, claves unicas.

```java
Map<String,Integer> map = new HashMap<>();
map.put("Ana", 25);
map.get("Ana");
```

- **HashMap**: O(1)
- **TreeMap**: ordenado por clave
- **LinkedHashMap**: orden de insercion

## Stream API

Operaciones funcionales (Java 8+).

```java
List<String> filtrados = personas.stream()
    .filter(p -> p.getEdad() >= 18)
    .map(Persona::getNombre)
    .collect(Collectors.toList());
```

Intermedias: `filter`, `map`, `sorted`, `distinct`
Terminales: `collect`, `forEach`, `count`, `reduce`

## Lambdas

```java
list.forEach(item -> System.out.println(item));
list.sort((a,b) -> a.compareTo(b));
```
