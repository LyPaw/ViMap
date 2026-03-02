package raccoon;

import java.util.UUID;

/**
 * Clase base abstracta para todo lo que existe en el mundo de Raccoon City.
 * Gestiona identidad, nombre, salud y posición.
 */
public abstract class Entity {

    private final String id;
    protected String name;
    protected int health;
    protected int maxHealth;
    protected float posX;
    protected float posY;

    // ── Constructor ──────────────────────────────────────────────
    public Entity(String name, int maxHealth, float posX, float posY) {
        this.id        = UUID.randomUUID().toString().substring(0, 8);
        this.name      = name;
        this.maxHealth = maxHealth;
        this.health    = maxHealth;
        this.posX      = posX;
        this.posY      = posY;
    }

    // ── Getters ──────────────────────────────────────────────────
    public String getId()      { return id; }
    public String getName()    { return name; }
    public int    getHealth()  { return health; }
    public int    getMaxHealth() { return maxHealth; }

    // ── Lógica común ─────────────────────────────────────────────
    /**
     * Aplica daño a la entidad. No puede bajar de 0.
     * @param dmg puntos de daño recibidos
     */
    public void takeDamage(int dmg) {
        if (dmg <= 0) return;
        health = Math.max(0, health - dmg);
        System.out.println(name + " recibe " + dmg + " de daño. Salud: " + health + "/" + maxHealth);
        if (!isAlive()) {
            System.out.println(name + " ha muerto.");
        }
    }

    /**
     * Comprueba si la entidad sigue con vida.
     * @return true si health > 0
     */
    public boolean isAlive() {
        return health > 0;
    }

    // ── Métodos abstractos ───────────────────────────────────────
    /** Lógica de actualización por turno/frame. */
    public abstract void update();

    /** Descripción textual de la entidad. */
    public abstract String getDescription();

    @Override
    public String toString() {
        return "[" + getClass().getSimpleName() + " | " + name + " | HP: " + health + "/" + maxHealth + "]";
    }
}
