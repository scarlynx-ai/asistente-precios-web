/**
 * Conector de Google Sheets para Asistente de Precios ($0 Costo en la Nube)
 * 
 * INSTRUCCIONES:
 * 1. En tu Google Sheet, ve a Extensiones > Apps Script.
 * 2. Borra todo lo que haya y pega este código.
 * 3. Haz clic en "Implementar" > "Nueva implementación".
 * 4. Selecciona tipo: "Aplicación web".
 * 5. Configura:
 *    - Ejecutar como: "Yo" (tu cuenta)
 *    - Quién tiene acceso: "Cualquier usuario"
 * 6. Haz clic en "Implementar" y copia la URL proporcionada.
 */

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  
  if (data.length < 2) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'ok', data: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // Buscar encabezados
  var headers = data[0].map(function(h) { return String(h).trim().toUpperCase(); });
  var colCodigo = -1, colDesc = -1, colCompra = -1, colVenta = -1, colIgv = -1, colTotal = -1;
  
  for (var i = 0; i < headers.length; i++) {
    var h = headers[i];
    if (h.indexOf('COD') !== -1) colCodigo = i;
    else if (h.indexOf('DESC') !== -1 || h.indexOf('NOMBRE') !== -1) colDesc = i;
    else if (h.indexOf('COMPRA') !== -1) colCompra = i;
    else if (h.indexOf('VENTA') !== -1) colVenta = i;
    else if (h.indexOf('IGV') !== -1) colIgv = i;
    else if (h.indexOf('TOTAL') !== -1) colTotal = i;
  }
  
  var products = [];
  for (var r = 1; r < data.length; r++) {
    var row = data[r];
    var cod = colCodigo !== -1 ? String(row[colCodigo]).trim() : '';
    var desc = colDesc !== -1 ? String(row[colDesc]).trim() : '';
    if (!cod && !desc) continue;
    
    products.push({
      id: r,
      codigo: cod,
      descripcion: desc,
      precio_compra: colCompra !== -1 ? Number(row[colCompra]) || 0 : 0,
      precio_venta: colVenta !== -1 ? Number(row[colVenta]) || 0 : 0,
      igv: colIgv !== -1 ? Number(row[colIgv]) || 0 : 0,
      total: colTotal !== -1 ? Number(row[colTotal]) || 0 : 0,
      stock: 'Disponible'
    });
  }
  
  return ContentService.createTextOutput(JSON.stringify({ status: 'ok', count: products.length, data: products }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    if (payload.action === 'add') {
      sheet.appendRow([
        payload.codigo,
        payload.descripcion,
        payload.precio_compra,
        payload.precio_venta,
        payload.igv,
        payload.total
      ]);
      return ContentService.createTextOutput(JSON.stringify({ status: 'ok', message: 'Producto agregado' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}