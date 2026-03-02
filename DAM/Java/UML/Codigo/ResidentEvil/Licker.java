package raccoon;

/**
 * Licker: mutación avanzada del zombie, ciego pero con lengua letal.
 * Puede trepar por superficies.
 */
public class Licker extends Zombie {

    private int     tongueDamage;
    private boolean climbable;

    // ── Constructor ──────────────────────────────────────────────
    public Licker(String name, float posX, float posY) {
        super(name, posX, posY);
        this.maxHealth      = 120;
        this.health         = 120;
        this.mutationLevel  = 3;
        this.speed          = 1.8f;
        this.detectionRange = 8.0f;   // detecta por sonido, no por vista
        this.tongueDamage   = 30;
        this.climbable      = true;
    }

    // ── Ataque especial ──────────────────────────────────────────
    /**
     * Ataca con la lengua: mayor alcance y daño que el mordisco.
     */
    public void tongueStrike(Entity target) {
        System.out.println(name + " lanza su lengua hacia " + target.getName()
                + " causando " + tongueDamage + " de daño!");
        target.takeDamage(tongueDamage);
    }

    @Override
    public int getAttackDamage() {
        // El Licker usa la lengua como ataque base
        return tongueDamage + mutationLevel;
    }

    // ── Entity ───────────────────────────────────────────────────
    @Override
    public void update() {
        System.out.println(name + " [Licker] trepa por las paredes, buscando presas por sonido...");
    }

    @Override
    public String getDescription() {
        return "Licker | Daño de lengua: " + tongueDamage
                + " | Puede trepar: " + climbable
                + " | Detección: " + detectionRange + "m";
    }

    // ── Getters ──────────────────────────────────────────────────
    public int     getTongueDamage() { return tongueDamage; }
    public boolean isClimbable()     { return climbable; }
}
