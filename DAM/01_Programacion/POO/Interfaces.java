package poo;

interface Volador {
    void volar();
    void aterrizar();
}

interface Nadador {
    void nadar();
    void sumergirse();
}

interface Corredor {
    void correr();
}

class Pato implements Volador, Nadador, Corredor {
    private String nombre;

    public Pato(String nombre) {
        this.nombre = nombre;
    }

    @Override
    public void volar() {
        System.out.println(nombre + " vuela batiendo las alas.");
    }

    @Override
    public void aterrizar() {
        System.out.println(nombre + " aterriza suavemente.");
    }

    @Override
    public void nadar() {
        System.out.println(nombre + " nada en el estanque.");
    }

    @Override
    public void sumergirse() {
        System.out.println(nombre + " se sumerge buscando comida.");
    }

    @Override
    public void correr() {
        System.out.println(nombre + " corre patosamente.");
    }
}

class Avion implements Volador {
    private String modelo;

    public Avion(String modelo) {
        this.modelo = modelo;
    }

    @Override
    public void volar() {
        System.out.println("El avion " + modelo + " vuela a 900 km/h.");
    }

    @Override
    public void aterrizar() {
        System.out.println("El avion " + modelo + " aterriza en la pista.");
    }
}

public class Interfaces {
    public static void main(String[] args) {
        Pato donald = new Pato("Donald");
        Avion boeing = new Avion("Boeing 747");

        donald.volar();
        donald.nadar();
        donald.correr();
        System.out.println();

        boeing.volar();
        boeing.aterrizar();
        System.out.println();

        // Polimorfismo con interfaces
        Volador[] voladores = { donald, boeing };
        for (Volador v : voladores) {
            v.volar();
        }
    }
}
