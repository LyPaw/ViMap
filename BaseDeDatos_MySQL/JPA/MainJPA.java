package modelo;

import jakarta.persistence.*;
import java.util.List;

public class MainJPA {

    public static void main(String[] args) {
        EntityManagerFactory emf = Persistence.createEntityManagerFactory("ViMapPU");
        EntityManager em = emf.createEntityManager();

        try {
            // Insertar datos de ejemplo
            em.getTransaction().begin();

            Autor autor = new Autor("Gabriel", "Garcia Marquez", "Colombiana");
            em.persist(autor);

            Libro libro = new Libro("978-84-376-0494-7", "Cien anios de soledad", autor);
            em.persist(libro);

            Usuario usuario = new Usuario("Ana Lopez", "ana@email.com", "612345678");
            em.persist(usuario);

            Prestamo prestamo = new Prestamo(usuario, libro, 14);
            em.persist(prestamo);

            libro.setDisponible(false);
            em.getTransaction().commit();

            // Consultar datos
            TypedQuery<Libro> query = em.createQuery(
                "SELECT l FROM Libro l JOIN FETCH l.autor WHERE l.disponible = :disp",
                Libro.class);
            query.setParameter("disp", false);
            List<Libro> prestados = query.getResultList();

            System.out.println("Libros prestados actualmente:");
            for (Libro l : prestados) {
                System.out.println("  - " + l.getTitulo()
                    + " por " + l.getAutor().getNombre()
                    + " " + l.getAutor().getApellidos());
            }

            // Consultar prestamos activos con JPQL
            TypedQuery<Prestamo> pQuery = em.createQuery(
                "SELECT p FROM Prestamo p JOIN FETCH p.usuario JOIN FETCH p.libro WHERE p.estado = :est",
                Prestamo.class);
            pQuery.setParameter("est", Prestamo.Estado.ACTIVO);
            List<Prestamo> activos = pQuery.getResultList();

            System.out.println("\nPrestamos activos:");
            for (Prestamo p : activos) {
                System.out.println("  " + p.getUsuario().getNombre()
                    + " - " + p.getLibro().getTitulo()
                    + " (dev: " + p.getFechaDevolucion() + ")");
            }

        } catch (Exception e) {
            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }
            e.printStackTrace();
        } finally {
            em.close();
            emf.close();
        }
    }
}
