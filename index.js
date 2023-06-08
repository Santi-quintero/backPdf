const express = require("express");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const app = express();
const port = 3000;
app.use(express.json({ limit: "50mb" }));
app.post("/agregar-firma", async (req, res) => {
  try {
    const { signature, PDF, Img, position } = req.body;
    // Crea un nuevo PDFDocument desde los bytes recibidos
    const pdfDoc = await PDFDocument.load(PDF);
    // Carga una fuente de texto estándar
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    // Carga la imagen de la firma desde los bytes recibidos
    const firmaImage = await pdfDoc.embedPng(Img);

    const firstPage = pdfDoc.getPages()[position.page];
    // const { width, height } = firstPage.getSize();

    const adjustedX = position.x;
    let adjustedY = firstPage.getHeight() - position.y;

    const fontSize = 12;

    // Agrega los datos de la firma electrónica
    const size = Object.keys(signature).length + 1;
    console.log(size);
    firstPage.drawText(
      `Firmado electrónicamente por: \nNombre: ${signature.name}\nCorreo: ${signature.email}\nTeléfono: ${signature.phone}\nDocumento: ${signature.document.type}. ${signature.document.number}\nIP: ${signature.IP}`,
      {
        x: adjustedX,
        y: adjustedY,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
        lineHeight: fontSize,
        opacity: 1,
      }
    );
    const offsetY = (size - 1) * fontSize + 2;
    firstPage.drawImage(firmaImage, {
      x: adjustedX - 80,
      y: adjustedY - offsetY,
      width: 80,
      height: size * fontSize,
    });
    // Genera los nuevos bytes del PDF modificado

    const modifiedPdfBytes = await pdfDoc.save();
    // const prueba = await pdfDoc.saveAsBase64({ dataUri: true });
    // console.log(prueba);
    
    // Genera un nombre único para el archivo modificado
    const fileName = `${uuidv4()}.pdf`;

    const base64 =
      // Guarda el archivo modificado en el disco
      fs.writeFileSync(fileName, modifiedPdfBytes);
    // Envía la respuesta con el archivo para su descarga

    //Genera los nuevos bytes del PDF modificado
    const body = {
      statusCode: 200,
      body: modifiedPdfBytes,
    };
    res.json(body);
    // res.download(fileName, () => {
    //   // Elimina el archivo después de la descarga
    //   fs.unlinkSync(fileName);
    // });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al modificar el PDF.");
  }
});
app.listen(port, () => {
  console.log(`Servidor Express iniciado en http://localhost:${port}`);
});
