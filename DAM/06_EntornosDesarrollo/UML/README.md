## Material de Estudio

El temario oficial completo de este modulo esta disponible en el siguiente archivo PDF local:

- [Temario: UML (PDF)](../temario_uml.pdf)

# Entornos de Desarrollo - UML

## Unified Modeling Language

UML es un lenguaje de modelado visual estandarizado para especificar, visualizar, construir y documentar artefactos de sistemas de software.

### Tipos de diagramas UML (13 diagramas)

#### Diagramas estructurales (6)
-   **Diagrama de Clases**: muestra clases, atributos, metodos y relaciones.
-   **Diagrama de Objetos**: instancias concretas de clases en un momento dado.
-   **Diagrama de Componentes**: organizacion y dependencias entre componentes.
-   **Diagrama de Despliegue**: distribucion fisica del software en hardware.
-   **Diagrama de Paquetes**: agrupacion logica de elementos del modelo.
-   **Diagrama de Estructura Compuesta**: descomposicion interna de una clase.

#### Diagramas de comportamiento (7)
-   **Diagrama de Casos de Uso**: interacciones entre actores y el sistema.
-   **Diagrama de Secuencia**: interacciones ordenadas temporalmente entre objetos.
-   **Diagrama de Colaboracion**: interacciones entre objetos con enfoque estructural.
-   **Diagrama de Estados**: ciclo de vida de un objeto con estados y transiciones.
-   **Diagrama de Actividades**: flujo de trabajo o proceso de negocio.
-   **Diagrama de Tiempos**: restricciones temporales en interacciones.
-   **Diagrama de Interaccion General**: vision global de varios diagramas de interaccion.

### Relaciones entre clases

| Relacion | Notacion | Descripcion |
|----------|----------|-------------|
| Asociacion | -----> | Uso simple entre clases |
| Agregacion | <>----> | Todo-parte (debil) |
| Composicion | <*>----> | Todo-parte (fuerte) |
| Dependencia | - - -> | Uso temporal |
| Herencia | ---|> | Especializacion |
| Realizacion | - - |> | Implementacion de interfaz |

### Multiplicidad

-   `1` : exactamente uno
-   `0..1` : cero o uno
-   `*` : cero o muchos
-   `1..*` : uno o muchos
-   `0..n` : cero a n especifico

## Ejercicios propuestos

1.  Disena un diagrama de clases para un sistema de gestion de biblioteca con clases: Libro, Autor, Usuario, Prestamo.
2.  Crea un diagrama de casos de uso para un cajero automatico (retirar, ingresar, consultar saldo, transferir).
3.  Modela un diagrama de secuencia para el proceso de compra online (Cliente -> Carrito -> Pedido -> Pago).
4.  Disena un diagrama de estados para el ciclo de vida de un pedido (pendiente, confirmado, enviado, entregado, cancelado).
5.  Transforma un diagrama de clases dado a codigo Java (forward engineering).

