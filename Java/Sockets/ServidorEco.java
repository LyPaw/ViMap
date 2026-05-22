package sockets;

import java.io.*;
import java.net.*;
import java.util.concurrent.*;

public class ServidorEco {
    public static final int PUERTO = 8080;

    public static void main(String[] args) throws IOException {
        ExecutorService pool = Executors.newFixedThreadPool(5);
        try (ServerSocket ss = new ServerSocket(PUERTO)) {
            System.out.println("Servidor eco en puerto " + PUERTO);
            while (true) {
                Socket cliente = ss.accept();
                System.out.println("Cliente conectado: " + cliente.getInetAddress());
                pool.execute(() -> atenderCliente(cliente));
            }
        }
    }

    static void atenderCliente(Socket s) {
        try (BufferedReader in = new BufferedReader(new InputStreamReader(s.getInputStream()));
             PrintWriter out = new PrintWriter(s.getOutputStream(), true)) {
            out.println("Bienvenido al servidor de eco. Escribe 'salir' para terminar.");
            String msg;
            while ((msg = in.readLine()) != null) {
                if (msg.equalsIgnoreCase("salir")) break;
                out.println("ECO: " + msg.toUpperCase());
            }
        } catch (IOException e) {
            System.err.println("Error: " + e.getMessage());
        } finally {
            try { s.close(); } catch (IOException e) {}
        }
    }
}
