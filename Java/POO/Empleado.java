package poo;

public class Empleado extends Persona {
    private String puesto;
    private double salario;

    public Empleado(String nombre, int edad, String dni, String puesto, double salario) {
        super(nombre, edad, dni);
        this.puesto = puesto;
        this.salario = salario;
    }

    public String getPuesto() { return puesto; }
    public void setPuesto(String puesto) { this.puesto = puesto; }
    public double getSalario() { return salario; }
    public void setSalario(double salario) { if (salario >= 0) this.salario = salario; }

    public void aumentarSalario(double porcentaje) {
        if (porcentaje > 0) this.salario += this.salario * porcentaje / 100.0;
    }

    @Override
    public void mostrarDatos() {
        super.mostrarDatos();
        System.out.println("Puesto: " + puesto + ", Salario: " + salario + " EUR");
    }

    public static void main(String[] args) {
        Empleado e = new Empleado("Carlos Ruiz", 30, "87654321B", "Desarrollador", 35000);
        e.mostrarDatos();
        e.aumentarSalario(10);
        System.out.println("Nuevo salario: " + e.getSalario() + " EUR");
    }
}
