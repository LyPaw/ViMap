package servicios.sockets;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;
import java.util.Scanner;

public class ClienteEco {
    private static final String SERVIDOR = "localhost";
    private static final int PUERTO = 8080;

    public static void main(String[] args) {
        try (Socket socket = new Socket(SERVIDOR, PUERTO);
             BufferedReader in = new BufferedReader(
                new InputStreamReader(socket.getInputStream()));
             PrintWriter out = new PrintWriter(
                socket.getOutputStream(), true);
             Scanner scanner = new Scanner(System.in)) {

            System.out.println("Conectado al servidor de eco.");
            System.out.println(in.readLine());
            System.out.println(in.readLine());

            String mensaje;
            while (true) {
                System.out.print("Tu mensaje: ");
                mensaje = scanner.nextLine();

                out.println(mensaje);

                String respuesta = in.readLine();
                System.out.println("Servidor: " + respuesta);

                if (mensaje.equalsIgnoreCase("salir")) {
                    break;
                }
            }

        } catch (IOException e) {
            System.err.println("Error de conexion: " + e.getMessage());
        }
    }
}
