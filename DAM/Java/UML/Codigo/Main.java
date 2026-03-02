package raccoon;

/**
 * Punto de entrada: demuestra el funcionamiento de todas las clases del UML.
 * Sirve como prueba manual de la jerarquía de objetos.
 */
public class Main {

    public static void main(String[] args) {

        System.out.println("╔══════════════════════════════════════╗");
        System.out.println("║   RACCOON CITY — DEMO OOP            ║");
        System.out.println("╚══════════════════════════════════════╝\n");

        // ── 1. Crear ítems ────────────────────────────────────────
        Weapon pistol   = new Weapon("Glock 17",  WeaponType.PISTOL,   25, 15, 0, 0);
        Weapon shotgun  = new Weapon("SPAS-12",   WeaponType.SHOTGUN,  60,  8, 0, 0);
        HealingItem herb = new HealingItem("Hierba Verde",  40, false, 0, 0);
        HealingItem cure = new HealingItem("Vacuna Anti-T", 20, true,  0, 0);

        // ── 2. Crear supervivientes ───────────────────────────────
        Survivor leon = new Survivor("Leon S. Kennedy", 0, 0);
        Survivor claire = new Survivor("Claire Redfield", 2, 0);

        leon.pickUp(pistol);
        leon.pickUp(herb);
        leon.equip(pistol);

        claire.pickUp(shotgun);
        claire.pickUp(cure);
        claire.equip(shotgun);

        System.out.println("--- Supervivientes ---");
        System.out.println(leon.getDescription());
        System.out.println(claire.getDescription());
        System.out.println();

        // ── 3. Crear enemigos ─────────────────────────────────────
        Zombie zombie1 = new Zombie("Zombie #1", 3, 0);
        Licker licker  = new Licker("Licker Alfa", 5, 0);
        Tyrant mr_x    = new Tyrant("Mr. X", 10, 0);

        System.out.println("--- Enemigos ---");
        System.out.println(zombie1.getDescription());
        System.out.println(licker.getDescription());
        System.out.println(mr_x.getDescription());
        System.out.println();

        // ── 4. Combate ────────────────────────────────────────────
        System.out.println("══ COMBATE ══");
        leon.attack(zombie1);
        zombie1.attack(leon);
        System.out.println("Estado de Leon: " + leon.getInfectionStatus());
        System.out.println();

        // Usar hierba si está herido
        if (leon.getHealth() < leon.getMaxHealth()) {
            leon.useItem(herb);
        }

        // Claire vs Licker
        claire.activateAdrenaline();
        claire.attack(licker);
        licker.tongueStrike(claire);
        System.out.println();

        // Leon vs Tyrant
        System.out.println("══ LEON vs MR. X ══");
        for (int i = 0; i < 3 && mr_x.isAlive(); i++) {
            leon.attack(mr_x);
            if (mr_x.isAlive()) mr_x.attack(leon);
        }
        System.out.println();

        // ── 5. Curar infección ────────────────────────────────────
        if (leon.getInfectionStatus() != InfectionStatus.CLEAN) {
            System.out.println("León necesita la vacuna!");
            // Claire pasa la vacuna a Leon (simplificado)
            cure.interact(leon);
            System.out.println("Estado infección Leon: " + leon.getInfectionStatus());
        }

        // ── 6. Habitaciones ──────────────────────────────────────
        System.out.println("\n══ EXPLORACIÓN ══");
        Room hall    = new Room("R01", "Vestíbulo de la Comisaría");
        Room armory  = new Room("R02", "Armería");
        Room lab     = new Room("R03", "Laboratorio B3");

        hall.addExit("norte", armory);
        hall.addExit("abajo", lab);
        armory.addExit("sur", hall);
        lab.setLocked(true);

        armory.addItem(new Weapon("Rocket Launcher", WeaponType.ROCKET_LAUNCHER, 200, 1, 0, 0));
        armory.addEntity(new Zombie("Zombie Guardia", 6, 0));

        hall.interact(leon);
        armory.interact(claire);
        lab.interact(leon);   // bloqueada

        // ── 7. Update loop ────────────────────────────────────────
        System.out.println("\n══ TURNO DE ACTUALIZACIÓN ══");
        leon.update();
        claire.update();
        licker.update();
        mr_x.update();

        System.out.println("\n✅ Demo completada.");
    }
}
