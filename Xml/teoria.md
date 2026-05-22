# XML - eXtensible Markup Language

## Estructura

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

## DTD

```xml
<!ELEMENT biblioteca (libro+)>
<!ELEMENT libro (titulo, autor, anio)>
<!ATTLIST libro id CDATA #REQUIRED>
```

## XSD

```xml
<xs:element name="libro">
  <xs:complexType>
    <xs:sequence>
      <xs:element name="titulo" type="xs:string"/>
      <xs:element name="anio" type="xs:integer"/>
    </xs:sequence>
  </xs:complexType>
</xs:element>
```

## Namespaces

```xml
<root xmlns:lib="http://ejemplo.com/libros"
      xmlns:per="http://ejemplo.com/personas">
  <lib:titulo>Don Quijote</lib:titulo>
  <per:nombre>Cervantes</per:nombre>
</root>
```

## XSLT

```xml
<xsl:template match="/">
  <html><body>
    <xsl:for-each select="biblioteca/libro">
      <p><xsl:value-of select="titulo"/></p>
    </xsl:for-each>
  </body></html>
</xsl:template>
```

## Parsing (Java)

- **DOM**: arbol completo en memoria
- **SAX**: eventos secuenciales (streaming)
- **StAX**: pull, mas control

```java
Document doc = DocumentBuilderFactory
    .newInstance().newDocumentBuilder().parse("f.xml");
NodeList libros = doc.getElementsByTagName("libro");
```

## Aplicaciones

- Configuraciones: pom.xml, web.xml, persistence.xml
- Intercambio: SOAP, RSS, SVG
- Serializacion: JAXB, XStream
