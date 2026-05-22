package concurrencia;

import java.util.LinkedList;
import java.util.Queue;

class Buffer {
    private Queue<Integer> cola = new LinkedList<>();
    private int capacidad;
    public Buffer(int capacidad) { this.capacidad = capacidad; }

    public synchronized void producir(int valor) throws InterruptedException {
        while (cola.size() == capacidad) { wait(); }
        cola.offer(valor);
        System.out.println("Producido: " + valor);
        notifyAll();
    }

    public synchronized int consumir() throws InterruptedException {
        while (cola.isEmpty()) { wait(); }
        int valor = cola.poll();
        System.out.println("Consumido: " + valor);
        notifyAll();
        return valor;
    }
}

class Productor extends Thread {
    private Buffer buffer;
    public Productor(Buffer b) { this.buffer = b; }
    @Override
    public void run() {
        try {
            for (int i = 1; i <= 10; i++) { buffer.producir(i); Thread.sleep(100); }
        } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
    }
}

class Consumidor extends Thread {
    private Buffer buffer;
    public Consumidor(Buffer b) { this.buffer = b; }
    @Override
    public void run() {
        try {
            for (int i = 0; i < 10; i++) { buffer.consumir(); Thread.sleep(200); }
        } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
    }
}

public class ProductorConsumidor {
    public static void main(String[] args) throws InterruptedException {
        Buffer b = new Buffer(3);
        Productor p = new Productor(b);
        Consumidor c = new Consumidor(b);
        p.start(); c.start();
        p.join(); c.join();
        System.out.println("Finalizado.");
    }
}
