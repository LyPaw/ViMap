package raccoon;

/**
 * Contrato para todo lo que puede atacar a una entidad.
 */
public interface Attackable {

    /**
     * Ataca al objetivo indicado.
     * @param target entidad que recibe el ataque
     */
    void attack(Entity target);

    /**
     * Devuelve el daño base del ataque.
     * @return puntos de daño
     */
    int getAttackDamage();
}
