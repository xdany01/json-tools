# Herramienta de manipulación de archivos JSON

Esta herramienta proporciona funciones para ordenar un archivo JSON y comparar dos archivos JSON. Es útil para tareas de manipulación de datos en formato JSON.

## Uso

1. **Ordenar un archivo JSON:**
   
   - Ejecutar el programa y seleccionar la opción 1.
   - Ingresar la ruta del archivo JSON desordenado cuando se solicite.
   - Especificar la clave para ordenar el JSON.
   - El programa generará un nuevo archivo JSON ordenado con el nombre modificado según la cantidad de objetos y guardará el resultado en la misma ubicación del archivo original.

2. **Comparar dos archivos JSON:**
   
   - Ejecutar el programa y seleccionar la opción 2.
   - Ingresar la ruta del primer archivo JSON cuando se solicite.
   - Ingresar la ruta del segundo archivo JSON cuando se solicite.
   - Especificar la clave para identificar los objetos en ambos archivos.
   - El programa generará un archivo llamado `diffElements.json` que contiene los elementos que están presentes en el primer archivo pero no en el segundo, basado en la clave especificada.

## Requisitos

- Node.js instalado en tu sistema.

## Instalación

1. Clonar este repositorio o descargar el código fuente.
2. Abrir una terminal en la ubicación del código.
3. Ejecutar `npm install` para instalar las dependencias.

## Ejecución

Ejecutar el programa con el siguiente comando:

```
node main.js
```

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.
