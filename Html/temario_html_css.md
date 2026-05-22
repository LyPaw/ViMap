# HTML y CSS - Desarrollo Frontend

## HTML5

Estructura semantica de una pagina web.

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Mi Pagina</title>
</head>
<body>
    <header>
        <h1>Titulo</h1>
        <nav><a href="#">Inicio</a></nav>
    </header>
    <main>
        <section>
            <article>Contenido principal</article>
        </section>
        <aside>Barra lateral</aside>
    </main>
    <footer>Pie de pagina</footer>
</body>
</html>
```

Elementos semanticos: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`

## Formularios

```html
<form action="/enviar" method="POST">
    <label for="nombre">Nombre:</label>
    <input type="text" id="nombre" name="nombre" required>
    <input type="email" placeholder="Email">
    <select name="pais">
        <option value="es">Espana</option>
    </select>
    <button type="submit">Enviar</button>
</form>
```

## CSS3

Selectores, propiedades y valores para estilizar.

```css
/* Selector de clase */
.card {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```

## Flexbox

Layout unidimensional (fila o columna).

```css
.contenedor {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
}
```

## CSS Grid

Layout bidimensional (filas y columnas).

```css
.grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}
.item { grid-column: span 2; }
```

## Animaciones

```css
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
}

.elemento {
    animation: fadeIn 0.5s ease-out;
    transition: transform 0.3s;
}
.elemento:hover { transform: scale(1.05); }
```

## Variables CSS

```css
:root {
    --primary: #3b82f6;
    --text: #1a1a2e;
}
h1 { color: var(--primary); }
```

## Responsive Design

```css
/* Mobile first */
.contenido { padding: 16px; }
@media (min-width: 768px) {
    .contenido { padding: 32px; }
}
@media (min-width: 1024px) {
    .contenido { padding: 48px; max-width: 960px; margin: 0 auto; }
}
```
