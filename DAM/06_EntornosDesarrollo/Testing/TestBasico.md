# Ejemplo de Tests Parametrizados con JUnit 5

## Dependencia Maven

```xml
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter-params</artifactId>
    <version>5.10.0</version>
    <scope>test</scope>
</dependency>
```

## Clase a testear

```java
public class Validador {
    public boolean esEmailValido(String email) {
        if (email == null || email.isEmpty()) return false;
        return email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    }

    public boolean esDNIValido(String dni) {
        if (dni == null || dni.length() != 9) return false;
        String numeros = dni.substring(0, 8);
        char letra = Character.toUpperCase(dni.charAt(8));
        String letras = "TRWAGMYFPDXBNJZSQVHLCKE";
        try {
            int numero = Integer.parseInt(numeros);
            return letras.charAt(numero % 23) == letra;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    public boolean esTelefonoValido(String telefono) {
        if (telefono == null) return false;
        return telefono.matches("^\\+?\\d{9,15}$");
    }
}
```

## Tests parametrizados

```java
import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.NullSource;
import org.junit.jupiter.params.provider.ValueSource;

class ValidadorTest {
    private Validador validador = new Validador();

    @ParameterizedTest
    @ValueSource(strings = {
        "usuario@dominio.com",
        "test@test.es",
        "nombre.apellido@empresa.co.uk",
        "email+tag@dominio.com"
    })
    @DisplayName("Emails validos")
    void testEmailValido(String email) {
        assertTrue(validador.esEmailValido(email));
    }

    @ParameterizedTest
    @ValueSource(strings = {
        "",
        "invalido",
        "@dominio.com",
        "usuario@",
        "usuario@.com",
        "usuario@dominio"
    })
    @DisplayName("Emails invalidos")
    void testEmailInvalido(String email) {
        assertFalse(validador.esEmailValido(email));
    }

    @ParameterizedTest
    @NullSource
    @DisplayName("Email nulo")
    void testEmailNulo(String email) {
        assertFalse(validador.esEmailValido(email));
    }

    @ParameterizedTest
    @CsvSource({
        "12345678Z, true",
        "00000000T, true",
        "12345678A, false",
        "invalido, false",
        ", false"
    })
    @DisplayName("Validacion de DNI")
    void testDNI(String dni, boolean esperado) {
        assertEquals(esperado, validador.esDNIValido(dni));
    }

    @ParameterizedTest
    @CsvSource({
        "612345678, true",
        "+34612345678, true",
        "1234, false",
        ", false"
    })
    @DisplayName("Validacion de telefono")
    void testTelefono(String telefono, boolean esperado) {
        assertEquals(esperado, validador.esTelefonoValido(telefono));
    }
}
```

## Ejercicio propuesto

Implementa un test parametrizado para una clase `ConversorTemperatura` con los siguientes metodos:
- `double celsiusAFahrenheit(double celsius)`
- `double fahrenheitACelsius(double fahrenheit)`

Usa @CsvSource con los siguientes valores de prueba:
- 0 C -> 32 F
- 100 C -> 212 F
- -40 C -> -40 F
- 37 C -> 98.6 F
