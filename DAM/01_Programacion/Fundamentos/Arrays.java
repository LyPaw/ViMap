package fundamentos;

public class Arrays {
    public static void main(String[] args) {
        // Declaracion e inicializacion
        int[] numeros = new int[5];
        numeros[0] = 10;
        numeros[1] = 20;
        numeros[2] = 30;
        numeros[3] = 40;
        numeros[4] = 50;

        int[] valores = { 5, 3, 8, 1, 9, 2 };

        // Recorrido con for clasico
        System.out.print("numeros: ");
        for (int i = 0; i < numeros.length; i++) {
            System.out.print(numeros[i] + " ");
        }
        System.out.println();

        // Recorrido con for-each
        System.out.print("valores: ");
        for (int v : valores) {
            System.out.print(v + " ");
        }
        System.out.println();

        // Array multidimensional
        int[][] matriz = {
            {1, 2, 3},
            {4, 5, 6},
            {7, 8, 9}
        };

        System.out.println("Matriz 3x3:");
        for (int f = 0; f < matriz.length; f++) {
            for (int c = 0; c < matriz[f].length; c++) {
                System.out.print(matriz[f][c] + " ");
            }
            System.out.println();
        }

        // Algoritmo de busqueda lineal
        int buscar = 8;
        boolean encontrado = false;
        for (int v : valores) {
            if (v == buscar) {
                encontrado = true;
                break;
            }
        }
        System.out.println("Valor " + buscar + " encontrado: " + encontrado);

        // Algoritmo de ordenacion basico (burbuja)
        int[] ordenar = { 5, 3, 8, 1, 9, 2 };
        for (int i = 0; i < ordenar.length - 1; i++) {
            for (int j = 0; j < ordenar.length - 1 - i; j++) {
                if (ordenar[j] > ordenar[j + 1]) {
                    int temp = ordenar[j];
                    ordenar[j] = ordenar[j + 1];
                    ordenar[j + 1] = temp;
                }
            }
        }
        System.out.print("Ordenado: ");
        for (int v : ordenar) {
            System.out.print(v + " ");
        }
        System.out.println();
    }
}
