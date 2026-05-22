package empresarial.erp;

public class Producto {
    private static int contador = 0;
    private int id;
    private String codigo;
    private String nombre;
    private String descripcion;
    private double precioUnitario;
    private int stockActual;
    private int stockMinimo;
    private boolean activo;

    public Producto(String codigo, String nombre, String descripcion,
                    double precioUnitario, int stockActual, int stockMinimo) {
        this.id = ++contador;
        this.codigo = codigo;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precioUnitario = precioUnitario;
        this.stockActual = stockActual;
        this.stockMinimo = stockMinimo;
        this.activo = true;
    }

    public int getId() { return id; }

    public String getCodigo() { return codigo; }

    public void setCodigo(String codigo) { this.codigo = codigo; }

    public String getNombre() { return nombre; }

    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }

    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public double getPrecioUnitario() { return precioUnitario; }

    public void setPrecioUnitario(double precioUnitario) {
        if (precioUnitario >= 0) {
            this.precioUnitario = precioUnitario;
        }
    }

    public int getStockActual() { return stockActual; }

    public boolean hayStock(int cantidad) {
        return stockActual >= cantidad;
    }

    public void reducirStock(int cantidad) {
        if (cantidad > 0 && hayStock(cantidad)) {
            this.stockActual -= cantidad;
        }
    }

    public void incrementarStock(int cantidad) {
        if (cantidad > 0) {
            this.stockActual += cantidad;
        }
    }

    public boolean necesitaReposicion() {
        return stockActual < stockMinimo;
    }

    public int getStockMinimo() { return stockMinimo; }

    public void setStockMinimo(int stockMinimo) {
        if (stockMinimo >= 0) {
            this.stockMinimo = stockMinimo;
        }
    }

    public boolean isActivo() { return activo; }

    public void setActivo(boolean activo) { this.activo = activo; }

    @Override
    public String toString() {
        return "Producto[" + codigo + "] " + nombre +
               " - " + String.format("%.2f", precioUnitario) + " EUR" +
               " (Stock: " + stockActual + ")";
    }
}
