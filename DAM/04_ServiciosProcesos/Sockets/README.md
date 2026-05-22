# Programacion de Servicios y Procesos - Sockets

## Conceptos fundamentales

Los sockets son el mecanismo fundamental de comunicacion entre procesos a traves de una red.

### Modelo Cliente-Servidor

-   **Servidor**: proceso que espera y atiende peticiones de clientes.
-   **Cliente**: proceso que inicia la comunicacion enviando peticiones.

### Socket API de Java

-   **ServerSocket**: socket del servidor que escucha en un puerto.
-   **Socket**: socket del cliente (y tambien del lado servidor tras aceptar conexion).
-   `accept()`: bloquea hasta recibir una conexion entrante.
-   `getInputStream()` / `getOutputStream()`: flujos para leer/escribir datos.

### Protocolos

-   **TCP (Transmission Control Protocol)**: orientado a conexion, fiable, ordenado.
-   **UDP (User Datagram Protocol)**: sin conexion, no fiable, mas rapido.

### Clases para TCP

-   `java.net.ServerSocket` (servidor)
-   `java.net.Socket` (cliente)
-   `java.io.BufferedReader` + `InputStreamReader` (lectura)
-   `java.io.PrintWriter` (escritura)

### Clases para UDP

-   `java.net.DatagramSocket`
-   `java.net.DatagramPacket`
-   `java.net.InetAddress`

### Multi-threading en servidores

Un servidor debe crear un hilo por cada cliente para atender multiples conexiones simultaneas:

```java
while (true) {
    Socket cliente = serverSocket.accept();
    new Thread(new ManejadorCliente(cliente)).start();
}
```

## Ejercicios propuestos

1.  Implementa un servidor de eco que devuelva al cliente el mensaje recibido en mayusculas.
2.  Crea un chat multiusuario donde el servidor retransmita mensajes a todos los clientes conectados.
3.  Implementa un servidor de archivos que permita a los clientes descargar ficheros.
4.  Desarrolla un juego de preguntas y respuestas usando sockets TCP.
5.  Implementa un servicio de mensajes UDP (broadcast) para descubrimiento de servicios en red.
