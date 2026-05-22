package accesodatos.jpa;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import jakarta.persistence.TypedQuery;
import java.util.List;

public class UsuarioRepository {
    private EntityManagerFactory emf;
    private EntityManager em;

    public UsuarioRepository() {
        emf = Persistence.createEntityManagerFactory("ViMapPU");
        em = emf.createEntityManager();
    }

    public Usuario guardar(Usuario usuario) {
        em.getTransaction().begin();
        if (usuario.getId() == null) {
            em.persist(usuario);
        } else {
            usuario = em.merge(usuario);
        }
        em.getTransaction().commit();
        return usuario;
    }

    public Usuario buscarPorId(Long id) {
        return em.find(Usuario.class, id);
    }

    public List<Usuario> listarTodos() {
        TypedQuery<Usuario> query = em.createQuery(
            "SELECT u FROM Usuario u ORDER BY u.nombre", Usuario.class);
        return query.getResultList();
    }

    public List<Usuario> buscarPorNombre(String nombre) {
        TypedQuery<Usuario> query = em.createQuery(
            "SELECT u FROM Usuario u WHERE u.nombre LIKE :nombre", Usuario.class);
        query.setParameter("nombre", "%" + nombre + "%");
        return query.getResultList();
    }

    public List<Usuario> mayoresDe(int edadMinima) {
        TypedQuery<Usuario> query = em.createQuery(
            "SELECT u FROM Usuario u WHERE u.edad >= :edad ORDER BY u.edad", Usuario.class);
        query.setParameter("edad", edadMinima);
        return query.getResultList();
    }

    public void eliminar(Long id) {
        em.getTransaction().begin();
        Usuario usuario = em.find(Usuario.class, id);
        if (usuario != null) {
            em.remove(usuario);
        }
        em.getTransaction().commit();
    }

    public long contarUsuarios() {
        TypedQuery<Long> query = em.createQuery(
            "SELECT COUNT(u) FROM Usuario u", Long.class);
        return query.getSingleResult();
    }

    public void cerrar() {
        if (em != null && em.isOpen()) {
            em.close();
        }
        if (emf != null && emf.isOpen()) {
            emf.close();
        }
    }
}
