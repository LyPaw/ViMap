package interfaces.swing;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.SwingUtilities;
import java.awt.BorderLayout;
import java.awt.FlowLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class VentanaSwing extends JFrame {

    private JTextField campoNombre;
    private JLabel etiquetaSaludo;

    public VentanaSwing() {
        setTitle("Ventana Swing - ViMap");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(400, 200);
        setLocationRelativeTo(null);

        initComponents();
    }

    private void initComponents() {
        JPanel panelSuperior = new JPanel(new FlowLayout());
        JLabel lblNombre = new JLabel("Nombre:");
        campoNombre = new JTextField(20);
        panelSuperior.add(lblNombre);
        panelSuperior.add(campoNombre);

        JPanel panelCentral = new JPanel(new FlowLayout());
        etiquetaSaludo = new JLabel("Escribe tu nombre y pulsa el boton");
        panelCentral.add(etiquetaSaludo);

        JPanel panelInferior = new JPanel(new FlowLayout());
        JButton btnSaludar = new JButton("Saludar");
        JButton btnLimpiar = new JButton("Limpiar");
        JButton btnSalir = new JButton("Salir");

        btnSaludar.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                String nombre = campoNombre.getText().trim();
                if (!nombre.isEmpty()) {
                    etiquetaSaludo.setText("Hola, " + nombre + "! Bienvenido a Swing.");
                } else {
                    JOptionPane.showMessageDialog(VentanaSwing.this,
                        "Por favor, introduce un nombre.",
                        "Aviso", JOptionPane.WARNING_MESSAGE);
                }
            }
        });

        btnLimpiar.addActionListener(e -> {
            campoNombre.setText("");
            etiquetaSaludo.setText("Escribe tu nombre y pulsa el boton");
        });

        btnSalir.addActionListener(e -> System.exit(0));

        panelInferior.add(btnSaludar);
        panelInferior.add(btnLimpiar);
        panelInferior.add(btnSalir);

        setLayout(new BorderLayout());
        add(panelSuperior, BorderLayout.NORTH);
        add(panelCentral, BorderLayout.CENTER);
        add(panelInferior, BorderLayout.SOUTH);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            VentanaSwing ventana = new VentanaSwing();
            ventana.setVisible(true);
        });
    }
}
