# Ejemplo de Diagrama de Clases UML

## Sistema de Gestion de Biblioteca

### Clases del modelo

```
+---------------------------+       +---------------------------+
|         Libro             |       |         Autor             |
+---------------------------+       +---------------------------+
| - isbn: String            |       | - id: int                |
| - titulo: String          |       | - nombre: String         |
| - anioPublicacion: int    |       | - apellidos: String      |
| - disponible: boolean     |       | - nacionalidad: String   |
+---------------------------+       +---------------------------+
| + prestar(): boolean      |       | + getNombreCompleto()    |
| + devolver(): boolean     |  *    |   : String               |
| + estaDisponible(): bool  |-------|                           |
+---------------------------+       +---------------------------+
        | 1
        |
        | *
+---------------------------+
|        Prestamo           |
+---------------------------+
| - id: int                 |
| - fechaInicio: Date       |
| - fechaDevolucion: Date   |
| - estado: String          |
+---------------------------+
| + estaVencido(): boolean  |
| + calcularMulta(): double |
+---------------------------+
        | *
        |
        | 1
+---------------------------+
|        Usuario            |
+---------------------------+
| - id: int                 |
| - nombre: String          |
| - email: String           |
| - telefono: String        |
| - maxPrestamos: int       |
+---------------------------+
| + puedePrestar(): boolean |
| + getPrestamosActivos()   |
|   : List<Prestamo>        |
+---------------------------+
```

### Codigo generado (forward engineering)

```java
public class Libro {
    private String isbn;
    private String titulo;
    private int anioPublicacion;
    private boolean disponible;
    private Autor autor;

    public boolean prestar() {
        if (disponible) {
            disponible = false;
            return true;
        }
        return false;
    }

    public boolean devolver() {
        disponible = true;
        return true;
    }

    public boolean estaDisponible() {
        return disponible;
    }
}

public class Autor {
    private int id;
    private String nombre;
    private String apellidos;
    private String nacionalidad;
    private List<Libro> libros;

    public String getNombreCompleto() {
        return nombre + " " + apellidos;
    }
}

public class Prestamo {
    private int id;
    private Date fechaInicio;
    private Date fechaDevolucion;
    private String estado;
    private Libro libro;
    private Usuario usuario;

    public boolean estaVencido() {
        return fechaDevolucion != null
            && new Date().after(fechaDevolucion);
    }

    public double calcularMulta() {
        if (!estaVencido()) return 0;
        long dias = (new Date().getTime()
            - fechaDevolucion.getTime())
            / (1000 * 60 * 60 * 24);
        return dias * 0.50;
    }
}

public class Usuario {
    private int id;
    private String nombre;
    private String email;
    private String telefono;
    private int maxPrestamos;
    private List<Prestamo> prestamos;

    public boolean puedePrestar() {
        return getPrestamosActivos().size() < maxPrestamos;
    }

    public List<Prestamo> getPrestamosActivos() {
        return prestamos.stream()
            .filter(p -> "ACTIVO".equals(p.getEstado()))
            .toList();
    }
}
```

## Ejercicio propuesto

Transforma el siguiente diagrama de clases a codigo Java:

```
+------------------+       +------------------+
|    Vehiculo      |       |     Motor        |
+------------------+       +------------------+
| - matricula      |       | - tipo           |
| - marca          | 1     | - cilindrada     |
| - modelo         |-------| - potencia       |
| - anyo           |       +------------------+
+------------------+       | + getInfo()      |
| + arrancar()     |       +------------------+
| + detener()      |
| + getInfo()      |
+------------------+
       A
       |
+------+--------+----------+
|               |           |
|               |           |
+----------+  +---------+  +-----------+
|  Coche   |  |  Moto   |  |  Camion   |
+----------+  +---------+  +-----------+
| numPuertas|  | tipo    |  | capacidad |
+----------+  +---------+  +-----------+
```
