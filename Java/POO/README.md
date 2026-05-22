# POO - Programacion Orientada a Objetos

## 1. Clases y Objetos

Una **clase** es un molde o plantilla que define el estado (atributos) y el comportamiento (metodos) de un tipo de objeto. Un **objeto** es una instancia concreta de una clase, con valores especificos para sus atributos.

```java
public class Coche {
    String marca;
    String modelo;
    int velocidad;

    void acelerar() {
        velocidad += 10;
    }

    void frenar() {
        if (velocidad >= 5) velocidad -= 5;
    }
}

Coche c = new Coche();
c.marca = "Toyota";
c.modelo = "Corolla";
c.acelerar();
```

### Constructores

Un constructor es un metodo especial que se ejecuta al crear un objeto. Tiene el mismo nombre que la clase y no devuelve nada.

```java
public class Coche {
    String marca;
    String modelo;

    public Coche(String marca, String modelo) {
        this.marca = marca;
        this.modelo = modelo;
    }
}

Coche c = new Coche("Toyota", "Corolla");
```

### Sobrecarga de constructores

Una clase puede tener varios constructores con distintos parametros.

```java
public class Rectangulo {
    private int ancho;
    private int alto;

    public Rectangulo() {
        this.ancho = 0;
        this.alto = 0;
    }

    public Rectangulo(int lado) {
        this.ancho = lado;
        this.alto = lado;
    }

    public Rectangulo(int ancho, int alto) {
        this.ancho = ancho;
        this.alto = alto;
    }
}
```

## 2. Encapsulacion

La encapsulacion consiste en ocultar los detalles internos de una clase y solo exponer una interfaz controlada mediante metodos publicos. Se logra usando modificadores de acceso:

- `private`: solo accesible desde la propia clase
- `default` (sin modificador): accesible desde el mismo paquete
- `protected`: accesible desde el mismo paquete y subclases
- `public`: accesible desde cualquier clase

```java
public class CuentaBancaria {
    private String titular;
    private double saldo;

    public CuentaBancaria(String titular, double saldoInicial) {
        this.titular = titular;
        if (saldoInicial >= 0) {
            this.saldo = saldoInicial;
        }
    }

    public double getSaldo() {
        return saldo;
    }

    public void depositar(double cantidad) {
        if (cantidad > 0) {
            saldo += cantidad;
        }
    }

    public boolean retirar(double cantidad) {
        if (cantidad > 0 && cantidad <= saldo) {
            saldo -= cantidad;
            return true;
        }
        return false;
    }
}
```

## 3. Herencia

La herencia permite que una clase hija reutilice atributos y metodos de una clase padre usando la palabra clave `extends`. La clase hija puede:

- Heredar metodos publicos y protected
- Sobrescribir metodos con `@Override`
- Anadir nuevos atributos y metodos
- Llamar al constructor del padre con `super()`

```java
public class Vehiculo {
    protected String matricula;
    protected String marca;
    protected int velocidadMaxima;

    public Vehiculo(String matricula, String marca, int velocidadMaxima) {
        this.matricula = matricula;
        this.marca = marca;
        this.velocidadMaxima = velocidadMaxima;
    }

    public String obtenerInformacion() {
        return marca + " (" + matricula + ") - " + velocidadMaxima + " km/h";
    }
}

public class Coche extends Vehiculo {
    private int numeroPuertas;

    public Coche(String matricula, String marca, int velocidadMaxima, int numeroPuertas) {
        super(matricula, marca, velocidadMaxima);
        this.numeroPuertas = numeroPuertas;
    }

    @Override
    public String obtenerInformacion() {
        return super.obtenerInformacion() + " - " + numeroPuertas + " puertas";
    }
}
```

## 4. Polimorfismo

El polimorfismo permite que una misma referencia pueda comportarse de diferentes formas segun el tipo real del objeto. Se manifiesta de dos formas:

### Polimorfismo en tiempo de compilacion (sobrecarga)

Mismo nombre de metodo, distintos parametros.

```java
public class Calculadora {
    public int sumar(int a, int b) { return a + b; }
    public double sumar(double a, double b) { return a + b; }
    public int sumar(int a, int b, int c) { return a + b + c; }
}
```

### Polimorfismo en tiempo de ejecucion (sobrescritura)

Una referencia de superclase apunta a un objeto de subclase. El metodo ejecutado se determina en tiempo de ejecucion.

```java
Vehiculo v1 = new Coche("1234ABC", "Seat", 180, 5);
Vehiculo v2 = new Moto("5678DEF", "Yamaha", 200, false);

// Ambos llaman a obtenerInformacion(), pero cada uno ejecuta su version
System.out.println(v1.obtenerInformacion());
System.out.println(v2.obtenerInformacion());
```

### El operador instanceof

Permite comprobar el tipo real de un objeto en tiempo de ejecucion.

```java
if (vehiculo instanceof Coche) {
    Coche c = (Coche) vehiculo;
    System.out.println("Puertas: " + c.getNumeroPuertas());
}
```

## 5. Interfaces

Una interfaz define un **contrato** que las clases deben cumplir. Todos los metodos de una interfaz son implicitamente `public` y `abstract`. Desde Java 8 pueden tener metodos `default` y `static`.

```java
public interface Imprimible {
    void imprimir();
    default void imprimirConFormato() {
        System.out.println("=== DOCUMENTO ===");
        imprimir();
        System.out.println("=== FIN ===");
    }
}

public interface Escaneable {
    void escanear();
}

public class ImpresoraMultifuncion implements Imprimible, Escaneable {
    @Override
    public void imprimir() {
        System.out.println("Imprimiendo documento...");
    }

    @Override
    public void escanear() {
        System.out.println("Escanendo documento...");
    }
}
```

## 6. Clases Abstractas

Una clase abstracta no puede instanciarse directamente. Puede contener metodos abstractos (sin implementacion) y metodos concretos.

```java
public abstract class Figura {
    protected String color;

    public Figura(String color) {
        this.color = color;
    }

    public abstract double calcularArea();

    public void mostrarColor() {
        System.out.println("Color: " + color);
    }
}

public class Circulo extends Figura {
    private double radio;

    public Circulo(String color, double radio) {
        super(color);
        this.radio = radio;
    }

    @Override
    public double calcularArea() {
        return Math.PI * radio * radio;
    }
}
```

## 7. Principios SOLID

### S - Single Responsibility Principle

Cada clase debe tener una unica responsabilidad y solo una razon para cambiar.

```java
// MAL: la clase gestiona clientes Y envia emails
public class ClienteService {
    public void guardarCliente(Cliente c) { /* logica BD */ }
    public void enviarEmailBienvenida(Cliente c) { /* logica email */ }
}

// BIEN: cada clase tiene una responsabilidad
public class ClienteRepository {
    public void guardar(Cliente c) { /* logica BD */ }
}

public class EmailService {
    public void enviarBienvenida(Cliente c) { /* logica email */ }
}
```

### O - Open/Closed Principle

Las clases deben estar abiertas a extension pero cerradas a modificacion.

```java
public abstract class Notificador {
    public abstract void enviar(String mensaje, String destino);
}

public class EmailNotificador extends Notificador {
    @Override
    public void enviar(String mensaje, String destino) {
        // enviar email
    }
}

public class SMSNotificador extends Notificador {
    @Override
    public void enviar(String mensaje, String destino) {
        // enviar SMS
    }
}
```

### L - Liskov Substitution Principle

Los subtipos deben poder sustituir a su tipo base sin alterar el comportamiento esperado.

### I - Interface Segregation Principle

Es mejor tener interfaces especificas que una interfaz general con muchos metodos.

### D - Dependency Inversion Principle

Las clases deben depender de abstracciones, no de implementaciones concretas.

```java
// MAL: depende de una implementacion concreta
public class PedidoService {
    private MySQLRepositorio repo = new MySQLRepositorio();
}

// BIEN: depende de una abstraccion
public class PedidoService {
    private Repositorio repo;
    public PedidoService(Repositorio repo) {
        this.repo = repo;
    }
}
```
