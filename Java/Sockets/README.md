# Sockets en Java - Programacion de Red

## 1. Fundamentos de redes

Un **socket** es un punto final de comunicacion entre dos procesos en una red. Representa una conexion bidireccional entre un programa cliente y un programa servidor.

### Protocolos de transporte

| Protocolo | Fiabilidad | Conexion | Velocidad | Uso |
|-----------|-----------|----------|-----------|-----|
| **TCP** | Garantiza entrega y orden | Orientado a conexion | Mas lento | Web, email, FTP |
| **UDP** | No garantiza entrega ni orden | Sin conexion | Mas rapido | Streaming, juegos, DNS |

### Puertos y direcciones

Un socket se identifica por: `(direccion_IP, puerto)`. Los puertos van del 0 al 65535:
- 0-1023: puertos bien conocidos (HTTP=80, HTTPS=443, SSH=22)
- 1024-49151: puertos registrados
- 49152-65535: puertos dinamicos/privados

## 2. Socket TCP en Java

### Servidor TCP

```java
import java.io.*;
import java.net.*;

public class ServidorEco {
    public static final int PUERTO = 8080;

    public static void main(String[] args) throws IOException {
        // 1. Crear ServerSocket en el puerto
        try (ServerSocket serverSocket = new ServerSocket(PUERTO)) {
            System.out.println("Servidor escuchando en puerto " + PUERTO);

            while (true) {
                // 2. Aceptar conexion entrante (bloqueante)
                Socket clienteSocket = serverSocket.accept();
                System.out.println("Cliente conectado: "
                    + clienteSocket.getInetAddress().getHostAddress());

                // 3. Crear flujos de entrada/salida
                BufferedReader in = new BufferedReader(
                    new InputStreamReader(clienteSocket.getInputStream()));
                PrintWriter out = new PrintWriter(
                    clienteSocket.getOutputStream(), true);

                // 4. Leer y responder
                String linea;
                while ((linea = in.readLine()) != null) {
                    out.println("ECO: " + linea.toUpperCase());
                }

                // 5. Cerrar conexion
                clienteSocket.close();
            }
        }
    }
}
```

### Cliente TCP

```java
import java.io.*;
import java.net.*;
import java.util.Scanner;

public class ClienteEco {
    public static void main(String[] args) throws IOException {
        // 1. Conectar al servidor
        try (Socket socket = new Socket("localhost", ServidorEco.PUERTO);
             BufferedReader in = new BufferedReader(
                 new InputStreamReader(socket.getInputStream()));
             PrintWriter out = new PrintWriter(
                 socket.getOutputStream(), true);
             Scanner scanner = new Scanner(System.in)) {

            String linea;
            while (true) {
                System.out.print("> ");
                linea = scanner.nextLine();
                out.println(linea);
                if (linea.equalsIgnoreCase("salir")) break;
                System.out.println(in.readLine());
            }
        }
    }
}
```

## 3. Servidor multi-cliente con pool de hilos

Para atender multiples clientes simultaneamente, cada conexion se maneja en un hilo separado.

```java
import java.io.*;
import java.net.*;
import java.util.concurrent.*;

public class ServidorMultiCliente {
    private static final int PUERTO = 8080;
    private static final ExecutorService pool =
        Executors.newFixedThreadPool(10);

    public static void main(String[] args) throws IOException {
        try (ServerSocket ss = new ServerSocket(PUERTO)) {
            System.out.println("Servidor multi-cliente en puerto " + PUERTO);

            while (true) {
                Socket cliente = ss.accept();
                pool.execute(new ManejadorCliente(cliente));
            }
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

            out.println("Bienvenido. Escribe 'salir' para terminar.");
            String linea;
            while ((linea = in.readLine()) != null) {
                if (linea.equalsIgnoreCase("salir")) break;
                out.println("Recibido: " + linea);
            }
        } catch (IOException e) {
            System.err.println("Error manejando cliente: " + e.getMessage());
        } finally {
            try { socket.close(); } catch (IOException e) {}
        }
    }
}
```

## 4. Chat multi-cliente

Un servidor de chat difunde mensajes a todos los clientes conectados.

```java
import java.io.*;
import java.net.*;
import java.util.*;
import java.util.concurrent.*;

public class ChatServidor {
    private static final int PUERTO = 8081;
    private static final Set<PrintWriter> clientes =
        new CopyOnWriteArraySet<>();

    public static void main(String[] args) throws IOException {
        System.out.println("Servidor de chat en puerto " + PUERTO);

        try (ServerSocket ss = new ServerSocket(PUERTO)) {
            while (true) {
                new Thread(new ManejadorChat(ss.accept())).start();
            }
        }
    }

    private static class ManejadorChat implements Runnable {
        private Socket socket;
        private String nombre;

        ManejadorChat(Socket socket) {
            this.socket = socket;
        }

        @Override
        public void run() {
            try (BufferedReader in = new BufferedReader(
                     new InputStreamReader(socket.getInputStream()));
                 PrintWriter out = new PrintWriter(
                     socket.getOutputStream(), true)) {

                out.println("Ingresa tu nombre:");
                nombre = in.readLine();
                clientes.add(out);
                difundir("[SERVER] " + nombre + " se ha conectado");

                String mensaje;
                while ((mensaje = in.readLine()) != null) {
                    if (mensaje.equalsIgnoreCase("/salir")) break;
                    difundir("[" + nombre + "]: " + mensaje);
                }
            } catch (IOException e) {
                System.err.println("Error en chat: " + e.getMessage());
            } finally {
                if (nombre != null) {
                    difundir("[SERVER] " + nombre + " se ha desconectado");
                }
                try { socket.close(); } catch (IOException e) {}
            }
        }

        private void difundir(String mensaje) {
            for (PrintWriter cliente : clientes) {
                cliente.println(mensaje);
            }
        }
    }
}
```

```java
// ClienteChat.java
import java.io.*;
import java.net.*;

public class ClienteChat {
    public static void main(String[] args) throws Exception {
        Socket socket = new Socket("localhost", 8081);
        BufferedReader in = new BufferedReader(
            new InputStreamReader(socket.getInputStream()));
        PrintWriter out = new PrintWriter(
            socket.getOutputStream(), true);

        // Hilo para leer mensajes del servidor
        new Thread(() -> {
            try {
                String linea;
                while ((linea = in.readLine()) != null) {
                    System.out.println(linea);
                }
            } catch (IOException e) {}
        }).start();

        // Hilo principal para enviar mensajes
        BufferedReader consola = new BufferedReader(
            new InputStreamReader(System.in));
        String texto;
        while ((texto = consola.readLine()) != null) {
            out.println(texto);
        }
        socket.close();
    }
}
```

## 5. Protocolo HTTP desde cero

Se puede construir manualmente una peticion HTTP usando sockets:

```java
try (Socket socket = new Socket("www.example.com", 80);
     PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
     BufferedReader in = new BufferedReader(
         new InputStreamReader(socket.getInputStream()))) {

    out.println("GET / HTTP/1.1");
    out.println("Host: www.example.com");
    out.println("Connection: close");
    out.println();

    String linea;
    while ((linea = in.readLine()) != null) {
        System.out.println(linea);
    }
}
```

## 6. UDP en Java

UDP no establece conexion previa. Se usa `DatagramSocket` y `DatagramPacket`.

```java
// Servidor UDP
DatagramSocket socket = new DatagramSocket(8888);
byte[] buffer = new byte[1024];
DatagramPacket paquete = new DatagramPacket(buffer, buffer.length);
socket.receive(paquete);  // bloquea hasta recibir

String mensaje = new String(paquete.getData(), 0, paquete.getLength());
System.out.println("Recibido: " + mensaje);

// Responder
String respuesta = "Mensaje recibido";
byte[] datosRespuesta = respuesta.getBytes();
DatagramPacket respuestaPaquete = new DatagramPacket(
    datosRespuesta, datosRespuesta.length,
    paquete.getAddress(), paquete.getPort());
socket.send(respuestaPaquete);

// Cliente UDP
DatagramSocket socket = new DatagramSocket();
byte[] buffer = "Hola servidor".getBytes();
InetAddress address = InetAddress.getByName("localhost");
DatagramPacket paquete = new DatagramPacket(
    buffer, buffer.length, address, 8888);
socket.send(paquete);
```

## 7. Buenas practicas

- Usar `try-with-resources` para cerrar sockets y flujos automaticamente
- Implementar timeouts con `socket.setSoTimeout(5000)`
- Usar pool de hilos (`ExecutorService`) en lugar de crear hilos ilimitados
- Manejar `InterruptedException` correctamente (restaurar el flag con `Thread.currentThread().interrupt()`)
- Validar y sanitizar los datos recibidos del cliente
- Usar codificacion de caracteres explicita (`OutputStreamWriter(socket.getOutputStream(), StandardCharsets.UTF_8)`)
