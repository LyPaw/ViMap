package poo;

abstract class Animal {
    protected String nombre;

    public Animal(String nombre) {
        this.nombre = nombre;
    }

    public abstract void hacerSonido();

    public void dormir() {
        System.out.println(nombre + " esta durmiendo.");
    }
}

class Perro extends Animal {
    public Perro(String nombre) {
        super(nombre);
    }

    @Override
    public void hacerSonido() {
        System.out.println(nombre + " dice: Guau guau!");
    }
}

class Gato extends Animal {
    public Gato(String nombre) {
        super(nombre);
    }

    @Override
    public void hacerSonido() {
        System.out.println(nombre + " dice: Miau miau!");
    }
}

class Vaca extends Animal {
    public Vaca(String nombre) {
        super(nombre);
    }

    @Override
    public void hacerSonido() {
        System.out.println(nombre + " dice: Muuuu!");
    }
}

public class Polimorfismo {
    public static void main(String[] args) {
        Animal[] animales = {
            new Perro("Rex"),
            new Gato("Luna"),
            new Vaca("Paca")
        };

        for (Animal a : animales) {
            a.hacerSonido();
            a.dormir();
            System.out.println();
        }

        // Sobrecarga de metodos (compile-time polymorphism)
        Calculadora calc = new Calculadora();
        System.out.println("Suma int: " + calc.sumar(5, 3));
        System.out.println("Suma double: " + calc.sumar(5.5, 3.2));
        System.out.println("Suma tres: " + calc.sumar(1, 2, 3));
    }
}

class Calculadora {
    public int sumar(int a, int b) {
        return a + b;
    }

    public double sumar(double a, double b) {
        return a + b;
    }

    public int sumar(int a, int b, int c) {
        return a + b + c;
    }
}
