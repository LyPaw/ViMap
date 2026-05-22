package poo;

public class Empleado extends Persona {
    private String puesto;
    private double salario;
    private static int contadorEmpleados = 0;

    public Empleado(String nombre, int edad, String dni, String puesto, double salario) {
        super(nombre, edad, dni);
        this.puesto = puesto;
        this.salario = salario;
        contadorEmpleados++;
    }

    public String getPuesto() {
        return puesto;
    }

    public void setPuesto(String puesto) {
        this.puesto = puesto;
    }

    public double getSalario() {
        return salario;
    }

    public void setSalario(double salario) {
        if (salario >= 0) {
            this.salario = salario;
        }
    }

    public void aumentarSalario(double porcentaje) {
        if (porcentaje > 0) {
            this.salario += this.salario * porcentaje / 100.0;
        }
    }

    public static int getContadorEmpleados() {
        return contadorEmpleados;
    }

    @Override
    public void mostrarDatos() {
        super.mostrarDatos();
        System.out.println("Puesto: " + puesto);
        System.out.println("Salario: " + salario + " EUR");
    }

    @Override
    public String toString() {
        return super.toString() + " -> Empleado{puesto='" + puesto + "', salario=" + salario + "}";
    }

    public static void main(String[] args) {
        Empleado emp = new Empleado("Ana Lopez", 30, "12345678A", "Desarrolladora", 35000);
        emp.mostrarDatos();
        System.out.println();
        emp.aumentarSalario(10);
        System.out.println("Salario tras aumento del 10%: " + emp.getSalario() + " EUR");
        System.out.println("Total empleados: " + Empleado.getContadorEmpleados());
    }
}
