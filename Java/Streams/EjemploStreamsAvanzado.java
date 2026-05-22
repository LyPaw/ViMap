package streams;

import java.util.*;
import java.util.stream.Collectors;

public class EjemploStreamsAvanzado {
    public static void main(String[] args) {
        List<Producto> productos = Arrays.asList(
            new Producto("Portatil", 899.99, "Electronica"),
            new Producto("Teclado", 89.95, "Accesorios"),
            new Producto("Monitor", 349.50, "Electronica"),
            new Producto("Raton", 49.99, "Accesorios"),
            new Producto("Impresora", 199.99, "Oficina")
        );

        // Filtrar por precio > 100 y ordenar
        List<Producto> caros = productos.stream()
            .filter(p -> p.getPrecio() > 100)
            .sorted(Comparator.comparing(Producto::getPrecio).reversed())
            .collect(Collectors.toList());
        System.out.println("Productos > 100 EUR: " + caros);

        // Agrupar por categoria
        Map<String, List<Producto>> porCategoria = productos.stream()
            .collect(Collectors.groupingBy(Producto::getCategoria));
        System.out.println("\nPor categoria:");
        porCategoria.forEach((cat, prods) -> System.out.println("  " + cat + ": " + prods));

        // Precio medio por categoria
        Map<String, Double> precioMedio = productos.stream()
            .collect(Collectors.groupingBy(Producto::getCategoria,
                Collectors.averagingDouble(Producto::getPrecio)));
        System.out.println("\nPrecio medio por categoria: " + precioMedio);

        // Nombre mas largo
        Optional<Producto> nombreLargo = productos.stream()
            .max(Comparator.comparing(p -> p.getNombre().length()));
        nombreLargo.ifPresent(p -> System.out.println("\nNombre mas largo: " + p));

        // Reduce: suma total
        double total = productos.stream()
            .mapToDouble(Producto::getPrecio)
            .sum();
        System.out.println("Total inventario: " + total + " EUR");
    }
}

class Producto {
    private String nombre;
    private double precio;
    private String categoria;

    public Producto(String nombre, double precio, String categoria) {
        this.nombre = nombre; this.precio = precio; this.categoria = categoria;
    }
    public String getNombre() { return nombre; }
    public double getPrecio() { return precio; }
    public String getCategoria() { return categoria; }
    @Override
    public String toString() { return nombre + " (" + precio + " EUR)"; }
}
