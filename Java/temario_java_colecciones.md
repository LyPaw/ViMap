# Colecciones en Java

## Collections Framework

Jerarquia de interfaces e implementaciones para almacenar y manipular grupos de objetos.

## List

Coleccion ordenada que permite duplicados.

```java
List<String> lista = new ArrayList<>();
lista.add("A");
lista.add("B");
String item = lista.get(0);
```

- **ArrayList**: basado en array, acceso O(1), insercion lenta
- **LinkedList**: basado en nodos enlazados, insercion O(1), acceso O(n)

## Set

Coleccion sin duplicados.

```java
Set<Integer> conjunto = new HashSet<>();
conjunto.add(1);
conjunto.add(1);  // ignorado
```

- **HashSet**: basado en hash table, orden no garantizado
- **TreeSet**: ordenado (TreeMap), O(log n)
- **LinkedHashSet**: orden de insercion

## Map

Pares clave-valor, claves unicas.

```java
Map<String, Integer> edades = new HashMap<>();
edades.put("Ana", 25);
int edad = edades.get("Ana");
```

- **HashMap**: O(1) promedio
- **TreeMap**: ordenado por clave
- **LinkedHashMap**: orden de insercion

## Stream API

Operaciones funcionales sobre colecciones (Java 8+).

```java
List<String> filtrados = personas.stream()
    .filter(p -> p.getEdad() >= 18)
    .map(Persona::getNombre)
    .collect(Collectors.toList());
```

Operaciones:
- Intermedias: `filter`, `map`, `sorted`, `distinct`, `limit`
- Terminales: `collect`, `forEach`, `count`, `reduce`, `anyMatch`

## Lambdas

Funciones anonimas para comportamiento parametrizable.

```java
list.forEach(item -> System.out.println(item));
list.sort((a, b) -> a.compareTo(b));
```
