package servicios.hilos;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class PoolHilos {
    public static void main(String[] args) throws InterruptedException, ExecutionException {
        ExecutorService executor = Executors.newFixedThreadPool(4);

        System.out.println("Procesando tareas con CompletableFuture...\n");

        var futuros = IntStream.rangeClosed(1, 8)
            .mapToObj(i -> CompletableFuture.supplyAsync(() -> {
                String nombre = Thread.currentThread().getName();
                int tiempo = (int) (Math.random() * 1000) + 200;
                try {
                    Thread.sleep(tiempo);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
                String resultado = "Tarea-" + i + " ejecutada en " + nombre +
                    " (" + tiempo + "ms)";
                return resultado;
            }, executor))
            .collect(Collectors.toList());

        CompletableFuture<Void> todas = CompletableFuture.allOf(
            futuros.toArray(new CompletableFuture[0]));

        todas.thenRun(() -> System.out.println("\nTodas las tareas completadas!")).get();

        for (var fut : futuros) {
            System.out.println(fut.get());
        }

        executor.shutdown();
        executor.awaitTermination(5, TimeUnit.SECONDS);
        System.out.println("\nPool de hilos finalizado.");
    }
}
