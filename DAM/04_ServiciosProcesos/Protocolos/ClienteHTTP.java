package servicios.protocolos;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpRequest.BodyPublishers;
import java.time.Duration;

public class ClienteHTTP {
    private static final HttpClient client = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(10))
        .build();

    public static void main(String[] args) {
        try {
            // GET request
            String resultadoGET = hacerGET();
            System.out.println("=== RESPUESTA GET ===");
            System.out.println(resultadoGET);
            System.out.println();

            // POST request
            String resultadoPOST = hacerPOST();
            System.out.println("=== RESPUESTA POST ===");
            System.out.println(resultadoPOST);

        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
        }
    }

    public static String hacerGET() throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("http://localhost:8080/api/ejemplo/1"))
            .GET()
            .build();

        HttpResponse<String> response = client.send(request,
            HttpResponse.BodyHandlers.ofString());

        System.out.println("Codigo de estado: " + response.statusCode());
        System.out.println("Cabeceras:");
        response.headers().map().forEach((k, v) ->
            System.out.println("  " + k + ": " + v));
        System.out.println();

        return response.body();
    }

    public static String hacerPOST() throws Exception {
        String json = """
            {
            "title": "Ejemplo de post",
            "body": "Contenido de ejemplo desde ViMap",
                "userId": 1
            }
            """;

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("http://localhost:8080/api/ejemplo"))
            .header("Content-Type", "application/json")
            .POST(BodyPublishers.ofString(json))
            .build();

        HttpResponse<String> response = client.send(request,
            HttpResponse.BodyHandlers.ofString());

        System.out.println("Codigo de estado: " + response.statusCode());
        return response.body();
    }
}
