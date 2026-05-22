# Testing en Java

## Importancia de las pruebas unitarias

Las pruebas unitarias verifican el comportamiento de unidades individuales de codigo, como metodos o clases, de forma aislada del resto del sistema. Su objetivo es detectar errores temprano en el desarrollo, cuando son mas faciles y baratos de corregir. Ademas, facilitan la refactorizacion porque proporcionan una red de seguridad que confirma que los cambios no rompen la funcionalidad existente. Las pruebas tambien sirven como documentacion viva del comportamiento esperado del sistema, mostrando como se usa cada componente y que resultados produce en cada caso.

## JUnit 5

JUnit 5, tambien conocido como Jupiter, es el framework de pruebas unitarias mas utilizado en Java. Sus anotaciones principales permiten definir el ciclo de vida de las pruebas. Test marca un metodo como prueba ejecutable. BeforeEach indica que el metodo anotado debe ejecutarse antes de cada prueba, tipicamente para inicializar objetos. AfterEach se ejecuta despues de cada prueba para limpiar recursos. BeforeAll se ejecuta una vez antes de todas las pruebas y debe ser estatico. AfterAll se ejecuta una vez despues de todas las pruebas y tambien debe ser estatico. Disabled deshabilita temporalmente una prueba o clase de prueba. DisplayName proporciona un nombre descriptivo para la prueba en los informes. Tag permite etiquetar pruebas para filtrar su ejecucion. Nested permite agrupar pruebas relacionadas dentro de una clase interna.

## Aserciones

Las aserciones son el corazon de las pruebas unitarias. La clase Assertions del paquete org.junit.jupiter.api proporciona metodos estaticos para verificar resultados. assertEquals comprueba que dos valores son iguales, con una sobrecarga para numeros decimales que acepta un delta para la comparacion. assertTrue y assertFalse evaluan condiciones booleanas. assertNull y assertNotNull verifican nulos. assertSame y assertNotSame verifican que dos referencias apunten o no al mismo objeto. assertArrayEquals compara arrays elemento a elemento. assertThrows verifica que un bloque de codigo lanza una excepcion especifica. assertAll agrupa multiples aserciones para que todas se ejecuten aunque alguna falle, mostrando al final todos los errores encontrados. fail hace fallar la prueba directamente.

## Tests parametrizados

Los tests parametrizados permiten ejecutar la misma prueba con diferentes conjuntos de datos, evitando la duplicacion de codigo. La anotacion ParameterizedTest sustituye a Test y se combina con fuentes de datos como ValueSource para valores simples, CsvSource para tablas de valores separados por comas, y MethodSource para un metodo que proporciona los datos programaticamente.

## TDD

Test Driven Development es una metodologia de desarrollo que sigue el ciclo rojo-verde-refactor. Primero se escribe una prueba que falla porque la funcionalidad aun no existe, ese es el paso rojo. Luego se escribe el codigo minimo necesario para que la prueba pase, que es el paso verde. Finalmente se refactoriza el codigo para mejorarlo sin cambiar su comportamiento, manteniendo las pruebas verdes. Este ciclo se repite para cada nueva funcionalidad, garantizando que todo el codigo producido esta probado.

## Mocks con Mockito

Los mocks son objetos simulados que permiten aislar la unidad bajo prueba de sus dependencias externas como bases de datos, servicios web o sistemas de archivos. Mockito es la biblioteca de mocks mas utilizada en Java. Con Mockito se pueden crear objetos mock, definir su comportamiento con when, verificar interacciones con verify, y usar argument matchers como anyInt o anyString para generalizar las condiciones. Los mocks son esenciales para escribir pruebas unitarias verdaderas que no dependan del entorno.

## Cobertura de codigo

La cobertura de codigo mide que porcentaje del codigo es ejecutado por las pruebas. Las metricas principales son la cobertura de lineas, que cuenta cuantas lineas de codigo se ejecutan; la cobertura de ramas, que evalua si todas las bifurcaciones condicionales como if y else se han probado; y la cobertura de metodos, que indica cuantos metodos se invocan durante las pruebas. JaCoCo y Cobertura son las herramientas mas comunes para medir cobertura en proyectos Java. Como regla practica, se recomienda alcanzar al menos el ochenta por ciento de cobertura en la logica de negocio, sin obsesionarse con codigo trivial como getters y setters.

## Buenas practicas

Cada prueba debe verificar un comportamiento conceptual, ya sea con una asercion unica o con varias agrupadas en assertAll. Los nombres de las pruebas deben ser descriptivos, indicando que se prueba y en que condiciones. Las pruebas deben ser independientes entre si y no depender del orden de ejecucion. Se debe inicializar el estado en BeforeEach en lugar de compartir objetos entre pruebas. Los casos limite como valores nulos, vacios, negativos o cero deben probarse explicitamente. Las pruebas deben ejecutarse frecuentemente durante el desarrollo, idealmente en cada compilacion.
