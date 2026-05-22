package empresarial.workflow;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

enum EstadoSolicitud {
    BORRADOR,
    PENDIENTE,
    EN_REVISION,
    APROBADO,
    RECHAZADO,
    CANCELADO
}

class Transicion {
    private EstadoSolicitud desde;
    private EstadoSolicitud hasta;
    private String accion;
    private double limiteAprobacion;

    public Transicion(EstadoSolicitud desde, EstadoSolicitud hasta,
                      String accion, double limiteAprobacion) {
        this.desde = desde;
        this.hasta = hasta;
        this.accion = accion;
        this.limiteAprobacion = limiteAprobacion;
    }

    public EstadoSolicitud getDesde() { return desde; }
    public EstadoSolicitud getHasta() { return hasta; }
    public String getAccion() { return accion; }
    public double getLimiteAprobacion() { return limiteAprobacion; }
}

class HistorialCambio {
    private LocalDateTime timestamp;
    private EstadoSolicitud desde;
    private EstadoSolicitud hasta;
    private String usuario;
    private String comentario;

    public HistorialCambio(EstadoSolicitud desde, EstadoSolicitud hasta,
                           String usuario, String comentario) {
        this.timestamp = LocalDateTime.now();
        this.desde = desde;
        this.hasta = hasta;
        this.usuario = usuario;
        this.comentario = comentario;
    }

    @Override
    public String toString() {
        return String.format("[%s] %s -> %s | %s: %s",
            timestamp.toString().replace("T", " "),
            desde, hasta, usuario, comentario);
    }
}

class SolicitudGasto {
    private static int contador = 0;
    private int id;
    private String solicitante;
    private String concepto;
    private double importe;
    private EstadoSolicitud estado;
    private List<HistorialCambio> historial;

    public SolicitudGasto(String solicitante, String concepto, double importe) {
        this.id = ++contador;
        this.solicitante = solicitante;
        this.concepto = concepto;
        this.importe = importe;
        this.estado = EstadoSolicitud.BORRADOR;
        this.historial = new ArrayList<>();
        agregarHistorial("Sistema", "Solicitud creada");
    }

    public int getId() { return id; }
    public String getSolicitante() { return solicitante; }
    public String getConcepto() { return concepto; }
    public double getImporte() { return importe; }
    public EstadoSolicitud getEstado() { return estado; }
    public List<HistorialCambio> getHistorial() {
        return new ArrayList<>(historial);
    }

    public void agregarHistorial(String usuario, String comentario) {
        historial.add(new HistorialCambio(estado, estado, usuario, comentario));
    }

    public boolean transicionar(EstadoSolicitud nuevoEstado,
                                String usuario, String comentario) {
        String accion = estado + "_TO_" + nuevoEstado;
        Transicion t = WorkflowEjemplo.WORKFLOW.get(accion);

        if (t == null) {
            System.out.println("ERROR: No se puede pasar de " + estado +
                " a " + nuevoEstado);
            return false;
        }

        if (nuevoEstado == EstadoSolicitud.APROBADO &&
            importe > t.getLimiteAprobacion()) {
            System.out.println("ERROR: El importe " + importe +
                " supera el limite de aprobacion de " +
                t.getLimiteAprobacion());
            return false;
        }

        System.out.println("Solicitud #" + id + ": " + estado + " -> " +
            nuevoEstado + " (" + usuario + ")");
        this.estado = nuevoEstado;
        historial.add(new HistorialCambio(t.getDesde(), t.getHasta(),
            usuario, comentario));
        return true;
    }

    public void mostrarEstado() {
        System.out.println("\n=== Solicitud #" + id + " ===");
        System.out.println("Solicitante: " + solicitante);
        System.out.println("Concepto: " + concepto);
        System.out.println("Importe: " + String.format("%.2f", importe) + " EUR");
        System.out.println("Estado actual: " + estado);
        System.out.println("--- Historial ---");
        for (HistorialCambio h : historial) {
            System.out.println("  " + h);
        }
    }
}

public class WorkflowEjemplo {

    public static final Map<String, Transicion> WORKFLOW = new HashMap<>();

    static {
        WORKFLOW.put("BORRADOR_TO_PENDIENTE",
            new Transicion(EstadoSolicitud.BORRADOR, EstadoSolicitud.PENDIENTE,
                "Enviar solicitud", 0));
        WORKFLOW.put("PENDIENTE_TO_EN_REVISION",
            new Transicion(EstadoSolicitud.PENDIENTE, EstadoSolicitud.EN_REVISION,
                "Iniciar revision", 0));
        WORKFLOW.put("EN_REVISION_TO_APROBADO",
            new Transicion(EstadoSolicitud.EN_REVISION, EstadoSolicitud.APROBADO,
                "Aprobar", 5000));
        WORKFLOW.put("EN_REVISION_TO_RECHAZADO",
            new Transicion(EstadoSolicitud.EN_REVISION, EstadoSolicitud.RECHAZADO,
                "Rechazar", 0));
        WORKFLOW.put("BORRADOR_TO_CANCELADO",
            new Transicion(EstadoSolicitud.BORRADOR, EstadoSolicitud.CANCELADO,
                "Cancelar", 0));
        WORKFLOW.put("PENDIENTE_TO_CANCELADO",
            new Transicion(EstadoSolicitud.PENDIENTE, EstadoSolicitud.CANCELADO,
                "Cancelar", 0));
    }

    public static void main(String[] args) {
        System.out.println("=== WORKFLOW DE APROBACION DE GASTOS ===\n");

        SolicitudGasto s1 = new SolicitudGasto(
            "Ana Lopez", "Nuevo monitor oficina", 1200.00);
        s1.transicionar(EstadoSolicitud.PENDIENTE, "Ana Lopez", "Adjunto presupuesto");
        s1.transicionar(EstadoSolicitud.EN_REVISION, "Jefe Dpto", "Recibido, en revision");
        s1.transicionar(EstadoSolicitud.APROBADO, "Jefe Dpto", "Aprobado");
        s1.mostrarEstado();

        System.out.println("\n--- Solicitud rechazada ---");
        SolicitudGasto s2 = new SolicitudGasto(
            "Carlos Ruiz", "Teclado mecanico", 150.00);
        s2.transicionar(EstadoSolicitud.PENDIENTE, "Carlos Ruiz", "");
        s2.transicionar(EstadoSolicitud.EN_REVISION, "Jefe Dpto", "En revision");
        s2.transicionar(EstadoSolicitud.RECHAZADO, "Jefe Dpto", "No procede");
        s2.mostrarEstado();

        System.out.println("\n--- Solicitud que supera limite ---");
        SolicitudGasto s3 = new SolicitudGasto(
            "Beatriz Garcia", "Servidor nuevo", 15000.00);
        s3.transicionar(EstadoSolicitud.PENDIENTE, "Beatriz Garcia", "");
        s3.transicionar(EstadoSolicitud.EN_REVISION, "Director TI", "");
        s3.transicionar(EstadoSolicitud.APROBADO, "Director TI",
            "Requiere aprobacion de direccion");

        System.out.println("\n--- Transicion invalida ---");
        s1.transicionar(EstadoSolicitud.RECHAZADO, "Admin", "Intento invalido");
    }
}
