package raccoon;

/**
 * Ítem de curación: restaura salud y opcionalmente cura la infección.
 */
public class HealingItem extends Item {

    private int     healAmount;
    private boolean cureInfection;

    // ── Constructor ──────────────────────────────────────────────
    public HealingItem(String displayName, int healAmount, boolean cureInfection,
                       float posX, float posY) {
        super(displayName, posX, posY);
        this.healAmount    = healAmount;
        this.cureInfection = cureInfection;
    }

    // ── Interactable ─────────────────────────────────────────────
    /**
     * Al interactuar, cura al actor y opcionalmente elimina la infección.
     * health es protected en Entity — accesible desde el mismo package.
     */
    @Override
    public void interact(Character actor) {
        int before = actor.getHealth();
        int healed = Math.min(healAmount, actor.getMaxHealth() - before);
        actor.health += healed;   // acceso directo al campo protected (mismo package)
        System.out.println(actor.getName() + " usa " + displayName
                + " y recupera " + healed + " HP. Salud: "
                + actor.getHealth() + "/" + actor.getMaxHealth());

        if (cureInfection
                && actor.getInfectionStatus() != InfectionStatus.CLEAN
                && actor.getInfectionStatus() != InfectionStatus.MUTATED) {
            actor.setInfectionStatus(InfectionStatus.CLEAN);
            System.out.println("💊 La infección de " + actor.getName() + " ha sido curada.");
        }

        available = false;
    }

    // ── Item ──────────────────────────────────────────────────────
    @Override
    public String getEffect() {
        return "Cura " + healAmount + " HP"
                + (cureInfection ? " + elimina infección" : "");
    }

    @Override
    public String getDescription() {
        return "HealingItem [" + displayName + "] — " + getEffect();
    }

    // ── Getters ──────────────────────────────────────────────────
    public int     getHealAmount()   { return healAmount; }
    public boolean isCureInfection() { return cureInfection; }
}
