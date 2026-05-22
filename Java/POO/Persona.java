package poo;

public class Persona {
    private String nombre;
    private int edad;
    private String dni;

    public Persona(String nombre, int edad, String dni) {
        this.nombre = nombre;
        this.edad = edad;
        this.dni = dni;
    }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public int getEdad() { return edad; }
    public void setEdad(int edad) { if (edad >= 0 && edad <= 150) this.edad = edad; }
    public String getDni() { return dni; }
    public void setDni(String dni) { this.dni = dni; }

    public void mostrarDatos() {
        System.out.println("Nombre: " + nombre + ", Edad: " + edad + ", DNI: " + dni);
    }

    public static void main(String[] args) {
        Persona p = new Persona("Ana Lopez", 25, "12345678A");
        p.mostrarDatos();
    }
}
