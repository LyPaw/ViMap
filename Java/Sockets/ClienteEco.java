package sockets;

import java.io.*;
import java.net.*;
import java.util.Scanner;

public class ClienteEco {
    public static void main(String[] args) throws IOException {
        try (Socket s = new Socket("localhost", ServidorEco.PUERTO);
             BufferedReader in = new BufferedReader(new InputStreamReader(s.getInputStream()));
             PrintWriter out = new PrintWriter(s.getOutputStream(), true);
             Scanner sc = new Scanner(System.in)) {
            System.out.println(in.readLine());
            String msg;
            while (true) {
                System.out.print("> ");
                msg = sc.nextLine();
                out.println(msg);
                if (msg.equalsIgnoreCase("salir")) break;
                System.out.println(in.readLine());
            }
        }
    }
}
