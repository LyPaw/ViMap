-- Base de datos: Biblioteca
-- DDL: Creacion de esquema, tablas e indices

CREATE DATABASE IF NOT EXISTS biblioteca
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE biblioteca;

-- Tabla de autores
CREATE TABLE IF NOT EXISTS autores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(150) NOT NULL,
    nacionalidad VARCHAR(50),
    fecha_nacimiento DATE,
    INDEX idx_apellidos (apellidos)
) ENGINE=InnoDB;

-- Tabla de libros
CREATE TABLE IF NOT EXISTS libros (
    id INT PRIMARY KEY AUTO_INCREMENT,
    isbn VARCHAR(20) UNIQUE NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    anio_publicacion INT,
    disponible BOOLEAN DEFAULT TRUE,
    autor_id INT NOT NULL,
    FOREIGN KEY (autor_id) REFERENCES autores(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_titulo (titulo)
) ENGINE=InnoDB;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    telefono VARCHAR(15),
    max_prestamos INT DEFAULT 5,
    INDEX idx_email (email)
) ENGINE=InnoDB;

-- Tabla de prestamos
CREATE TABLE IF NOT EXISTS prestamos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    libro_id INT NOT NULL,
    fecha_inicio DATE NOT NULL DEFAULT (CURRENT_DATE),
    fecha_devolucion DATE,
    estado ENUM('ACTIVO', 'DEVUELTO', 'VENCIDO') DEFAULT 'ACTIVO',
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (libro_id) REFERENCES libros(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_estado (estado),
    INDEX idx_fecha (fecha_inicio)
) ENGINE=InnoDB;

-- Trigger: evitar prestar un libro no disponible
DELIMITER //
CREATE TRIGGER before_prestamo_insert
BEFORE INSERT ON prestamos
FOR EACH ROW
BEGIN
    DECLARE disp BOOLEAN;
    SELECT disponible INTO disp FROM libros WHERE id = NEW.libro_id;
    IF NOT disp THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El libro no esta disponible para prestamo';
    END IF;
END//
DELIMITER ;

-- Trigger: actualizar disponible al devolver
DELIMITER //
CREATE TRIGGER after_prestamo_update
AFTER UPDATE ON prestamos
FOR EACH ROW
BEGIN
    IF NEW.estado = 'DEVUELTO' AND OLD.estado != 'DEVUELTO' THEN
        UPDATE libros SET disponible = TRUE WHERE id = NEW.libro_id;
    END IF;
END//
DELIMITER ;

-- Trigger: marcar como vencido automaticamente
DELIMITER //
CREATE EVENT event_marcar_vencidos
ON SCHEDULE EVERY 1 DAY
DO
BEGIN
    UPDATE prestamos
    SET estado = 'VENCIDO'
    WHERE estado = 'ACTIVO'
      AND fecha_devolucion IS NOT NULL
      AND fecha_devolucion < CURRENT_DATE;
END//
DELIMITER ;

-- Datos de ejemplo (DML)
INSERT INTO autores (nombre, apellidos, nacionalidad) VALUES
    ('Gabriel', 'Garcia Marquez', 'Colombiana'),
    ('Miguel', 'de Cervantes', 'Espanola'),
    ('Jane', 'Austen', 'Britanica');

INSERT INTO libros (isbn, titulo, anio_publicacion, autor_id) VALUES
    ('978-84-376-0494-7', 'Cien anios de soledad', 1967, 1),
    ('978-84-670-2013-1', 'El Quijote', 1605, 2),
    ('978-84-206-6325-7', 'Orgullo y prejuicio', 1813, 3);

INSERT INTO usuarios (nombre, email, telefono) VALUES
    ('Ana Lopez', 'ana@email.com', '612345678'),
    ('Carlos Ruiz', 'carlos@email.com', '698765432');

-- Consultas de ejemplo
-- Obtener libros disponibles
SELECT l.id, l.titulo, CONCAT(a.nombre, ' ', a.apellidos) AS autor
FROM libros l
JOIN autores a ON l.autor_id = a.id
WHERE l.disponible = TRUE
ORDER BY l.titulo;

-- Prestamos activos con info de usuario y libro
SELECT p.id, u.nombre AS usuario, l.titulo AS libro, p.fecha_inicio
FROM prestamos p
JOIN usuarios u ON p.usuario_id = u.id
JOIN libros l ON p.libro_id = l.id
WHERE p.estado = 'ACTIVO';

-- Contar prestamos por usuario
SELECT u.nombre, COUNT(p.id) AS total_prestamos
FROM usuarios u
LEFT JOIN prestamos p ON u.id = p.usuario_id
GROUP BY u.id, u.nombre
ORDER BY total_prestamos DESC;
