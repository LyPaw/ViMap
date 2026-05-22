# Concurrencia en Java

## Conceptos fundamentales

1.  **Hilo (Thread)**: unidad basica de ejecucion. Un programa puede tener varios hilos ejecutandose concurrentemente.
2.  **Proceso vs Hilo**: los procesos tienen memoria independiente; los hilos comparten memoria del mismo proceso.
3.  **Concurrencia vs Paralelismo**: concurrencia es la ejecucion aparentemente simultanea (intercalada). Paralelismo es ejecucion real simultanea (multi-core).

## Creacion de hilos

-   Extendiendo `Thread` y sobrescribiendo `run()`.
-   Implementando `Runnable` y pasandolo a un `Thread`.
-   Implementando `Callable` (devuelve resultado) con `FutureTask`.
-   Usando `ExecutorService` para pools de hilos.

## Sincronizacion

-   **synchronized**: bloquea el acceso a un metodo o bloque para un solo hilo.
-   **wait() / notify() / notifyAll()**: coordinacion entre hilos (modelo productor-consumidor).
-   **Lock / ReentrantLock**: alternativa mas flexible a synchronized.
-   **Semaphore**: controla el acceso a un recurso con un contador de permisos.

## Problemas comunes

-   **Race condition**: dos hilos acceden y modifican datos compartidos simultaneamente.
-   **Deadlock**: dos hilos se bloquean mutuamente esperando recursos.
-   **Starvation**: un hilo no consigue acceso al recurso porque otros lo acaparan.
-   **Liveness**: el sistema progresa correctamente (ausencia de deadlocks y starvation).

## Clases utiles en java.util.concurrent

-   `ExecutorService`, `Executors`, `Callable`, `Future`
-   `ConcurrentHashMap`, `CopyOnWriteArrayList`
-   `CountDownLatch`, `CyclicBarrier`, `Semaphore`
-   `BlockingQueue` (usada en productor-consumidor)

## Ejercicios propuestos

1.  Implementa un reloj digital que muestre la hora actual y se actualice cada segundo usando un hilo.
2.  Crea dos hilos: uno que genere numeros pares y otro que genere impares, sincronizando la salida.
3.  Simula una carrera de 5 corredores usando hilos. Muestra el orden de llegada.
4.  Implementa el problema del productor-consumidor con un buffer de tamanio fijo.
5.  Usa un ExecutorService con un pool de 3 hilos para procesar 10 tareas.
