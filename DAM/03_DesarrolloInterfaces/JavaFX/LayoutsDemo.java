package interfaces.javafx;

import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

public class LayoutsDemo extends Application {

    @Override
    public void start(Stage primaryStage) {
        BorderPane root = new BorderPane();
        root.setPadding(new Insets(10));

        // Top - HBox con titulo
        HBox topBar = new HBox(10);
        topBar.setPadding(new Insets(10));
        topBar.setStyle("-fx-background-color: #3b82f6;");
        Label titulo = new Label("Demo de Layouts en JavaFX");
        titulo.setStyle("-fx-text-fill: white; -fx-font-size: 18px; -fx-font-weight: bold;");
        topBar.getChildren().add(titulo);
        root.setTop(topBar);

        // Left - VBox con menu
        VBox menu = new VBox(8);
        menu.setPadding(new Insets(10));
        menu.setStyle("-fx-background-color: #1a2233;");
        String[] opciones = { "Inicio", "Usuarios", "Productos", "Reportes", "Configuracion" };
        for (String op : opciones) {
            Button btn = new Button(op);
            btn.setMaxWidth(Double.MAX_VALUE);
            menu.getChildren().add(btn);
        }
        root.setLeft(menu);

        // Center - GridPane con formulario
        GridPane formulario = new GridPane();
        formulario.setHgap(10);
        formulario.setVgap(10);
        formulario.setPadding(new Insets(20));

        formulario.add(new Label("Nombre:"), 0, 0);
        formulario.add(new TextField(), 1, 0);
        formulario.add(new Label("Email:"), 0, 1);
        formulario.add(new TextField(), 1, 1);
        formulario.add(new Label("Telefono:"), 0, 2);
        formulario.add(new TextField(), 1, 2);

        Button guardar = new Button("Guardar");
        formulario.add(guardar, 1, 3);
        GridPane.setMargin(guardar, new Insets(10, 0, 0, 0));

        root.setCenter(formulario);

        // Bottom - HBox con botones de accion
        HBox bottomBar = new HBox(10);
        bottomBar.setPadding(new Insets(10));
        bottomBar.setStyle("-fx-background-color: #0c1018;");
        bottomBar.getChildren().addAll(
            new Button("Aceptar"),
            new Button("Cancelar"),
            new Button("Aplicar")
        );
        root.setBottom(bottomBar);

        Scene scene = new Scene(root, 600, 400);
        primaryStage.setTitle("Layouts Demo - ViMap");
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
