package concurrencia;

import java.util.LinkedList;
import java.util.Queue;

class BufferCompartido {
    private Queue<Integer> buffer = new LinkedList<>();
    private int capacidad;

    public BufferCompartido(int capacidad) {
        this.capacidad = capacidad;
    }

    public synchronized void producir(int valor) throws InterruptedException {
        while (buffer.size() == capacidad) {
            System.out.println("Buffer lleno. Productor espera...");
            wait();
        }
        buffer.offer(valor);
        System.out.println("Producido: " + valor + " [Buffer: " + buffer.size() + "]");
        notifyAll();
    }

    public synchronized int consumir() throws InterruptedException {
        while (buffer.isEmpty()) {
            System.out.println("Buffer vacio. Consumidor espera...");
            wait();
        }
        int valor = buffer.poll();
        System.out.println("Consumido: " + valor + " [Buffer: " + buffer.size() + "]");
        notifyAll();
        return valor;
    }
}

class Productor extends Thread {
    private BufferCompartido buffer;

    public Productor(BufferCompartido buffer) {
        this.buffer = buffer;
    }

    @Override
    public void run() {
        int valor = 0;
        try {
            for (int i = 0; i < 10; i++) {
                buffer.producir(++valor);
                Thread.sleep((long) (Math.random() * 200));
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}

class Consumidor extends Thread {
    private BufferCompartido buffer;

    public Consumidor(BufferCompartido buffer) {
        this.buffer = buffer;
    }

    @Override
    public void run() {
        try {
            for (int i = 0; i < 10; i++) {
                buffer.consumir();
                Thread.sleep((long) (Math.random() * 300));
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}

public class ProductorConsumidor {
    public static void main(String[] args) {
        BufferCompartido buffer = new BufferCompartido(3);

        Productor productor = new Productor(buffer);
        Consumidor consumidor = new Consumidor(buffer);

        productor.start();
        consumidor.start();

        try {
            productor.join();
            consumidor.join();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        System.out.println("Productor-Consumidor finalizado.");
    }
}
