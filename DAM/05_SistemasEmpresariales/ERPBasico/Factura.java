package empresarial.erp;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class Factura {
    private static int contadorAnual = 0;
    private String numeroFactura;
    private ClienteEmpresa cliente;
    private Pedido pedido;
    private LocalDate fechaEmision;
    private LocalDate fechaVencimiento;
    private double baseImponible;
    private double iva;
    private double total;
    private boolean pagada;

    private static final double TIPO_IVA = 0.21;

    public Factura(Pedido pedido) {
        this.pedido = pedido;
        this.cliente = pedido.getCliente();
        this.fechaEmision = LocalDate.now();
        this.fechaVencimiento = fechaEmision.plusDays(30);
        this.baseImponible = pedido.getTotal();
        this.iva = baseImponible * TIPO_IVA;
        this.total = baseImponible + iva;
        this.pagada = false;

        int anio = fechaEmision.getYear();
        contadorAnual++;
        this.numeroFactura = String.format("F-%d-%04d", anio, contadorAnual);
    }

    public String getNumeroFactura() { return numeroFactura; }

    public ClienteEmpresa getCliente() { return cliente; }

    public Pedido getPedido() { return pedido; }

    public LocalDate getFechaEmision() { return fechaEmision; }

    public LocalDate getFechaVencimiento() { return fechaVencimiento; }

    public double getBaseImponible() { return baseImponible; }

    public double getIva() { return iva; }

    public double getTotal() { return total; }

    public boolean isPagada() { return pagada; }

    public void marcarPagada() {
        this.pagada = true;
        System.out.println("Factura " + numeroFactura + " marcada como pagada.");
    }

    public void imprimir() {
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        System.out.println("\n============================================");
        System.out.println("            FACTURA " + numeroFactura);
        System.out.println("============================================");
        System.out.println("Cliente: " + cliente.getRazonSocial());
        System.out.println("NIF: " + cliente.getNif());
        System.out.println("Fecha emision: " + fechaEmision.format(fmt));
        System.out.println("Fecha vencimiento: " + fechaVencimiento.format(fmt));
        System.out.println("--------------------------------------------");
        System.out.printf("Base imponible: %20.2f EUR%n", baseImponible);
        System.out.printf("IVA (%.0f%%): %22.2f EUR%n", TIPO_IVA * 100, iva);
        System.out.println("--------------------------------------------");
        System.out.printf("TOTAL: %25.2f EUR%n", total);
        System.out.println("Estado: " + (pagada ? "PAGADA" : "PENDIENTE"));
        System.out.println("============================================\n");
    }

    @Override
    public String toString() {
        return "Factura " + numeroFactura + " | " + cliente.getRazonSocial() +
               " | " + String.format("%.2f", total) + " EUR" +
               " | " + (pagada ? "Pagada" : "Pendiente");
    }
}
