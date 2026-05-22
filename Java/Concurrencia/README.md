# Concurrencia en Java

## Conceptos fundamentales

Un proceso es un programa en ejecucion con su propio espacio de memoria independiente. Un hilo, tambien llamado thread, es una unidad de ejecucion dentro de un proceso; los hilos comparten la memoria del proceso, lo que permite la comunicacion eficiente entre ellos pero tambien introduce riesgos de acceso concurrente. La concurrencia permite que varios hilos ejecuten tareas de forma simultanea, mejorando el rendimiento en sistemas con multiples nucleos y la capacidad de respuesta en aplicaciones interactivas. En Java, la maquina virtual gestiona los hilos y su planificacion, aunque el planificador del sistema operativo decide el orden real de ejecucion.

## Creacion de hilos

Existen tres formas principales de crear hilos en Java. La primera es extendiendo la clase Thread y sobrescribiendo su metodo run. La segunda es implementando la interfaz Runnable y pasando la instancia al constructor de Thread. La tercera, introducida en Java 8, es usando una expresion lambda directamente en el constructor de Thread. En todos los casos, la ejecucion comienza al llamar al metodo start, nunca run directamente, porque start crea un nuevo hilo del sistema mientras que run ejecuta el codigo en el hilo actual.

## Ciclo de vida de un hilo

Un hilo pasa por varios estados desde su creacion hasta su terminacion. Cuando se crea con new Thread esta en estado nuevo. Al llamar a start pasa a estado ejecutable, donde el planificador decide cuando asignarle la CPU. Cuando esta ejecutandose puede pasar a estado bloqueado o en espera si llama a sleep, wait o join, o si queda a la espera de un recurso bloqueado. Cuando el metodo run finaliza o se lanza una excepcion no capturada, el hilo pasa a estado terminado.

## Sincronizacion

Cuando varios hilos acceden a datos compartidos sin sincronizacion pueden producirse condiciones de carrera, donde el resultado final depende del orden impredecible de ejecucion. La sincronizacion garantiza la exclusion mutua: solo un hilo puede ejecutar una seccion critica a la vez. En Java, la sincronizacion se logra mediante la palabra clave synchronized, que puede aplicarse a metodos completos o a bloques dentro de un metodo. Cada objeto en Java tiene un monitor asociado; synchronized adquiere ese monitor, impidiendo que otros hilos ejecuten codigo sincronizado sobre el mismo objeto.

Ademas de synchronized, Java proporciona locks explicitos en el paquete java.util.concurrent.locks. La interfaz Lock con su implementacion ReentrantLock ofrece funcionalidades adicionales como tryLock para intentar adquirir el lock con timeout, lockInterruptibly para poder interrumpir un hilo bloqueado en la adquisicion, y la posibilidad de crear condiciones con Condition para una gestion mas fina de la espera. ReadWriteLock permite multiples lectores simultaneos pero escritura exclusiva, mejorando el rendimiento cuando hay mas lecturas que escrituras.

## Comunicacion entre hilos

Los metodos wait, notify y notifyAll, heredados de Object, permiten la comunicacion entre hilos. wait hace que el hilo actual espere hasta que otro hilo llame a notify o notifyAll sobre el mismo objeto. Estos metodos deben llamarse dentro de un bloque synchronized y mientras se espera se libera el monitor del objeto. Es recomendable usar wait dentro de un bucle while que verifique la condicion, para evitar despertares espurios.

## Executors

El framework Executors, introducido en Java 5, abstrae la gestion de hilos proporcionando pools reutilizables. Executors.newFixedThreadPool crea un pool con un numero fijo de hilos. Executors.newCachedThreadPool crea un pool que crea hilos segun sea necesario y reutiliza los que terminan. Executors.newSingleThreadExecutor asegura que las tareas se ejecutan secuencialmente en un unico hilo. ScheduledExecutorService permite ejecutar tareas con retardo o de forma periodica.

La interfaz Callable es similar a Runnable pero puede devolver un resultado y lanzar excepciones. Future representa el resultado pendiente de una tarea asincrona, con metodos como get que bloquea hasta obtener el resultado, cancel para intentar cancelar la tarea, y isDone para comprobar si ha finalizado. invokeAll ejecuta una coleccion de tareas y espera a que todas terminen. invokeAny ejecuta una coleccion y devuelve el resultado de la primera en terminar.

## CompletableFuture

CompletableFuture, introducido en Java 8, extiende Future con capacidades de programacion asincrona mediante callbacks. supplyAsync ejecuta una tarea en un pool por defecto y devuelve un CompletableFuture. thenApply registra una funcion que se ejecuta cuando el futuro se completa. thenAccept registra un consumidor para el resultado. thenCombine combina dos futuros independientes. exceptionally maneja errores. allOf espera a que todos los futuros se completen. Esta API permite encadenar operaciones asincronas sin bloquear hilos y sin la complejidad de la gestion manual de hilos.

## Problemas comunes

El deadlock ocurre cuando dos o mas hilos se bloquean mutuamente esperando recursos que el otro posee, creando una espera circular que nunca se resuelve. La race condition produce resultados incorrectos porque el orden de ejecucion de los hilos es impredecible. El starvation ocurre cuando un hilo nunca obtiene el recurso porque otros hilos lo acaparan continuamente. La falta de liveness significa que el sistema no progresa a pesar de no haber deadlock. Para evitar estos problemas se recomienda adquirir los locks siempre en el mismo orden, usar timeouts en la adquisicion de locks, minimizar las secciones criticas, y utilizar las colecciones concurrentes del paquete java.util.concurrent en lugar de sincronizar manualmente.
