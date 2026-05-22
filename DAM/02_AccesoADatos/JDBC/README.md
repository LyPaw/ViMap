# JDBC - Java Database Connectivity

## Conceptos fundamentales

JDBC es la API estandar de Java para conectar y operar con bases de datos relacionales.

### Arquitectura JDBC

1.  **DriverManager**: gestiona los drivers de conexion.
2.  **Connection**: representa la conexion a una base de datos.
3.  **Statement / PreparedStatement**: ejecuta sentencias SQL.
4.  **ResultSet**: representa el resultado de una consulta.
5.  **SQLException**: excepcion para errores de base de datos.

### Pasos para conectar a una BD

1.  Cargar el driver: `Class.forName("com.mysql.cj.jdbc.Driver")`
2.  Establecer conexion: `DriverManager.getConnection(url, user, pass)`
3.  Crear Statement: `conn.createStatement()`
4.  Ejecutar consulta: `stmt.executeQuery(sql)` o `stmt.executeUpdate(sql)`
5.  Procesar ResultSet: `rs.next()`, `rs.getInt()`, `rs.getString()`
6.  Cerrar recursos: `rs.close()`, `stmt.close()`, `conn.close()`

### PreparedStatement vs Statement

-   **PreparedStatement**: consultas precompiladas, evita inyeccion SQL, mejor rendimiento en consultas repetitivas.
-   **Statement**: sentencias simples, sin parametros.

### Transacciones

-   `conn.setAutoCommit(false)` para desactivar autocommit.
-   `conn.commit()` para confirmar cambios.
-   `conn.rollback()` para deshacer cambios.

## Ejercicios propuestos

1.  Crea una base de datos de alumnos con campos: id, nombre, edad, curso. Implementa un CRUD completo.
2.  Implementa una busqueda por nombre usando PreparedStatement con LIKE.
3.  Anade manejo de transacciones para insertar un pedido y sus lineas en dos tablas relacionadas.
4.  Crea un pool de conexiones usando HikariCP.
5.  Implementa un metodo que exporte una tabla a un archivo CSV.
