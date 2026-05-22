## Material de Estudio

El temario oficial completo de este modulo esta disponible en el siguiente archivo PDF local:

- [Temario: Hilos (PDF)](../temario_hilos.pdf)

# Programacion de Servicios y Procesos - Hilos

## Conceptos avanzados de hilos

### Ciclo de vida de un hilo

1.  **Nuevo (New)**: creado con `new Thread()` pero no iniciado.
2.  **Ejecutable (Runnable)**: tras llamar a `start()`, listo para ejecutar.
3.  **En ejecucion (Running)**: cuando la CPU le asigna tiempo.
4.  **Bloqueado (Blocked)**: esperando un recurso o monitor.
5.  **En espera (Waiting)**: esperando notificacion de otro hilo.
6.  **Terminado (Terminated)**: cuando `run()` finaliza.

### Sincronizacion avanzada

-   **ReentrantLock**: Lock reentrante con capacidad de interrupcion y tiempo de espera.
-   **ReadWriteLock**: permite multiples lectores simultaneos pero escritor exclusivo.
-   **Semaphore**: controla acceso a recurso con N permisos.
-   **CountDownLatch**: espera a que N operaciones se completen.
-   **CyclicBarrier**: punto de encuentro donde N hilos se sincronizan.
-   **Phaser**: fase de sincronizacion reutilizable.

### Colecciones concurrentes

-   `ConcurrentHashMap`: HashMap thread-safe sin bloqueo total.
-   `CopyOnWriteArrayList`: lista thread-safe optimizada para lectura.
-   `BlockingQueue`: cola thread-safe que bloquea en operaciones de insercion/extraccion.
-   `ConcurrentLinkedQueue`: cola thread-safe no bloqueante.

### ExecutorService

-   `Executors.newFixedThreadPool(int n)`: pool con n hilos fijos.
-   `Executors.newCachedThreadPool()`: pool que crea/elimina hilos segun demanda.
-   `Executors.newSingleThreadExecutor()`: un unico hilo.
-   `Executors.newScheduledThreadPool(int n)`: para tareas programadas.

### CompletableFuture (Java 8+)

Programacion asincrona encadenada:

```java
CompletableFuture.supplyAsync(() -> "Hola")
    .thenApply(String::toUpperCase)
    .thenAccept(System.out::println);
```

## Ejercicios propuestos

1.  Implementa un pipeline de procesamiento con varias etapas conectadas por BlockingQueue.
2.  Usa CountDownLatch para sincronizar el inicio de N hilos simultaneamente.
3.  Implementa un pool de conexiones thread-safe usando Semaphore.
4.  Usa CompletableFuture para hacer llamadas a una API simulada y combinar resultados.
5.  Implementa un servicio de backup periodico usando ScheduledExecutorService.

