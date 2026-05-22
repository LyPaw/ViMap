# Base de Datos MySQL y Acceso a Datos (1o y 2o DAM)

Este directorio cubre dos asignaturas del ciclo: Bases de Datos de primer curso y Acceso a Datos de segundo curso. La primera se centra en el diseno y manipulacion de bases de datos relacionales con SQL, mientras que la segunda aborda la persistencia desde Java mediante JPA y Hibernate.

## Estructura

La carpeta contiene tres scripts SQL que cubren todo el espectro de la asignatura de Bases de Datos. esquema_biblioteca.sql incluye la creacion completa del esquema con tablas, claves foraneas, indices, triggers, eventos y datos iniciales. consultas_avanzadas.sql contiene subconsultas, CTEs con la clausula WITH, funciones de ventana con OVER, vistas con CREATE VIEW, expresiones CASE, e indices compuestos. triggers_procedimientos.sql incluye procedimientos almacenados con parametros de entrada y salida, funciones que devuelven valores escalares, y triggers con logica condicional compleja.

La subcarpeta JPA contiene las entidades Java con anotaciones Jakarta Persistence que mapean las tablas de la base de datos biblioteca. Incluye las clases Usuario, Autor, Libro, Prestamo con sus relaciones OneToMany, ManyToOne y Enumerated, ademas de un MainJPA que demuestra el ciclo completo de persistencia: insercion de datos, confirmacion de transaccion, consultas JPQL con JOIN FETCH y manejo de excepciones.

## Diseno de Bases de Datos

El modelo Entidad-Relacion es la tecnica fundamental para el diseno conceptual de bases de datos. Las entidades representan objetos del mundo real con existencia propia, como Usuario, Libro o Pedido. Los atributos son las propiedades de esas entidades, como nombre, precio o fecha. Las relaciones son asociaciones entre entidades y pueden ser de varios tipos: uno a uno, donde una entidad se relaciona con exactamente otra; uno a muchos, donde una entidad se relaciona con varias; y muchos a muchos, donde varias entidades se relacionan con varias. Las relaciones muchos a muchos requieren una tabla intermedia para su implementacion en el modelo relacional.

La transformacion del modelo Entidad-Relacion al modelo relacional sigue reglas precisas. Cada entidad se convierte en una tabla. Los atributos se convierten en columnas. La clave primaria es el identificador unico de cada fila. Las relaciones uno a muchos se modelan agregando una clave foranea en la tabla del lado muchos que referencia a la tabla del lado uno. Las relaciones muchos a muchos requieren una tabla intermedia que contiene las claves foraneas de ambas tablas relacionadas.

## Normalizacion

La normalizacion es un proceso para eliminar redundancias y anomalias en el diseno de bases de datos. La primera forma normal exige que cada columna contenga valores atomicos e indivisibles, prohibiendo listas o conjuntos en una misma celda. La segunda forma normal, que solo aplica a tablas con clave primaria compuesta, requiere que cada columna no clave dependa de la clave primaria completa y no solo de una parte de ella. La tercera forma normal exige que las columnas no clave dependan directamente de la clave primaria y no de otras columnas no clave, eliminando las dependencias transitivas. Cumplir la tercera forma normal generalmente es suficiente para la mayoria de aplicaciones empresariales.

## Integridad Referencial

Las claves foraneas, definidas con FOREIGN KEY, garantizan la integridad referencial de la base de datos: no pueden existir referencias a filas que no existen. Las acciones referenciales determinan que ocurre cuando se elimina o actualiza la fila padre. ON DELETE CASCADE elimina automaticamente las filas hijas. ON DELETE RESTRICT impide eliminar si existen referencias. ON DELETE SET NULL pone a NULL la clave foranea en las filas hijas. ON DELETE NO ACTION es similar a RESTRICT en MySQL.

## JPA y Hibernate

JPA, Jakarta Persistence API, es el estandar de Java para el mapeo objeto-relacional. Las entidades son clases Java anotadas con Entity que se corresponden con tablas de la base de datos. Cada instancia de la entidad representa una fila de la tabla. La anotacion Table especifica la tabla, Id marca la clave primaria, GeneratedValue define la estrategia de generacion de identificadores, y Column personaliza el mapeo de columnas.

Las relaciones entre entidades se mapean con anotaciones especificas. OneToMany y ManyToOne modelan relaciones uno a muchos y muchos a uno, siendo la segunda el lado propietario de la relacion que contiene la clave foranea con JoinColumn. OneToOne modela relaciones uno a uno. ManyToMany modela relaciones muchos a muchos, requiriendo JoinTable para la tabla intermedia. Cascade determina que operaciones en la entidad padre se propagan a las hijas, como persist, merge o remove. Fetch define la estrategia de carga: LAZY carga los datos solo cuando se accede a ellos, mientras que EAGER los carga inmediatamente.

El EntityManager es la interfaz principal para interactuar con la base de datos. persist inserta una nueva entidad. find busca por clave primaria. merge actualiza una entidad existente o inserta si no existe. remove elimina la entidad. createQuery permite escribir consultas JPQL, que son similares a SQL pero trabajan con objetos y sus atributos en lugar de tablas y columnas. El ciclo de vida de una entidad incluye los estados new o no gestionada, managed o gestionada dentro de una transaccion, detached o separada cuando la transaccion ha terminado, y removed o eliminada.
