package accesodatos.jdbc;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class CRUDEjemplo {
    private static final String URL = "jdbc:mysql://localhost:3306/mi_basedatos";
    private static final String USER = "root";
    private static final String PASSWORD = "password";

    private Connection conn;

    public CRUDEjemplo() throws SQLException {
        this.conn = DriverManager.getConnection(URL, USER, PASSWORD);
    }

    public void insertar(String nombre, String email, int edad) throws SQLException {
        String sql = "INSERT INTO usuarios (nombre, email, edad) VALUES (?, ?, ?)";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, nombre);
            ps.setString(2, email);
            ps.setInt(3, edad);
            int filas = ps.executeUpdate();
            System.out.println("Insertadas " + filas + " fila(s).");
        }
    }

    public void listar() throws SQLException {
        String sql = "SELECT id, nombre, email, edad FROM usuarios";
        try (Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            System.out.println("\n--- Listado de usuarios ---");
            while (rs.next()) {
                System.out.printf("ID: %d | %s | %s | %d anios%n",
                    rs.getInt("id"),
                    rs.getString("nombre"),
                    rs.getString("email"),
                    rs.getInt("edad"));
            }
        }
    }

    public void actualizar(int id, String nuevoEmail) throws SQLException {
        String sql = "UPDATE usuarios SET email = ? WHERE id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, nuevoEmail);
            ps.setInt(2, id);
            int filas = ps.executeUpdate();
            System.out.println("Actualizadas " + filas + " fila(s).");
        }
    }

    public void eliminar(int id) throws SQLException {
        String sql = "DELETE FROM usuarios WHERE id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            int filas = ps.executeUpdate();
            System.out.println("Eliminadas " + filas + " fila(s).");
        }
    }

    public void cerrar() throws SQLException {
        if (conn != null && !conn.isClosed()) {
            conn.close();
            System.out.println("Conexion cerrada.");
        }
    }

    public static void main(String[] args) {
        try {
            CRUDEjemplo crud = new CRUDEjemplo();
            crud.insertar("Ana Lopez", "ana@email.com", 25);
            crud.insertar("Carlos Ruiz", "carlos@email.com", 30);
            crud.listar();
            crud.actualizar(1, "ana.nueva@email.com");
            crud.listar();
            crud.eliminar(2);
            crud.listar();
            crud.cerrar();
        } catch (SQLException e) {
            System.err.println("Error: " + e.getMessage());
        }
    }
}
