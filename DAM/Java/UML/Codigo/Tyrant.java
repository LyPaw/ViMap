package raccoon;

/**
 * Tyrant (T-103): bioarma de Umbrella, prácticamente indestructible.
 * Tiene armadura y un modo de rabia que potencia sus ataques.
 */
public class Tyrant extends Zombie {

    private int     armorPoints;
    private boolean isEnraged;

    // ── Constructor ──────────────────────────────────────────────
    public Tyrant(String name, float posX, float posY) {
        super(name, posX, posY);
        this.maxHealth    = 500;
        this.health       = 500;
        this.mutationLevel = 10;
        this.speed        = 0.9f;
        this.armorPoints  = 80;
        this.isEnraged    = false;
    }

    // ── Armadura: sobrescribe takeDamage ─────────────────────────
    /**
     * La armadura absorbe parte del daño recibido.
     */
    @Override
    public void takeDamage(int dmg) {
        int absorbed  = Math.min(armorPoints, dmg / 2);
        int effective = dmg - absorbed;
        System.out.println(name + " absorbe " + absorbed + " de daño con su armadura.");
        super.takeDamage(effective);
    }

    // ── Modo rabia ───────────────────────────────────────────────
    /**
     * Activa el modo enraged: aumenta el daño y la velocidad.
     */
    public void rage() {
        if (!isEnraged) {
            isEnraged = true;
            speed    *= 1.5f;
            System.out.println("🔴 " + name + " entra en modo RABIA! Velocidad: " + speed);
        }
    }

    @Override
    public int getAttackDamage() {
        int base = super.getAttackDamage();
        return isEnraged ? base * 2 : base;
    }

    // ── Entity ───────────────────────────────────────────────────
    @Override
    public void update() {
        System.out.println(name + " [Tyrant] avanza implacablemente...");
        if (!isEnraged && health < maxHealth * 0.3) {
            rage();
        }
    }

    @Override
    public String getDescription() {
        return "Tyrant | HP: " + health + "/" + maxHealth
                + " | Armadura: " + armorPoints
                + " | Enraged: " + isEnraged;
    }

    // ── Getters ──────────────────────────────────────────────────
    public int     getArmorPoints() { return armorPoints; }
    public boolean isEnraged()      { return isEnraged; }
}
