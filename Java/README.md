# Java - Programacion Backend (1º y 2º DAM)

Este directorio agrupa el temario completo de las asignaturas de **Programacion** (1º curso) y **Programacion de Servicios y Procesos** (2º curso) del ciclo DAM.

## Estructura de carpetas

| Carpeta | Asignatura | Contenido |
|---------|-----------|-----------|
| `POO/` | Programacion | Clases, objetos, herencia, polimorfismo, interfaces, encapsulacion, SOLID |
| `Colecciones/` | Programacion | List, Set, Map, Stream API, lambdas, expresiones funcionales |
| `Concurrencia/` | Prog. Servicios y Procesos | Threads, ExecutorService, sincronizacion, locks, productor-consumidor |
| `Streams/` | Programacion | Operaciones funcionales, filtros, map, reduce, Optional, collectors |
| `Sockets/` | Prog. Servicios y Procesos | TCP/UDP, ServerSocket, Socket, chat multi-cliente, protocolo HTTP |
| `Testing/` | Programacion | JUnit 5, aserciones, TDD, excepciones, cobertura |

## Mapa de dependencias entre modulos

Cada carpeta contiene un `README.md` con la teoria extendida y archivos `.java` con codigo funcional listo para compilar y ejecutar. Los ejemplos estan diseñados para ser autocontenidos: cada uno tiene su propio `main` y no requiere dependencias externas (salvo JUnit 5 para Testing).

## Requisitos para compilar

- Java 21+ (aunque la mayoria del codigo funciona desde Java 8)
- JUnit 5 (solo para la carpeta Testing)
- Ninguna dependencia externa para POO, Colecciones, Concurrencia, Streams, Sockets

Para compilar un ejemplo individual desde la raiz del proyecto:

```
javac Java/POO/Persona.java
java Java.POO.Persona
```

O usando el `pom.xml` de la carpeta `Xml/` con Maven:
```
cd Xml
mvn compile exec:java -Dexec.mainClass="poo.Persona"
```
