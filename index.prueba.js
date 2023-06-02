const express = require('express');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;

app.use(express.json({ limit: '50mb' }));

app.post('/agregar-firma', async (req, res) => {
  try {
    const { signature, PDF, Img } = req.body;
    // Crea un nuevo PDFDocument desde los bytes recibidos
    const pdfDoc = await PDFDocument.load(PDF);

    // Carga una fuente de texto estándar
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Carga la imagen de la firma desde los bytes recibidos
    const firmaImage = await pdfDoc.embedPng(Img);

    // Agrega los datos de la firma electrónica
    const lineHeight = 16;

    const firstPage = pdfDoc.getPages()[0];
    const { width, height } = firstPage.getSize();

    // Agrega la imagen de la firma
    const imageWidth = 80;
    const imageHeight = 80;
    const imageX = signature.x * width;
    const imageY = signature.y * height;

    firstPage.drawImage(firmaImage, {
      x: imageX,
      y: imageY,
      width: imageWidth,
      height: imageHeight,
    });

    // Calcula las coordenadas para los datos de la firma
    const textX = imageX + imageWidth + 10; // Posición X de los datos de la firma
    const textY = imageY + imageHeight - lineHeight; // Posición Y de los datos de la firma

    const fontSize = 12;

    firstPage.drawText('Firmado electrónicamente por:', { x: textX, y: textY, size: fontSize, font, color: rgb(0.95, 0.1, 0.1) });
    firstPage.drawText(`Nombre: ${signature.name}`, { x: textX, y: textY - lineHeight, size: fontSize, font, color: rgb(0.95, 0.1, 0.1) });
    firstPage.drawText(`Correo: ${signature.email}`, { x: textX, y: textY - 2 * lineHeight, size: fontSize, font, color: rgb(0.95, 0.1, 0.1) });
    firstPage.drawText(`Teléfono: ${signature.phone}`, { x: textX, y: textY - 3 * lineHeight, size: fontSize, font, color: rgb(0.95, 0.1, 0.1) });
    firstPage.drawText(`Tipo de documento: ${signature.document.type}`, { x: textX, y: textY - 4 * lineHeight, size: fontSize, font, color: rgb(0.95, 0.1, 0.1) });
    firstPage.drawText(`Número de documento: ${signature.document.number}`, { x: textX, y: textY - 5 * lineHeight, size: fontSize, font, color: rgb(0.95, 0.1, 0.1) });

    // Genera los nuevos bytes del PDF modificado
    const modifiedPdfBytes = await pdfDoc.save();

    // Genera un nombre único para el archivo modificado
    const fileName = `${uuidv4()}.pdf`;

    // Guarda el archivo modificado en el disco
    fs.writeFileSync(fileName, modifiedPdfBytes);

    // Envía la respuesta con el archivo para su descarga
    res.download(fileName, () => {
      // Elimina el archivo después de la descarga
      fs.unlinkSync(fileName);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al modificar el PDF.');
  }
});

app.listen(port, () => {
  console.log(`Servidor Express iniciado en http://localhost:${port}`);
});
