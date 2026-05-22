# HTML y CSS - Frontend

## HTML5 Semantico

```html
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Pagina</title></head>
<body>
  <header><h1>Titulo</h1><nav><a href="#">Inicio</a></nav></header>
  <main><section><article>Contenido</article></section>
        <aside>Lateral</aside></main>
  <footer>Pie</footer>
</body>
</html>
```

Elementos: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`

## Formularios

```html
<form action="/enviar" method="POST">
  <label for="nombre">Nombre:</label>
  <input type="text" id="nombre" required>
  <input type="email" placeholder="Email">
  <select name="pais"><option value="es">Espana</option></select>
  <button type="submit">Enviar</button>
</form>
```

## Flexbox

```css
.contenedor {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
```

## Grid

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
```

## Animaciones

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.elemento {
  animation: fadeIn 0.5s ease;
  transition: transform 0.3s;
}
.elemento:hover { transform: scale(1.05); }
```

## Variables CSS

```css
:root { --primary: #3b82f6; }
h1 { color: var(--primary); }
```

## Responsive

```css
@media (min-width: 768px) { ... }
@media (min-width: 1024px) { ... }
```
