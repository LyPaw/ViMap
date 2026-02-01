# Arrays y Colecciones en Java
## I. Arrays Unidimensionales (Vectores) 🗃️
### Los ejercicios se centran en la declaración, inicialización, recorrido y operaciones básicas en arrays de tamaño fijo.
### Ejercicio 1: Suma y Media
- Objetivo: Crear un array, llenarlo y calcular estadísticas básicas.
- Instrucciones:
  - Crea un array de tipo double llamado precios con un tamaño de 5.
  - Asigna manualmente 5 precios diferentes al array (ej.: precios[0] = 15.50;).
  - Usando un bucle for estándar, recorre el array para sumar todos los valores.
  - Muestra la suma total y el valor medio de los precios.
```java
    public class EjercicioArrays1 {
    public static void main(String[] args) {
    double[] precios = new double[5];
    precios[0] = 15.50;
    precios[1] = 20.00;
    precios[2] = 5.25;
    precios[3] = 12.00;
    precios[4] = 8.75;
    double sumaTotal = 0;
    for (int i = 0; i < precios.length; i++) {
    sumaTotal += precios[i];
    }
    double valorMedio = sumaTotal / precios.length;
    System.out.println("Suma total: " + sumaTotal);
    System.out.println("Valor medio: " + valorMedio);
    }
    }
```
- Resultado Esperado:
```java
Suma total: 61.5
Valor medio: 12.3
```
### Ejercicio 2: Bucle Extendido y Conteo
- Objetivo: Usar el bucle for-each y aplicar lógica condicional.
- Instrucciones:
  - Crea un array de tipo int inicializado directamente llamado calificaciones con 8 valores.
  - Usa el bucle for-each para recorrer el array.
  - Dentro del bucle, cuenta cuántas calificaciones son superiores o iguales a 90.
  - Muestra el resultado final (ej.: "Hay 3 alumnos con sobresaliente").
```java
  public class EjercicioArrays2 {
  public static void main(String[] args) {
  int[] calificaciones = {85, 92, 78, 95, 88, 91, 75, 99};
  int contadorSobresalientes = 0;
  // Uso del bucle for-each
  for (int calificacion : calificaciones) {
  if (calificacion >= 90) {
  contadorSobresalientes++;
  }
  }
  System.out.println("Total de calificaciones: " + calificaciones.length);
  System.out.println("Hay " + contadorSobresalientes + " alumnos con sobresaliente.");
  }
  }
```
- Resultado Esperado:
```java
Total de calificaciones: 8
Hay 4 alumnos con sobresaliente
```
### Ejercicio 3: Impresión Rápida
- Objetivo: Usar la utilidad Arrays.toString() para depuración.
- Instrucciones:
  - Crea un array de tipo String llamado dias con los nombres de los días de la semana.
  - Usa Arrays.toString() para imprimir el array completo en una sola línea.  
```java
  import java.util.Arrays;
  public class EjercicioArrays3 {
  public static void main(String[] args) {
  String[] dias = {"Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"};
  // Uso de Arrays.toString()
  System.out.println("Días de la semana: " + Arrays.toString(dias));
  }
  }
```
- Resultado Esperado:
```java
Días de la semana: [Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo]
```
## II. Arrays Bidimensionales (Matrices) 🌐
### Los ejercicios se centran en el uso de bucles anidados y el acceso por doble índice.
### Ejercicio 4: Inicialización y Acceso
- Objetivo: Declarar y acceder a elementos en una matriz.
- Instrucciones:
  - Declara e inicializa una matriz de enteros 3 × 3 llamada matrizIdentidad donde la diagonal principal sea 1 y el resto 0.
Ejemplo:

    int[][] matriz = {
        {1, 0, 0},
        {0, 1, 0},
        {0, 0, 1}
    };
  - Imprime el valor en la posición central: matriz[1][1].
  - Imprime el número total de filas y columnas:
  - matriz.length
  - matriz[0].length
```java
  public class EjercicioMatrices1 {
  public static void main(String[] args) {
  // Inicialización directa de una matriz 3x3
  int[][] matrizIdentidad = {
  {1, 0, 0},
  {0, 1, 0},
  {0, 0, 1}
  };
  System.out.println("Valor en la posición central [1][1]: " + matrizIdentidad[1][1]);
  System.out.println("Número de filas (matrizIdentidad.length): " + matrizIdentidad.length);
  System.out.println("Número de columnas (matrizIdentidad[0].length): " +
  matrizIdentidad[0].length);
  }
  }
```
- Resultado Esperado:
```java
Valor en la posición central [1][1]: 1
Número de filas (matrizIdentidad.length): 3
Número de columnas (matrizIdentidad[0].length): 3
```
### Ejercicio 5: Recorrido y Suma por Fila
- Objetivo: Usar bucles anidados para procesamiento.
- Instrucciones:
  - Crea una matriz de enteros 4 × 5 llamada datos y asígnale valores aleatorios o fijos.
  - Usa bucles anidados para recorrer la matriz.
  - Por cada fila, calcula y muestra la suma de sus elementos.   
```java
  public class EjercicioMatrices2 {
  public static void main(String[] args) {
  int[][] datos = {
  {10, 2, 5, 8, 1},
  {3, 15, 7, 6, 9},
  {1, 2, 3, 4, 5},
  {10, 10, 10, 10, 10}
  };
  // Bucle exterior para filas
  for (int fila = 0; fila < datos.length; fila++) {
  int sumaFila = 0;
  // Bucle interior para columnas
  for (int columna = 0; columna < datos[fila].length; columna++) {
  sumaFila += datos[fila][columna];
  }
  System.out.println("Suma de la Fila " + fila + ": " + sumaFila);
  }
  }
  }
```
- Resultado Esperado: 
```java
Suma de la Fila 0: 26
Suma de la Fila 1: 40
Suma de la Fila 2: 15
Suma de la Fila 3: 50
```
