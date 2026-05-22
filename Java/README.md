# Java - Programacion Backend (1o y 2o DAM)

Este directorio agrupa el temario completo de las asignaturas de Programacion (1er curso) y Programacion de Servicios y Procesos (2o curso) del ciclo DAM.

## Estructura de carpetas

La carpeta POO cubre los fundamentos de la programacion orientada a objetos: clases, objetos, herencia, polimorfismo, interfaces, encapsulacion y los principios SOLID. Los archivos Java en esta carpeta muestran ejemplos de cada concepto, incluyendo una clase Persona con encapsulacion, una clase Empleado que hereda de Persona, una demostracion de polimorfismo con animales, y un ejemplo de interfaces con voladores y nadadores.

La carpeta Colecciones aborda el Java Collections Framework: las interfaces List, Set y Map con sus implementaciones principales ArrayList, LinkedList, HashSet, TreeSet, LinkedHashSet, HashMap y TreeMap, asi como la Stream API de Java 8 y las expresiones lambda. Los ejemplos incluyen operaciones basicas con ArrayList, mapas de frecuencias con HashMap, y filtros con Stream.

La carpeta Concurrencia corresponde a la asignatura de segundo curso Programacion de Servicios y Procesos. Explica la creacion de hilos mediante Thread y Runnable, el framework Executors con pools de hilos, la sincronizacion con synchronized y locks, la comunicacion entre hilos con wait y notify, el patron productor-consumidor, y CompletableFuture para programacion asincrona. Incluye ejemplos de hilos simples, un buffer compartido con productor y consumidor, y un ejecutor con tareas Callable.

La carpeta Streams profundiza en la programacion funcional: el API de Streams con operaciones intermedias como filter, map, flatMap, sorted, distinct, limit y skip, y operaciones terminales como collect, reduce, forEach, count, anyMatch y findFirst. Incluye tambien el manejo de Optional para evitar null pointers y el uso de Collectors para agrupar, particionar y resumir datos.

La carpeta Sockets, tambien de segundo curso, cubre la programacion de redes con TCP. Explica los fundamentos de sockets, la creacion de servidores con ServerSocket, clientes con Socket, la atencion multi-cliente con pools de hilos, un servidor de chat que difunde mensajes a todos los clientes conectados, y la construccion manual de peticiones HTTP. Incluye ejemplos de un servidor de eco, un cliente de eco, un chat multiusuario y su cliente correspondiente.

La carpeta Testing cubre las pruebas unitarias con JUnit 5. Explica las anotaciones del ciclo de vida, las aserciones principales, los tests parametrizados, el ciclo TDD de rojo-verde-refactor, el uso de mocks con Mockito y las metricas de cobertura de codigo. Incluye una calculadora como sistema bajo prueba y su conjunto de tests correspondiente.

## Mapa de dependencias entre modulos

Cada carpeta contiene un archivo README.md con la teoria extendida y archivos con extension .java con codigo funcional listo para compilar y ejecutar. Los ejemplos estan disenados para ser autocontenidos: cada uno tiene su propio metodo main y no requiere dependencias externas, salvo JUnit 5 para la carpeta Testing.

## Requisitos para compilar

Se requiere Java 21 o superior, aunque la mayoria del codigo funciona desde Java 8. Solo la carpeta Testing necesita JUnit 5 como dependencia externa. Los modulos de POO, Colecciones, Concurrencia, Streams y Sockets no requieren ninguna biblioteca adicional.

Para compilar un ejemplo individual desde la raiz del proyecto se puede usar el comando javac seguido de la ruta del archivo, y luego java con el nombre completo de la clase incluyendo el paquete. Tambien es posible usar Maven con el pom.xml ubicado en la carpeta Xml, que incluye todas las dependencias necesarias como JUnit 5, MySQL Connector, Hibernate y Jakarta Persistence.
