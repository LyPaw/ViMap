package interfaces.javafx;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextField;
import javafx.scene.input.KeyCode;
import javafx.scene.input.KeyEvent;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

public class EventosJavaFX extends Application {

    @Override
    public void start(Stage primaryStage) {
        TextField campoTexto = new TextField();
        campoTexto.setPromptText("Escribe algo aqui...");

        TextArea registro = new TextArea();
        registro.setEditable(false);
        registro.setPrefHeight(250);

        Label etiqueta = new Label("Pasa el raton por aqui");
        etiqueta.setStyle("-fx-font-size: 16px; -fx-padding: 20px; -fx-border-color: #3b82f6; -fx-border-radius: 5px;");

        // Evento de teclado
        campoTexto.setOnKeyPressed((KeyEvent event) -> {
            if (event.getCode() == KeyCode.ENTER) {
                registro.appendText("Enter presionado: " + campoTexto.getText() + "\n");
            } else {
                registro.appendText("Tecla presionada: " + event.getText() + "\n");
            }
        });

        campoTexto.setOnKeyReleased(event -> {
            if (event.getCode() == KeyCode.ESCAPE) {
                campoTexto.clear();
                registro.appendText("Campo limpiado (ESC)\n");
            }
        });

        // Eventos de raton
        etiqueta.setOnMouseEntered((MouseEvent event) -> {
            etiqueta.setStyle("-fx-font-size: 16px; -fx-padding: 20px; -fx-border-color: #22d3ee; -fx-border-radius: 5px; -fx-background-color: #111827;");
            registro.appendText("Mouse entro en la etiqueta\n");
        });

        etiqueta.setOnMouseExited(event -> {
            etiqueta.setStyle("-fx-font-size: 16px; -fx-padding: 20px; -fx-border-color: #3b82f6; -fx-border-radius: 5px;");
            registro.appendText("Mouse salio de la etiqueta\n");
        });

        etiqueta.setOnMouseClicked(event -> {
            registro.appendText("Clic en la etiqueta (" + event.getClickCount() + " clics)\n");
        });

        VBox root = new VBox(10);
        root.setStyle("-fx-padding: 20px;");
        root.getChildren().addAll(campoTexto, etiqueta, registro);

        Scene scene = new Scene(root, 500, 400);
        primaryStage.setTitle("Eventos JavaFX - ViMap");
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
