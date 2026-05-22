# JPA - Java Persistence API

## Conceptos fundamentales

JPA es la especificacion estandar de Java para el mapeo objeto-relacional (ORM).

### ORM (Object-Relational Mapping)

El ORM permite mapear automaticamente las tablas de la base de datos a objetos Java y viceversa, eliminando la necesidad de escribir SQL manual.

### Implementaciones de JPA

-   **Hibernate**: la implementacion mas popular y completa.
-   **EclipseLink**: implementacion de referencia (JPA 3.0).
-   **OpenJPA**: implementacion Apache.

### Anotaciones principales de JPA

-   `@Entity`: marca una clase como entidad persistente.
-   `@Table`: especifica la tabla asociada.
-   `@Id`: marca la clave primaria.
-   `@GeneratedValue`: genera el valor de la clave automaticamente.
-   `@Column`: mapea un atributo a una columna.
-   `@OneToMany`, `@ManyToOne`, `@OneToOne`, `@ManyToMany`: relaciones.
-   `@JoinColumn`: especifica la columna de join.
-   `@Transient`: marca un campo como no persistente.

### EntityManager

El `EntityManager` es la interfaz principal para operaciones de persistencia:

-   `persist()`: inserta un nuevo objeto en la BD.
-   `find()`: busca por clave primaria.
-   `merge()`: actualiza un objeto existente.
-   `remove()`: elimina un objeto.
-   `createQuery()`: ejecuta JPQL (Java Persistence Query Language).

### JPQL

JPQL es un lenguaje de consulta orientado a objetos similar a SQL pero trabaja con objetos Java en lugar de tablas.

## Ejercicios propuestos

1.  Configura una entidad `Producto` con JPA y Hibernate. Crea un CRUD completo.
2.  Define una relacion @OneToMany entre `Categoria` y `Producto`. Inserta y consulta datos.
3.  Escribe una consulta JPQL que obtenga todos los productos con precio mayor a un valor dado.
4.  Implementa una busqueda paginada usando `setFirstResult()` y `setMaxResults()`.
5.  Anade validacion con Bean Validation (@NotNull, @Size, @Min) a las entidades JPA.
