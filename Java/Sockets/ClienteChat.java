package sockets;

import java.io.*;
import java.net.*;

public class ClienteChat {

    public static void main(String[] args) throws Exception {
        Socket socket = new Socket("localhost", 8081);
        BufferedReader in = new BufferedReader(
            new InputStreamReader(socket.getInputStream()));
        PrintWriter out = new PrintWriter(
            socket.getOutputStream(), true);

        Thread receptor = new Thread(() -> {
            try {
                String linea;
                while ((linea = in.readLine()) != null) {
                    System.out.println(linea);
                }
            } catch (IOException e) {
                System.out.println("Conexion cerrada.");
            }
        });
        receptor.setDaemon(true);
        receptor.start();

        BufferedReader consola = new BufferedReader(
            new InputStreamReader(System.in));
        String texto;
        while ((texto = consola.readLine()) != null) {
            out.println(texto);
            if (texto.equalsIgnoreCase("/salir")) {
                break;
            }
        }

        socket.close();
    }
}
