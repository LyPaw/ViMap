# 📚 Arrays en Java:

Concepto y UsoUn array (arreglo) en Java es una estructura de datos que permite almacenar una colección de valores del mismo tipo bajo un único nombre de variable.

## 🎯 Propósito Principal.
Se usan para organizar colecciones de datos (como una lista de calificaciones, nombres o precios) y acceder a ellos de forma rápida utilizando un índice, que siempre comienza en $\mathbf{0}$.
Ejemplo de Uso (Acceso por Índice)

 ```java 
        public class UsoArrayEjemplo {
            public static void main(String[] args) {
                // 1. Declaración e inicialización: Array de 5 enteros
                int[] edades = new int[5];
        
                // 2. Asignación de un valor en el índice 2 (la tercera posición)
                edades[2] = 35;
        
                // 3. Acceso al valor en el índice 2
                int edadEspecifica = edades[2];
        
                System.out.println("La edad en la tercera posición (índice 2) es: " + edadEspecifica);
            }
        }
 ```


# 📚 Colecciones (Basicas) y Arrays en Java
# Arrays (Vectores) ➡

- Un Array es una zona de almacenamiento continuo que contiene una serie de elementos del mismo tipo.
- Se utiliza para almacenar datos y es una colección de datos del mismo tipo.
- En lugar de usar múltiples variables (numero1, numero2, etc.), se usa una única variable que contiene elementos accesibles por índice.

- El índice de un array va desde $0$ hasta la longitud del array $-1$.

## 1. Declaración y Creación
La declaración de un array indica la referencia al array y el tipo de datos que contendrá. Esta declaración crea solo una referencia en la pila de memoria, pero no reserva memoria para los datos.

- Sintaxis de Declaración: tipoElemento[] nombreArray;
 ```java

    double[] numeros; // Crea una referencia
    int[] otrosNumeros;
```
- Creación (Reserva de Memoria): Después de la declaración, se debe crear el array usando new para reservar el espacio en la memoria dinámica (montículo).
 ```java

   numeros = new double[10]; // Reserva espacio para 10 doubles
```  
- Forma Concisa: Se puede declarar y crear simultáneamente.
 ```java

   double[] numeros = new double[10];
```
## 2. Inicialización y Relleno
- Asignación por Índice (Relleno Posterior): Se asignan los valores uno por uno después de la creación.
```java

   double[] miLista = new double[3];
   miLista[0] = 1.2;
   miLista[1] = 2.2;
   miLista[2] = 3.2; // ¡OJO! el índice va desde 0 hasta la longitud-1
```
- Inicialización con Valores (Directa): Java permite crear e inicializar arrays con valores en la declaración. Esto declara, crea e inicializa el array en un solo paso.
```java

   // Forma común y concisa
   double[] miLista = {1.2, 1.3, 1.4, 1.5};
   
   // Otra forma válida
   int[] valores = new int[] {1, 2, 4};
```
## 3. Recorrido y Muestra
Se usan bucles para recorrer y mostrar los arrays.
- Bucle for Estándar: Útil si necesitas el índice.
```java

   for (int i = 0; i < miLista.length; i++) {
     System.out.println("Valor en el índice " + i + ": " + miLista[i]);
}

```
- Bucle Extendido (for-each): Simplifica la iteración, útil cuando solo necesitas el valor del elemento
```java

      double[] miLista = {2.9, 3.4, 4.5, 5.6};
    
      for (double u : miLista) {
        System.out.println(u);
      }

```

# Arrays Bidimensionales (Matrices) 🗺

Un array bidimensional se utiliza para almacenar datos en forma de tabla o matriz16. Se puede declarar como int[][] distancia.
## 1. Declaración y Creación.
- Declaración y Creación: Especifica el número de filas y columnas. Para el ejemplo de distancias entre 8 ciudades, se usaría:
```java
   int[][] distancia = new int[8][8];
}

```
- Longitud: Para un array int[][] x = new int[3][4]:
  - La longitud de las filas es x.length (que es $3$).
  - La longitud de las columnas es x[fila].length (que es $4$ para cada fila).

## 2. Inicialización y Relleno.
- Asignación por Índice: Se usan dos índices (fila y columna).
```java
   distancia[0][0] = 0;
   distancia[0][1] = 615; // Distancia de Almería (0) a Cádiz (1)
}

```
-Inicialización Directa: Se usan llaves anidadas para representar las filas y columnas.
```java
   int[][] array = {
    {1, 2, 3},    // Fila 0
    {4, 5, 6},    // Fila 1
    {7, 8, 9},    // Fila 2
    {10, 11, 12}  // Fila 3
   };

```
## 3.Recorrido y Muestra.
- Se utilizan bucles anidados para recorrer todos los elementos. El bucle exterior controla las filas, y el interior controla las columnas.

```java
       for (int fila = 0; fila < matriz.length; fila++) {
        for (int columna = 0; columna < matriz[fila].length; columna++) {
            // Muestra el elemento en la posición [fila][columna]
            System.out.print(matriz[fila][columna] + " ");
        }
        System.out.println(); // Salto de línea después de cada fila
       }
```
# ArrayList (Colecciones Dinámicas) 🏃‍♀️
- Un ArrayList es una lista de elementos que crece o se reduce dinámicamente cuando los
elementos se agregan o se eliminan.
- A diferencia de los arrays, es una colección de objetos,
no de datos primitivos

## 1.Declaración y Creación (Parametrización).
Es mejor declarar ArrayList utilizando Genéricos (parametrización) para especificar el tipo de
objeto que contendrá (por ejemplo, <String>).

- Sin Genéricos (Warning):
```java
   ArrayList lista = new ArrayList(); // Permite cualquier objeto (genera warning)
}

```
- Con Genéricos (Recomendado):
Esto asegura que solo se agreguen datos del tipo
especificado y elimina la necesidad de castings
```java
   // Opción 1:
   // ArrayList<String> lista = new ArrayList<>();
   // Opción 2: Usando la clase padre (List)
   import java.util.List;
   List<String> lista = new ArrayList<>();
}

```
## 2.Relleno y Operaciones Principales.
Se usan métodos de la clase ArrayList para manipular los elementos.

- Añadir elementos:
```java
   ArrayList<String> cityList = new ArrayList<>();
   cityList.add("Londres"); // Añade al final
   cityList.add("Madrid");
   cityList.add(2, "Roma"); // Añade "Roma" en el índice 2

```
- Obtener tamaño: list.size()
- Acceder a un elemento: list.get(index)
- Comprobar existencia: cityList.contains("Madrid")

## 3.Recorrido y Muestra.

- Bucle for Normal:

```java
  for (int i = 0; i < cityList.size(); i++) {
  // Se usa get(i) para acceder al elemento
  String nombre = cityList.get(i);
  System.out.println(nombre);
  }
```
- Bucle for-each Extendido:
```java
  for (String ciudad : cityList) {
  System.out.println(ciudad);
  }
```
- Método toString(): Imprime el contenido completo
```java
  System.out.println(cityList.toString());
  }
```
