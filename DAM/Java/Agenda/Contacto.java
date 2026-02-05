package Agenda;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor


public class Contacto {
    private String nombreContacto;
    private String numeroTelefono;

@Override
    public String toString() {
       return this.nombreContacto + "-" + this.numeroTelefono;
    }
}
