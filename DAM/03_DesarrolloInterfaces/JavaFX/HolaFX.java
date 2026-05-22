package interfaces.javafx;

import javafx.application.Application;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

public class HolaFX extends Application {

    private int contador = 0;

    @Override
    public void start(Stage primaryStage) {
        Label etiqueta = new Label("Hola, JavaFX!");
        etiqueta.setStyle("-fx-font-size: 24px; -fx-font-weight: bold;");

        Label contadorLabel = new Label("Clics: 0");

        Button boton = new Button("Haz clic");
        boton.setOnAction(e -> {
            contador++;
            contadorLabel.setText("Clics: " + contador);
            etiqueta.setText("Has hecho clic " + contador + " veces!");
        });

        Button botonReset = new Button("Reiniciar");
        botonReset.setOnAction(e -> {
            contador = 0;
            contadorLabel.setText("Clics: 0");
            etiqueta.setText("Hola, JavaFX!");
        });

        VBox root = new VBox(15);
        root.setAlignment(Pos.CENTER);
        root.getChildren().addAll(etiqueta, contadorLabel, boton, botonReset);

        Scene scene = new Scene(root, 400, 300);

        primaryStage.setTitle("Hola JavaFX - ViMap");
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
