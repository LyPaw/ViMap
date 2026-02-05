# Proyecto Agenda con Lomlok

## 1. Configuración del proyecto

Primeramente, inserta el **plugin Lomlok** en tu proyecto.  
Las instrucciones están en el PowerPoint de la segunda parte del tema de POO.

---

## 2. Clase `Contacto`

### Atributos
- `nombreContacto`: `String` privado.
- `numeroTelefono`: `String` privado.

### Anotaciones con Lomlok
- `@Getter`
- `@Setter`
- `@NoArgsConstructor`
- `@AllArgsConstructor`

### Método `toString` (override)
Imprime tanto el nombre del contacto como el teléfono.

```java
@Override
public String toString() {
    return "Contacto{" +
           "nombreContacto='" + nombreContacto + '\'' +
           ", numeroTelefono='" + numeroTelefono + '\'' +
           '}';
}
