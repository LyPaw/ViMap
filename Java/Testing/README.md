# Testing y Aseguramiento de la Calidad del Software: Fundamentos Teoricos

## Capitulo 1: Fundamentos de las Pruebas Unitarias

Las pruebas unitarias constituyen el nivel mas granular de verificacion del software, centrandose en comprobar el comportamiento correcto de unidades individuales de codigo, tipicamente metodos o clases completas, de forma aislada del resto del sistema. Su proposito fundamental es detectar errores en las etapas tempranas del desarrollo, cuando el costo de corregirlos es significativamente menor que si se descubren en fases avanzadas de integracion, pruebas de sistema o, peor aun, en produccion.

Ademas de la deteccion temprana de errores, las pruebas unitarias proporcionan otros beneficios igualmente valiosos. Actuan como red de seguridad durante la refactorizacion, permitiendo modificar y mejorar el codigo con la confianza de que cualquier cambio que rompa la funcionalidad existente sera detectado inmediatamente por las pruebas. Funcionan como documentacion viva y ejecutable del comportamiento esperado del sistema, mostrando con ejemplos concretos como debe utilizarse cada componente y que resultados debe producir en cada escenario, documentacion que nunca queda desactualizada porque se ejecuta regularmente. Favorecen un diseno mas modular, desacoplado y testeable, ya que el codigo dificil de probar suele ser un indicador fiable de problemas de diseno, como acoplamiento excesivo, responsabilidades mal asignadas o dependencias ocultas.

## Capitulo 2: El Framework de Pruebas JUnit 5

El framework de pruebas mas ampliamente adoptado en el ecosistema Java proporciona un conjunto de anotaciones que definen el ciclo de vida de las pruebas y permiten organizarlas de forma estructurada y expresiva. La anotacion principal marca un metodo como una prueba ejecutable, que el motor de pruebas descubrira y ejecutara automaticamente. Las anotaciones de inicializacion y limpieza permiten ejecutar codigo antes y despues de cada prueba, estableciendo el estado inicial necesario y liberando los recursos adquiridos, asi como antes y despues de todas las pruebas de la clase, para operaciones costosas como la creacion de conexiones a bases de datos o la carga de configuraciones.

El framework proporciona anotaciones complementarias que amplian las capacidades de organizacion y filtrado de las pruebas. La anotacion de deshabilitacion permite desactivar pruebas temporalmente sin eliminarlas, util para pruebas que fallan por causas ajenas al codigo probado. La anotacion de nombre descriptivo permite proporcionar nombres legibles para los informes de resultados. La anotacion de etiquetado permite clasificar las pruebas por categorias como unitarias, de integracion o lentas, facilitando su ejecucion selectiva. La anotacion de parametrizacion permite ejecutar la misma prueba con multiples conjuntos de datos de entrada, evitando la duplicacion de codigo de prueba.

## Capitulo 3: Aserciones y Verificacion de Resultados

Las aserciones constituyen el corazon de las pruebas unitarias, permitiendo verificar que el comportamiento observado del sistema coincide con el comportamiento esperado. El conjunto de metodos de asercion proporciona verificaciones para la igualdad de valores, incluyendo una variante para numeros decimales que acepta un margen de error, denominado delta, para compensar los problemas de precision inherentes a la aritmetica en coma flotante.

Las aserciones adicionales permiten verificar condiciones booleanas, comprobar si un objeto es nulo o no nulo, confirmar que dos referencias apuntan al mismo objeto o a objetos diferentes, comparar arrays elemento a elemento verificando que contengan los mismos valores en el mismo orden, y verificar que un bloque de codigo lanza una excepcion especifica, comprobando asi el comportamiento esperado ante condiciones de error.

Una funcionalidad avanzada es la agrupacion de aserciones, donde multiples verificaciones se ejecutan aunque algunas fallen, mostrando al final la relacion completa de errores encontrados en lugar de detenerse en el primer fallo. Esto permite obtener una vision mas completa del estado de la prueba y corregir multiples problemas en una sola iteracion.

## Capitulo 4: El Ciclo de Desarrollo Guiado por Pruebas

El Desarrollo Guiado por Pruebas, conocido por sus siglas en ingles TDD, es una metodologia de desarrollo que invierte el orden tradicional de las fases de construccion y verificacion. En el enfoque tradicional, primero se escribe el codigo de produccion y luego se escriben las pruebas para verificarlo. En TDD, primero se escribe la prueba y luego el codigo que la hace pasar.

El ciclo, conocido como rojo-verde-refactor, se compone de tres pasos que se repiten para cada pequena unidad de funcionalidad. En el paso rojo, el desarrollador escribe una prueba que falla porque la funcionalidad que verifica aun no existe. Esta prueba define el comportamiento esperado desde la perspectiva del usuario de la unidad que se va a implementar, actuando como una especificacion ejecutable. En el paso verde, el desarrollador escribe el codigo minimo necesario para que la prueba pase, sin preocuparse por la calidad, la eficiencia o la elegancia de la implementacion. El objetivo es hacer que la prueba pase lo antes posible. En el paso de refactorizacion, el desarrollador mejora el codigo de produccion, eliminando duplicaciones, mejorando la legibilidad, optimizando el rendimiento y aplicando principios de diseno, mientras las pruebas se mantienen verdes y verifican que los cambios no alteran el comportamiento esperado.

Este ciclo produce codigo que esta inherentemente probado, disenado para ser testeable, y que evoluciona de forma incremental con retroalimentacion constante.

## Capitulo 5: Aislamiento con Objetos Simulados

Las pruebas unitarias verdaderas deben ejecutarse de forma aislada, sin depender de infraestructura externa como bases de datos, servicios web, sistemas de archivos o relojes del sistema. Las dependencias externas introducen no determinismo, lentitud y fragilidad en las pruebas. Los objetos simulados, tambien conocidos como mocks, permiten crear sustitutos controlados de estas dependencias, definiendo su comportamiento de forma programatica y verificando que las interacciones con ellos ocurren segun lo esperado.

El marco de trabajo de simulacion mas utilizado en el ecosistema Java permite crear objetos mock de interfaces y clases, especificar el valor de retorno de sus metodos para que devuelvan los datos deseados en cada escenario de prueba, lanzar excepciones bajo determinadas condiciones para probar los caminos de error, verificar que ciertos metodos fueron invocados con los argumentos esperados, y utilizar matchers de argumentos para generalizar las condiciones de verificacion cuando no se conoce el valor exacto del argumento.

El uso adecuado de mocks permite aislar la unidad bajo prueba y centrar la verificacion en su logica interna, pero su uso excesivo o inadecuado puede conducir a pruebas fragiles que se rompen ante cambios triviales en la implementacion. Como regla general, deben mockearse las dependencias externas que introducen no determinismo o efectos secundarios, pero no las clases de valor o las colecciones de datos.

## Capitulo 6: Cobertura y Estrategias de Prueba

La cobertura de codigo es una metrica que mide el porcentaje del codigo fuente que es ejecutado durante la ejecucion de las pruebas, proporcionando una indicacion de que partes del sistema han sido verificadas y cuales permanecen sin probar. Las dimensiones de cobertura mas relevantes son la cobertura de lineas, que cuenta cuantas lineas de codigo se ejecutan al menos una vez; la cobertura de ramas, que evalua si todas las bifurcaciones condicionales, como if-else o switch, se han probado en todas sus direcciones; y la cobertura de metodos, que indica cuantos metodos se invocan durante las pruebas.

Las herramientas de medicion de cobertura se integran en el proceso de construccion y generan informes detallados que permiten identificar las zonas del codigo no probadas, mostrando visualmente que lineas estan cubiertas y cuales no. Como regla practica, se recomienda alcanzar al menos el ochenta por ciento de cobertura en la logica de negocio, sin obsesionarse con el codigo trivial como los metodos de acceso a atributos, los constructores simples o las clases de configuracion. La cobertura es una metrica util pero no debe ser el unico criterio de calidad: es preferible tener pruebas significativas que verifican comportamientos importantes aunque no cubran todo el codigo, que tener una cobertura alta basada en pruebas triviales que no detectan errores reales.

## Capitulo 7: Buenas Practicas en la Escritura de Pruebas

Cada prueba debe verificar un comportamiento conceptual especifico, idealmente una sola afirmacion logica, con un nombre descriptivo que indique claramente que se prueba y bajo que condiciones. Un nombre de prueba bien formado permite identificar rapidamente que funcionalidad falla sin necesidad de leer el codigo de la prueba.

Las pruebas deben ser independientes entre si y no depender del orden de ejecucion, pudiendo ejecutarse individualmente, en cualquier combinacion o en paralelo sin que los resultados se vean afectados. El estado inicial de cada prueba debe establecerse en los metodos de inicializacion, evitando compartir objetos mutables entre pruebas para prevenir interferencias.

Los casos limite, como valores nulos, cadenas vacias, numeros negativos, el valor cero, valores en los limites del rango permitido, colecciones vacias, y parametros extremos, deben probarse explicitamente, ya que concentran una alta proporcion de errores en los sistemas de produccion.

Las pruebas deben ejecutarse rapidamente, permitiendo su ejecucion frecuente como parte del proceso de desarrollo. Una suite de pruebas que tarda segundos se ejecuta decenas de veces al dia, mientras que una que tarda minutos se ejecuta solo antes de cada confirmacion de cambios. Las pruebas lentas deben identificarse y separarse de las pruebas unitarias rapidas, ejecutandose en una fase posterior del proceso de integracion continua.
