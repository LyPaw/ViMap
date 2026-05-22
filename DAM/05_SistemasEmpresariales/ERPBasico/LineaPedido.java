package empresarial.erp;

public class LineaPedido {
    private Producto producto;
    private int cantidad;
    private double precioUnitario;
    private double descuento;
    private double subtotal;

    public LineaPedido(Producto producto, int cantidad, double descuento) {
        this.producto = producto;
        this.cantidad = cantidad;
        this.precioUnitario = producto.getPrecioUnitario();
        this.descuento = descuento;
        double precioConDescuento = precioUnitario * (1 - descuento);
        this.subtotal = precioConDescuento * cantidad;
    }

    public Producto getProducto() { return producto; }

    public int getCantidad() { return cantidad; }

    public double getPrecioUnitario() { return precioUnitario; }

    public double getDescuento() { return descuento; }

    public double getSubtotal() { return subtotal; }

    @Override
    public String toString() {
        String descStr = descuento > 0
            ? String.format(" (-%.0f%%)", descuento * 100)
            : "";
        return String.format("  %s x%d @ %.2f%s = %.2f EUR",
            producto.getNombre(), cantidad, precioUnitario, descStr, subtotal);
    }
}
