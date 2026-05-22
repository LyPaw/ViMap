## Material de Estudio

El temario oficial completo de este modulo esta disponible en el siguiente archivo PDF local:

- [Temario: Flujos de Trabajo (PDF)](../temario_workflow.pdf)

# Sistemas de Gestion Empresarial - Flujos de Trabajo

## Conceptos fundamentales

Un flujo de trabajo (workflow) es una secuencia de tareas que procesan un conjunto de datos, con reglas que definen la transicion entre estados.

### Componentes de un workflow

1.  **Estado (State)**: situacion en la que se encuentra un elemento del workflow.
2.  **Transicion (Transition)**: paso de un estado a otro, activado por un evento.
3.  **Evento (Event)**: accion que desencadena una transicion.
4.  **Tarea (Task)**: unidad de trabajo que se ejecuta en un estado.
5.  **Regla (Rule)**: condicion que determina la validez de una transicion.

### Patrones de workflow

-   **Maquina de estados finitos (FSM)**: conjunto de estados y transiciones entre ellos.
-   **Pipeline**: secuencia lineal de etapas de procesamiento.
-   **Fork/Join**: division y combinacion de flujos paralelos.
-   **BPMN (Business Process Model and Notation)**: notacion estandar para modelar procesos de negocio.

### Implementacion en Java

-   `Enum` para definir estados.
-   `Map<Estado, List<Transicion>>` para definir la maquina de estados.
-   Patron State para comportamiento variable segun estado.
-   Frameworks: Activiti, Camunda, jBPM (para workflows complejos).

## Ejercicios propuestos

1.  Implementa un workflow de aprobacion de gastos: Solicitud -> Pendiente -> Aprobado/Rechazado.
2.  Anade notificaciones por email simuladas en cada cambio de estado del workflow.
3.  Implementa un historial de cambios que registre cada transicion con timestamp y usuario.
4.  Extiende el workflow con una regla de escalado: si supera 5000 EUR, requiere aprobacion del director.
5.  Implementa un workflow de incorporacion de empleado (onboarding) con tareas de RRHH, IT y formacion.

