# CSS - Hojas de Estilo en Cascada (1o y 2o DAM)

## Fundamentos de CSS

CSS, Cascading Style Sheets, es el lenguaje que define la presentacion visual de documentos HTML. Su funcion principal es separar el contenido, que se define en HTML, de la forma, que se define en CSS. Esto permite cambiar la apariencia completa de un sitio web modificando solo los archivos de estilo, sin tocar el HTML.

El nombre cascada proviene del algoritmo que resuelve conflictos entre reglas CSS cuando dos o mas reglas pretenden aplicar estilos diferentes al mismo elemento. El algoritmo considera tres criterios en orden. El primero es el origen del CSS: el estilo del navegador tiene la menor prioridad, seguido del estilo del usuario, y el estilo del autor tiene la mayor prioridad. El segundo criterio es la especificidad del selector: los selectores mas especificos tienen prioridad sobre los mas genericos. El tercer criterio es el orden de declaracion: a igual especificidad, la ultima regla declarada es la que se aplica.

La especificidad se calcula con cuatro valores. Los selectores de elemento y pseudoelementos suman uno al cuarto valor. Los selectores de clase, atributo y pseudoclases suman uno al tercer valor. Los selectores de ID suman uno al segundo valor. Los estilos en linea declarados en el atributo style del HTML suman uno al primer valor. La declaracion important anula cualquier otra regla, pero su uso debe evitarse porque rompe el flujo natural de la cascada y dificulta el mantenimiento.

## Selectores avanzados

Los selectores de atributo permiten seleccionar elementos segun la presencia o el valor de sus atributos. El selector con un atributo presente selecciona elementos que tengan ese atributo, independientemente de su valor. El selector con valor exacto selecciona elementos cuyo atributo tenga exactamente ese valor. El selector que empieza con selecciona elementos cuyo atributo comienza con un valor determinado, util para enlaces que empiezan con https. El selector que termina con selecciona elementos cuyo atributo termina con un valor, como archivos pdf. El selector que contiene selecciona elementos cuyo atributo contiene esa subcadena en cualquier posicion.

Las pseudoclases estructurales seleccionan elementos segun su posicion en el arbol del documento. first-child selecciona el primer hijo de su padre. last-child selecciona el ultimo hijo. nth-child selecciona hijos segun una formula como odd para impares, even para pares, o 3n+1 para cada tres empezando por el primero. empty selecciona elementos sin hijos. not selecciona elementos que no coinciden con un selector dado. Las pseudoclases de estado como hover, focus, active, checked, disabled y required permiten aplicar estilos segun el estado del elemento o la interaccion del usuario.

Los pseudoelementos permiten estilizar partes especificas de un elemento. before y after insertan contenido generado por CSS antes o despues del contenido del elemento, siendo muy utiles para decoraciones, iconos o indicadores visuales. first-line aplica estilos a la primera linea de un bloque de texto. first-letter aplica estilos a la primera letra. placeholder estiliza el texto de placeholder de los campos de formulario.

## Flexbox

Flexbox es un modelo de layout unidimensional que trabaja en una sola direccion, fila o columna. El contenedor flex se activa con display flex y sus propiedades controlan la direccion con flex-direction, el ajuste de linea con flex-wrap, la alineacion horizontal con justify-content, la alineacion vertical con align-items, la alineacion de multiplas lineas con align-content, y el espaciado entre items con gap.

Los items flexibles tienen propiedades individuales para controlar su comportamiento. flex-grow determina la capacidad del item para crecer si hay espacio disponible. flex-shrink determina su capacidad para encogerse si no hay espacio. flex-basis establece el tamano base antes de distribuir el espacio. La propiedad flex es un shorthand que combina grow, shrink y basis. align-self sobrescribe la alineacion del contenedor para un item especifico. order permite cambiar el orden visual sin alterar el orden en el HTML.

## CSS Grid

CSS Grid es un modelo de layout bidimensional que trabaja simultaneamente con filas y columnas. El contenedor grid se activa con display grid. Las propiedades grid-template-columns y grid-template-rows definen el tamano y numero de columnas y filas. La unidad fr representa una fraccion del espacio disponible. La funcion repeat permite repetir patrones de columnas. auto-fit y minmax permiten crear diseños responsive sin media queries.

Los items grid se colocan automaticamente en las celdas disponibles, pero pueden posicionarse explicitamente usando grid-column y grid-row con valores de linea de inicio y fin, o usando span para indicar cuantas celdas deben ocupar. grid-template-areas permite definir areas nombradas en el contenedor y asignar items a esas areas con grid-area, lo que facilita la creacion de layouts complejos como el patron de pagina completa con header, sidebar, contenido, aside y footer.

## Animaciones y Transiciones

Las transiciones permiten cambios suaves entre dos estados de un elemento. Se definen con la propiedad transition que especifica la propiedad a animar, la duracion, la funcion de tiempo como ease o linear, y el retardo. Las transiciones se activan automaticamente cuando cambia el valor de la propiedad, por ejemplo al hacer hover sobre un boton.

Las animaciones con keyframes permiten secuencias de cambios mas complejas. Se definen con la regla keyframes que establece puntos de control con porcentajes o las palabras clave from y to. La propiedad animation aplica la animacion con nombre, duracion, funcion de tiempo, iteraciones, direccion y estado final. Las animaciones pueden ejecutarse una vez o en bucle infinito.

## Responsive Design

El diseno responsive adapta la apariencia de una pagina al tamano de la pantalla del dispositivo. Las media queries permiten aplicar estilos condicionales segun caracteristicas del dispositivo como el ancho de pantalla, la orientacion o las preferencias del usuario. El enfoque mobile first consiste en escribir primero los estilos base para pantallas pequenas y luego anadir estilos para pantallas mayores mediante media queries con min-width.

Las container queries son una evolucion de las media queries que permiten aplicar estilos basados en el tamano del contenedor padre en lugar del tamano de la ventana. Esto permite crear componentes verdaderamente reutilizables que se adaptan al espacio disponible independientemente del contexto.

## Variables CSS

Las variables CSS, tambien llamadas propiedades personalizadas, permiten definir valores reutilizables en todo el documento. Se declaran con doble guion dentro del selector root para que esten disponibles globalmente, y se usan con la funcion var. Las variables facilitan la creacion de temas, la consistencia visual y el mantenimiento del codigo, ya que un cambio en la definicion de la variable se refleja automaticamente en todos los lugares donde se usa.
