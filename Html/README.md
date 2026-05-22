# HTML - Desarrollo Frontend (1º y 2º DAM)

## 1. Arquitectura Web Moderna

Una aplicacion web moderna sigue una arquitectura cliente-servidor:

```
Cliente (navegador)             Servidor (backend)
┌─────────────────┐            ┌──────────────────┐
│ HTML (estructura)│  HTTP Req  │ API REST/GraphQL │
│ CSS (presentacion)│ ────────→ │ Logica de negocio │
│ JS (comportamiento)│ ←──────── │ Base de datos     │
└─────────────────┘  HTTP Res  └──────────────────┘
```

El navegador renderiza el HTML, aplica los estilos CSS y ejecuta JavaScript para la interactividad.

## 2. HTML5 Semantico

HTML5 introdujo etiquetas semanticas que describen el significado del contenido.

### Estructura tipica de una pagina

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi sitio web</title>
    <meta name="description" content="Descripcion para SEO">
    <link rel="stylesheet" href="estilos.css">
</head>
<body>
    <header>
        <nav>
            <ul>
                <li><a href="/">Inicio</a></li>
                <li><a href="/about">Sobre nosotros</a></li>
                <li><a href="/contact">Contacto</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <article>
            <h1>Titulo del articulo</h1>
            <p>Contenido principal del articulo.</p>
            <section>
                <h2>Seccion relacionada</h2>
                <p>Contenido de la seccion.</p>
            </section>
        </article>

        <aside>
            <h2>Barra lateral</h2>
            <p>Contenido complementario.</p>
        </aside>
    </main>

    <footer>
        <p>&copy; 2025 Todos los derechos reservados.</p>
    </footer>
</body>
</html>
```

### Elementos semanticos principales

| Etiqueta | Proposito |
|----------|-----------|
| `<header>` | Encabezado de pagina o seccion |
| `<nav>` | Navegacion principal |
| `<main>` | Contenido principal (unico por pagina) |
| `<article>` | Contenido autocontenido (post, noticia) |
| `<section>` | Agrupacion tematica de contenido |
| `<aside>` | Contenido complementario (sidebar) |
| `<footer>` | Pie de pagina o seccion |
| `<figure>` | Contenido ilustrativo (imagen, diagrama) |
| `<figcaption>` | Leyenda para `<figure>` |
| `<time>` | Fechas y horas |
| `<mark>` | Texto resaltado |

## 3. Formularios HTML

Los formularios permiten recoger datos del usuario y enviarlos al servidor.

```html
<form action="/api/usuarios" method="POST" novalidate>
    <fieldset>
        <legend>Datos personales</legend>

        <label for="nombre">Nombre completo:</label>
        <input type="text" id="nombre" name="nombre"
               required minlength="3" maxlength="100"
               placeholder="Ej: Ana Lopez">

        <label for="email">Correo electronico:</label>
        <input type="email" id="email" name="email"
               required placeholder="ana@ejemplo.com">

        <label for="edad">Edad:</label>
        <input type="number" id="edad" name="edad"
               min="0" max="150" step="1">

        <label for="pais">Pais:</label>
        <select id="pais" name="pais">
            <option value="">Selecciona un pais</option>
            <option value="es">Espana</option>
            <option value="mx">Mexico</option>
            <option value="ar">Argentina</option>
        </select>

        <label for="bio">Biografia:</label>
        <textarea id="bio" name="bio" rows="4"
                  maxlength="500"></textarea>

        <fieldset>
            <legend>Intereses</legend>
            <label><input type="checkbox" name="intereses" value="deporte"> Deporte</label>
            <label><input type="checkbox" name="intereses" value="musica"> Musica</label>
            <label><input type="checkbox" name="intereses" value="lectura"> Lectura</label>
        </fieldset>

        <label><input type="radio" name="genero" value="F" required> Femenino</label>
        <label><input type="radio" name="genero" value="M"> Masculino</label>
    </fieldset>

    <div class="botones">
        <button type="submit">Enviar</button>
        <button type="reset">Limpiar</button>
    </div>
</form>
```

### Validacion nativa HTML5

Atributos de validacion del lado del cliente sin JavaScript:

- `required`: campo obligatorio
- `minlength` / `maxlength`: longitud de texto
- `min` / `max`: valores numericos minimo y maximo
- `pattern`: expresion regular para validar el formato
- `type="email"`, `type="url"`, `type="number"`: tipos especificos con validacion integrada

```html
<input type="text" pattern="[A-Za-z\s]+" title="Solo letras y espacios">
```

## 4. SPA (Single Page Application)

Una SPA carga una unica pagina HTML y actualiza dinamicamente el contenido mediante JavaScript, sin recargar la pagina completa.

### Ciclo de vida de una SPA

```
Carga inicial del HTML
  ↓
Fetch de datos (API REST)
  ↓
Renderizado (creacion de elementos DOM)
  ↓
Interaccion del usuario
  ↓
Actualizacion del estado
  ↓
Re-renderizado de componentes afectados
```

### Ejemplo minimo de SPA

```html
<div id="app">
    <nav>
        <a href="#" data-page="inicio">Inicio</a>
        <a href="#" data-page="acerca">Acerca</a>
        <a href="#" data-page="contacto">Contacto</a>
    </nav>
    <main id="contenido"></main>
</div>

<script>
    const rutas = {
        inicio: '<h1>Bienvenido</h1><p>Pagina principal</p>',
        acerca: '<h1>Sobre nosotros</h1><p>Informacion del sitio</p>',
        contacto: '<h1>Contacto</h1><form>...</form>'
    };

    document.querySelectorAll('[data-page]').forEach(enlace => {
        enlace.addEventListener('click', (e) => {
            e.preventDefault();
            const pagina = e.target.dataset.page;
            document.getElementById('contenido').innerHTML = rutas[pagina];
            history.pushState({ pagina }, '', '/' + pagina);
        });
    });

    window.addEventListener('popstate', (e) => {
        if (e.state) {
            document.getElementById('contenido').innerHTML = rutas[e.state.pagina];
        }
    });
</script>
```

## 5. Talleres auto-evaluables

En la carpeta `Html/` encontraras talleres interactivos donde puedes escribir codigo directamente en un `textarea` y validar tu solucion con aserciones locales. Sin servidor, sin dependencias externas. Feedback inmediato en verde (acierto) o rojo (error).

Los talleres evaluan:
- Manipulacion del DOM con vanilla JavaScript
- Validacion de formularios y estructuras de datos
- Logica de programacion funcional
- Eventos y manejo del DOM
