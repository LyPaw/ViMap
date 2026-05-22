-- Consultas SQL avanzadas para MySQL

USE biblioteca;

-- Subconsulta: libros con prestamos activos
SELECT titulo FROM libros
WHERE id IN (
    SELECT libro_id FROM prestamos WHERE estado = 'ACTIVO'
);

-- JOIN multiple con agregacion
SELECT
    u.nombre AS usuario,
    COUNT(p.id) AS total_prestamos,
    GROUP_CONCAT(l.titulo SEPARATOR ', ') AS libros_prestados
FROM usuarios u
JOIN prestamos p ON u.id = p.usuario_id
JOIN libros l ON p.libro_id = l.id
WHERE p.estado = 'ACTIVO'
GROUP BY u.id, u.nombre;

-- CTE (WITH): prestamos por mes
WITH prestamos_mensuales AS (
    SELECT
        DATE_FORMAT(fecha_inicio, '%Y-%m') AS mes,
        COUNT(*) AS total
    FROM prestamos
    GROUP BY mes
)
SELECT mes, total
FROM prestamos_mensuales
ORDER BY mes DESC;

-- Ventana (Window function): ranking de usuarios por prestamos
SELECT
    u.nombre,
    COUNT(p.id) AS prestamos,
    RANK() OVER (ORDER BY COUNT(p.id) DESC) AS ranking
FROM usuarios u
LEFT JOIN prestamos p ON u.id = p.usuario_id
GROUP BY u.id, u.nombre;

-- Case: clasificar libros por antiguedad
SELECT
    titulo,
    anio_publicacion,
    CASE
        WHEN anio_publicacion < 1800 THEN 'Clasico'
        WHEN anio_publicacion < 1950 THEN 'Moderno'
        WHEN anio_publicacion < 2000 THEN 'Contemporaneo'
        ELSE 'Reciente'
    END AS epoca
FROM libros
ORDER BY anio_publicacion;

-- Vista: libros disponibles con autor
CREATE OR REPLACE VIEW v_libros_disponibles AS
SELECT l.id, l.isbn, l.titulo, l.anio_publicacion,
       CONCAT(a.nombre, ' ', a.apellidos) AS autor
FROM libros l
JOIN autores a ON l.autor_id = a.id
WHERE l.disponible = TRUE;

SELECT * FROM v_libros_disponibles ORDER BY titulo;

-- Indices compuestos
CREATE INDEX idx_prestamos_fecha_estado ON prestamos(fecha_inicio, estado);
