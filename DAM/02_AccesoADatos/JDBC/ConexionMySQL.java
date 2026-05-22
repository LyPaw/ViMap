package accesodatos.jdbc;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class ConexionMySQL {
    private static final String URL = "jdbc:mysql://localhost:3306/mi_basedatos";
    private static final String USER = "root";
    private static final String PASSWORD = "password";

    public static Connection conectar() throws SQLException {
        Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
        System.out.println("Conexion establecida correctamente.");
        return conn;
    }

    public static void main(String[] args) {
        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;

        try {
            conn = conectar();
            stmt = conn.createStatement();

            String sql = "SELECT id, nombre, email FROM usuarios";
            rs = stmt.executeQuery(sql);

            System.out.println("Usuarios en la base de datos:");
            while (rs.next()) {
                int id = rs.getInt("id");
                String nombre = rs.getString("nombre");
                String email = rs.getString("email");
                System.out.println("ID: " + id + " | Nombre: " + nombre + " | Email: " + email);
            }

        } catch (SQLException e) {
            System.err.println("Error de base de datos: " + e.getMessage());
        } finally {
            try {
                if (rs != null) rs.close();
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
                System.out.println("Conexion cerrada.");
            } catch (SQLException e) {
                System.err.println("Error al cerrar: " + e.getMessage());
            }
        }
    }
}
