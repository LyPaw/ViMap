# XML - Lenguajes de Marcas (1o DAM)

## Introduccion a XML

XML, eXtensible Markup Language, es un lenguaje de marcado disenado para almacenar y transportar datos de forma estructurada y legible tanto por humanos como por maquinas. A diferencia de HTML, que tiene un conjunto fijo de etiquetas predefinidas, XML permite al usuario definir sus propias etiquetas, lo que lo hace extremadamente flexible para representar cualquier tipo de informacion estructurada. XML es independiente de plataforma, se basa en texto plano, y organiza la informacion en una estructura de arbol donde los elementos se anidan formando una jerarquia.

Un documento XML bien formado debe cumplir varias reglas estrictas. Debe tener un unico elemento raiz que contenga a todos los demas. Todas las etiquetas deben cerrarse correctamente, ya sea con etiqueta de cierre o con la sintaxis de elemento vacio. Los atributos deben estar entre comillas, dobles o simples. Los nombres de las etiquetas distinguen entre mayusculas y minusculas, por lo que Elemento y elemento son etiquetas diferentes. Los nombres deben empezar con una letra o guion bajo, nunca con un numero.

## Componentes de un documento XML

La declaracion XML al inicio del documento especifica la version y la codificacion de caracteres. Los elementos son los nodos del arbol y pueden contener texto, otros elementos o ambos. Los atributos proporcionan informacion adicional sobre un elemento y se escriben dentro de la etiqueta de apertura. Los comentarios permiten anadir notas para el lector que no se procesan. Las entidades representan caracteres especiales que de otra manera causarian problemas de parseo, como el ampersand, los signos de menor y mayor, y las comillas. Las secciones CDATA envuelven texto que no debe ser parseado, permitiendo incluir caracteres especiales sin escaparlos. Los espacios de nombres, declarados con xmlns, evitan conflictos de nombres cuando se combinan documentos de diferentes vocabularios.

## DTD

Document Type Definition es un lenguaje de esquema que define la estructura legal de un documento XML: que elementos pueden aparecer, en que orden, cuantos de cada uno, y que atributos tienen. El DTD puede declararse dentro del propio documento XML, como DTD interno, o en un archivo externo referenciado desde el documento.

Las declaraciones de elementos en DTD especifican el nombre y el contenido permitido. El contenido puede ser texto parseado con PCDATA, vacio con EMPTY, cualquier cosa con ANY, o una secuencia de elementos hijos. La cardinalidad se indica con simbolos: ningun simbolo significa exactamente uno, el signo mas significa uno o mas, el asterisco significa cero o mas, y el interrogante significa cero o uno. El operador tuberia permite alternativas entre elementos.

Las declaraciones de atributos en DTD especifican para cada elemento que atributos tiene, su tipo y si son obligatorios u opcionales. Los tipos de atributo incluyen CDATA para texto, ID para identificadores unicos en el documento, IDREF para referencias a otros identificadores, IDREFS para multiples referencias separadas por espacios, NMTOKEN para nombres token, y listas de valores permitidos entre parentesis. Los modificadores de uso son REQUIRED para atributos obligatorios, IMPLIED para opcionales, FIXED para valores constantes, y un valor por defecto opcional.

## XSD

XML Schema Definition es una alternativa mas potente y expresiva que DTD. A diferencia de DTD, XSD utiliza sintaxis XML, lo que permite procesarlo con las mismas herramientas que cualquier otro documento XML. XSD soporta tipos de datos nativos como cadenas, numeros enteros, decimales, booleanos, fechas y horas, ademas de permitir definir tipos complejos con secuencias de elementos, restricciones mediante patrones expresiones regulares y rangos de valores, y herencia de tipos por extension o restriccion.

Un esquema XSD define elementos simples con tipo de dato directo y elementos complejos que contienen otros elementos o atributos. Los elementos complejos pueden tener secuencias ordenadas de hijos, elecciones entre alternativas, o conjuntos sin orden. La cardinalidad se controla con minOccurs y maxOccurs. Los atributos se definen con la declaracion attribute dentro del tipo complejo. Las restricciones se especifican con facets como minInclusive y maxInclusive para rangos, pattern para expresiones regulares, enumeration para listas de valores permitidos, y length, minLength y maxLength para cadenas.

La principal ventaja de XSD sobre DTD es el soporte de espacios de nombres. XSD permite definir a que espacio de nombres pertenecen los elementos y atributos del documento, lo que facilita la combinacion de multiples esquemas. targetNamespace especifica el espacio de nombres del vocabulario que se esta definiendo, y elementFormDefault controla si los elementos locales deben estar cualificados con el espacio de nombres.

## XSLT

XSLT, eXtensible Stylesheet Language Transformations, es un lenguaje para transformar documentos XML en otros formatos como HTML, texto plano u otros XML. Una transformacion XSLT consta de un conjunto de reglas llamadas plantillas, cada una con un patron de coincidencia y un contenido de salida. El procesador XSLT recorre el arbol del documento XML de entrada y cuando encuentra un nodo que coincide con el patron de una plantilla, ejecuta el contenido de esa plantilla para generar la salida.

## Parsing de XML en Java

Existen tres formas principales de procesar XML en Java. DOM, Document Object Model, carga todo el documento en memoria como un arbol de nodos, permitiendo el acceso aleatorio a cualquier parte del documento. Es adecuado para documentos pequenos o medianos donde se necesita modificar la estructura. SAX, Simple API for XML, realiza una lectura secuencial basada en eventos, notificando al programa cuando encuentra una etiqueta de apertura, texto o etiqueta de cierre, sin cargar el documento completo en memoria. Es ideal para documentos grandes o cuando solo se necesita leer una vez. StAX, Streaming API for XML, es un enfoque pull donde el programador controla cuando leer el siguiente elemento, combinando la eficiencia de SAX con la facilidad de uso de DOM.

## Aplicaciones empresariales de XML

XML se utiliza ampliamente en el desarrollo de software empresarial. Los archivos de configuracion de herramientas como Maven con pom.xml, aplicaciones web con web.xml, y JPA con persistence.xml utilizan XML para definir parametros, dependencias y comportamientos. Los protocolos de intercambio de datos como SOAP utilizan XML como formato de mensajes sobre HTTP. Los formatos de sindicacion RSS y Atom usan XML para distribuir contenido. Los graficos vectoriales SVG se definen con XML. Las bases de datos XML como eXist-db almacenan documentos XML nativos. La serializacion de objetos Java a XML se realiza con tecnologias como JAXB o XStream.
