package servicios.hilos;

import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

class CuentaBancaria {
    private int saldo = 0;
    private final Lock lock = new ReentrantLock();

    public void depositar(int cantidad) {
        lock.lock();
        try {
            int nuevoSaldo = saldo + cantidad;
            Thread.sleep(50);
            saldo = nuevoSaldo;
            System.out.println(Thread.currentThread().getName() +
                " deposito " + cantidad + ". Saldo: " + saldo);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } finally {
            lock.unlock();
        }
    }

    public int getSaldo() {
        return saldo;
    }
}

class ClienteBanco extends Thread {
    private CuentaBancaria cuenta;
    private int depositos;

    public ClienteBanco(CuentaBancaria cuenta, int depositos, String nombre) {
        super(nombre);
        this.cuenta = cuenta;
        this.depositos = depositos;
    }

    @Override
    public void run() {
        for (int i = 0; i < depositos; i++) {
            cuenta.depositar(100);
        }
    }
}

public class EjemploHilo {
    public static void main(String[] args) throws InterruptedException {
        CuentaBancaria cuenta = new CuentaBancaria();

        ClienteBanco cliente1 = new ClienteBanco(cuenta, 5, "Cliente-1");
        ClienteBanco cliente2 = new ClienteBanco(cuenta, 5, "Cliente-2");

        cliente1.start();
        cliente2.start();

        cliente1.join();
        cliente2.join();

        System.out.println("\nSaldo final: " + cuenta.getSaldo() + " EUR (esperado: 1000)");
    }
}
