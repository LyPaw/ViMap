package accesodatos.jpa;

import java.util.List;

public class MainJPA {
    public static void main(String[] args) {
        UsuarioRepository repo = new UsuarioRepository();

        // Insertar usuarios
        System.out.println("=== Insertando usuarios ===");
        repo.guardar(new Usuario("Ana Lopez", "ana@email.com", 25));
        repo.guardar(new Usuario("Carlos Ruiz", "carlos@email.com", 30));
        repo.guardar(new Usuario("Beatriz Garcia", "beatriz@email.com", 22));
        repo.guardar(new Usuario("David Martinez", "david@email.com", 35));

        // Listar todos
        System.out.println("\n=== Todos los usuarios ===");
        List<Usuario> todos = repo.listarTodos();
        todos.forEach(System.out::println);

        // Buscar por ID
        System.out.println("\n=== Busqueda por ID ===");
        Usuario u = repo.buscarPorId(1L);
        System.out.println("Encontrado: " + u);

        // Buscar por nombre
        System.out.println("\n=== Busqueda por nombre ===");
        List<Usuario> encontrados = repo.buscarPorNombre("ana");
        encontrados.forEach(System.out::println);

        // Usuarios mayores de edad
        System.out.println("\n=== Usuarios mayores de 25 ===");
        List<Usuario> mayores = repo.mayoresDe(25);
        mayores.forEach(System.out::println);

        // Contar usuarios
        System.out.println("\nTotal usuarios: " + repo.contarUsuarios());

        // Actualizar
        System.out.println("\n=== Actualizando usuario ===");
        Usuario actualizar = repo.buscarPorId(1L);
        if (actualizar != null) {
            actualizar.setEmail("ana.nuevo@email.com");
            repo.guardar(actualizar);
            System.out.println("Actualizado: " + repo.buscarPorId(1L));
        }

        // Eliminar
        System.out.println("\n=== Eliminando usuario ===");
        repo.eliminar(4L);
        System.out.println("Total tras eliminar: " + repo.contarUsuarios());

        repo.cerrar();
    }
}
