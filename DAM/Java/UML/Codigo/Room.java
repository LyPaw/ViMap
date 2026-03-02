package raccoon;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Habitación de Raccoon City.
 * Contiene entidades e ítems, y conecta con otras habitaciones.
 * Implementa Interactable (entrar en la sala es una interacción).
 */
public class Room implements Interactable {

    private final String        roomId;
    private       String        description;
    private       List<Entity>  entities;
    private       List<Item>    items;
    private       Map<String, Room> exits;
    private       boolean       locked;

    // ── Constructor ──────────────────────────────────────────────
    public Room(String roomId, String description) {
        this.roomId      = roomId;
        this.description = description;
        this.entities    = new ArrayList<>();
        this.items       = new ArrayList<>();
        this.exits       = new HashMap<>();
        this.locked      = false;
    }

    // ── Interactable ─────────────────────────────────────────────
    /**
     * El personaje entra en la sala: se le muestran entidades e ítems presentes.
     */
    @Override
    public void interact(Character actor) {
        if (locked) {
            System.out.println("🔒 La sala \"" + description + "\" está cerrada con llave.");
            return;
        }
        System.out.println("\n── " + actor.getName() + " entra en: " + description + " ──");
        if (entities.isEmpty() && items.isEmpty()) {
            System.out.println("  La sala está vacía.");
        }
        if (!entities.isEmpty()) {
            System.out.println("  Entidades presentes:");
            entities.forEach(e -> System.out.println("    • " + e));
        }
        if (!items.isEmpty()) {
            System.out.println("  Ítems disponibles:");
            items.forEach(it -> System.out.println("    • " + it.getDisplayName() + " — " + it.getEffect()));
        }
        System.out.println("  Salidas: " + exits.keySet());
    }

    @Override
    public boolean isAvailable() {
        return !locked;
    }

    // ── Gestión de entidades ──────────────────────────────────────
    public void addEntity(Entity entity) {
        entities.add(entity);
    }

    public void removeEntity(Entity entity) {
        entities.remove(entity);
    }

    // ── Gestión de ítems ─────────────────────────────────────────
    public void addItem(Item item) {
        items.add(item);
    }

    public void removeItem(Item item) {
        items.remove(item);
    }

    // ── Salidas ───────────────────────────────────────────────────
    public void addExit(String direction, Room room) {
        exits.put(direction, room);
    }

    public Room getExit(String direction) {
        return exits.getOrDefault(direction, null);
    }

    // ── Getters / Setters ────────────────────────────────────────
    public String         getRoomId()     { return roomId; }
    public String         getDescription(){ return description; }
    public List<Entity>   getEntities()   { return entities; }
    public List<Item>     getItems()      { return items; }
    public boolean        isLocked()      { return locked; }
    public void           setLocked(boolean locked) { this.locked = locked; }

    @Override
    public String toString() {
        return "[Room: " + description + " | Entidades: " + entities.size()
                + " | Ítems: " + items.size() + " | Bloqueada: " + locked + "]";
    }
}
