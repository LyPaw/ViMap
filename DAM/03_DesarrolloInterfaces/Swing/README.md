# Desarrollo de Interfaces con Swing

## Conceptos fundamentales

Swing es el kit de herramientas GUI tradicional de Java, parte de Java Foundation Classes (JFC).

### Componentes principales

-   **JFrame**: ventana principal de la aplicacion.
-   **JPanel**: contenedor generico para agrupar componentes.
-   **JButton**, **JLabel**, **JTextField**, **JTextArea**
-   **JComboBox**, **JList**, **JTable**, **JTree**
-   **JMenuBar**, **JMenu**, **JMenuItem**

### Layout Managers

-   **BorderLayout**: regiones (N, S, E, W, Center).
-   **FlowLayout**: flujo horizontal con ajuste.
-   **GridLayout**: cuadricula de celdas de igual tamano.
-   **GridBagLayout**: cuadricula flexible con pesos.
-   **BoxLayout**: alineacion vertical u horizontal.
-   **CardLayout**: apilamiento de paneles intercambiables.

### Manejo de eventos en Swing

-   `ActionListener`: para acciones en botones y menus.
-   `MouseListener`: para eventos de raton.
-   `KeyListener`: para eventos de teclado.
-   `DocumentListener`: para cambios en campos de texto.

### Modelo MVC en Swing

Los componentes Swing separan datos (Model) de visualizacion (View) y control (Controller):

-   `JTable` + `TableModel`
-   `JList` + `ListModel`
-   `JComboBox` + `ComboBoxModel`

### Hilos en Swing

-   **Event Dispatch Thread (EDT)**: todos los componentes Swing deben crearse y manipularse en el EDT.
-   `SwingUtilities.invokeLater()` para ejecutar codigo en el EDT.

## Ejercicios propuestos

1.  Crea una calculadora basica con JFrame, usando GridLayout para los botones.
2.  Implementa un bloc de notas simple con JMenuBar (Archivo, Editar, Formato) y JTextArea.
3.  Crea una aplicacion de lista de tareas con JList y DefaultListModel.
4.  Desarrolla un visor de imagenes que cargue archivos JPG/PNG usando JFileChooser.
5.  Implementa un formulario de alta de clientes con validacion de campos usando JDialog.
