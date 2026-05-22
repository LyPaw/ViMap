# Colecciones en Java

## El Java Collections Framework

El JCF proporciona una arquitectura unificada para almacenar y manipular grupos de objetos. Incluye interfaces que definen tipos abstractos de colecciones, implementaciones concretas que realizan esas interfaces, y algoritmos estaticos en la clase Collections para ordenar, buscar y mezclar elementos. La interfaz raiz es Collection, de la que heredan List, Set y Queue. La interfaz Map no hereda de Collection pero forma parte del framework.

## List

La interfaz List representa una coleccion ordenada que permite elementos duplicados y acceso posicional mediante indice. Su implementacion principal es ArrayList, basada en un array redimensionable que ofrece acceso por indice en tiempo constante pero insercion y eliminacion en medio en tiempo lineal. LinkedList esta basada en una lista doblemente enlazada, ofreciendo insercion y eliminacion en los extremos en tiempo constante pero acceso por indice en tiempo lineal. LinkedList tambien implementa Queue y Deque, por lo que puede usarse como cola FIFO con offer y poll, o como pila LIFO con push y pop.

## Set

La interfaz Set representa una coleccion que no permite elementos duplicados. La igualdad entre elementos se determina mediante los metodos equals y hashCode. HashSet es la implementacion mas utilizada, basada en una tabla hash que ofrece rendimiento constante para insercion, busqueda y eliminacion, pero sin garantizar ningun orden. TreeSet esta basado en un arbol rojo-negro y mantiene los elementos ordenados segun su orden natural o un Comparator proporcionado, con rendimiento logaritmico. LinkedHashSet mantiene el orden de insercion con un rendimiento similar a HashSet.

## Map

La interfaz Map almacena pares clave-valor, donde las claves son unicas. HashMap ofrece rendimiento constante para insercion, busqueda y eliminacion basado en el codigo hash de las claves. TreeMap mantiene las claves ordenadas con rendimiento logaritmico. LinkedHashMap mantiene el orden de insercion. El metodo getOrDefault permite obtener un valor por defecto si la clave no existe. computeIfAbsent calcula un valor solo si la clave esta ausente, lo que resulta util para inicializar estructuras anidadas. Merge permite combinar valores existentes con uno nuevo mediante una funcion, siendo especialmente util para contar frecuencias de palabras o acumular valores. ConcurrentHashMap es una version thread-safe para entornos concurrentes que no permite null como clave ni valor.

## Stream API

Los streams, introducidos en Java 8, permiten procesar colecciones de forma declarativa y funcional. Un stream no es una estructura de datos sino una secuencia de elementos sobre la que se aplican operaciones. Las operaciones se dividen en intermedias, que devuelven un nuevo stream y son lazy, y terminales, que producen un resultado o efecto lateral. Las operaciones intermedias incluyen filter para seleccionar elementos segun un predicado, map para transformar cada elemento, flatMap para aplanar streams anidados, sorted para ordenar, distinct para eliminar duplicados, limit para acotar el numero de elementos, skip para saltar elementos, y peek para inspeccionar sin modificar. Las operaciones terminales incluyen collect para convertir a coleccion, reduce para combinar elementos en un solo valor, forEach para iterar, count para contar, anyMatch allMatch y noneMatch para realizar comprobaciones booleanas, y findFirst y findAny para obtener un elemento.

## Expresiones Lambda

Las expresiones lambda son funciones anonimas que pueden ser tratadas como valores. Su sintaxis consiste en una lista de parametros entre parentesis, una flecha, y un cuerpo que puede ser una expresion o un bloque de sentencias. Las lambdas se usan principalmente para implementar interfaces funcionales, que son interfaces con un unico metodo abstracto. Java proporciona interfaces funcionales predefinidas en el paquete java.util.function: Function que recibe un valor y devuelve otro, Predicate que recibe un valor y devuelve un booleano, Consumer que recibe un valor y no devuelve nada, Supplier que no recibe nada y devuelve un valor, UnaryOperator que recibe y devuelve del mismo tipo, y BinaryOperator que recibe dos valores del mismo tipo y devuelve uno.

## Method References

Las referencias a metodos son una forma abreviada de escribir lambdas cuando ya existe un metodo que realiza la operacion deseada. La sintaxis usa el operador :: y puede referirse a metodos estaticos, metodos de instancia, metodos de un objeto especifico, o constructores.

## Optional

Optional es un contenedor que puede contener o no un valor, disenado para evitar los NullPointerException. Proporciona metodos como isPresent para comprobar si hay valor, ifPresent para ejecutar una accion si lo hay, orElse para devolver un valor por defecto, orElseGet para calcular un valor por defecto solo si es necesario, orElseThrow para lanzar una excepcion si no hay valor, map para transformar el valor si existe, filter para aplicar un predicado, y flatMap para evitar anidar opcionales.
