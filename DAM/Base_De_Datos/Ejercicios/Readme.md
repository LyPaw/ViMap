# 📝 Ejercicio 1 — Biblioteca
## 📌 Enunciado
Una biblioteca desea gestionar la información de sus libros y los autores que los escriben.
Cada libro tiene un ISBN, título y año de publicación.
Cada autor tiene un id, nombre y nacionalidad.
Un libro puede tener uno o varios autores.
Un autor puede escribir varios libros.
---
## 🧠 Análisis
- Entidades: LIBRO, AUTOR
- Relación: N:M → Escribe
---
```mermaid
erDiagram
   AUTOR }o--o{ LIBRO : escribe

    AUTOR {
        int id_autor PK
        string nombre
        string nacionalidad
    }

    LIBRO {
        string isbn PK
        string titulo
        int anio_publicacion
    }

```
# 📝 Ejercicio 2 — Tienda Online
## 📌 Enunciado
Una tienda online necesita almacenar información sobre clientes, pedidos y productos.
Un cliente puede realizar varios pedidos.
Cada pedido pertenece a un único cliente.
Un pedido contiene uno o varios productos.
De cada producto se guarda: id, nombre y precio.
De cada pedido: número, fecha.
---
## 🧠 Análisis
- Entidades: CLIENTE, PEDIDO, PRODUCTO
- Relación 1:N → Cliente–Pedido
- Relación N:M → Pedido–Producto
---
```mermaid
erDiagram
 CLIENTE ||--o{ PEDIDO : realiza
    PEDIDO ||--o{ LINEA_PEDIDO : contiene
    PRODUCTO ||--o{ LINEA_PEDIDO : aparece_en

    CLIENTE {
        int id_cliente PK
        string nombre
        string email
    }

    PEDIDO {
        int id_pedido PK
        date fecha
    }

    PRODUCTO {
        int id_producto PK
        string nombre
        float precio
    }

    LINEA_PEDIDO {
        int cantidad
    }

```
# 📝 Ejercicio 3 — Centro Educativo
## 📌 Enunciado
Un centro educativo quiere gestionar alumnos, asignaturas y profesores.
Un alumno puede matricularse en varias asignaturas.
Una asignatura puede tener varios alumnos.
Cada asignatura es impartida por un único profesor.
Un profesor puede impartir varias asignaturas.
De la matrícula interesa guardar la nota final.
---
## 🧠 Análisis
- Relación N:M → Alumno–Asignatura
- Relación 1:N → Profesor–Asignatura
- Entidad asociativa: MATRICULA
---
```mermaid
erDiagram
PROFESOR ||--o{ ASIGNATURA : imparte
    ALUMNO ||--o{ MATRICULA : se_matricula
    ASIGNATURA ||--o{ MATRICULA : incluye

    ALUMNO {
        int id_alumno PK
        string nombre
        string email
    }

    PROFESOR {
        int id_profesor PK
        string nombre
        string especialidad
    }

    ASIGNATURA {
        int id_asignatura PK
        string nombre
        int creditos
    }

    MATRICULA {
        float nota_final
    }

```
# 📝 Ejercicio 4 — Sistema de Gestión Hospitalaria
## 📌 Enunciado
Un hospital quiere gestionar la información de pacientes, médicos, citas, tratamientos, habitaciones y facturas.
Condiciones:
Un paciente puede tener varias citas médicas.
Cada cita es atendida por un solo médico.
Un médico puede atender muchas citas.
En una cita se puede prescribir uno o varios tratamientos.
Un tratamiento puede aparecer en distintas citas.
Un paciente puede estar asignado a una habitación.
Una habitación puede alojar a varios pacientes en distintos periodos.
A cada paciente se le genera una o varias facturas.
---
## 🧠 Análisis
- Entidades detectadas (7)
-- PACIENTE
-- MEDICO
-- CITA
-- TRATAMIENTO
-- CITA_TRATAMIENTO (entidad asociativa)
-- HABITACION
-- FACTURA
- Relaciones clave
-- PACIENTE 1:N CITA
-- MEDICO 1:N CITA
-- CITA N:M TRATAMIENTO
--PACIENTE N:M HABITACION (histórico)
-- PACIENTE 1:N FACTURA
---
```mermaid
erDiagram
 PACIENTE ||--o{ CITA : solicita
    MEDICO ||--o{ CITA : atiende

    CITA ||--o{ CITA_TRATAMIENTO : prescribe
    TRATAMIENTO ||--o{ CITA_TRATAMIENTO : se_aplica

    PACIENTE ||--o{ ESTANCIA : ocupa
    HABITACION ||--o{ ESTANCIA : es_usada

    PACIENTE ||--o{ FACTURA : genera

    PACIENTE {
        int id_paciente PK
        string nombre
        string dni
        date fecha_nacimiento
    }

    MEDICO {
        int id_medico PK
        string nombre
        string especialidad
    }

    CITA {
        int id_cita PK
        date fecha
        string motivo
    }

    TRATAMIENTO {
        int id_tratamiento PK
        string descripcion
        float coste
    }

    HABITACION {
        int id_habitacion PK
        string tipo
        int planta
    }

    FACTURA {
        int id_factura PK
        date fecha
        float total
    }

    ESTANCIA {
        date fecha_inicio
        date fecha_fin
    }

    CITA_TRATAMIENTO {
        string dosis
        int duracion_dias
    }
```
---
# 📝 Ejercicio 5 — Biblioteca
## 📌 Enunciado
- Se quiere registrar los libros,autor y ejemplares de una biblioteca. Debes hacer el modelo ER y el modelo modificado.
---
```mermaid
erDiagram
   LIBRO {
        int Cod_Libro
        int Paginas
    }

    AUTOR {
        string DNI
        string Nombre
    }

    EJEMPLAR {
        int Numero_Ejemplar
    }

    LIBRO }o--o{ AUTOR : "Escribe"
    LIBRO ||--o{ EJEMPLAR : "Tiene"
```
- 📌 Notas
Escribe es N:M entre Libro y Autor
Tiene es 1:N entre Libro y Ejemplar
## 2️⃣ Esquema ER Modificado
### Entidad Debil
```mermaid
erDiagram
   LIBRO {
        int Cod_Libro PK
        int Paginas
    }

    AUTOR {
        string DNI PK
        string Nombre
    }

    EJEMPLAR {
        int Numero_Ejemplar PK
        int Cod_Libro FK
    }

    LIBRO }o--o{ AUTOR : "Escribe"
    LIBRO ||--o{ EJEMPLAR : "Identifica"
```
### Tabla Nueva
---
---
```mermaid
erDiagram
   LIBRO {
        int Cod_Libro PK
        int Paginas
    }

    AUTOR {
        string DNI PK
        string Nombre
    }

    LIBRO_AUTOR {
        int Cod_Libro PK, FK
        string DNI PK, FK
    }

    EJEMPLAR {
        int Numero_Ejemplar PK
        int Cod_Libro PK, FK
    }

    LIBRO ||--o{ EJEMPLAR : "Tiene"
    LIBRO ||--o{ LIBRO_AUTOR : "Participa"
    AUTOR ||--o{ LIBRO_AUTOR : "Participa"
```
