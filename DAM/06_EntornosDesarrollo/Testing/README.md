# Entornos de Desarrollo - Testing

## Pruebas de Software

### Piramide de testing

```
         /\
        /  \         Pruebas E2E (lentas, costosas)
       /    \
      /      \       Pruebas de Integracion
     /________\
    /          \     Pruebas Unitarias (rapidas, muchas)
   /            \
  /______________\
```

### Estrategias de testing

1.  **Caja negra**: se prueban las funcionalidades sin conocer el codigo interno.
    -   Equivalencia de particiones
    -   Valores limite
    -   Tablas de decision
2.  **Caja blanca**: se prueba la estructura interna del codigo.
    -   Cobertura de sentencias
    -   Cobertura de ramas
    -   Cobertura de caminos
3.  **Caja gris**: combinacion de las anteriores.

### Herramientas

-   **JUnit 5**: framework de pruebas unitarias para Java.
-   **Mockito**: framework de mocking para aislar dependencias.
-   **AssertJ**: libreria de aserciones fluidas.
-   **JaCoCo**: herramienta de cobertura de codigo.
-   **Selenium**: pruebas funcionales de aplicaciones web.
-   **SoapUI / Postman**: pruebas de APIs REST/SOAP.

### Cobertura de codigo

Metricas comunes:
-   **Line coverage**: porcentaje de lineas de codigo ejecutadas.
-   **Branch coverage**: porcentaje de ramas de decision ejecutadas.
-   **Method coverage**: porcentaje de metodos invocados.
-   **Path coverage**: porcentaje de caminos posibles ejecutados.

### Integracion continua (CI)

-   Los tests se ejecutan automaticamente en cada commit.
-   Herramientas: Jenkins, GitHub Actions, GitLab CI, CircleCI.
-   El pipeline tipico: build -> test -> analisis -> deploy.

## Ejercicios propuestos

1.  Calcula la cobertura de una clase utilizando JaCoCo e identifica las ramas no cubiertas.
2.  Escribe tests parametrizados con JUnit 5 que prueben multiples combinaciones de entrada.
3.  Usa Mockito para simular una dependencia externa (base de datos, API) en un test unitario.
4.  Implementa pruebas de integracion para un repositorio JPA usando una BD en memoria (H2).
5.  Disena una suite de pruebas con @Tag para separar tests rapidos de tests lentos.
