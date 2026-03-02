package raccoon;

/**
 * Estado de infección de un personaje.
 * A mayor nivel, más peligroso es el personaje.
 */
public enum InfectionStatus {
    CLEAN,
    EXPOSED,
    INFECTED,
    MUTATED
}
