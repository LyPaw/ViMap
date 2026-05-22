package poo;

abstract class Animal {
    protected String nombre;
    public Animal(String nombre) { this.nombre = nombre; }
    public abstract void hacerSonido();
    public void dormir() { System.out.println(nombre + " esta durmiendo."); }
}

class Perro extends Animal {
    public Perro(String nombre) { super(nombre); }
    @Override public void hacerSonido() { System.out.println(nombre + " dice: Guau!"); }
}

class Gato extends Animal {
    public Gato(String nombre) { super(nombre); }
    @Override public void hacerSonido() { System.out.println(nombre + " dice: Miau!"); }
}

public class Polimorfismo {
    public static void main(String[] args) {
        Animal[] animales = { new Perro("Rex"), new Gato("Luna") };
        for (Animal a : animales) {
            a.hacerSonido();
            a.dormir();
        }
    }
}
