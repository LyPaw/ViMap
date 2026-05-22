package modelo;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "prestamos")
public class Prestamo {

    public enum Estado { ACTIVO, DEVUELTO, VENCIDO }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "libro_id", nullable = false)
    private Libro libro;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "fecha_devolucion")
    private LocalDate fechaDevolucion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Estado estado = Estado.ACTIVO;

    public Prestamo() {}

    public Prestamo(Usuario usuario, Libro libro, int dias) {
        this.usuario = usuario;
        this.libro = libro;
        this.fechaInicio = LocalDate.now();
        this.fechaDevolucion = this.fechaInicio.plusDays(dias);
        this.estado = Estado.ACTIVO;
    }

    public boolean estaVencido() {
        return estado == Estado.ACTIVO
            && fechaDevolucion != null
            && LocalDate.now().isAfter(fechaDevolucion);
    }

    public long calcularDiasRetraso() {
        if (fechaDevolucion == null || LocalDate.now().isBefore(fechaDevolucion)) {
            return 0;
        }
        return LocalDate.now().toEpochDay() - fechaDevolucion.toEpochDay();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    public Libro getLibro() { return libro; }
    public void setLibro(Libro libro) { this.libro = libro; }
    public LocalDate getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDate fechaInicio) { this.fechaInicio = fechaInicio; }
    public LocalDate getFechaDevolucion() { return fechaDevolucion; }
    public void setFechaDevolucion(LocalDate fechaDevolucion) { this.fechaDevolucion = fechaDevolucion; }
    public Estado getEstado() { return estado; }
    public void setEstado(Estado estado) { this.estado = estado; }
}
