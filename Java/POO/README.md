# POO - Programacion Orientada a Objetos

## Clases y Objetos

Una clase es un molde o plantilla que define el estado, mediante atributos, y el comportamiento, mediante metodos, de un tipo de objeto. Un objeto es una instancia concreta de una clase, con valores especificos para sus atributos. La creacion de objetos se realiza mediante la palabra clave new, que invoca al constructor de la clase. Los constructores son metodos especiales que tienen el mismo nombre que la clase y no devuelven ningun valor. Se ejecutan en el momento de crear un objeto y sirven para inicializar sus atributos. Una clase puede tener varios constructores con distintos parametros, lo que se conoce como sobrecarga de constructores. Dentro del constructor, la palabra clave this hace referencia al objeto actual y permite distinguir entre parametros y atributos cuando tienen el mismo nombre.

## Encapsulacion

La encapsulacion consiste en ocultar los detalles internos de una clase y solo exponer una interfaz controlada mediante metodos publicos. Esto se logra usando modificadores de acceso: private limita el acceso a la propia clase, default o sin modificador permite el acceso desde el mismo paquete, protected extiende el acceso a subclases, y public permite el acceso desde cualquier clase. La practica habitual es declarar los atributos como private y proporcionar metodos publicos getter y setter para acceder y modificar su valor. Esto permite controlar que valores son validos, por ejemplo rechazando edades negativas o saldos que dejarian una cuenta en numeros rojos. La encapsulacion es uno de los pilares fundamentales de la programacion orientada a objetos porque protege la integridad de los datos y permite cambiar la implementacion interna sin afectar a los usuarios de la clase.

## Herencia

La herencia permite que una clase hija reutilice atributos y metodos de una clase padre usando la palabra clave extends. La clase hija puede heredar metodos publicos y protected, puede sobrescribir metodos con la anotacion Override para cambiar su comportamiento, puede anadir nuevos atributos y metodos propios, y puede llamar al constructor del padre mediante super. La herencia modela relaciones de tipo es-un, como por ejemplo un empleado es una persona. Java solo permite herencia simple, es decir, una clase solo puede extender directamente de una superclase. La clase Object es la raiz de toda la jerarquia de clases en Java; todas las clases heredan de ella metodos como toString, equals y hashCode.

## Polimorfismo

El polimorfismo permite que una misma referencia pueda comportarse de diferentes formas segun el tipo real del objeto. Se manifiesta de dos formas: la sobrecarga, tambien llamado polimorfismo en tiempo de compilacion, donde un mismo nombre de metodo tiene distintos parametros; y la sobrescritura, o polimorfismo en tiempo de ejecucion, donde una referencia de superclase apunta a un objeto de subclase y el metodo ejecutado se determina en tiempo de ejecucion segun el tipo real. Esto permite escribir codigo generico que trabaje con la superclase y funcione correctamente con cualquier subclase. El operador instanceof permite comprobar el tipo real de un objeto en tiempo de ejecucion, lo que resulta util antes de realizar conversiones de tipo con casting.

## Interfaces

Una interfaz define un contrato que las clases deben cumplir. Todos los metodos de una interfaz son implicitamente public y abstract. Desde Java 8, las interfaces pueden tener metodos default con implementacion por defecto y metodos static. Una clase puede implementar multiples interfaces, lo que compensa la limitacion de la herencia simple. Las interfaces permiten definir comportamientos comunes entre clases no relacionadas jerarquicamente. Por ejemplo, tanto un Pato como un Avion pueden implementar una interfaz Volador aunque no compartan una superclase comun. Desde Java 9, las interfaces tambien pueden tener metodos privados para compartir codigo entre metodos default.

## Clases Abstractas

Una clase abstracta no puede instanciarse directamente y se declara con la palabra clave abstract. Puede contener metodos abstractos, que son metodos sin implementacion que las subclases deben implementar obligatoriamente, y metodos concretos con implementacion completa. A diferencia de las interfaces, las clases abstractas pueden tener atributos con cualquier modificador de acceso y constructores. Se utilizan cuando varias clases comparten estado y comportamiento comun, pero no tiene sentido crear instancias de la clase base.

## Principios SOLID

El primer principio, Single Responsibility, establece que cada clase debe tener una unica responsabilidad y solo una razon para cambiar. Esto mantiene las clases pequenas, enfocadas y faciles de mantener.

El segundo principio, Open Closed, indica que las clases deben estar abiertas a extension pero cerradas a modificacion. Esto significa que se debe poder anadir nuevo comportamiento creando nuevas clases que extiendan las existentes, sin modificar el codigo ya probado y funcionando.

El tercer principio, Liskov Substitution, afirma que los subtipos deben poder sustituir a su tipo base sin alterar el comportamiento esperado del programa. Si una subclase rompe las expectativas de la superclase, el diseno es incorrecto.

El cuarto principio, Interface Segregation, recomienda tener interfaces especificas y pequenas en lugar de una interfaz general con muchos metodos. Las clases no deben verse forzadas a implementar metodos que no necesitan.

El quinto principio, Dependency Inversion, establece que las clases deben depender de abstracciones, no de implementaciones concretas. Las clases de alto nivel no deben depender de clases de bajo nivel; ambas deben depender de abstracciones. Esto se logra tipicamente mediante inyeccion de dependencias.
