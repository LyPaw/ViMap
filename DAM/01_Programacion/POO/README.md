# Programacion Orientada a Objetos (POO)

## Conceptos fundamentales

1.  **Clase y Objeto**: una clase es una plantilla que define atributos y metodos. Un objeto es una instancia concreta de una clase.
2.  **Encapsulacion**: ocultacion de los detalles internos mediante modificadores de acceso (private, public, protected). Los atributos se exponen via getters/setters.
3.  **Herencia**: mecanismo por el cual una clase hija hereda atributos y metodos de una clase padre. Se usa `extends`.
4.  **Polimorfismo**: capacidad de un objeto de comportarse de distintas formas. Sobrecarga (compile-time) y sobreescritura (runtime).
5.  **Abstraccion**: modelado de entidades del mundo real mediante clases abstractas e interfaces.
6.  **Interfaces**: contrato que define metodos que las clases implementadoras deben cumplir. Soporte de herencia multiple via interfaces.

## Relaciones entre clases

-   Asociacion: uso simple entre clases.
-   Agregacion: relacion todo-parte debil (las partes existen independientemente).
-   Composicion: relacion todo-parte fuerte (las partes no existen sin el todo).
-   Dependencia: una clase usa temporalmente a otra.

## Principios SOLID

-   **S**ingle Responsibility: una clase debe tener una unica responsabilidad.
-   **O**pen/Closed: abierta a extension, cerrada a modificacion.
-   **L**iskov Substitution: una subclase debe poder sustituir a su superclase.
-   **I**nterface Segregation: interfaces especificas mejor que una general.
-   **D**ependency Inversion: depender de abstracciones, no de implementaciones.

## Ejercicios propuestos

1.  Disena un sistema de vehiculos con clases Coche, Moto, Bicicleta que hereden de Vehiculo. Implementa el metodo mover() de forma polimorfica.
2.  Crea una interfaz `Imprimible` con un metodo `imprimir()` y haz que varias clases la implementen (Factura, Informe, Etiqueta).
3.  Implementa el patron Singleton para una clase `Configuracion` que gestione parametros globales de la aplicacion.
4.  Disena un sistema de figuras geometricas usando una clase abstracta Figura con metodos area() y perimetro().
