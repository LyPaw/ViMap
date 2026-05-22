package empresarial.erp;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class Pedido {
    private static int contador = 0;
    private int id;
    private ClienteEmpresa cliente;
    private List<LineaPedido> lineas;
    private LocalDate fecha;
    private String estado;
    private double total;

    public enum Estado {
        PENDIENTE, CONFIRMADO, PREPARACION, ENVIADO, ENTREGADO, CANCELADO
    }

    public Pedido(ClienteEmpresa cliente) {
        this.id = ++contador;
        this.cliente = cliente;
        this.lineas = new ArrayList<>();
        this.fecha = LocalDate.now();
        this.estado = Estado.PENDIENTE.name();
        this.total = 0.0;
    }

    public int getId() { return id; }

    public ClienteEmpresa getCliente() { return cliente; }

    public List<LineaPedido> getLineas() {
        return new ArrayList<>(lineas);
    }

    public LocalDate getFecha() { return fecha; }

    public String getEstado() { return estado; }

    public void setEstado(String estado) { this.estado = estado; }

    public double getTotal() { return total; }

    public void agregarLinea(Producto producto, int cantidad) {
        if (producto.isActivo() && producto.hayStock(cantidad)) {
            double descuento = cliente.getDescuento();
            LineaPedido linea = new LineaPedido(producto, cantidad, descuento);
            lineas.add(linea);
            producto.reducirStock(cantidad);
            recalcularTotal();
        }
    }

    private void recalcularTotal() {
        this.total = lineas.stream()
            .mapToDouble(LineaPedido::getSubtotal)
            .sum();
    }

    public boolean confirmar() {
        if (cliente.tieneCreditoSuficiente(total)) {
            this.estado = Estado.CONFIRMADO.name();
            cliente.descontarCredito(total);
            return true;
        }
        return false;
    }

    public void cancelar() {
        this.estado = Estado.CANCELADO.name();
        for (LineaPedido linea : lineas) {
            linea.getProducto().incrementarStock(linea.getCantidad());
        }
        System.out.println("Pedido #" + id + " cancelado. Stock restaurado.");
    }

    @Override
    public String toString() {
        return "Pedido #" + id + " | " + cliente.getRazonSocial() +
               " | " + fecha + " | " + estado +
               " | Total: " + String.format("%.2f", total) + " EUR";
    }
}
