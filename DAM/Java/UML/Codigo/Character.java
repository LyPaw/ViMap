package raccoon;

import java.util.ArrayList;
import java.util.List;

/**
 * Personaje abstracto: todo ser que se mueve, tiene inventario y estado de infección.
 * Extiende Entity e impone el contrato onDeath() a las subclases.
 */
public abstract class Character extends Entity {

    protected float           speed;
    protected InfectionStatus infectionStatus;
    protected List<Item>      inventory;

    // ── Constructor ──────────────────────────────────────────────
    public Character(String name, int maxHealth, float posX, float posY, float speed) {
        super(name, maxHealth, posX, posY);
        this.speed           = speed;
        this.infectionStatus = InfectionStatus.CLEAN;
        this.inventory       = new ArrayList<>();
    }

    // ── Getters / Setters ────────────────────────────────────────
    public InfectionStatus getInfectionStatus() { return infectionStatus; }
    public void setInfectionStatus(InfectionStatus status) { this.infectionStatus = status; }
    public float getSpeed() { return speed; }
    public List<Item> getInventory() { return inventory; }

    // ── Movimiento ───────────────────────────────────────────────
    /**
     * Mueve al personaje sumando un delta a su posición actual.
     */
    public void move(float dx, float dy) {
        posX += dx * speed;
        posY += dy * speed;
        System.out.println(name + " se mueve a (" + posX + ", " + posY + ")");
    }

    // ── Inventario ───────────────────────────────────────────────
    /**
     * Recoge un ítem y lo añade al inventario.
     */
    public void pickUp(Item item) {
        inventory.add(item);
        System.out.println(name + " recoge: " + item.getDisplayName());
    }

    /**
     * Usa un ítem del inventario (llama a interact y lo elimina si ya no está disponible).
     */
    public void useItem(Item item) {
        if (inventory.contains(item)) {
            item.interact(this);
            if (!item.isAvailable()) {
                inventory.remove(item);
            }
        } else {
            System.out.println(name + " no tiene ese ítem en el inventario.");
        }
    }

    // ── Sobrescribir takeDamage para disparar onDeath ─────────────
    @Override
    public void takeDamage(int dmg) {
        super.takeDamage(dmg);
        if (!isAlive()) {
            onDeath();
        }
    }

    // ── Métodos abstractos ───────────────────────────────────────
    /** Lógica que se ejecuta cuando el personaje muere. */
    public abstract void onDeath();
}
