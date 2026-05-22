package accesodatos.jdbc;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class ConsultasAvanzadas {
    private static final String URL = "jdbc:mysql://localhost:3306/mi_basedatos";
    private static final String USER = "root";
    private static final String PASSWORD = "password";

    public static void main(String[] args) {
        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD)) {

            // Busqueda con LIKE
            String busqueda = "%ana%";
            String sqlLike = "SELECT id, nombre, email FROM usuarios WHERE nombre LIKE ?";
            try (PreparedStatement ps = conn.prepareStatement(sqlLike)) {
                ps.setString(1, busqueda);
                try (ResultSet rs = ps.executeQuery()) {
                    System.out.println("Usuarios que contienen 'ana' en el nombre:");
                    while (rs.next()) {
                        System.out.println("  " + rs.getInt("id") + ": " + rs.getString("nombre"));
                    }
                }
            }

            // Consulta con JOIN (pedidos y usuarios)
            String sqlJoin = """
                SELECT u.nombre, p.id AS pedido_id, p.total, p.fecha
                FROM usuarios u
                INNER JOIN pedidos p ON u.id = p.usuario_id
                WHERE p.total > ?
                ORDER BY p.total DESC
                """;
            try (PreparedStatement ps = conn.prepareStatement(sqlJoin)) {
                ps.setDouble(1, 50.0);
                try (ResultSet rs = ps.executeQuery()) {
                    System.out.println("\nPedidos mayores a 50 EUR:");
                    while (rs.next()) {
                        System.out.printf("  %s | Pedido #%d | %.2f EUR%n",
                            rs.getString("nombre"),
                            rs.getInt("pedido_id"),
                            rs.getDouble("total"));
                    }
                }
            }

            // Transaccion: insertar pedido con lineas
            conn.setAutoCommit(false);
            try {
                String sqlPedido = "INSERT INTO pedidos (usuario_id, total, fecha) VALUES (?, ?, NOW())";
                PreparedStatement psPedido = conn.prepareStatement(sqlPedido,
                    PreparedStatement.RETURN_GENERATED_KEYS);
                psPedido.setInt(1, 1);
                psPedido.setDouble(2, 150.50);
                psPedido.executeUpdate();

                ResultSet rsKeys = psPedido.getGeneratedKeys();
                int pedidoId = 0;
                if (rsKeys.next()) {
                    pedidoId = rsKeys.getInt(1);
                }

                String sqlLinea = "INSERT INTO lineas_pedido (pedido_id, producto, cantidad, precio) VALUES (?, ?, ?, ?)";
                try (PreparedStatement psLinea = conn.prepareStatement(sqlLinea)) {
                    psLinea.setInt(1, pedidoId);
                    psLinea.setString(2, "Portatil Pro");
                    psLinea.setInt(3, 1);
                    psLinea.setDouble(4, 150.50);
                    psLinea.executeUpdate();
                }

                conn.commit();
                System.out.println("\nTransaccion completada: Pedido #" + pedidoId + " creado.");

            } catch (SQLException e) {
                conn.rollback();
                System.err.println("Transaccion revertida: " + e.getMessage());
            }

        } catch (SQLException e) {
            System.err.println("Error: " + e.getMessage());
        }
    }
}
