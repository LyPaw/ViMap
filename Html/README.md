# HTML - Desarrollo Frontend (1o y 2o DAM)

## Arquitectura Web Moderna

Una aplicacion web moderna sigue una arquitectura cliente-servidor donde el navegador, actuando como cliente, realiza peticiones HTTP a un servidor que procesa la logica de negocio y accede a la base de datos. El navegador recibe respuestas que generalmente contienen HTML, CSS y JavaScript, y se encarga de renderizar la interfaz de usuario. Esta arquitectura permite separar claramente las responsabilidades: el frontend se ocupa de la presentacion y la interaccion con el usuario, mientras que el backend gestiona los datos y las reglas de negocio.

## HTML5 Semantico

HTML5 introdujo un conjunto de etiquetas semanticas que describen el significado del contenido, no solo su apariencia. La etiqueta header define el encabezado de una pagina o seccion. nav contiene los enlaces de navegacion principal. main envuelve el contenido principal y debe ser unico por pagina. article representa contenido autocontenido como un post o una noticia. section agrupa contenido tematicamente relacionado. aside contiene contenido complementario como barras laterales. footer define el pie de pagina. El uso correcto de estas etiquetas mejora la accesibilidad para lectores de pantalla, el posicionamiento en buscadores y la mantenibilidad del codigo.

## Formularios HTML

Los formularios permiten recoger datos del usuario y enviarlos al servidor. El elemento form envuelve el conjunto de campos y especifica la URL de destino mediante action y el metodo HTTP mediante method. Los campos de entrada se definen con input, cuyo atributo type determina el tipo de dato: text para texto, email para correo electronico, number para valores numericos, password para contrasenas, checkbox para seleccion multiple, radio para seleccion unica, submit para enviar el formulario, y reset para limpiar los campos. El elemento textarea permite entrada de texto multilinea. select combinado con option crea listas desplegables. fieldset agrupa campos relacionados y legend proporciona una leyenda para el grupo.

HTML5 incluye validacion nativa del lado del cliente sin necesidad de JavaScript. El atributo required hace que un campo sea obligatorio. minlength y maxlength limitan la longitud del texto. min y max establecen valores numericos minimo y maximo. pattern permite una expresion regular para validar el formato, como por ejemplo solo letras y espacios. Los tipos email y url tienen validacion integrada de su formato. Cuando el usuario intenta enviar un formulario con campos invalidos, el navegador muestra mensajes de error automaticos y evita el envio.

## SPA

Single Page Application es un modelo de aplicacion web donde se carga una unica pagina HTML inicial y todo el contenido posterior se genera y actualiza dinamicamente mediante JavaScript, sin recargar la pagina completa. Esto proporciona una experiencia de usuario mas fluida similar a una aplicacion de escritorio. El ciclo de vida de una SPA comienza con la carga inicial del HTML y los recursos CSS y JavaScript. Luego se realizan peticiones asincronas a una API REST para obtener datos. Con esos datos se renderizan los componentes del interfaz creando y manipulando elementos del DOM. Cuando el usuario interactua, se actualiza el estado de la aplicacion y se re-renderizan solo los componentes afectados. La gestion del historial del navegador mediante history.pushState permite que los botones de navegacion funcionen correctamente.

## Talleres auto-evaluables

En la carpeta Html se encuentran talleres interactivos donde el alumno puede escribir codigo JavaScript directamente en un textarea y validar su solucion mediante aserciones locales que se ejecutan en el propio navegador, sin necesidad de servidor ni dependencias externas. El sistema proporciona feedback inmediato: si todas las aserciones se cumplen, el taller muestra un mensaje en verde indicando que la solucion es correcta. Si alguna asercion falla, se muestra un mensaje en rojo con el detalle del error. Este enfoque permite el aprendizaje autodirigido y la practica intensiva de conceptos de programacion.

Los talleres disponibles cubren la manipulacion del DOM con vanilla JavaScript, incluyendo la creacion y manipulacion de elementos, la validacion de formularios verificando campos obligatorios, formatos de email y rangos de edad, y un taller completo de gestion de tareas TODO que evalua la implementacion de funciones para agregar, cambiar estado, eliminar, filtrar y contar tareas, todo ello usando programacion funcional con arrays inmutables.
