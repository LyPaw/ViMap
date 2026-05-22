# MySQL - Base de Datos

## DDL (Data Definition Language)

Creacion y modificacion de estructuras.

```sql
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE usuarios ADD COLUMN telefono VARCHAR(20);
DROP TABLE usuarios;
```

## DML (Data Manipulation Language)

CRUD de datos.

```sql
INSERT INTO usuarios (nombre, email) VALUES ('Ana', 'ana@mail.com');
UPDATE usuarios SET nombre = 'Ana Maria' WHERE id = 1;
DELETE FROM usuarios WHERE id = 1;
SELECT * FROM usuarios WHERE email LIKE '%@mail.com';
```

## Indices

Optimizan busquedas.

```sql
CREATE INDEX idx_email ON usuarios(email);
CREATE UNIQUE INDEX idx_unique_email ON usuarios(email);
```

## Joins

Combinar datos de varias tablas.

```sql
SELECT u.nombre, p.titulo
FROM usuarios u
INNER JOIN publicaciones p ON u.id = p.usuario_id;
```

Tipos: `INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN`, `FULL JOIN`

## Claves Foraneas

Integridad referencial entre tablas.

```sql
CREATE TABLE publicaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON DELETE CASCADE
);
```

## Triggers

Ejecucion automatica ante eventos.

```sql
CREATE TRIGGER before_insert_usuario
BEFORE INSERT ON usuarios
FOR EACH ROW
SET NEW.creado_en = NOW();
```

## Procedimientos y Funciones

Logica reutilizable en el servidor.

```sql
DELIMITER //
CREATE PROCEDURE ObtenerUsuarios()
BEGIN
    SELECT * FROM usuarios;
END //
DELIMITER ;
```

## Eventos

Tareas programadas.

```sql
CREATE EVENT limpiar_usuarios_viejos
ON SCHEDULE EVERY 1 DAY
DO DELETE FROM usuarios WHERE creado_en < NOW() - INTERVAL 1 YEAR;
```
