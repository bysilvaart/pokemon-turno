# Pokémon Turno

**[Abrir Pokémon Turno](https://bysilvaart.github.io/pokemon-turno)**

Una app mobile first para recordar las acciones usadas en Pokémon TCG.

- Estadio, partidario y energía del turno.
- Habilidades del Pokémon activo y de cinco Pokémon de banca.
- Nuevo turno para limpiar las nueve marcas.
- Modos claro y oscuro, siguiendo el sistema por defecto.
- Guardado local en el navegador y caché sin conexión después de la primera carga.

## Publicación

Sitio estático con GitHub Pages: publicar la rama `main`, carpeta raíz `/`.
Los archivos usan rutas relativas para funcionar dentro de `/pokemon-turno/`.
No requiere instalación, compilación ni claves de servicios externos.

## Uso

Toca para marcar o desmarcar una acción. Las marcas se guardan solo en el dispositivo y navegador utilizados; no se sincronizan entre equipos.

## Actualizaciones

Edita los archivos estáticos y confirma los cambios en `main`.
Al modificar los recursos, aumenta la versión de caché en `sw.js`.
