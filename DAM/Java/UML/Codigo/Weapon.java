package raccoon;

/**
 * Arma: ítem que puede equiparse y dispararse.
 * Extiende Item (que ya implementa Interactable).
 */
public class Weapon extends Item {

    private WeaponType type;
    private int        damage;
    private int        ammo;
    private int        maxAmmo;

    // ── Constructor ──────────────────────────────────────────────
    public Weapon(String displayName, WeaponType type, int damage, int maxAmmo, float posX, float posY) {
        super(displayName, posX, posY);
        this.type    = type;
        this.damage  = damage;
        this.maxAmmo = maxAmmo;
        this.ammo    = maxAmmo;
    }

    // ── Interactable ─────────────────────────────────────────────
    /**
     * Al interactuar, el personaje recoge el arma en su inventario.
     */
    @Override
    public void interact(Character actor) {
        System.out.println(actor.getName() + " recoge el arma: " + displayName);
        actor.pickUp(this);
    }

    // ── Uso ──────────────────────────────────────────────────────
    /**
     * Dispara el arma. Devuelve el daño producido, 0 si no hay munición.
     */
    public int fire() {
        if (ammo <= 0) {
            System.out.println(displayName + ": ¡Sin munición! Recarga primero.");
            return 0;
        }
        ammo--;
        System.out.println(displayName + " dispara. Munición restante: " + ammo + "/" + maxAmmo);
        return damage;
    }

    /**
     * Recarga el arma a su capacidad máxima.
     */
    public void reload() {
        ammo = maxAmmo;
        System.out.println(displayName + " recargada. Munición: " + ammo + "/" + maxAmmo);
    }

    // ── Item ──────────────────────────────────────────────────────
    @Override
    public String getEffect() {
        return type + " — Daño: " + damage + " | Munición: " + ammo + "/" + maxAmmo;
    }

    @Override
    public String getDescription() {
        return "Arma [" + type + "] " + displayName + " | " + getEffect();
    }

    // ── Getters ──────────────────────────────────────────────────
    public WeaponType getType()    { return type; }
    public int        getDamage()  { return damage; }
    public int        getAmmo()    { return ammo; }
    public int        getMaxAmmo() { return maxAmmo; }
}
