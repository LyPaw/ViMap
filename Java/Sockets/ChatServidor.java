package sockets;

import java.io.*;
import java.net.*;
import java.util.*;
import java.util.concurrent.*;

public class ChatServidor {
    private static final int PUERTO = 8081;
    private static List<ManejadorChat> clientes = new ArrayList<>();

    public static void main(String[] args) throws IOException {
        ExecutorService pool = Executors.newCachedThreadPool();
        try (ServerSocket ss = new ServerSocket(PUERTO)) {
            System.out.println("Chat en puerto " + PUERTO);
            while (true) {
                Socket s = ss.accept();
                ManejadorChat m = new ManejadorChat(s);
                clientes.add(m);
                pool.execute(m);
            }
        }
    }

    public static synchronized void difundir(String msg, ManejadorChat remitente) {
        for (ManejadorChat c : clientes)
            if (c != remitente) c.enviar(msg);
    }

    public static synchronized void eliminar(ManejadorChat c) { clientes.remove(c); }
}

class ManejadorChat implements Runnable {
    private Socket socket;
    private PrintWriter out;
    private String nombre;

    public ManejadorChat(Socket s) { this.socket = s; }
    public void enviar(String msg) { out.println(msg); }

    @Override
    public void run() {
        try (BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()))) {
            out = new PrintWriter(socket.getOutputStream(), true);
            out.println("Nombre de usuario:");
            nombre = in.readLine();
            ChatServidor.difundir(nombre + " se connecto.", this);
            String msg;
            while ((msg = in.readLine()) != null) {
                if (msg.equalsIgnoreCase("salir")) break;
                ChatServidor.difundir("[" + nombre + "]: " + msg, this);
            }
        } catch (IOException e) {
            System.err.println("Error en chat: " + e.getMessage());
        } finally {
            ChatServidor.eliminar(this);
            ChatServidor.difundir(nombre + " se desconecto.", this);
            try { socket.close(); } catch (IOException e) {}
        }
    }
}
