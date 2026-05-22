# CSS - Hojas de Estilo en Cascada (1º y 2º DAM)

## 1. Fundamentos de CSS

CSS (Cascading Style Sheets) es el lenguaje que define la presentacion visual de documentos HTML. Separa el contenido (HTML) de la forma (CSS).

### Como se aplica CSS

```html
<!-- CSS externo (recomendado) -->
<link rel="stylesheet" href="estilos.css">

<!-- CSS interno en el head -->
<style>
  body { font-family: sans-serif; }
</style>

<!-- CSS en linea (evitar) -->
<p style="color: red;">Texto rojo</p>
```

### La cascada

El nombre "cascada" viene de como se resuelven los conflictos entre reglas:

1. **Origen**: CSS del navegador < CSS del usuario < CSS del autor
2. **Especificidad**: cuanto mas especifico es el selector, mayor prioridad
3. **Orden**: a igual especificidad, gana la ultima regla declarada

### Calculo de especificidad

```
Selectores                      Especificidad (a,b,c,d)
*                                  0,0,0,0
elemento                           0,0,0,1
.clase, [atributo], :pseudo        0,0,1,0
#id                                0,1,0,0
style="..."                        1,0,0,0
!important                         anula cualquier regla
```

```css
/* Especificidad: 0,0,0,1 */
p { color: blue; }

/* Especificidad: 0,0,1,0 */
.texto { color: green; }

/* Especificidad: 0,0,1,1 */
p.texto { color: red; }

/* Especificidad: 0,1,0,0 */
#principal { color: yellow; }

/* Gana !important (evitar su uso) */
p { color: purple !important; }
```

## 2. Selectores avanzados

### Selectores de atributo

```css
/* Atributo presente */
[disabled] { opacity: 0.5; }

/* Atributo con valor exacto */
[type="submit"] { background: blue; }

/* Atributo que empieza con */
a[href^="https"] { color: green; }

/* Atributo que termina con */
a[href$=".pdf"]::after { content: " [PDF]"; }

/* Atributo que contiene */
a[href*="google"] { color: red; }

/* Atributo con palabra separada por espacios */
[lang~="es"] { font-style: italic; }
```

### Pseudoclases estructurales

```css
/* Posicion entre hermanos */
li:first-child { font-weight: bold; }
li:last-child { border: none; }
li:nth-child(odd) { background: #f0f0f0; }
li:nth-child(3n+1) { color: blue; }  /* cada 3 empezando por 1 */

/* Relacion con el contenido */
p:empty { display: none; }

/* Negacion */
input:not([type="submit"]) { border: 1px solid gray; }

/* Estado */
:hover, :focus, :active, :checked, :disabled, :required
```

### Pseudoelementos

```css
/* Antes y despues del contenido del elemento */
.card::before {
    content: "";
    display: block;
    width: 40px;
    height: 3px;
    background: #3b82f6;
    margin-bottom: 12px;
}

.card::after {
    content: " \2192";  /* flecha derecha */
    color: #3b82f6;
}

/* Primera linea y primera letra */
p::first-line { font-weight: bold; }
p::first-letter { font-size: 2em; float: left; }

/* Placeholder de inputs */
input::placeholder { color: gray; font-style: italic; }
```

## 3. Flexbox

Flexbox es un modelo de layout unidimensional (una sola direccion: fila o columna).

### Propiedades del contenedor

```css
.contenedor-flex {
    display: flex;           /* activa flexbox */
    flex-direction: row;     /* row | column | row-reverse | column-reverse */
    flex-wrap: wrap;         /* nowrap | wrap | wrap-reverse */
    justify-content: center; /* flex-start | flex-end | center | space-between | space-around | space-evenly */
    align-items: center;     /* stretch | flex-start | flex-end | center | baseline */
    align-content: center;   /* distribucion en multi-linea */
    gap: 16px;               /* espacio entre items (row-gap column-gap) */
}
```

### Propiedades de los items

```css
.item-flex {
    flex-grow: 1;      /* capacidad de crecer (0 = no crece) */
    flex-shrink: 1;    /* capacidad de encoger (0 = no encoge) */
    flex-basis: auto;  /* tamano base antes de distribuir espacio */
    flex: 1 1 200px;   /* shorthand: grow shrink basis */
    align-self: center; /* sobrescribe align-items del contenedor */
    order: 0;          /* orden de visualizacion (-1 antes, 1 despues) */
}
```

### Patrones comunes con Flexbox

```css
/* Centrar perfectamente */
.centrado {
    display: flex;
    justify-content: center;
    align-items: center;
}

/* Layout santamaria (header, 3 columnas, footer) */
.pagina {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}
.contenido {
    display: flex;
    flex: 1;
}
.sidebar { flex: 0 0 250px; }
.main { flex: 1; }
.aside { flex: 0 0 200px; }

/* Grilla responsive sin media queries */
.grilla-flex {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
}
.grilla-flex > * {
    flex: 1 1 250px;  /* minimo 250px, crece si hay espacio */
}
```

## 4. CSS Grid

Grid es un modelo de layout bidimensional (filas y columnas simultaneamente).

### Propiedades del contenedor

```css
.contenedor-grid {
    display: grid;
    grid-template-columns: 200px 1fr 200px;   /* 3 columnas */
    grid-template-rows: auto 1fr auto;         /* 3 filas */
    gap: 16px;                                 /* espaciado */
    grid-template-areas:                       /* areas nombradas */
        "header  header  header"
        "sidebar content aside"
        "footer  footer  footer";
}

/* Unidades especiales de Grid */
grid-template-columns: 1fr 2fr 1fr;    /* fracciones */
grid-template-columns: repeat(3, 1fr); /* 3 columnas iguales */
grid-template-columns: auto-fit minmax(250px, 1fr); /* responsive automatico */
grid-template-columns: 100px auto 100px;
```

### Propiedades de los items

```css
.item-grid {
    grid-column: 1 / 3;         /* de columna 1 a 3 */
    grid-column: span 2;        /* ocupa 2 columnas */
    grid-row: 1 / 3;
    grid-area: content;          /* asigna a un area nombrada */
    justify-self: center;        /* alineacion horizontal en la celda */
    align-self: center;          /* alineacion vertical en la celda */
}
```

### Grid responsive sin media queries

```css
.grid-auto {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
}
/* auto-fit crea tantas columnas como quepan, minimo 280px cada una */
```

## 5. Animaciones y Transiciones

### Transiciones

```css
.boton {
    background: #3b82f6;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    /* transition: property duration timing-function delay */
}

.boton:hover {
    background: #6366f1;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}
```

### Animaciones @keyframes

```css
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50%      { transform: scale(1.1); }
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
}

@keyframes slideIn {
    0%   { transform: translateX(-100%); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
}

.elemento {
    animation: fadeIn 0.6s ease-out forwards;
    /* animation: name duration timing-function delay iteration-count direction fill-mode */
}
```

## 6. Responsive Design

### Media Queries

```css
/* Mobile first: estilos base para movil */
.contenedor {
    padding: 16px;
}

/* Tablet */
@media (min-width: 768px) {
    .contenedor {
        padding: 32px;
        max-width: 720px;
        margin: 0 auto;
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .contenedor {
        padding: 48px;
        max-width: 960px;
    }
}

/* Pantalla grande */
@media (min-width: 1440px) {
    .contenedor {
        max-width: 1200px;
    }
}

/* Preferencias del sistema */
@media (prefers-color-scheme: dark) {
    body { background: #0f172a; color: #e2e8f0; }
}

@media (prefers-reduced-motion: reduce) {
    * { animation-duration: 0.01ms !important; }
}
```

### Container Queries

```css
.tarjeta-contenedor {
    container-type: inline-size;
    container-name: tarjeta;
}

@container tarjeta (min-width: 400px) {
    .tarjeta-contenido {
        display: flex;
        gap: 16px;
        align-items: center;
    }
}
```

## 7. Variables CSS

```css
:root {
    --color-primario: #3b82f6;
    --color-secundario: #6366f1;
    --color-fondo: #0f172a;
    --color-texto: #e2e8f0;
    --espaciado-base: 16px;
    --radio-borde: 8px;
    --fuente-principal: 'Segoe UI', system-ui, sans-serif;
    --sombra: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.componente {
    background: var(--color-fondo);
    color: var(--color-texto);
    padding: var(--espaciado-base);
    border-radius: var(--radio-borde);
    box-shadow: var(--sombra);
}
```
