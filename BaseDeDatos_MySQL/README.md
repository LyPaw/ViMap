# Base de Datos MySQL y Acceso a Datos (1º y 2º DAM)

Este directorio cubre dos asignaturas: **Bases de Datos** (1º curso) y **Acceso a Datos** (2º curso).

## Estructura

| Carpeta/Archivo | Asignatura | Contenido |
|----------------|-----------|-----------|
| `README.md` | Ambas | Teoria completa: diseno, normalizacion, JPA, Hibernate |
| `esquema_biblioteca.sql` | Bases de Datos | DDL completo: tablas, FK, indices, triggers, eventos, datos iniciales |
| `consultas_avanzadas.sql` | Bases de Datos | Subconsultas, CTEs, window functions, vistas, CASE |
| `triggers_procedimientos.sql` | Bases de Datos | Procedimientos, funciones, triggers con logica compleja |
| `JPA/` | Acceso a Datos | Entidades JPA con anotaciones, repositorios y configuracion |

## 1. Diseno de Bases de Datos

### Modelo Entidad-Relacion (E/R)

Entidades: objetos del mundo real con existencia propia (Usuario, Libro, Pedido).
Atributos: propiedades de las entidades (nombre, precio, fecha).
Relaciones: asociaciones entre entidades (1:1, 1:N, N:M).

### Notacion grafica (MER)

```
[USUARIO] --- (realiza) --- [PRESTAMO] --- (incluye) --- [LIBRO]
```

Cada entidad se representa como rectangulo, cada relacion como rombo, cada atributo como elipse.

### Transformacion a esquema relacional

1. Cada entidad se convierte en una tabla
2. Los atributos se convierten en columnas
3. La clave primaria es el identificador unico
4. Las relaciones 1:N se modelan con FK en la tabla N
5. Las relaciones N:M requieren una tabla intermedia

## 2. Normalizacion

Proceso para eliminar redundancias y anomalias en el diseno.

### 1FN (Primera Forma Normal)

Cada columna debe contener valores atomicos (indivisibles). No se permiten listas o conjuntos en una celda.

```sql
-- MAL: campo categorias con valores separados por comas
-- id | titulo | categorias
-- 1  | Libro  | "novela, drama"

-- BIEN: tabla separada para categorias
-- libros: id, titulo
-- categorias: id, nombre
-- libros_categorias: libro_id, categoria_id
```

### 2FN (Segunda Forma Normal)

Cada columna no clave debe depender de la clave primaria completa (no solo de parte de ella). Aplica solo a tablas con clave compuesta.

### 3FN (Tercera Forma Normal)

Las columnas no clave deben depender directamente de la clave primaria, no de otras columnas no clave.

```sql
-- MAL: dependencia transitiva
-- empleados: id, nombre, departamento_id, departamento_ciudad
-- "departamento_ciudad" depende de "departamento_id", no de "id"

-- BIEN: tabla separada para departamentos
-- empleados: id, nombre, departamento_id
-- departamentos: id, ciudad
```

## 3. Integridad Referencial

Las claves foraneas (FOREIGN KEY) garantizan que no existan referencias huerfanas.

```sql
CREATE TABLE prestamos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    libro_id INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_devolucion DATE,
    estado ENUM('ACTIVO', 'DEVUELTO', 'VENCIDO') DEFAULT 'ACTIVO',
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (libro_id) REFERENCES libros(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);
```

Acciones referenciales:
- `ON DELETE CASCADE`: elimina automaticamente las filas hijas
- `ON DELETE RESTRICT`: impide eliminar si hay referencias
- `ON DELETE SET NULL`: pone a NULL la FK al eliminar el padre
- `ON DELETE NO ACTION`: similar a RESTRICT (comportamiento por defecto)

## 4. JPA y Hibernate (Acceso a Datos - 2º curso)

JPA (Jakarta Persistence API) es el estandar de Java para mapeo objeto-relacional (ORM).

### Entidades JPA

```java
@Entity
@Table(name = "usuarios")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(unique = true, nullable = false)
    private String email;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    private List<Prestamo> prestamos = new ArrayList<>();

    public Usuario() {}

    public Usuario(String nombre, String email) {
        this.nombre = nombre;
        this.email = email;
    }
}
```

### Tipos de relaciones JPA

| Relacion | Anotacion | Ejemplo |
|----------|-----------|---------|
| 1:1 | `@OneToOne` | Usuario -> Direccion |
| 1:N | `@OneToMany` | Usuario -> Prestamos |
| N:1 | `@ManyToOne` | Prestamo -> Usuario |
| N:M | `@ManyToMany` | Libro -> Categoria |

### EntityManager (CRUD basico)

```java
@PersistenceContext
private EntityManager em;

// Crear
em.persist(usuario);

// Leer por ID
Usuario u = em.find(Usuario.class, 1L);

// Leer con JPQL
List<Usuario> usuarios = em.createQuery(
    "SELECT u FROM Usuario u WHERE u.email LIKE :email",
    Usuario.class)
    .setParameter("email", "%@mail.com")
    .getResultList();

// Actualizar
Usuario u = em.find(Usuario.class, 1L);
u.setNombre("Nuevo nombre");
em.merge(u);

// Eliminar
Usuario u = em.find(Usuario.class, 1L);
em.remove(u);
```

### Repository pattern con JPA

```java
@Repository
public class UsuarioRepository {
    @PersistenceContext
    private EntityManager em;

    public Usuario guardar(Usuario usuario) {
        if (usuario.getId() == null) {
            em.persist(usuario);
            return usuario;
        } else {
            return em.merge(usuario);
        }
    }

    public Optional<Usuario> buscarPorId(Long id) {
        return Optional.ofNullable(em.find(Usuario.class, id));
    }

    public List<Usuario> buscarTodos() {
        return em.createQuery("SELECT u FROM Usuario u", Usuario.class)
                 .getResultList();
    }

    public void eliminar(Long id) {
        buscarPorId(id).ifPresent(em::remove);
    }
}
```

### Configuracion en persistence.xml

```xml
<persistence version="3.0"
    xmlns="https://jakarta.ee/xml/ns/persistence">
    <persistence-unit name="ViMapPU" transaction-type="RESOURCE_LOCAL">
        <provider>org.hibernate.jpa.HibernatePersistenceProvider</provider>
        <class>modelo.Usuario</class>
        <class>modelo.Libro</class>
        <properties>
            <property name="jakarta.persistence.jdbc.url"
                      value="jdbc:mysql://localhost:3306/biblioteca"/>
            <property name="jakarta.persistence.jdbc.user" value="root"/>
            <property name="jakarta.persistence.jdbc.password" value="password"/>
            <property name="jakarta.persistence.jdbc.driver"
                      value="com.mysql.cj.jdbc.Driver"/>
            <property name="hibernate.dialect"
                      value="org.hibernate.dialect.MySQLDialect"/>
            <property name="hibernate.hbm2ddl.auto" value="update"/>
            <property name="hibernate.show_sql" value="true"/>
        </properties>
    </persistence-unit>
</persistence>
```

### Ciclo de vida de una entidad JPA

```
NEW (no gestionada)
  → persist() → MANAGED (gestionada, dentro de transaccion)
  → find()/merge() → MANAGED
  → refresh() → MANAGED (recarga desde BD)
  → detach() → DETACHED (fuera de gestion)
  → remove() → REMOVED (se eliminara en el flush)
  → close()/commit() → DETACHED
```
