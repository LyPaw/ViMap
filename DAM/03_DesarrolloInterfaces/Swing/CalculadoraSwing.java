package interfaces.swing;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.SwingUtilities;
import java.awt.BorderLayout;
import java.awt.Font;
import java.awt.GridLayout;

public class CalculadoraSwing extends JFrame {

    private JTextField pantalla;
    private double operando1 = 0;
    private String operador = "";
    private boolean nuevoNumero = true;

    public CalculadoraSwing() {
        setTitle("Calculadora Swing - ViMap");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(300, 400);
        setLocationRelativeTo(null);

        initComponents();
    }

    private void initComponents() {
        pantalla = new JTextField();
        pantalla.setEditable(false);
        pantalla.setFont(new Font("Monospaced", Font.BOLD, 24));
        pantalla.setHorizontalAlignment(JTextField.RIGHT);
        pantalla.setText("0");

        String[] botones = {
            "7", "8", "9", "/",
            "4", "5", "6", "*",
            "1", "2", "3", "-",
            "0", ".", "=", "+",
            "C", "CE"
        };

        JPanel panelBotones = new JPanel(new GridLayout(5, 4, 4, 4));

        for (String texto : botones) {
            JButton btn = new JButton(texto);
            btn.setFont(new Font("Monospaced", Font.PLAIN, 18));
            btn.addActionListener(e -> botonPresionado(texto));
            panelBotones.add(btn);
        }

        setLayout(new BorderLayout());
        add(pantalla, BorderLayout.NORTH);
        add(panelBotones, BorderLayout.CENTER);
    }

    private void botonPresionado(String texto) {
        if ("0123456789".contains(texto)) {
            if (nuevoNumero) {
                pantalla.setText(texto);
                nuevoNumero = false;
            } else {
                pantalla.setText(pantalla.getText() + texto);
            }
        } else if (texto.equals(".")) {
            if (!pantalla.getText().contains(".")) {
                pantalla.setText(pantalla.getText() + ".");
            }
        } else if (texto.equals("C")) {
            pantalla.setText("0");
            operando1 = 0;
            operador = "";
            nuevoNumero = true;
        } else if (texto.equals("CE")) {
            pantalla.setText("0");
            nuevoNumero = true;
        } else if (texto.equals("=")) {
            if (!operador.isEmpty()) {
                double operando2 = Double.parseDouble(pantalla.getText());
                double resultado = calcular(operando1, operando2, operador);
                pantalla.setText(formatear(resultado));
                operador = "";
                nuevoNumero = true;
            }
        } else {
            if (!nuevoNumero) {
                operando1 = Double.parseDouble(pantalla.getText());
                operador = texto;
                nuevoNumero = true;
            }
        }
    }

    private double calcular(double a, double b, String op) {
        switch (op) {
            case "+": return a + b;
            case "-": return a - b;
            case "*": return a * b;
            case "/":
                if (b != 0) return a / b;
                return 0;
            default: return 0;
        }
    }

    private String formatear(double d) {
        if (d == (long) d) {
            return String.valueOf((long) d);
        }
        return String.valueOf(d);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            CalculadoraSwing calc = new CalculadoraSwing();
            calc.setVisible(true);
        });
    }
}
