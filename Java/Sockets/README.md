# Sockets y Programacion de Red: Fundamentos Teoricos

## Capitulo 1: Fundamentos de la Comunicacion en Red

La comunicacion entre programas que se ejecutan en diferentes maquinas de una red se fundamenta en el concepto de socket, que constituye un punto final de comunicacion identificado de forma unica por la combinacion de una direccion IP y un numero de puerto. La direccion IP identifica la maquina dentro de la red, mientras que el puerto identifica el programa o servicio especifico dentro de esa maquina, permitiendo que multiples servicios convivan en un mismo servidor. El rango de puertos se extiende desde el valor cero hasta el valor 65535, reservandose los primeros 1024 para servicios estandar y bien conocidos, como el puerto 80 para HTTP, el puerto 443 para HTTPS, el puerto 21 para FTP, el puerto 25 para SMTP y el puerto 22 para SSH.

El modelo de referencia OSI, desarrollado por la Organizacion Internacional de Normalizacion, define siete capas de abstraccion que estandarizan la comunicacion entre sistemas heterogeneos. Cada capa proporciona servicios a la capa superior y utiliza los servicios de la capa inferior, encapsulando la informacion mediante la anadidura de cabeceras especificas en cada nivel. La capa fisica se ocupa de la transmision de bits a traves del medio fisico. La capa de enlace de datos organiza los bits en tramas y detecta errores de transmision. La capa de red se encarga del direccionamiento logico y el encaminamiento de los paquetes a traves de la red, utilizando protocolos como IP. La capa de transporte, la mas relevante para la programacion de sockets, proporciona la transferencia de datos entre los extremos de la comunicacion, ocultando los detalles de la red subyacente.

## Capitulo 2: Protocolos de Transporte: TCP y UDP

En la capa de transporte del modelo OSI existen dos protocolos fundamentales con caracteristicas radicalmente diferentes que determinan su idoneidad para distintos tipos de aplicaciones.

El protocolo TCP, Transmission Control Protocol, proporciona un servicio de comunicacion fiable y orientado a conexion. Antes de intercambiar datos, los extremos deben establecer una conexion mediante un proceso conocido como handshake de tres vias, donde se intercambian mensajes de sincronizacion y confirmacion para acordar los parametros de la comunicacion. Una vez establecida la conexion, TCP garantiza que todos los datos se entreguen en el mismo orden en que se enviaron y sin perdidas, implementando mecanismos de deteccion de errores mediante sumas de comprobacion, retransmision de paquetes perdidos, control de flujo para evitar que un emisor rapido sature a un receptor lento, y control de congestion para adaptar la velocidad de transmision a las condiciones de la red. Esta fiabilidad tiene un coste en terminos de latencia y sobrecarga de control.

El protocolo UDP, User Datagram Protocol, proporciona un servicio no fiable y sin conexion, donde los datos se envian en unidades discretas llamadas datagramas sin establecer ninguna conexion previa. UDP no garantiza la entrega, el orden de llegada ni la integridad de los datos, y no implementa control de flujo ni de congestion. Sin embargo, esta simplicidad se traduce en una latencia minima y una sobrecarga de control reducida, lo que hace a UDP adecuado para aplicaciones en tiempo real donde la perdida ocasional de datos es aceptable pero el retardo no, como la transmision de audio y video en streaming, los juegos online o las aplicaciones de voz sobre IP.

## Capitulo 3: El Modelo Cliente-Servidor con TCP

La comunicacion mediante TCP sigue un modelo perfectamente definido con roles asimetricos que reflejan la arquitectura cliente-servidor. El servidor crea un socket servidor asociado a un puerto especifico de su maquina y queda a la espera de peticiones de conexion entrantes mediante una operacion de aceptacion que resulta bloqueante hasta que un cliente se conecta. Cuando un cliente inicia una conexion, la operacion de aceptacion devuelve un nuevo socket que representa la conexion establecida, permitiendo al servidor intercambiar datos con ese cliente de forma independiente.

El cliente, por su parte, crea un socket especificando la direccion del servidor, que puede ser una direccion IP o un nombre de dominio, y el puerto en el que el servidor esta escuchando. Esta accion inicia el proceso de establecimiento de conexion conocido como handshake de tres vias, que implica el intercambio de tres mensajes entre cliente y servidor. Una vez establecida la conexion, ambos extremos pueden intercambiar datos mediante flujos de entrada y salida, leyendo y escribiendo en el socket de forma bidireccional y simetrica.

La finalizacion de la conexion TCP puede producirse de forma ordenada mediante el intercambio de mensajes de finalizacion, donde cada extremo envia un mensaje de cierre y espera la confirmacion del otro, o de forma abrupta mediante la desconexion forzada del socket.

## Capitulo 4: Servidores Concurrentes y Gestion de Multiples Clientes

Para atender simultaneamente a multiples clientes sin que la atencion de uno bloquee la de los demas, el servidor debe asignar un contexto de ejecucion independiente a cada conexion establecida. El patron clasico consiste en que el servidor principal ejecute un bucle infinito de aceptacion de conexiones, delegando la atencion de cada cliente a un nuevo hilo de ejecucion creado especificamente para ese proposito. Este enfoque permite que el servidor principal retorne inmediatamente a la espera de nuevas conexiones mientras los clientes existentes son atendidos concurrentemente en sus respectivos hilos.

Sin embargo, la creacion ilimitada de hilos puede conducir al agotamiento de los recursos del sistema, ya que cada hilo consume memoria para su pila y recursos del sistema operativo. Por esta razon, es recomendable utilizar un pool de hilos reutilizables que limite el numero de conexiones concurrentes y evite el costo asociado a la creacion y destruccion continua de hilos. El framework de ejecutores de Java proporciona la infraestructura necesaria para implementar este patron de forma eficiente y segura.

En el caso de servidores de chat o aplicaciones donde los clientes necesitan recibir mensajes enviados por otros clientes, el servidor debe mantener un registro de todos los clientes conectados y difundir los mensajes recibidos a todos ellos o a un subconjunto seleccionado. Este patron de difusion requiere que el servidor gestione adecuadamente la concurrencia en el acceso a la lista de clientes, evitando condiciones de carrera que podrian resultar en el envio de mensajes a clientes ya desconectados o en la perdida de mensajes.

## Capitulo 5: Protocolos de Aplicacion sobre TCP

El protocolo HTTP, que constituye la base de la comunicacion en la World Wide Web, es un protocolo de aplicacion que opera sobre TCP en el puerto 80, o en el puerto 443 para su variante segura HTTPS. HTTP sigue un modelo peticion-respuesta donde el cliente, tipicamente un navegador web, envia una peticion al servidor y este responde con el recurso solicitado.

Una peticion HTTP consta de una linea de solicitud que especifica el metodo, como GET para recuperar recursos o POST para enviar datos, la ruta del recurso solicitado y la version del protocolo. A continuacion siguen un conjunto de cabeceras con metadatos como el tipo de contenido aceptado, la identificacion del cliente, la gestion de cache y las preferencias de idioma. Una linea en blanco seniala el final de las cabeceras, y opcionalmente un cuerpo con datos adicionales en el caso de peticiones POST o PUT.

El servidor responde con una linea de estado que incluye la version del protocolo, un codigo numerico de tres digitos que indica el resultado de la operacion, y un mensaje textual explicativo. Los codigos de estado se agrupan en cinco categorias: respuestas informativas, respuestas exitosas, redirecciones, errores del cliente y errores del servidor. Tras la linea de estado siguen las cabeceras de respuesta y el cuerpo del contenido solicitado.

## Capitulo 6: Comunicacion mediante UDP

La comunicacion mediante UDP sigue un modelo diferente al de TCP, al no requerir el establecimiento previo de una conexion ni el mantenimiento de estado en los extremos. Tanto el emisor como el receptor crean sockets datagrama asociados a un puerto. El emisor construye paquetes datagrama que contienen los datos a transmitir junto con la direccion y el puerto de destino, y los envia a traves del socket. El receptor permanece a la espera de paquetes entrantes mediante una operacion de recepcion bloqueante, y cuando recibe un paquete puede determinar la direccion y el puerto del remitente para, si es necesario, enviar una respuesta.

La naturaleza no fiable de UDP implica que los paquetes pueden perderse sin que el emisor sea notificado, pueden llegar duplicados si la red genera copias, o pueden llegar en un orden diferente al de envio si la red reencamina los paquetes por caminos distintos. Correspondera a la capa de aplicacion, si lo necesita, implementar mecanismos de deteccion y correccion de errores, como numeros de secuencia, confirmaciones de recepcion, temporizadores de retransmision y buffers de reordenacion.

## Capitulo 7: Buenas Practicas en Programacion de Red

La gestion adecuada de los recursos de red es fundamental para la robustez y seguridad de las aplicaciones. Los sockets y los flujos de entrada y salida asociados deben cerrarse siempre, incluso en caso de error, para liberar los recursos del sistema y evitar el agotamiento de descriptores de archivo. El lenguaje proporciona el mecanismo try-with-resources que facilita esta gestion al cerrar automaticamente los recursos declarados en su cabecera cuando finaliza el bloque de codigo correspondiente, independientemente de que se produzcan excepciones.

La implementacion de tiempos de espera en las operaciones de red evita que la aplicacion quede bloqueada indefinidamente ante una conexion lenta, un servidor que no responde o una red congestionada. Los tiempos de espera deben establecerse tanto para la conexion inicial como para las operaciones de lectura y escritura posteriores.

La validacion y sanitizacion de los datos recibidos de la red es esencial para prevenir vulnerabilidades de seguridad como la inyeccion de comandos, el desbordamiento de buffers o los ataques de denegacion de servicio. Nunca deben confiarse los datos recibidos sin verificar su tamano, formato y contenido.

La utilizacion de una codificacion de caracteres explicita, preferiblemente UTF-8, garantiza la correcta transmision de caracteres especiales, acentos y simbolos internacionales, evitando problemas de codificacion que pueden resultar en datos corruptos o ilegibles.

La interrupcion correcta de los hilos que gestionan conexiones de red requiere restaurar el indicador de interrupcion del hilo mediante una interrupcion explicita, cerrar los sockets para que las operaciones de bloqueo pendientes lancen una excepcion, y permitir que el hilo finalice de forma ordenada, liberando los recursos que haya adquirido durante su ejecucion.
