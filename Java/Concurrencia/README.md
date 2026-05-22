# Concurrencia en Java

## 1. Conceptos fundamentales

Un **proceso** es un programa en ejecucion con su propio espacio de memoria. Un **hilo** (thread) es una unidad de ejecucion dentro de un proceso; los hilos comparten la memoria del proceso.

La concurrencia permite que varios hilos ejecuten tareas de forma simultanea, mejorando el rendimiento en sistemas multicore y la capacidad de respuesta en aplicaciones interactivas.

## 2. Creacion de hilos

### Mediante extension de Thread

```java
class MiHilo extends Thread {
    private String nombre;

    public MiHilo(String nombre) {
        this.nombre = nombre;
    }

    @Override
    public void run() {
        for (int i = 1; i <= 5; i++) {
            System.out.println(nombre + " - iteracion " + i);
            try {
                Thread.sleep((long)(Math.random() * 1000));
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return;
            }
        }
        System.out.println(nombre + " termino");
    }
}

// Uso
MiHilo hilo = new MiHilo("Hilo-1");
hilo.start();  // NO llamar a run() directamente
```

### Mediante Runnable

```java
class Tarea implements Runnable {
    private String id;

    public Tarea(String id) {
        this.id = id;
    }

    @Override
    public void run() {
        System.out.println("Tarea " + id + " ejecutada por "
            + Thread.currentThread().getName());
    }
}

Thread hilo = new Thread(new Tarea("A"));
hilo.start();
```

### Mediante lambda (Java 8+)

```java
Thread hilo = new Thread(() -> {
    System.out.println("Hilo desde lambda");
});
hilo.start();
```

## 3. Ciclo de vida de un hilo

```
NUEVO → RUNNABLE → RUNNING → BLOQUEADO/WAITING → RUNNABLE → TERMINADO
```

- **NUEVO**: creado con `new Thread()`
- **RUNNABLE**: listo para ejecutar tras `start()`
- **RUNNING**: el planificador le asigna la CPU
- **BLOQUEADO/WAITING**: esperando recurso, `sleep()`, `wait()`, `join()`
- **TERMINADO**: `run()` finaliza o se lanza excepcion no capturada

## 4. Metodos importantes

```java
hilo.start();          // Inicia la ejecucion
hilo.join();           // Espera a que el hilo termine
hilo.join(1000);       // Espera maximo 1 segundo
Thread.sleep(500);     // Pausa el hilo actual 500ms
Thread.yield();        // Sugiere ceder la CPU
hilo.interrupt();      // Interrumpe el hilo
hilo.isAlive();        // Comprueba si esta vivo
hilo.setPriority(10);  // Prioridad (1-10)
```

## 5. Sincronizacion

Cuando varios hilos acceden a datos compartidos pueden producirse **condiciones de carrera** (race conditions). La sincronizacion garantiza la exclusion mutua.

### Metodo synchronized

```java
public class Contador {
    private int valor = 0;

    public synchronized void incrementar() {
        valor++;
    }

    public synchronized int getValor() {
        return valor;
    }
}
```

### Bloque synchronized

```java
public void metodo() {
    // codigo no sincronizado
    synchronized (this) {
        // seccion critica
        valor++;
    }
}
```

### Lock explícito (java.util.concurrent.locks)

```java
public class ContadorLock {
    private int valor = 0;
    private final Lock lock = new ReentrantLock();

    public void incrementar() {
        lock.lock();
        try {
            valor++;
        } finally {
            lock.unlock();
        }
    }
}
```

### ReentrantLock con tryLock

```java
if (lock.tryLock(100, TimeUnit.MILLISECONDS)) {
    try {
        // recurso adquirido
    } finally {
        lock.unlock();
    }
} else {
    System.out.println("No se pudo adquirir el lock");
}
```

### ReadWriteLock

Permite multiples lectores simultaneos pero escritura exclusiva.

```java
private final ReadWriteLock rwLock = new ReentrantReadWriteLock();

public void leer() {
    rwLock.readLock().lock();
    try { /* lectura */ }
    finally { rwLock.readLock().unlock(); }
}

public void escribir() {
    rwLock.writeLock().lock();
    try { /* escritura */ }
    finally { rwLock.writeLock().unlock(); }
}
```

## 6. Comunicacion entre hilos: wait / notify

```java
class Buffer {
    private Queue<Integer> cola = new LinkedList<>();
    private int capacidad;

    public Buffer(int capacidad) {
        this.capacidad = capacidad;
    }

    public synchronized void producir(int valor) throws InterruptedException {
        while (cola.size() == capacidad) {
            wait();  // espera hasta que haya espacio
        }
        cola.offer(valor);
        System.out.println("Producido: " + valor + " [tamanio: " + cola.size() + "]");
        notifyAll();  // despierta a los consumidores
    }

    public synchronized int consumir() throws InterruptedException {
        while (cola.isEmpty()) {
            wait();  // espera hasta que haya elementos
        }
        int valor = cola.poll();
        System.out.println("Consumido: " + valor + " [tamanio: " + cola.size() + "]");
        notifyAll();  // despierta a los productores
        return valor;
    }
}
```

## 7. Executors (Java 5+)

El framework Executors abstrae la gestion de hilos, proporcionando pools reutilizables.

### Tipos de pools

```java
ExecutorService pool = Executors.newFixedThreadPool(4);      // 4 hilos fijos
ExecutorService pool = Executors.newCachedThreadPool();       // dinamico
ExecutorService pool = Executors.newSingleThreadExecutor();   // un hilo
ScheduledExecutorService pool = Executors.newScheduledThreadPool(2); // programado
```

### ExecutorService con Callable y Future

```java
class TareaSuma implements Callable<Integer> {
    private int inicio, fin;

    public TareaSuma(int inicio, int fin) {
        this.inicio = inicio;
        this.fin = fin;
    }

    @Override
    public Integer call() {
        int suma = 0;
        for (int i = inicio; i <= fin; i++) {
            suma += i;
        }
        return suma;
    }
}

ExecutorService exec = Executors.newFixedThreadPool(4);

List<Future<Integer>> futuros = new ArrayList<>();
futuros.add(exec.submit(new TareaSuma(1, 100)));
futuros.add(exec.submit(new TareaSuma(101, 200)));
futuros.add(exec.submit(new TareaSuma(201, 300)));

int total = 0;
for (Future<Integer> f : futuros) {
    total += f.get();  // bloquea hasta obtener resultado
}
exec.shutdown();
```

### ExecutorService con invokeAll

```java
List<Callable<String>> tareas = Arrays.asList(
    () -> { Thread.sleep(100); return "A"; },
    () -> { Thread.sleep(50);  return "B"; },
    () -> { Thread.sleep(200); return "C"; }
);

List<Future<String>> resultados = exec.invokeAll(tareas);
```

### ExecutorService con invokeAny (devuelve el primero en terminar)

```java
String primero = exec.invokeAny(tareas);
```

### ScheduledExecutorService

```java
ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2);
scheduler.schedule(() -> System.out.println("Una vez"), 5, TimeUnit.SECONDS);
scheduler.scheduleAtFixedRate(
    () -> System.out.println("Cada 2 seg"),
    0, 2, TimeUnit.SECONDS);
```

## 8. Colecciones concurrentes

```java
ConcurrentHashMap<String, Integer> mapa = new ConcurrentHashMap<>();
CopyOnWriteArrayList<String> lista = new CopyOnWriteArrayList<>();
ConcurrentLinkedQueue<String> cola = new ConcurrentLinkedQueue<>();
BlockingQueue<Integer> bloqueante = new ArrayBlockingQueue<>(10);
```

## 9. CompletableFuture (Java 8+)

Programacion asincrona con callbacks.

```java
CompletableFuture.supplyAsync(() -> {
    // tarea pesada
    return "resultado";
}).thenApply(String::toUpperCase)
  .thenAccept(System.out::println)
  .exceptionally(ex -> {
      System.err.println("Error: " + ex.getMessage());
      return null;
  });

// Combinar futuros
CompletableFuture<String> futuro1 = CompletableFuture.supplyAsync(() -> "Hola");
CompletableFuture<String> futuro2 = CompletableFuture.supplyAsync(() -> "Mundo");

futuro1.thenCombine(futuro2, (a, b) -> a + " " + b)
       .thenAccept(System.out::println);

// Esperar multiples futuros
CompletableFuture.allOf(futuro1, futuro2).join();
```

## 10. Problemas comunes

### Deadlock

Dos o mas hilos se bloquean mutuamente esperando recursos que el otro posee.

```java
// EJEMPLO DE DEADLOCK
final Object recursoA = new Object();
final Object recursoB = new Object();

new Thread(() -> {
    synchronized (recursoA) {
        Thread.sleep(100); // forzar condicion de carrera
        synchronized (recursoB) { /* ... */ }
    }
}).start();

new Thread(() -> {
    synchronized (recursoB) {
        Thread.sleep(100);
        synchronized (recursoA) { /* ... */ }
    }
}).start();
```

### Race condition

El resultado depende del orden no determinista de ejecucion de los hilos.

### Starvation

Un hilo nunca obtiene el recurso porque otros hilos lo acaparan.

### Liveness

El sistema no progresa a pesar de no haber deadlock.
