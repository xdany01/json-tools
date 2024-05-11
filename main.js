import fs from 'node:fs';
import readline from 'node:readline';
import * as path from "node:path";

// Crear una interfaz de lectura para leer desde la consola
const rl = readline.createInterface({
    input: process.stdin, output: process.stdout
});

const main = async () => {
    try {
        const opt = await askQuestion('Digite una opción:\n1-Ordenar un archivo JSON.\n2-Comparar dos archivos JSON.\n');
        switch (Number(opt.trim())) {
            case 1:
                const filePath = await askQuestion('Ingrese la ruta del archivo JSON desordenado: ');
                const data = await readFile(filePath);
                const jsonData = JSON.parse(data);
                const sortKey = await askQuestion('Ingrese la clave para ordenar el JSON: ');
                const sortedData = sortBy(jsonData, sortKey);
                const cantObj = sortedData?.length;
                const sortedFilePath = generateSortedFilePath(filePath, cantObj);
                const sortedJson = JSON.stringify(sortedData, null, 2);
                await writeFile(sortedFilePath, sortedJson);
                console.log(`El archivo JSON con ${cantObj} elementos fue ordenado y guardado correctamente: ${sortedFilePath}`);
                break;
            case 2:
                const filePath1 = await askQuestion('Ingrese la ruta del primer archivo JSON: ');
                const filePath2 = await askQuestion('Ingrese la ruta del segundo archivo JSON: ');
                const data1 = await readFile(filePath1);
                const data2 = await readFile(filePath2);
                const jsonData1 = JSON.parse(data1);
                const jsonData2 = JSON.parse(data2);
                const key = await askQuestion('Ingrese la clave para identificar el objeto: ');
                const {min, max} = getMinMax(jsonData1, jsonData2);
                const diffArrays = excludeArrs(max, min, key);
                const nameFile = 'diffElements.json';
                const pathBase = path.dirname(filePath1);
                const pathDiff = path.join(pathBase, nameFile);
                await writeFile(pathDiff, diffArrays);
                console.log(`El JSON se guardo correctamente en ${pathDiff}`);
                break;
            default:
                console.error(`Opción "${opt}" desconocida.`);
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        rl.close();
    }
};

/**
 * Función que realiza una pregunta al usuario y devuelve una promesa con la respuesta.
 * @param {string} question - La pregunta que se le hará al usuario.
 * @returns {Promise<string>} - La respuesta del usuario como una promesa.
 */
function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim()); // Resuelve la promesa con la respuesta del usuario sin espacios en blanco al inicio o final.
        });
    });
}


/**
 * Función para leer un archivo desde una ruta específica.
 * @param {string} filePath - La ruta del archivo a leer.
 * @returns {Promise} - Una promesa que resuelve con los datos del archivo leído o se rechaza con un error.
 */
function readFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => { // Lee el archivo en formato UTF-8
            if (err) {
                reject(err); // Rechaza la promesa si hay un error al leer el archivo
            } else {
                resolve(data); // Resuelve la promesa con los datos del archivo leído
            }
        });
    });
}

/**
 * Función para obtener el mínimo y máximo entre dos arreglos.
 * @param {Array} arr1 - Primer arreglo a comparar.
 * @param {Array} arr2 - Segundo arreglo a comparar.
 * @returns {Object} - Objeto con el mínimo y máximo arreglo.
 */
function getMinMax(arr1, arr2) {
    // Comparamos las longitudes de los arreglos para determinar cuál es el máximo y cuál es el mínimo.
    let max = arr1.length > arr2.length ? arr1 : arr2; // Asignamos el arreglo más largo a 'max'.
    let min = arr1.length < arr2.length ? arr1 : arr2; // Asignamos el arreglo más corto a 'min'.
    return {min, max}; // Devolvemos un objeto con el arreglo mínimo y máximo.
}

/**
 * Función para excluir elementos de un arreglo basado en una clave específica.
 * @param {Array} max - El arreglo principal del cual se excluirán elementos.
 * @param {Array} min - El arreglo que contiene los elementos a excluir.
 * @param {string} key - La clave por la cual se compararán los elementos.
 * @returns {string} - Un string JSON que representa el arreglo resultante después de la exclusión.
 */
function excludeArrs(max, min, key) {
    // Filtra los elementos del arreglo 'max' que no tienen ninguna coincidencia en el arreglo 'min' basado en la clave 'key'.
    return JSON.stringify(max.filter(obj1 => !min.some(obj2 => obj2[key] === obj1[key])));
}

/**
 * Función para ordenar un array de objetos por una clave específica.
 * @param {Array} arr - El array que se va a ordenar.
 * @param {string} key - La clave por la cual se va a ordenar el array.
 * @returns {Array} - El array ordenado por la clave especificada.
 */
function sortBy(arr, key) {
    // Se utiliza el método concat() para crear una copia del array original y no modificarlo directamente.
    return arr.concat().sort((a, b) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0));
}

/**
 * Función para generar la ruta de archivo ordenado.
 * @param {string} filePath - Ruta del archivo original.
 * @param {number} cantObj - Cantidad de objetos.
 * @returns {string} - Ruta del archivo ordenado.
 */
function generateSortedFilePath(filePath, cantObj) {
    let sortedFilePath = '';

    // Comprueba si el nombre del archivo ya contiene '-sorted.json'
    if (/[A-Za-z0-9\-_]+-sorted\.json$/.test(filePath)) {
        // Reemplaza la cantidad de objetos en el nombre del archivo
        sortedFilePath = filePath.replace(/-[0-9]+-sorted\.json$/, `-${cantObj}-sorted.json`);
    } else {
        // Agrega la cantidad de objetos al nombre del archivo
        sortedFilePath = filePath.replace('.json', `-${cantObj}-sorted.json`);
    }

    return sortedFilePath;
}

/**
 * Función para escribir un archivo con datos JSON ordenados.
 * @param {string} filePath - Ruta del archivo donde se escribirán los datos.
 * @param {string} sortedJson - Datos JSON ordenados a escribir en el archivo.
 * @returns {Promise} - Promesa que se resolverá una vez que se haya completado la escritura del archivo.
 */
function writeFile(filePath, sortedJson) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, sortedJson, {flag: 'w', encoding: 'utf8'}, (err) => {
            if (err) {
                reject(err); // Rechazar la promesa si hay un error al escribir el archivo
            } else {
                resolve(); // Resolver la promesa una vez que se haya completado la escritura del archivo
            }
        });
    });
}

// Evento para cerrar la interfaz de lectura al finalizar
rl.on('close', () => {
    console.log('Programa finalizado.');
});

main();