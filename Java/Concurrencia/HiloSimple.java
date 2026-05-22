package concurrencia;

class MiHilo extends Thread {
    private String nombre;
    public MiHilo(String nombre) { this.nombre = nombre; }
    @Override
    public void run() {
        for (int i = 1; i <= 5; i++) {
            System.out.println(nombre + " - iteracion " + i);
            try { Thread.sleep((long)(Math.random() * 500)); }
            catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        }
    }
}

class TareaRunnable implements Runnable {
    private String id;
    public TareaRunnable(String id) { this.id = id; }
    @Override
    public void run() {
        System.out.println("Tarea " + id + " en " + Thread.currentThread().getName());
    }
}

public class HiloSimple {
    public static void main(String[] args) throws InterruptedException {
        MiHilo h1 = new MiHilo("Hilo-1");
        MiHilo h2 = new MiHilo("Hilo-2");
        h1.start(); h2.start();

        Thread h3 = new Thread(new TareaRunnable("R-1"));
        Thread h4 = new Thread(new TareaRunnable("R-2"));
        h3.start(); h4.start();

        h1.join(); h2.join(); h3.join(); h4.join();
        System.out.println("Todos los hilos terminaron.");
    }
}
