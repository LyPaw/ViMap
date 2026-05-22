# POO - Programacion Orientada a Objetos

## Clases y Objetos

Una **clase** es una plantilla que define atributos y metodos. Un **objeto** es una instancia concreta.

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

`private` en atributos, `public` en getters/setters.

```java
public class Persona {
    private int edad;
    public int getEdad() { return edad; }
    public void setEdad(int e) { if (e>=0) edad = e; }
}
```

## Herencia

`extends` para heredar de una superclase.

```java
public class Empleado extends Persona {
    private double salario;
}
```

## Polimorfismo

Un objeto se comporta segun su tipo real.

```java
Persona p = new Empleado("Ana", 50000);
p.mostrarInfo();  // metodo sobreescrito
```

## Interfaces

Contrato que las clases deben implementar.

```java
interface Volable { void volar(); }
class Avion implements Volable {
    public void volar() { System.out.println("Volando"); }
}
```

## Clases Abstractas

No instanciables; pueden mezclar metodos abstractos y concretos.

```java
abstract class Animal {
    abstract void hacerSonido();
    void dormir() { System.out.println("Zzz..."); }
}
```

## SOLID

- SRP: una responsabilidad por clase
- OCP: abierto a extension, cerrado a modificacion
- LSP: subtipos sustituibles por su base
- ISP: interfaces especificas
- DIP: depender de abstracciones
