# Concurrencia en Java

## Threads

```java
class MiHilo extends Thread {
    public void run() { /* tarea */ }
}
new MiHilo().start();

new Thread(() -> System.out.println("Hilo")).start();
```

## Executors

Pool de hilos.

```java
ExecutorService pool = Executors.newFixedThreadPool(4);
pool.submit(() -> tarea());
pool.shutdown();
```

- `newFixedThreadPool(n)`: n fijos
- `newCachedThreadPool()`: dinamicos
- `newSingleThreadExecutor()`: un hilo

## Sincronizacion

```java
class Contador {
    private int valor;
    public synchronized void incrementar() { valor++; }
}
```

- `synchronized` (metodo/bloque)
- `ReentrantLock`
- `AtomicInteger`

## wait / notify

```java
synchronized (lock) {
    while (!condicion) lock.wait();
    lock.notifyAll();
}
```

## CompletableFuture

```java
CompletableFuture.supplyAsync(() -> "Hola")
    .thenApply(String::toUpperCase)
    .thenAccept(System.out::println);
```

## Problemas

- Deadlock: espera circular
- Race condition: orden impredecible
- Starvation: recurso nunca concedido
