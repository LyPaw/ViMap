# CSS - Hojas de Estilo en Cascada

## Selectores

```css
*              /* universal */
.clase         /* clase */
#id            /* id */
elemento       /* tipo */
[atributo]     /* atributo */
padre > hijo   /* hijo directo */
hermano ~ hermano /* hermano general */
```

## Pseudo-clases

```css
:hover, :focus, :active
:first-child, :last-child, :nth-child(n)
:not(selector)
```

## Flexbox

Layout unidimensional.

```css
.contenedor {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
}
.hijo { flex: 1; }
```

## Grid

Layout bidimensional.

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
    from { opacity: 0; }
    to   { opacity: 1; }
}
.elemento {
    animation: fadeIn 0.5s ease;
    transition: transform 0.3s;
}
.elemento:hover { transform: scale(1.05); }
```

## Variables

```css
:root { --primary: #3b82f6; }
h1 { color: var(--primary); }
```

## Responsive

```css
@media (min-width: 768px) { ... }
@media (min-width: 1024px) { ... }
```
