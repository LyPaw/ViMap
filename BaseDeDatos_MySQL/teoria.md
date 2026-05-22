# MySQL - Base de Datos

## DDL

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

## DML

```sql
INSERT INTO usuarios (nombre, email) VALUES ('Ana', 'ana@mail.com');
UPDATE usuarios SET nombre = 'Ana Maria' WHERE id = 1;
DELETE FROM usuarios WHERE id = 1;
SELECT * FROM usuarios WHERE email LIKE '%@mail.com';
```

## Indices

```sql
CREATE INDEX idx_email ON usuarios(email);
```

## Joins

```sql
SELECT u.nombre, p.titulo
FROM usuarios u
INNER JOIN publicaciones p ON u.id = p.usuario_id;
```

Tipos: `INNER`, `LEFT`, `RIGHT`, `FULL`

## Claves Foraneas

```sql
FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
```

## Triggers

```sql
CREATE TRIGGER before_insert_usuario
BEFORE INSERT ON usuarios
FOR EACH ROW SET NEW.creado_en = NOW();
```

## Procedimientos

```sql
DELIMITER //
CREATE PROCEDURE ObtenerUsuarios()
BEGIN SELECT * FROM usuarios; END //
DELIMITER ;
```

## Eventos

```sql
CREATE EVENT limpiar_usuarios_viejos
ON SCHEDULE EVERY 1 DAY
DO DELETE FROM usuarios WHERE creado_en < NOW() - INTERVAL 1 YEAR;
```

## CTEs y Window Functions

```sql
WITH ranked AS (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salario DESC) AS rn
    FROM empleados
) SELECT * FROM ranked WHERE rn = 1;
```
