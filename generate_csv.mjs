import fs from 'fs';

const dataRaw = fs.readFileSync('./src/data.json', 'utf8');
const data = JSON.parse(dataRaw);

const categorias = data.menu.map(c => c.categoria);
let catCsv = "Categoria\n" + categorias.map(c => `"${c}"`).join("\n");
fs.writeFileSync('categorias.csv', catCsv);

let platosCsv = "Categoria,Plato,Precio,Descripcion,Opcion1,Opcion2,Imagen URL\n";
for (const cat of data.menu) {
  for (const item of cat.items) {
    const c = `"${cat.categoria}"`;
    const p = `"${item.nombre}"`;
    const price = item.precio || '';
    const desc = `"${item.opcion || ''}"`; 
    
    let op1 = '';
    let op2 = '';
    if (item.opciones && item.opciones.length >= 1) op1 = `"${item.opciones[0]}"`;
    if (item.opciones && item.opciones.length >= 2) op2 = `"${item.opciones[1]}"`;

    let imgUrl = item.imagen || '';
    if (!imgUrl && item.imagenes && item.opciones && item.opciones.length > 0) {
        // En los platos que tienen imágenes por opción, pondremos la de la primera opción como base, 
        // pero la app manejará el fallback a la imagen local de la opción si la URL en Sheets está vacía o si es la local.
        imgUrl = item.imagenes[item.opciones[0]] || '';
    }
    
    platosCsv += `${c},${p},${price},${desc},${op1},${op2},"${imgUrl}"\n`;
  }
}
fs.writeFileSync('platos.csv', platosCsv);
console.log("CSV generados exitosamente.");
