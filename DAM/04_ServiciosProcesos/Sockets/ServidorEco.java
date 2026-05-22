package servicios.sockets;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ServidorEco {
    private static final int PUERTO = 8080;

    public static void main(String[] args) {
        System.out.println("Servidor de eco iniciado en puerto " + PUERTO);

        try (ServerSocket serverSocket = new ServerSocket(PUERTO)) {
            ExecutorService pool = Executors.newFixedThreadPool(5);

            while (true) {
                Socket clienteSocket = serverSocket.accept();
                System.out.println("Cliente conectado: " +
                    clienteSocket.getInetAddress().getHostAddress());

                pool.execute(new ManejadorCliente(clienteSocket));
            }

        } catch (IOException e) {
            System.err.println("Error en el servidor: " + e.getMessage());
        }
    }
}

class ManejadorCliente implements Runnable {
    private Socket socket;

    public ManejadorCliente(Socket socket) {
        this.socket = socket;
    }

    @Override
    public void run() {
        try (BufferedReader in = new BufferedReader(
                new InputStreamReader(socket.getInputStream()));
             PrintWriter out = new PrintWriter(
                socket.getOutputStream(), true)) {

            out.println("Bienvenido al servidor de eco ViMap.");
            out.println("Escribe 'salir' para desconectarte.");

            String mensaje;
            while ((mensaje = in.readLine()) != null) {
                System.out.println("Recibido: " + mensaje);

                if (mensaje.equalsIgnoreCase("salir")) {
                    out.println("Hasta luego!");
                    break;
                }

                out.println("ECO: " + mensaje.toUpperCase());
            }

        } catch (IOException e) {
            System.err.println("Error con cliente: " + e.getMessage());
        } finally {
            try {
                socket.close();
                System.out.println("Cliente desconectado");
            } catch (IOException e) {
                System.err.println("Error al cerrar socket: " + e.getMessage());
            }
        }
    }
}
