package raccoon;

/**
 * Zombie básico: infectado del virus-T.
 * Puede atacar e infectar a otros personajes.
 */
public class Zombie extends Character implements Attackable {

    private int   biteStrength;
    protected int mutationLevel;
    protected float detectionRange;

    // ── Constructor ──────────────────────────────────────────────
    public Zombie(String name, float posX, float posY) {
        super(name, 60, posX, posY, 0.6f);
        this.biteStrength    = 15;
        this.mutationLevel   = 1;
        this.detectionRange  = 5.0f;
        this.infectionStatus = InfectionStatus.MUTATED;
    }

    // ── Attackable ───────────────────────────────────────────────
    @Override
    public void attack(Entity target) {
        int dmg = getAttackDamage();
        System.out.println(name + " muerde a " + target.getName() + " por " + dmg + " de daño.");
        target.takeDamage(dmg);
        // Intentar infectar si el objetivo es un personaje
        if (target instanceof Character) {
            infect((Character) target);
        }
    }

    @Override
    public int getAttackDamage() {
        return biteStrength + (mutationLevel * 2);
    }

    // ── Infección ────────────────────────────────────────────────
    /**
     * Intenta infectar al objetivo. La probabilidad aumenta con el nivel de mutación.
     */
    public void infect(Character target) {
        if (target.getInfectionStatus() == InfectionStatus.CLEAN) {
            target.setInfectionStatus(InfectionStatus.EXPOSED);
            System.out.println("☣ " + target.getName() + " ha sido expuesto al virus-T!");
        } else if (target.getInfectionStatus() == InfectionStatus.EXPOSED) {
            target.setInfectionStatus(InfectionStatus.INFECTED);
            System.out.println("☣ " + target.getName() + " está INFECTADO por el virus-T!");
        }
    }

    // ── Entity ───────────────────────────────────────────────────
    @Override
    public void update() {
        // Comportamiento básico de patrulla
        System.out.println(name + " [Zombie] gruñe y busca presas...");
    }

    @Override
    public String getDescription() {
        return "Zombie | Mutación nivel " + mutationLevel + " | Mordisco: " + biteStrength;
    }

    @Override
    public void onDeath() {
        System.out.println("💀 " + name + " cae al suelo definitivamente.");
    }

    // ── Getters ──────────────────────────────────────────────────
    public int   getBiteStrength()   { return biteStrength; }
    public int   getMutationLevel()  { return mutationLevel; }
    public float getDetectionRange() { return detectionRange; }
}
