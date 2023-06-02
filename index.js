const express = require("express");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const app = express();
const port = 3000;
app.use(express.json({ limit: "50mb" }));
app.post("/agregar-firma", async (req, res) => {
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
    const firmaWidth = 150; // Ancho de la imagen de la firma
    const firmaHeight = (firmaWidth * firmaImage.height) / firmaImage.width;
    const firstPage = pdfDoc.getPages()[0];
    const { width, height } = firstPage.getSize();

    console.log(`width ${width}`);
    console.log(`height ${height}`);
    // Agrega los datos de la firma electrónica
    const textX = signature.x + 10; // Posición X de los datos de la firma
    const textY = signature.y + lineHeight + firmaHeight; // Posición Y de los datos de la firma
    const fontSize = 12;
    const yOffset = 40;
    const xOffset = 100;
    let y_nextLine = height + yOffset - signature.y;
    const x_fixed = textX - xOffset;
    // Agrega la imagen de la firma
    firstPage.drawText("Firmado electrónicamente por:", {
      x: x_fixed,
      y: y_nextLine,
      size: fontSize,
      font,
      color: rgb(0.95, 0.1, 0.1),
    });
    firstPage.drawText(`Nombre: ${signature.name}`, {
      x: x_fixed,
      y: (y_nextLine -= fontSize),
      size: fontSize,
      font,
      color: rgb(0.95, 0.1, 0.1),
    });
    firstPage.drawText(`Correo: ${signature.email}`, {
      x: x_fixed,
      y: (y_nextLine -= fontSize),
      size: fontSize,
      font,
      color: rgb(0.95, 0.1, 0.1),
    });
    firstPage.drawText(`Teléfono: ${signature.phone}`, {
      x: x_fixed,
      y: (y_nextLine -= fontSize),
      size: fontSize,
      font,
      color: rgb(0.95, 0.1, 0.1),
    });
    firstPage.drawImage(firmaImage, {
      x: x_fixed - 80,
      y: y_nextLine - 24,
      width: 80,
      height: 68,
    });
    firstPage.drawText(`Tipo de documento: ${signature.document.type}`, {
      x: x_fixed,
      y: (y_nextLine -= fontSize),
      size: fontSize,
      font,
      color: rgb(0.95, 0.1, 0.1),
    });
    firstPage.drawText(`Número de documento: ${signature.document.number}`, {
      x: x_fixed,
      y: (y_nextLine -= fontSize),
      size: fontSize,
      font,
      color: rgb(0.95, 0.1, 0.1),
    });
    // Genera los nuevos bytes del PDF modificado
    const modifiedPdfBytes = await pdfDoc.save();
    console.log(modifiedPdfBytes);
    // Genera un nombre único para el archivo modificado
    const fileName = `${uuidv4()}.pdf`;

    const base64 =
      // Guarda el archivo modificado en el disco
      fs.writeFileSync(fileName, modifiedPdfBytes);
    // Envía la respuesta con el archivo para su descarga
    res.download(fileName, () => {
      // Elimina el archivo después de la descarga
      fs.unlinkSync(fileName);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al modificar el PDF.");
  }
});
app.listen(port, () => {
  console.log(`Servidor Express iniciado en http://localhost:${port}`);
});
