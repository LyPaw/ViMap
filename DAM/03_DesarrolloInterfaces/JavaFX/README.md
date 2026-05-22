## Material de Estudio

El temario oficial completo de este modulo esta disponible en el siguiente archivo PDF local:

- [Temario: JavaFX (PDF)](../temario_javafx.pdf)

# Desarrollo de Interfaces con JavaFX

## Conceptos fundamentales

JavaFX es el framework moderno de Java para crear aplicaciones de escritorio con interfaces graficas de usuario (GUI).

### Arquitectura Scene Graph

-   **Stage**: la ventana principal de la aplicacion.
-   **Scene**: contenedor que alberga los nodos del grafo de escena.
-   **Node**: elemento basico del grafo (botones, textos, layouts, etc.).

### Layouts principales

-   **HBox**: disposicion horizontal.
-   **VBox**: disposicion vertical.
-   **BorderPane**: regiones (top, bottom, left, right, center).
-   **GridPane**: disposicion en cuadricula.
-   **StackPane**: apilamiento de nodos.
-   **FlowPane**: flujo horizontal/vertical con ajuste automatico.

### Componentes comunes

-   Label, Button, TextField, TextArea, ComboBox, ListView, TableView
-   Slider, ProgressBar, DatePicker, ColorPicker
-   MenuBar, ToolBar, TabPane, SplitPane

### Manejo de eventos

-   `setOnAction()`: evento de accion (botones).
-   `setOnMouseClicked()`: evento de clic.
-   `setOnKeyPressed()`: evento de teclado.
-   Lambda expressions: `button.setOnAction(e -> System.out.println("Clic!"));`

### FXML

FXML permite definir la interfaz de usuario en un archivo XML separado del codigo Java, siguiendo el patron MVC.

### Propiedades y Binding

-   `SimpleStringProperty`, `SimpleIntegerProperty`, etc.
-   Bindings unidireccionales y bidireccionales: `label.textProperty().bind(textField.textProperty())`

## Ejercicios propuestos

1.  Crea una calculadora con interfaz grafica usando GridPane y botones numericos.
2.  Implementa un formulario de registro con validacion de campos (nombre, email, password).
3.  Crea un visor de imagenes con botones anterior/siguiente y contador de imagenes.
4.  Desarrolla una lista de tareas (TODO list) con TableView, pudiendo anadir, completar y eliminar tareas.
5.  Implementa un cronometro con botones de iniciar, pausar y reiniciar, usando Timeline.

