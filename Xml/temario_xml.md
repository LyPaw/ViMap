# XML - eXtensible Markup Language

## Estructura Basica

XML es un lenguaje de marcado para almacenar y transportar datos.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<biblioteca>
    <libro id="1">
        <titulo>Cien Anos de Soledad</titulo>
        <autor>Gabriel Garcia Marquez</autor>
        <anio>1967</anio>
    </libro>
</biblioteca>
```

## DTD (Document Type Definition)

Define la estructura y elementos validos.

```xml
<!ELEMENT biblioteca (libro+)>
<!ELEMENT libro (titulo, autor, anio)>
<!ATTLIST libro id CDATA #REQUIRED>
<!ELEMENT titulo (#PCDATA)>
<!ELEMENT autor (#PCDATA)>
<!ELEMENT anio (#PCDATA)>
```

## XSD (XML Schema Definition)

Esquema mas expresivo y tipado que DTD.

```xml
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
    <xs:element name="libro">
        <xs:complexType>
            <xs:sequence>
                <xs:element name="titulo" type="xs:string"/>
                <xs:element name="autor" type="xs:string"/>
                <xs:element name="anio" type="xs:integer"/>
            </xs:sequence>
            <xs:attribute name="id" type="xs:integer" use="required"/>
        </xs:complexType>
    </xs:element>
</xs:schema>
```

## Namespaces

Evitan conflictos de nombres entre vocabularios.

```xml
<root xmlns:lib="http://ejemplo.com/libros"
      xmlns:per="http://ejemplo.com/personas">
    <lib:titulo>Don Quijote</lib:titulo>
    <per:nombre>Cervantes</per:nombre>
</root>
```

## XSLT

Transformacion de XML a otros formatos (HTML, texto, etc.).

```xml
<xsl:template match="/">
    <html><body>
        <xsl:for-each select="biblioteca/libro">
            <p><xsl:value-of select="titulo"/></p>
        </xsl:for-each>
    </body></html>
</xsl:template>
```

## Parsing

Formas de procesar XML en Java:

- **DOM**: carga todo el arbol en memoria (Arbol)
- **SAX**: lectura secuencial basada en eventos (Streaming)
- **StAX**: lectura pull, mas control que SAX

```java
DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
Document doc = factory.newDocumentBuilder().parse("archivo.xml");
NodeList libros = doc.getElementsByTagName("libro");
```

## Aplicaciones

- Configuraciones (pom.xml, web.xml, persistence.xml)
- Formatos de intercambio (SOAP, RSS, SVG)
- Documentos estructurados (DocBook, TEI)
- Serializacion de objetos (XStream, JAXB)
