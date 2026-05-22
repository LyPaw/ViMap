package empresarial.erp;

public class MainERP {
    public static void main(String[] args) {
        System.out.println("=== SISTEMA ERP ViMap ===\n");

        // Crear productos
        Producto p1 = new Producto("PORT-001", "Portatil Pro", "Portatil 16GB RAM, 512GB SSD", 899.99, 10, 3);
        Producto p2 = new Producto("MON-001", "Monitor 27\"", "Monitor IPS 4K 27 pulgadas", 349.50, 5, 2);
        Producto p3 = new Producto("TEC-001", "Teclado Mecanico", "Teclado RGB switches Cherry MX", 89.95, 20, 5);
        Producto p4 = new Producto("RAT-001", "Raton Inalambrico", "Raton ergonomico 8000 DPI", 49.99, 15, 5);

        System.out.println("--- Productos ---");
        System.out.println(p1);
        System.out.println(p2);
        System.out.println(p3);
        System.out.println(p4);

        // Crear clientes
        ClienteEmpresa c1 = new ClienteEmpresa("B12345678", "Tecnologia Avanzada SL", "info@tecavanza.es");
        c1.setTelefono("912345678");
        c1.setDireccion("Calle Mayor 10, Madrid");

        ClienteEmpresa c2 = new ClienteEmpresa("B87654321", "Informatica Global SA", "ventas@infoglobal.es");
        c2.setTelefono("934567890");
        c2.setVip(true);
        c2.setCreditoDisponible(50000);

        System.out.println("\n--- Clientes ---");
        System.out.println(c1);
        System.out.println(c2);

        // Crear pedidos
        System.out.println("\n--- Pedido 1 ---");
        Pedido pedido1 = new Pedido(c1);
        pedido1.agregarLinea(p1, 2);
        pedido1.agregarLinea(p3, 5);
        System.out.println(pedido1);
        boolean confirmado1 = pedido1.confirmar();
        System.out.println("Confirmado: " + (confirmado1 ? "SI" : "NO (credito insuficiente)"));

        System.out.println("\n--- Pedido 2 (Cliente VIP, 10% descuento) ---");
        Pedido pedido2 = new Pedido(c2);
        pedido2.agregarLinea(p2, 3);
        pedido2.agregarLinea(p4, 10);
        System.out.println(pedido2);
        pedido2.confirmar();
        System.out.println("Confirmado: SI");

        System.out.println("\n--- Stock tras pedidos ---");
        System.out.println(p1);
        System.out.println(p3);
        System.out.println(p2);

        // Facturas
        System.out.println("\n--- Facturas ---");
        Factura f1 = new Factura(pedido1);
        f1.imprimir();

        Factura f2 = new Factura(pedido2);
        f2.imprimir();

        f1.marcarPagada();
    }
}
