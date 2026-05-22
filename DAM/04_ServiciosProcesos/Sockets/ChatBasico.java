package servicios.sockets;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ChatBasico {
    private static final int PUERTO = 8081;
    private static List<ManejadorChat> clientes = new ArrayList<>();

    public static void main(String[] args) {
        System.out.println("Servidor de chat iniciado en puerto " + PUERTO);

        try (ServerSocket serverSocket = new ServerSocket(PUERTO)) {
            ExecutorService pool = Executors.newCachedThreadPool();

            while (true) {
                Socket clienteSocket = serverSocket.accept();
                ManejadorChat manejador = new ManejadorChat(clienteSocket);
                clientes.add(manejador);
                pool.execute(manejador);
                System.out.println("Nuevo usuario conectado. Total: " + clientes.size());
            }

        } catch (IOException e) {
            System.err.println("Error en servidor de chat: " + e.getMessage());
        }
    }

    public static synchronized void difundir(String mensaje, ManejadorChat remitente) {
        String salida = "[" + remitente.getNombreUsuario() + "]: " + mensaje;
        System.out.println(salida);
        for (ManejadorChat cliente : clientes) {
            if (cliente != remitente) {
                cliente.enviarMensaje(salida);
            }
        }
    }

    public static synchronized void eliminarCliente(ManejadorChat cliente) {
        clientes.remove(cliente);
        System.out.println("Usuario desconectado. Total: " + clientes.size());
    }
}

class ManejadorChat implements Runnable {
    private Socket socket;
    private PrintWriter out;
    private BufferedReader in;
    private String nombreUsuario;

    public ManejadorChat(Socket socket) {
        this.socket = socket;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void enviarMensaje(String mensaje) {
        out.println(mensaje);
    }

    @Override
    public void run() {
        try {
            in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            out = new PrintWriter(socket.getOutputStream(), true);

            out.println("Bienvenido al chat ViMap. Introduce tu nombre:");
            nombreUsuario = in.readLine();
            out.println("Bienvenido, " + nombreUsuario + "! Escribe 'salir' para desconectarte.");

            ChatBasico.difundir("se ha conectado al chat", this);

            String mensaje;
            while ((mensaje = in.readLine()) != null) {
                if (mensaje.equalsIgnoreCase("salir")) {
                    out.println("Hasta luego, " + nombreUsuario + "!");
                    break;
                }
                ChatBasico.difundir(mensaje, this);
            }

        } catch (IOException e) {
            System.err.println("Error en chat: " + e.getMessage());
        } finally {
            ChatBasico.eliminarCliente(this);
            ChatBasico.difundir("se ha desconectado", this);
            try {
                socket.close();
            } catch (IOException e) {
                System.err.println("Error al cerrar: " + e.getMessage());
            }
        }
    }
}
