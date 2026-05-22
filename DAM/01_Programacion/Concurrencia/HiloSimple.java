package concurrencia;

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
                Thread.sleep((long) (Math.random() * 500));
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        System.out.println(nombre + " ha terminado.");
    }
}

class TareaRunnable implements Runnable {
    private String id;

    public TareaRunnable(String id) {
        this.id = id;
    }

    @Override
    public void run() {
        System.out.println("Tarea " + id + " ejecutandose en " + Thread.currentThread().getName());
        try {
            Thread.sleep(300);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        System.out.println("Tarea " + id + " completada.");
    }
}

public class HiloSimple {
    public static void main(String[] args) {
        System.out.println("Inicio del programa (hilo principal)");

        MiHilo hilo1 = new MiHilo("Hilo-1");
        MiHilo hilo2 = new MiHilo("Hilo-2");

        hilo1.start();
        hilo2.start();

        Thread hilo3 = new Thread(new TareaRunnable("R-1"));
        Thread hilo4 = new Thread(new TareaRunnable("R-2"));

        hilo3.start();
        hilo4.start();

        try {
            hilo1.join();
            hilo2.join();
            hilo3.join();
            hilo4.join();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        System.out.println("Fin del programa (todos los hilos terminaron)");
    }
}
