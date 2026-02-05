package Agenda;

import lombok.Getter;
import lombok.Setter;

import java.util.*;

public class Agenda {
   @Setter
   @Getter

   //Atributos
   private String nombreAgenda;
   ArrayList<Contacto> agenda = new ArrayList<>();


   //Constructor
   Agenda(String nombreAgenda){
        this.nombreAgenda = nombreAgenda;
        this.agenda = new ArrayList<>();
   }

   //Getter
    public String getLibreta() {
        return agenda.toString();
    }

    public String getNombreAgenda() {
        return nombreAgenda;
    }

    //Setter
    public void setAgenda(ArrayList<Contacto> agenda) {
        agenda = agenda;
    }

    //ToString
    public String toString() {
        StringBuilder s = new StringBuilder();
        s.append(nombreAgenda + "\n");
        s.append(agenda.toString());
        return s.toString();
    }

    //AddContacto
    public void addContacto(Contacto contacto){
       agenda.add(contacto);
    }

    //Recibir nombre por el telefono
    public String getNombrePorTelefono(String numeroTelefono){
       for (Contacto contacto : agenda) {
           if (contacto.getNumeroTelefono().equals(numeroTelefono)) {
               return contacto.getNombreContacto();
           }
       }
       return null;
    }

    //recibir numero por el nombre
    public String getNumeroTelefonoPorNombre(String nombreContacto) {
        for (Contacto contacto : agenda) {
            if (contacto.getNombreContacto().equals(nombreContacto)) {
                return contacto.getNumeroTelefono();
            }
        }
        return null;
   }

   //Borrar contacto por el nombre
   public void borrarContacto(String nombre){
       for (int i = 0; i < agenda.size(); i++) {
           if (agenda.get(i).getNombreContacto().equals(nombre)) {
               agenda.remove(i);
               break;
           }
       }
   }

   //Actualizar contacto
    public boolean actualizarTelefono(String nombre, String nuevoTelefono) {
        for (Contacto c : agenda) {
            if (c.getNombreContacto().equals(nombre)) {
                c.setNumeroTelefono(nuevoTelefono);
                return true; // Actualizado correctamente
            }
        }
        return false; // No se encontró el contacto
    }
}
