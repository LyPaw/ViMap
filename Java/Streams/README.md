# Streams y Programacion Funcional

## Introduccion a la programacion funcional en Java

Java 8 introdujo las expresiones lambda y la Stream API, permitiendo un estilo de programacion funcional donde las operaciones se expresan de forma declarativa indicando que se quiere hacer en lugar de como hacerlo. El paradigma imperativo tradicional utiliza bucles y condicionales para recorrer colecciones y acumular resultados, mientras que el enfoque funcional encadena operaciones como filtros, transformaciones y reducciones sobre la coleccion.

## Expresiones lambda

Una expresion lambda es una funcion anonima que puede ser tratada como un valor y pasada como argumento a otros metodos. Su sintaxis consiste en una lista de parametros separados por comas, el operador flecha, y un cuerpo que puede ser una expresion unica o un bloque de sentencias entre llaves. Las lambdas dependen de las interfaces funcionales, que son interfaces con un unico metodo abstracto. El paquete java.util.function proporciona las interfaces funcionales mas comunes: Function que transforma una entrada en una salida, Predicate que evalua una condicion booleana, Consumer que realiza una accion sin devolver resultado, Supplier que genera un valor sin entrada, UnaryOperator que aplica una operacion sobre un tipo y devuelve el mismo tipo, y BinaryOperator que combina dos valores del mismo tipo en uno.

## Method References

Las referencias a metodos son una sintaxis abreviada para escribir lambdas cuando ya existe un metodo que realiza exactamente la operacion deseada. Se escriben usando el operador doble dos puntos seguido del nombre del metodo. Pueden referirse a metodos estaticos, a metodos de instancia de un objeto particular, a metodos de instancia de una clase determinada por el parametro, o a constructores.

## Stream API

Un Stream es una secuencia de elementos sobre la que se aplican operaciones funcionales. No almacena datos, sino que los procesa bajo demanda. El pipeline de un stream consta de tres partes: una fuente de datos, cero o mas operaciones intermedias que transforman el stream, y una operacion terminal que produce el resultado. Las operaciones intermedias son lazy, lo que significa que no se ejecutan hasta que se invoca una operacion terminal.

Las fuentes de streams pueden ser colecciones mediante el metodo stream, arrays mediante Arrays.stream, valores directos mediante Stream.of, rangos numericos con IntStream.range, o generadores infinitos con Stream.generate y Stream.iterate limitados con limit.

## Operaciones Intermedias

filter selecciona los elementos que cumplen una condicion dada por un Predicate. map transforma cada elemento aplicando una Function. flatMap aplana streams anidados, siendo util cuando cada elemento se transforma en un stream y se quiere un unico stream resultante. sorted ordena los elementos segun el orden natural o un Comparator. distinct elimina elementos duplicados usando equals. limita toma los primeros n elementos. skip salta los primeros n elementos. peek ejecuta una accion sobre cada elemento sin modificar el stream, siendo util para depuracion.

## Operaciones Terminales

collect ensambla los elementos en una coleccion u otro resultado usando un Collector. reduce combina los elementos en un unico valor mediante una operacion asociativa. forEach ejecuta una accion para cada elemento. count devuelve el numero de elementos. anyMatch, allMatch y noneMatch evaluan si alguno, todos o ningun elemento cumplen un predicado, respectivamente. findFirst y findAny devuelven un Optional con el primer o cualquier elemento del stream.

## Collectors

La clase Collectors proporciona implementaciones de Collector para las operaciones mas comunes. toList, toSet y toMap convierten a colecciones. groupingBy agrupa elementos segun una clave, produciendo un mapa donde cada clave tiene una lista de elementos. partitioningBy divide los elementos en dos grupos segun un predicado. joining concatena los elementos como cadenas. summingInt, averagingInt y summarizingInt realizan operaciones estadisticas. mapping aplica una transformacion antes de recolectar.

## Optional

Optional es un contenedor que puede contener un valor o estar vacio, disenado para evitar los NullPointerException. Su uso fomenta que el programador maneje explicitamente la ausencia de valor. Los metodos principales son map para transformar el valor si existe, flatMap para evitar Optional anidados, filter para aplicar un predicado, orElse para devolver un valor por defecto, orElseGet para calcularlo solo si es necesario, orElseThrow para lanzar una excepcion si no hay valor, ifPresent para ejecutar una accion si existe, e ifPresentOrElse para ejecutar una accion u otra segun haya valor o no.

## Streams paralelos

Los streams pueden ejecutarse en paralelo dividiendo la carga entre multiples hilos, lo que puede mejorar el rendimiento en colecciones grandes con operaciones costosas. Se obtienen mediante parallelStream o convirtiendo un stream secuencial con parallel. Sin embargo, el orden de procesamiento no esta garantizado, las operaciones con estado como limit pueden ser problematicas, y el beneficio solo se nota con conjuntos de datos suficientemente grandes. forEachOrdered preserva el orden si es necesario, pero reduce el paralelismo.
