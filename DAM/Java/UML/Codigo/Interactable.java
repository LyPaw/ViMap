package raccoon;

/**
 * Contrato para objetos con los que un personaje puede interactuar.
 */
public interface Interactable {

    /**
     * Ejecuta la interacción con el actor indicado.
     * @param actor personaje que inicia la interacción
     */
    void interact(Character actor);

    /**
     * Indica si el objeto está disponible para ser usado.
     * @return true si está disponible
     */
    boolean isAvailable();
}
