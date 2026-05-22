package fundamentos;

public class EstructurasControl {
    public static void main(String[] args) {
        int nota = 85;

        // if-else
        if (nota >= 90) {
            System.out.println("Sobresaliente");
        } else if (nota >= 70) {
            System.out.println("Notable");
        } else if (nota >= 50) {
            System.out.println("Aprobado");
        } else {
            System.out.println("Suspenso");
        }

        // switch
        String dia = "lunes";
        switch (dia) {
            case "lunes":    System.out.println("Inicio de semana"); break;
            case "viernes":  System.out.println("Ultimo dia laboral"); break;
            case "sabado":
            case "domingo":  System.out.println("Fin de semana"); break;
            default:         System.out.println("Dia laboral");
        }

        // for
        System.out.print("For: ");
        for (int i = 0; i < 5; i++) {
            System.out.print(i + " ");
        }
        System.out.println();

        // while
        System.out.print("While: ");
        int j = 0;
        while (j < 5) {
            System.out.print(j + " ");
            j++;
        }
        System.out.println();

        // do-while
        System.out.print("Do-while: ");
        int k = 0;
        do {
            System.out.print(k + " ");
            k++;
        } while (k < 5);
        System.out.println();

        // break y continue
        for (int i = 0; i < 10; i++) {
            if (i == 3) continue;
            if (i == 7) break;
            System.out.print(i + " ");
        }
        System.out.println("(salto el 3, paro en 7)");
    }
}
