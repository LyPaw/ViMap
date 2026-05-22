package poo;

interface Volador { void volar(); void aterrizar(); }
interface Nadador { void nadar(); void sumergirse(); }

class Pato implements Volador, Nadador {
    private String nombre;
    public Pato(String nombre) { this.nombre = nombre; }
    @Override public void volar() { System.out.println(nombre + " vuela."); }
    @Override public void aterrizar() { System.out.println(nombre + " aterriza."); }
    @Override public void nadar() { System.out.println(nombre + " nada."); }
    @Override public void sumergirse() { System.out.println(nombre + " se sumerge."); }
}

class Avion implements Volador {
    private String modelo;
    public Avion(String modelo) { this.modelo = modelo; }
    @Override public void volar() { System.out.println("Avion " + modelo + " vuela."); }
    @Override public void aterrizar() { System.out.println("Avion " + modelo + " aterriza."); }
}

public class Interfaces {
    public static void main(String[] args) {
        Pato p = new Pato("Donald");
        Avion a = new Avion("Boeing 747");
        p.volar(); p.nadar(); a.volar();
    }
}
