package Agenda;

public class main  {
    public static void main(String[] args) {

    //Creacion de los objetos
    Contacto c1 = new Contacto("Nicolas","1213233");
    Contacto c2 = new Contacto("Nicolas","1213233");
    Contacto c3 = new Contacto("Luis","1213233");
    Agenda agenda1 = new Agenda("Contactos");

    //Agregar los contactos a la agenda gracias al metodo dentro de agenda
    agenda1.addContacto(c1);
    agenda1.addContacto(c2);
    agenda1.addContacto(c3);


    System.out.println(agenda1.toString());

    //Recibir nombre mediante el telefono
    System.out.println(agenda1.getNombrePorTelefono("1213233"));

    //Recibir el numero mediante el nombre
    System.out.println(agenda1.getNumeroTelefonoPorNombre("Nicolas"));


    //Borra el contacto cuyo nombre de Nicolas
    agenda1.borrarContacto("Nicolas");
    System.out.println(agenda1.toString());

    //Actualiza el contacto de Luis y cambia el numero
    agenda1.actualizarTelefono("Luis","7777777");
    System.out.println(agenda1.toString());
    }
}