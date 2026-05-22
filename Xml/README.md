# XML - Lenguajes de Marcas (1º DAM)

## 1. Introduccion a XML

XML (eXtensible Markup Language) es un lenguaje de marcado diseñado para almacenar y transportar datos de forma estructurada y legible tanto por humanos como por maquinas.

### Caracteristicas principales

- **Extensible**: el usuario define sus propias etiquetas
- **Auto-documentado**: la estructura describe los datos
- **Independiente de plataforma**: texto plano, cualquier sistema puede leerlo
- **Basado en arbol**: los elementos se anidan formando una jerarquia

### Reglas basicas de un XML bien formado

1. Debe tener un unico elemento raiz
2. Las etiquetas deben cerrarse correctamente (`<elemento>...</elemento>` o `<elemento/>`)
3. Los atributos deben estar entre comillas (simples o dobles)
4. Los nombres de etiquetas distinguen mayusculas/minusculas
5. Los nombres deben empezar con letra o guion bajo, no con numero

## 2. Estructura de un documento XML

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!-- Declaracion: version y codificacion obligatoria -->

<biblioteca xmlns="http://vimap.es/biblioteca">
    <!-- namespace por defecto -->

    <libro id="1">
        <!-- atributo: informacion adicional sobre el elemento -->
        <isbn>978-84-376-0494-7</isbn>
        <titulo>Cien anios de soledad</titulo>
        <autor id="101">
            <nombre>Gabriel</nombre>
            <apellidos>Garcia Marquez</apellidos>
            <nacionalidad>Colombiana</nacionalidad>
        </autor>
        <anio>1967</anio>
        <precio moneda="EUR">19.99</precio>
        <!-- contenido mixto: texto + atributo -->
        <categorias>
            <categoria>Novela</categoria>
            <categoria>Realismo magico</categoria>
        </categorias>
    </libro>

</biblioteca>
```

### Componentes de un documento XML

| Componente | Descripcion | Ejemplo |
|-----------|-------------|---------|
| Declaracion | Version y codificacion | `<?xml version="1.0" encoding="UTF-8"?>` |
| Elemento | Nodo del arbol | `<titulo>texto</titulo>` |
| Atributo | Informacion adicional | `id="1"` |
| Comentario | Notas para el lector | `<!-- comentario -->` |
| Entidad | Caracter especial | `&amp;` `&lt;` `&gt;` `&quot;` `&apos;` |
| CDATA | Texto sin parsear | `<![CDATA[ texto <html> sin parsear ]]>` |
| Espacio de nombres | Evita colisiones | `xmlns:lib="http://..."` |

### Entidades predefinidas

| Entidad | Caracter | Significado |
|---------|----------|-------------|
| `&amp;` | & | ampersand |
| `&lt;` | < | menor que |
| `&gt;` | > | mayor que |
| `&quot;` | " | comillas dobles |
| `&apos;` | ' | comilla simple |

## 3. DTD (Document Type Definition)

El DTD define la estructura legal de un documento XML: que elementos pueden aparecer, en que orden, cuantos, y que atributos tienen.

### DTD interno

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE empleados [
    <!ELEMENT empleados (empleado+)>
    <!ELEMENT empleado (nombre, puesto, salario, departamento)>
    <!ELEMENT nombre (#PCDATA)>
    <!ELEMENT puesto (#PCDATA)>
    <!ELEMENT salario (#PCDATA)>
    <!ELEMENT departamento (#PCDATA)>
    <!ATTLIST empleado id ID #REQUIRED>
    <!ATTLIST empleado activo CDATA "true">
]>
<empleados>
    <empleado id="E001">
        <nombre>Ana Lopez</nombre>
        <puesto>Desarrolladora Senior</puesto>
        <salario>45000</salario>
        <departamento>Informatica</departamento>
    </empleado>
</empleados>
```

### Declaraciones DTD

```xml
<!-- Elementos -->
<!ELEMENT nombre contenido>
<!-- contenido puede ser: -->
#PCDATA          <!-- solo texto -->
EMPTY            <!-- sin contenido -->
ANY              <!-- cualquier contenido -->
(elementos)      <!-- secuencia de elementos -->

<!-- Cardinalidad en elementos -->
elemento         <!-- exactamente uno -->
elemento+        <!-- uno o mas -->
elemento*        <!-- cero o mas -->
elemento?        <!-- cero o uno -->
(elemento1|elemento2) <!-- alternativa (O) -->

<!-- Atributos -->
<!ATTLIST elemento
    atributo1 tipo #REQUIRED     <!-- obligatorio -->
    atributo2 tipo #IMPLIED      <!-- opcional -->
    atributo3 tipo #FIXED "valor"  <!-- valor fijo -->
    atributo4 tipo "default"     <!-- valor por defecto -->
>

<!-- Tipos de atributo DTD -->
CDATA      <!-- texto -->
ID         <!-- identificador unico en el documento -->
IDREF      <!-- referencia a un ID -->
IDREFS     <!-- multiples referencias separadas por espacio -->
NMTOKEN    <!-- nombre token -->
(enumeracion) <!-- valores permitidos (ej: "rojo|verde|azul") -->
```

## 4. XML Schema (XSD)

XSD es una alternativa mas potente y expresiva que DTD para definir la estructura de documentos XML. A diferencia de DTD, XSD usa sintaxis XML y soporta tipos de datos.

### Esquema XSD completo

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"
           targetNamespace="http://vimap.es/biblioteca"
           xmlns="http://vimap.es/biblioteca"
           elementFormDefault="qualified">

    <!-- Elemento raiz -->
    <xs:element name="biblioteca">
        <xs:complexType>
            <xs:sequence>
                <xs:element name="libro" minOccurs="0" maxOccurs="unbounded">
                    <xs:complexType>
                        <xs:sequence>
                            <xs:element name="isbn" type="xs:string"/>
                            <xs:element name="titulo" type="xs:string"/>
                            <xs:element name="autor">
                                <xs:complexType>
                                    <xs:sequence>
                                        <xs:element name="nombre" type="xs:string"/>
                                        <xs:element name="apellidos" type="xs:string"/>
                                        <xs:element name="nacionalidad" type="xs:string" minOccurs="0"/>
                                    </xs:sequence>
                                    <xs:attribute name="id" type="xs:int" use="required"/>
                                </xs:complexType>
                            </xs:element>
                            <xs:element name="anio" type="xs:int"/>
                            <xs:element name="precio">
                                <xs:complexType>
                                    <xs:simpleContent>
                                        <xs:extension base="xs:decimal">
                                            <xs:attribute name="moneda" type="xs:string" use="required"/>
                                        </xs:extension>
                                    </xs:simpleContent>
                                </xs:complexType>
                            </xs:element>
                            <xs:element name="categorias">
                                <xs:complexType>
                                    <xs:sequence>
                                        <xs:element name="categoria" type="xs:string"
                                                    maxOccurs="unbounded"/>
                                    </xs:sequence>
                                </xs:complexType>
                            </xs:element>
                        </xs:sequence>
                        <xs:attribute name="id" type="xs:int" use="required"/>
                    </xs:complexType>
                </xs:element>
            </xs:sequence>
        </xs:complexType>
    </xs:element>
</xs:schema>
```

### Tipos de datos XSD

**Tipos primitivos:**
- `xs:string`, `xs:int`, `xs:decimal`, `xs:boolean`
- `xs:date`, `xs:time`, `xs:dateTime`
- `xs:integer`, `xs:positiveInteger`, `xs:negativeInteger`
- `xs:double`, `xs:float`

**Restricciones (facets):**

```xml
<xs:element name="edad">
    <xs:simpleType>
        <xs:restriction base="xs:int">
            <xs:minInclusive value="0"/>
            <xs:maxInclusive value="150"/>
        </xs:restriction>
    </xs:simpleType>
</xs:element>

<xs:element name="email">
    <xs:simpleType>
        <xs:restriction base="xs:string">
            <xs:pattern value="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}"/>
        </xs:restriction>
    </xs:simpleType>
</xs:element>
```

### Comparativa DTD vs XSD

| Caracteristica | DTD | XSD |
|---------------|-----|-----|
| Sintaxis | No XML | XML |
| Tipos de datos | Solo texto | Numeros, fechas, booleanos, etc. |
| Espacios de nombres | No soporta | Soporta completamente |
| Expresiones regulares | Limitado | `xs:pattern` completo |
| Herencia | No | `xs:extension`, `xs:restriction` |
| Reutilizacion | Entidades | `xs:group`, `xs:attributeGroup` |
| Documentacion | No | `xs:annotation`, `xs:documentation` |

## 5. XSLT (eXtensible Stylesheet Language Transformations)

XSLT transforma documentos XML a otros formatos (HTML, texto, XML).

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="/">
        <html>
            <head><title>Catalogo de libros</title></head>
            <body>
                <h1>Libros disponibles</h1>
                <table border="1">
                    <tr>
                        <th>Titulo</th>
                        <th>Autor</th>
                        <th>Anio</th>
                    </tr>
                    <xsl:for-each select="biblioteca/libro">
                        <tr>
                            <td><xsl:value-of select="titulo"/></td>
                            <td><xsl:value-of select="autor/nombre"/></td>
                            <td><xsl:value-of select="anio"/></td>
                        </tr>
                    </xsl:for-each>
                </table>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
```

## 6. Parsing de XML en Java

### DOM (Document Object Model)

Carga todo el documento en memoria como un arbol. Adecuado para documentos pequenos/medianos.

```java
import javax.xml.parsers.*;
import org.w3c.dom.*;

DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
DocumentBuilder builder = factory.newDocumentBuilder();
Document doc = builder.parse(new File("archivo.xml"));

NodeList libros = doc.getElementsByTagName("libro");
for (int i = 0; i < libros.getLength(); i++) {
    Element libro = (Element) libros.item(i);
    String titulo = libro.getElementsByTagName("titulo").item(0).getTextContent();
    System.out.println("Titulo: " + titulo);
}
```

### SAX (Simple API for XML)

Lectura secuencial basada en eventos. No carga el documento completo en memoria.

```java
import org.xml.sax.*;
import org.xml.sax.helpers.*;
import javax.xml.parsers.*;

SAXParserFactory factory = SAXParserFactory.newInstance();
SAXParser saxParser = factory.newSAXParser();

DefaultHandler handler = new DefaultHandler() {
    public void startElement(String uri, String localName, String qName, Attributes attributes) {
        if (qName.equals("titulo")) {
            System.out.print("Titulo: ");
        }
    }
    public void characters(char ch[], int start, int length) {
        System.out.print(new String(ch, start, length));
    }
};

saxParser.parse("archivo.xml", handler);
```

### StAX (Streaming API for XML)

API pull que permite al programador controlar cuando leer el siguiente elemento.

```java
import javax.xml.stream.*;

XMLInputFactory factory = XMLInputFactory.newInstance();
XMLStreamReader reader = factory.createXMLStreamReader(new FileInputStream("archivo.xml"));

while (reader.hasNext()) {
    int event = reader.next();
    if (event == XMLStreamConstants.START_ELEMENT) {
        System.out.println("Elemento: " + reader.getLocalName());
    }
    if (event == XMLStreamConstants.CHARACTERS) {
        System.out.println("Texto: " + reader.getText());
    }
}
reader.close();
```

## 7. Aplicaciones empresariales de XML

- **Configuracion**: `pom.xml` (Maven), `web.xml` (Servlets), `persistence.xml` (JPA), `struts.xml`, `spring.xml`
- **Intercambio de datos**: SOAP (XML sobre HTTP), RSS/Atom feeds, SVG (graficos vectoriales), DocBook
- **Serializacion**: JAXB (Java Architecture for XML Binding), XStream
- **Protocolos**: XML-RPC, SOAP, XMPP (mensajeria instantanea)
