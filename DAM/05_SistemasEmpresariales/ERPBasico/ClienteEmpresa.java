package empresarial.erp;

public class ClienteEmpresa {
    private static int contador = 0;
    private int id;
    private String nif;
    private String razonSocial;
    private String nombreComercial;
    private String email;
    private String telefono;
    private String direccion;
    private double creditoDisponible;
    private boolean vip;

    public ClienteEmpresa(String nif, String razonSocial, String email) {
        this.id = ++contador;
        this.nif = nif;
        this.razonSocial = razonSocial;
        this.nombreComercial = razonSocial;
        this.email = email;
        this.creditoDisponible = 10000.0;
        this.vip = false;
    }

    public int getId() { return id; }

    public String getNif() { return nif; }

    public String getRazonSocial() { return razonSocial; }

    public void setRazonSocial(String razonSocial) { this.razonSocial = razonSocial; }

    public String getNombreComercial() { return nombreComercial; }

    public void setNombreComercial(String nombreComercial) {
        this.nombreComercial = nombreComercial;
    }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public String getTelefono() { return telefono; }

    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getDireccion() { return direccion; }

    public void setDireccion(String direccion) { this.direccion = direccion; }

    public double getCreditoDisponible() { return creditoDisponible; }

    public boolean tieneCreditoSuficiente(double importe) {
        return creditoDisponible >= importe;
    }

    public void descontarCredito(double importe) {
        if (tieneCreditoSuficiente(importe)) {
            this.creditoDisponible -= importe;
        }
    }

    public boolean isVip() { return vip; }

    public void setVip(boolean vip) { this.vip = vip; }

    public double getDescuento() {
        return vip ? 0.10 : 0.0;
    }

    @Override
    public String toString() {
        return "Cliente[" + nif + "] " + razonSocial +
               (vip ? " (VIP)" : "") +
               " | Credito: " + String.format("%.2f", creditoDisponible) + " EUR";
    }
}
