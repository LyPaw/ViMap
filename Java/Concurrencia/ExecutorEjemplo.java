package concurrencia;

import java.util.concurrent.*;

class TareaSuma implements Callable<Integer> {
    private int inicio, fin;
    public TareaSuma(int inicio, int fin) { this.inicio = inicio; this.fin = fin; }
    @Override
    public Integer call() {
        int suma = 0;
        for (int i = inicio; i <= fin; i++) suma += i;
        System.out.println(Thread.currentThread().getName() + " sumo " + inicio + "-" + fin + " = " + suma);
        return suma;
    }
}

public class ExecutorEjemplo {
    public static void main(String[] args) throws Exception {
        ExecutorService exec = Executors.newFixedThreadPool(4);
        Future<Integer> f1 = exec.submit(new TareaSuma(1, 100));
        Future<Integer> f2 = exec.submit(new TareaSuma(101, 200));
        Future<Integer> f3 = exec.submit(new TareaSuma(201, 300));
        Future<Integer> f4 = exec.submit(new TareaSuma(301, 400));
        int total = f1.get() + f2.get() + f3.get() + f4.get();
        System.out.println("Suma total: " + total);
        exec.shutdown();
    }
}
