# Concurrencia en Java

## Threads

Unidad basica de ejecucion concurrente.

```java
// Con Thread
class MiHilo extends Thread {
    public void run() {
        System.out.println("Hilo ejecutandose");
    }
}
new MiHilo().start();

// Con Runnable
new Thread(() -> System.out.println("Lambda")).start();
```

## Executors

Framework para gestionar pools de hilos (java.util.concurrent).

```java
ExecutorService pool = Executors.newFixedThreadPool(4);
pool.submit(() -> tareaPesada());
pool.shutdown();
```

Tipos:
- `newFixedThreadPool(n)`: n hilos fijos
- `newCachedThreadPool()`: hilos dinamicos
- `newSingleThreadExecutor()``: un solo hilo

## Sincronizacion

Protege datos compartidos del acceso concurrente.

```java
class Contador {
    private int valor;
    public synchronized void incrementar() { valor++; }
}
```

Mecanismos:
- `synchronized` (metodo o bloque)
- `Lock` / `ReentrantLock`
- `AtomicInteger`, `AtomicBoolean`

## wait / notify

Comunicacion entre hilos.

```java
synchronized (lock) {
    while (!condicion) lock.wait();
    // recurso disponible
    lock.notifyAll();
}
```

## CompletableFuture

Programacion asincrona con callbacks (Java 8+).

```java
CompletableFuture.supplyAsync(() -> "Hola")
    .thenApply(String::toUpperCase)
    .thenAccept(System.out::println);
```

## Problemas comunes

- **Deadlock**: hilos esperando recursos del otro
- **Race condition**: resultado depende del orden de ejecucion
- **Starvation**: un hilo nunca obtiene el recurso
- **Liveness**: el sistema no progresa
