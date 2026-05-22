# Programacion Orientada a Objetos en Java

## Clases y Objetos

Una **clase** es una plantilla que define atributos (variables) y metodos (funciones). Un **objeto** es una instancia concreta de una clase.

```java
public class Coche {
    String marca;
    int velocidad;

    void acelerar() { velocidad += 10; }
}

Coche c = new Coche();
c.marca = "Toyota";
c.acelerar();
```

## Encapsulacion

Usar `private` en atributos y `public` en getters/setters para ocultar el estado interno.

```java
public class Persona {
    private int edad;
    public int getEdad() { return edad; }
    public void setEdad(int e) {
        if (e >= 0) edad = e;
    }
}
```

## Herencia

Una clase hija hereda atributos y metodos de una clase padre con `extends`.

```java
public class Empleado extends Persona {
    private double salario;
    public double getSalario() { return salario; }
}
```

## Polimorfismo

Un objeto puede comportarse como su tipo real o como cualquier superclase.

```java
Persona p = new Empleado("Ana", 50000);
System.out.println(p.mostrarInfo());  // llama al metodo sobreescrito
```

## Interfaces

Definen un contrato que las clases deben implementar.

```java
interface Volable {
    void volar();
}

class Avion implements Volable {
    public void volar() { System.out.println("Volando..."); }
}
```

## Clases Abstractas

No se pueden instanciar; pueden tener metodos abstractos y concretos.

```java
abstract class Animal {
    abstract void hacerSonido();
    void dormir() { System.out.println("Zzz..."); }
}
```

## Principios SOLID

- **S**ingle Responsibility: una clase debe tener una unica responsabilidad
- **O**pen/Closed: abierto a extension, cerrado a modificacion
- **L**iskov Substitution: subtipos deben poder sustituir a su tipo base
- **I**nterface Segregation: interfaces especificas mejor que una general
- **D**ependency Inversion: depender de abstracciones, no de implementaciones
