-- Procedimientos almacenados, funciones y triggers en MySQL

USE biblioteca;

DELIMITER //

-- Procedimiento: registrar prestamo
CREATE PROCEDURE sp_realizar_prestamo(
    IN p_usuario_id INT,
    IN p_libro_id INT,
    IN p_dias INT
)
BEGIN
    DECLARE v_disponible BOOLEAN;
    DECLARE v_max_prestamos INT;
    DECLARE v_activos INT;

    SELECT disponible INTO v_disponible FROM libros WHERE id = p_libro_id;
    IF NOT v_disponible THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Libro no disponible';
    END IF;

    SELECT max_prestamos INTO v_max_prestamos FROM usuarios WHERE id = p_usuario_id;
    SELECT COUNT(*) INTO v_activos FROM prestamos
        WHERE usuario_id = p_usuario_id AND estado = 'ACTIVO';
    IF v_activos >= v_max_prestamos THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Limite de prestamos alcanzado';
    END IF;

    INSERT INTO prestamos (usuario_id, libro_id, fecha_inicio, fecha_devolucion)
    VALUES (p_usuario_id, p_libro_id, CURDATE(), DATE_ADD(CURDATE(), INTERVAL p_dias DAY));

    UPDATE libros SET disponible = FALSE WHERE id = p_libro_id;
END//

-- Funcion: calcular multa por retraso (0.50 EUR/dia)
CREATE FUNCTION f_calcular_multa(p_prestamo_id INT)
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE v_fecha_dev DATE;
    DECLARE v_dias_retraso INT;

    SELECT fecha_devolucion INTO v_fecha_dev
    FROM prestamos WHERE id = p_prestamo_id;

    IF v_fecha_dev IS NULL THEN
        RETURN 0.00;
    END IF;

    SET v_dias_retraso = DATEDIFF(CURDATE(), v_fecha_dev);
    IF v_dias_retraso <= 0 THEN
        RETURN 0.00;
    END IF;

    RETURN v_dias_retraso * 0.50;
END//

-- Trigger: evitar eliminar autor con libros
CREATE TRIGGER before_autor_delete
BEFORE DELETE ON autores
FOR EACH ROW
BEGIN
    DECLARE v_libros INT;
    SELECT COUNT(*) INTO v_libros FROM libros WHERE autor_id = OLD.id;
    IF v_libros > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No se puede eliminar un autor con libros asociados';
    END IF;
END//

DELIMITER ;

-- Ejemplos de uso
-- CALL sp_realizar_prestamo(1, 1, 14);
-- SELECT f_calcular_multa(1);
