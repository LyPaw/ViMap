package concurrencia;

import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

class TareaCalculo implements Callable<Integer> {
    private int inicio;
    private int fin;

    public TareaCalculo(int inicio, int fin) {
        this.inicio = inicio;
        this.fin = fin;
    }

    @Override
    public Integer call() {
        int suma = 0;
        for (int i = inicio; i <= fin; i++) {
            suma += i;
            try {
                Thread.sleep(10);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return -1;
            }
        }
        System.out.println(Thread.currentThread().getName() +
            " sumo de " + inicio + " a " + fin + " = " + suma);
        return suma;
    }
}

public class ExecutorEjemplo {
    public static void main(String[] args) throws InterruptedException, ExecutionException {
        ExecutorService executor = Executors.newFixedThreadPool(3);

        Callable<Integer> tarea1 = new TareaCalculo(1, 100);
        Callable<Integer> tarea2 = new TareaCalculo(101, 200);
        Callable<Integer> tarea3 = new TareaCalculo(201, 300);
        Callable<Integer> tarea4 = new TareaCalculo(301, 400);

        Future<Integer> resultado1 = executor.submit(tarea1);
        Future<Integer> resultado2 = executor.submit(tarea2);
        Future<Integer> resultado3 = executor.submit(tarea3);
        Future<Integer> resultado4 = executor.submit(tarea4);

        int sumaTotal = resultado1.get() + resultado2.get() + resultado3.get() + resultado4.get();
        System.out.println("\nSuma total del 1 al 400: " + sumaTotal);

        executor.shutdown();
        executor.awaitTermination(5, TimeUnit.SECONDS);
        System.out.println("Executor finalizado.");
    }
}
