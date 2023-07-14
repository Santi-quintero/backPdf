const express = require("express");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const fs = require("fs");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
const app = express();
const port = 3000;
app.use(express.json({ limit: "50mb" }));
app.post("/agregar-firmas", async (req, res) => {
  try {
    const { PDF, signatures } = req.body;

    // Crea un nuevo PDFDocument desde los bytes recibidos
    const pdfDoc = await PDFDocument.load(PDF);
    // Carga una fuente de texto estándar
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const outputPath = "./assets/codigo.png";
    const buffer = fs.readFileSync(outputPath);
    const uint8array = Uint8Array.from(buffer);

    const firmaImage = await pdfDoc.embedPng(uint8array);
    for (const signatureData of signatures) {
      const { position, signature } = signatureData;
      const { page, x, y } = position;

      const firstPage = pdfDoc.getPages()[page - 1];
      const { width, height } = firstPage.getSize();

      const adjustedX = x;
      let adjustedY = height - y;

      const fontSize = 6.5;
      let now = moment();
      let formattedDateTime = now.format("YYYY-MM-DD HH:mm:ss");

      // Agrega los datos de la firma electrónica
      const size = Object.keys(signature).length + 2;

      // Dibuja la imagen en la página PDF
      const offsetY = size * fontSize;
      firstPage.drawImage(firmaImage, {
        x: adjustedX,
        y: adjustedY - 50,
        width: 50,
        height: 50,
      });
      firstPage.drawText(
        `Firmado electrónicamente por: \nNombre: ${signature.name}\nCorreo: ${
          signature.email
        }\nTeléfono: ${signature.phone}\nDocumento: ${
          signature.document.type
        }. ${signature.document.number}\nIP: ${
          signature.IP
        }\nHuella-identidad: ${uuidv4()}\nFecha y Hora: ${formattedDateTime}`,
        {
          x: adjustedX + 52,
          y: adjustedY - 5,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
          lineHeight: fontSize,
          opacity: 1,
        }
      );

      // firstPage.drawRectangle({
      //   x: adjustedX,
      //   y: adjustedY - 50,
      //   width: 187,
      //   height: 50,
      //   borderColor: rgb(1, 0, 0),
      //   borderWidth: 1.5,
      // });
    }

    // Genera los nuevos bytes del PDF modificado
    const modifiedPdfBytes = await pdfDoc.save();

    // Genera los nuevos bytes del PDF modificado
    const body = {
      statusCode: 200,
      body: modifiedPdfBytes,
    };
    res.json(body);
    // const fileName = `${uuidv4()}.pdf`;

    // // // // Guarda el archivo modificado en el disco
    // fs.writeFileSync(fileName, modifiedPdfBytes);

    // // Envía la respuesta con el archivo para su descarga
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
