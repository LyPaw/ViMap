# Sockets en Java

## Conceptos

Un **socket** es un punto final de comunicacion entre dos maquinas en red. TCP garantiza entrega ordenada; UDP es mas rapido sin garantia.

## Servidor TCP (ServerSocket)

```java
ServerSocket server = new ServerSocket(8080);
Socket cliente = server.accept();  // bloquea hasta conexion
BufferedReader in = new BufferedReader(
    new InputStreamReader(cliente.getInputStream()));
PrintWriter out = new PrintWriter(cliente.getOutputStream(), true);
out.println("Bienvenido");
```

## Cliente TCP (Socket)

```java
Socket socket = new Socket("localhost", 8080);
PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
BufferedReader in = new BufferedReader(
    new InputStreamReader(socket.getInputStream()));
```

## Servidor Multi-Cliente

```java
while (true) {
    Socket cliente = server.accept();
    new Thread(() -> atenderCliente(cliente)).start();
}
```

## Protocolo HTTP

```java
GET /ruta HTTP/1.1
Host: localhost
```

En ClienteHTTP.java se construye manualmente una peticion HTTP/1.1 y se parsea la respuesta.

## Chat

El ChatServidor mantiene un Set de PrintWriter para difundir mensajes a todos los clientes conectados.
