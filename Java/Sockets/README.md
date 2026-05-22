# Sockets en Java - Programacion de Red

## Fundamentos de redes

Un socket es un punto final de comunicacion entre dos procesos en una red. Representa una conexion bidireccional entre un programa cliente y un programa servidor. Un socket se identifica por la combinacion de direccion IP y numero de puerto. Los puertos van del cero al 65535, donde los numeros del cero al 1023 son puertos bien conocidos reservados para servicios estandar como HTTP en el puerto 80, HTTPS en el 443 y SSH en el 22. Los puertos del 1024 al 49151 son registrados para aplicaciones especificas, y del 49152 al 65535 son dinamicos o privados.

Los dos protocolos principales de transporte son TCP y UDP. TCP garantiza la entrega ordenada y sin perdidas de los datos, estableciendo una conexion previa entre emisor y receptor, pero es mas lento debido a la sobrecarga de control. UDP no garantiza entrega ni orden y no requiere conexion previa, siendo mas rapido y adecuado para aplicaciones como streaming, juegos online o DNS donde la velocidad es prioritaria sobre la fiabilidad.

## Socket TCP en Java

La comunicacion TCP en Java sigue un patron claro. El servidor crea un ServerSocket en un puerto y queda a la espera de conexiones entrantes mediante el metodo accept, que es bloqueante. Cuando un cliente se conecta, accept devuelve un Socket que representa la conexion establecida. A partir de ese Socket se obtienen los flujos de entrada y salida: un InputStream para leer datos del cliente y un OutputStream para enviarle datos. Es habitual envolver estos flujos en BufferedReader y PrintWriter para trabajar con texto de forma comoda.

El cliente crea un Socket especificando la direccion IP y el puerto del servidor, y una vez establecida la conexion obtiene sus propios flujos de entrada y salida. La comunicacion consiste en intercambiar mensajes a traves de estos flujos, leyendo lineas de texto con readLine y escribiendo con println.

## Servidor multi-cliente

Para atender a multiples clientes simultaneamente, cada conexion debe manejarse en un hilo separado. El servidor principal acepta conexiones en un bucle infinito y por cada conexion crea un nuevo hilo que se encarga de la comunicacion con ese cliente. Esto permite que el servidor siga aceptando nuevas conexiones mientras los clientes existentes son atendidos en paralelo. Es recomendable usar un ExecutorService con un pool de hilos en lugar de crear un hilo nuevo por cada cliente, para limitar el numero de conexiones concurrentes y reutilizar hilos.

## Chat multi-cliente

Un servidor de chat requiere mantener una lista de todos los clientes conectados para poder difundir los mensajes. Cuando un cliente envia un mensaje, el servidor lo reenvia a todos los demas clientes. Cada cliente debe tener dos hilos: uno para enviar mensajes al servidor y otro para recibir mensajes del servidor. El servidor usa una coleccion thread-safe para almacenar los flujos de salida de los clientes, y un metodo sincronizado o una coleccion concurrente para garantizar que la difusion sea segura en entornos multi-hilo.

## Protocolo HTTP desde cero

Es posible construir manualmente una peticion HTTP usando sockets TCP. Una peticion HTTP consiste en una linea de solicitud con el metodo, la ruta y la version del protocolo, seguida de cabeceras con informacion adicional, una linea en blanco que indica el final de las cabeceras, y opcionalmente un cuerpo. El servidor responde con una linea de estado que incluye el codigo de resultado, cabeceras de respuesta, y el cuerpo con el contenido solicitado.

## UDP en Java

La comunicacion UDP en Java usa DatagramSocket y DatagramPacket. No se establece una conexion previa, sino que se crean paquetes con los datos, la direccion y el puerto de destino, y se envian mediante el socket. El servidor crea un DatagramSocket en un puerto y llama a receive para recibir paquetes, que es bloqueante. Para responder, se crea un nuevo DatagramPacket con la direccion y puerto del remitente original y se envia con send.

## Buenas practicas

Se recomienda usar try-with-resources para cerrar sockets y flujos automaticamente. Implementar timeouts con setSoTimeout para evitar que el servidor quede bloqueado indefinidamente. Usar ExecutorService en lugar de crear hilos ilimitados. Manejar InterruptedException correctamente restaurando el flag de interrupcion con Thread.currentThread.interrupt. Validar y sanitizar los datos recibidos del cliente para evitar inyecciones. Usar una codificacion de caracteres explicita como UTF-8 para garantizar la correcta transmision de caracteres especiales.
