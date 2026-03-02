package raccoon;

/**
 * Superviviente humano. Puede equipar armas y atacar.
 * Implementa Attackable.
 */
public class Survivor extends Character implements Attackable {

    private Weapon  equippedWeapon;
    private boolean adrenalineBoost;
    private int     staminaPoints;

    // ── Constructor ──────────────────────────────────────────────
    public Survivor(String name, float posX, float posY) {
        super(name, 100, posX, posY, 1.5f);
        this.adrenalineBoost = false;
        this.staminaPoints   = 100;
    }

    // ── Attackable ───────────────────────────────────────────────
    @Override
    public void attack(Entity target) {
        int dmg = getAttackDamage();
        System.out.println(name + " ataca a " + target.getName() + " con "
                + (equippedWeapon != null ? equippedWeapon.getDisplayName() : "puños")
                + " por " + dmg + " de daño.");
        target.takeDamage(dmg);
    }

    @Override
    public int getAttackDamage() {
        int base = (equippedWeapon != null) ? equippedWeapon.fire() : 5;
        return adrenalineBoost ? (int)(base * 1.5f) : base;
    }

    // ── Arma ─────────────────────────────────────────────────────
    /**
     * Equipa un arma del inventario.
     */
    public void equip(Weapon weapon) {
        this.equippedWeapon = weapon;
        System.out.println(name + " equipa: " + weapon.getDisplayName());
    }

    /**
     * Activa el modo adrenalina: aumenta el daño un 50% temporalmente.
     */
    public void activateAdrenaline() {
        if (staminaPoints >= 20) {
            adrenalineBoost = true;
            staminaPoints  -= 20;
            System.out.println(name + " activa la adrenalina! Estamina restante: " + staminaPoints);
        } else {
            System.out.println(name + " no tiene estamina suficiente.");
        }
    }

    // ── Entity ───────────────────────────────────────────────────
    @Override
    public void update() {
        // Desactivar adrenalina tras el turno
        if (adrenalineBoost) {
            adrenalineBoost = false;
            System.out.println(name + ": efecto de adrenalina terminado.");
        }
    }

    @Override
    public String getDescription() {
        return "Superviviente | Salud: " + health + " | Arma: "
                + (equippedWeapon != null ? equippedWeapon.getDisplayName() : "ninguna")
                + " | Infección: " + infectionStatus;
    }

    @Override
    public void onDeath() {
        System.out.println("💀 " + name + " ha caído. Raccoon City reclama otra víctima...");
        if (infectionStatus == InfectionStatus.INFECTED || infectionStatus == InfectionStatus.MUTATED) {
            System.out.println("⚠ " + name + " podría convertirse en zombie.");
        }
    }

    // ── Getters ──────────────────────────────────────────────────
    public Weapon  getEquippedWeapon()  { return equippedWeapon; }
    public boolean isAdrenalineActive() { return adrenalineBoost; }
    public int     getStaminaPoints()   { return staminaPoints; }
}
