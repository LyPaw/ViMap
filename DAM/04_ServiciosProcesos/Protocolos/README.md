# Programacion de Servicios y Procesos - Protocolos

## Protocolos de comunicacion en red

### Protocolo HTTP/HTTPS

-   Protocolo de capa de aplicacion para transferencia de hipertexto.
-   Metodos: GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS.
-   Codigos de estado: 200 (OK), 201 (Created), 400 (Bad Request), 404 (Not Found), 500 (Internal Server Error).
-   Cabeceras: Content-Type, Authorization, Accept, User-Agent, etc.

### Cliente HTTP en Java

-   `HttpURLConnection` (legacy)
-   `HttpClient` (Java 11+): API moderna con soporte sincrono y asincrono.

### Protocolo TCP/IP

-   Capa de transporte: TCP (fiable) y UDP (rapido).
-   Puertos: 0-1023 (privilegiados), 1024-49151 (registrados), 49152-65535 (efimeros).

### Protocolo WebSocket

-   Comunicacion bidireccional full-duplex sobre TCP.
-   Ideal para aplicaciones en tiempo real (chats, notificaciones, juegos).

### Serializacion

-   **Serializacion Java**: `ObjectOutputStream` / `ObjectInputStream`.
-   **JSON**: formato ligero de intercambio de datos.
-   **XML**: formato extensible de marcado.
-   **Protocol Buffers**: serializacion binaria eficiente de Google.

## Ejercicios propuestos

1.  Implementa un cliente HTTP que realice peticiones GET y POST usando la API HttpClient de Java 11.
2.  Crea un servidor que sirva archivos estaticos (HTML, CSS, JS) usando ServerSocket implementando HTTP basico.
3.  Implementa la serializacion de objetos Java a JSON usando la libreria Jackson o Gson.
4.  Desarrolla un cliente REST que consuma una API publica y muestre los resultados.
5.  Implementa un servidor WebSocket simple para notificaciones en tiempo real.
