package raccoon;

/**
 * Ítem abstracto: cualquier objeto del mundo que se puede recoger e interactuar.
 * Extiende Entity e implementa Interactable.
 */
public abstract class Item extends Entity implements Interactable {

    protected String  itemId;
    protected String  displayName;
    protected boolean available;

    // ── Constructor ──────────────────────────────────────────────
    public Item(String displayName, float posX, float posY) {
        super(displayName, 1, posX, posY);  // los ítems tienen 1 HP simbólico
        this.displayName = displayName;
        this.available   = true;
    }

    // ── Getters ──────────────────────────────────────────────────
    public String  getDisplayName() { return displayName; }

    @Override
    public boolean isAvailable() { return available; }

    // ── update() heredado de Entity — los ítems no hacen nada por defecto
    @Override
    public void update() { /* sin comportamiento por defecto */ }

    // ── Método abstracto que las subclases deben implementar ──────
    /** Devuelve una descripción del efecto del ítem. */
    public abstract String getEffect();
}
