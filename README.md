# Lyra Labander Solutions — Landing épica v5

Esta versión incluye las últimas mejoras que pediste:

- Constelación 3D basada en **coordenadas aproximadas reales de Lyra** (Vega, Sheliak, Sulafat, Delta2, Zeta1), proyectadas y centradas en un grupo 3D que rota suavemente.
- Interacción mejorada con el elemento 3D:
  - Parallax sensible al puntero.
  - Aceleración y pulso de brillo cuando se mantiene clic.
  - Líneas y halo de la constelación que reaccionan a la interacción.
- **Texto del hero más legible** sobre la constelación:
  - Contenedor “glass card” oscuro detrás del título y el lead.
  - Colores ligeramente más cálidos y sombras que separan el texto del fondo.
- Botón flotante de **WhatsApp** apuntando a `+52 786 105 2332`:
  - Link: `https://wa.me/527861052332` con mensaje prellenado.
- Nuevo “personaje” guía:
  - Un orbe sutil con las siglas `LY` que flota en la esquina inferior izquierda.
  - Tooltip con mensajes distintos según la parte de la página.
  - Al hacer clic te lleva a la sección más relevante (CTA/Contacto o secciones clave en “Nosotros”).
- El personaje y el botón de WhatsApp están presentes en **index** y en **nosotros**.

## Rutas esperadas de logos

Coloca tus archivos de logo en:

```text
assets/img/LogoPNG.png   (logo con texto)
assets/img/LogoJPG.jpg   (isotipo sin texto / sin fondo)
```

## Archivos clave

- `index.html` — Landing principal con hero, servicios, sectores, proceso, casos, CTA, contacto.
- `nosotros.html` — Misión, visión, valores y quiénes somos, también con fondo galáctico y constelación Lyra.
- `assets/css/styles.css` — Estilos, incluyendo hero mejorado, WhatsApp FAB y orbe guía.
- `assets/js/main.js` — Lógica del starfield, constelación Lyra 3D, modal de cotización, orbe guía, etc.

Puedes ajustar el correo del cotizador en `assets/js/main.js`:

```js
const destino = 'contacto@lyralabander.com';
```

Después de copiar tus logos, abre `index.html` y `nosotros.html` en tu navegador para revisar el resultado final.
