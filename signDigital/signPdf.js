const {
  PDFDocument,
  PDFName,
  PDFNumber,
  PDFHexString,
  PDFString,
  StandardFonts,
  rgb,
} = require("pdf-lib");
const signer = require("node-signpdf").default;
const fs = require("fs");
const PDFArrayCustom = require("./pdfArrayCustom");

class SignPDF {
  constructor(pdfFile, certFile) {
    this.pdfDoc = fs.readFileSync(pdfFile);
    this.certificate = fs.readFileSync(certFile);
  }

  async signPDF() {
    const password = "Sq1234%.";
    // const password = "Luis43.%";
    let newPDF = await this._addPlaceholder();
    newPDF = signer.sign(newPDF, this.certificate, {
      passphrase: password,
      asn1StrictParsing: true,
    });

    return newPDF;
  }
  async _addPlaceholder() {
    const loadedPdf = await PDFDocument.load(this.pdfDoc);
    const ByteRange = PDFArrayCustom.withContext(loadedPdf.context);
    const DEFAULT_BYTE_RANGE_PLACEHOLDER = "**********";
    const SIGNATURE_LENGTH = 3322;

    // Agregar una nueva página
    const newPage = loadedPdf.addPage();
    const pages = loadedPdf.getPages();
    const page = pages.length - 1;
    const marginX = 70;
    const rectWidth = 500 - 2 * marginX;

    newPage.drawRectangle({
      x: marginX,
      y: pages[page].getHeight() - 50 - 100,
      width: rectWidth,
      height: 100,
      borderWidth: 2,
      borderColor: rgb(0.75, 0.2, 0.2),
      color: rgb(1, 1, 1),
    });

    // Agregar imagen a la nueva página
    const imageBytes = fs.readFileSync("./assets/codigo.png");
    const image = await loadedPdf.embedPng(imageBytes);
    const imageDims = image.scaleToFit(rectWidth / 2, 100); // Ajustar imagen al ancho y alto deseado
    newPage.drawImage(image, {
      x: marginX, // Coordenada x de la posición de la imagen
      y: pages[page].getHeight() - 50 - 100, // Coordenada y de la posición de la imagen
      width: imageDims.width,
      height: imageDims.height,
    });

    // Agregar texto junto a la imagen
    const textContent = "Texto de ejemplo";
    const font = await loadedPdf.embedFont(StandardFonts.Helvetica);
    const textWidth = font.widthOfTextAtSize(textContent, 12);
    newPage.drawText(textContent, {
      x: marginX + rectWidth / 2 - textWidth / 2, // Coordenada x de la posición del texto ajustada al centro del rectángulo
      y: pages[page].getHeight() - 50 - 100 + 50, // Coordenada y de la posición del texto ajustada a la mitad del rectángulo
      size: 12, // Tamaño de fuente del texto
      font: font, // Fuente del texto (puede ajustarse según la fuente deseada)
      color: rgb(0, 0, 0), // Color del texto en formato RGB
    });

    ByteRange.push(PDFNumber.of(0));
    ByteRange.push(PDFName.of(DEFAULT_BYTE_RANGE_PLACEHOLDER));
    ByteRange.push(PDFName.of(DEFAULT_BYTE_RANGE_PLACEHOLDER));
    ByteRange.push(PDFName.of(DEFAULT_BYTE_RANGE_PLACEHOLDER));

    const signatureDict = loadedPdf.context.obj({
      Type: "Sig",
      Filter: "Adobe.PPKLite",
      SubFilter: "adbe.pkcs7.detached",
      ByteRange,
      Contents: PDFHexString.of("A".repeat(SIGNATURE_LENGTH)),
      Reason: PDFString.of("We need your signature for reasons..."),
      M: PDFString.fromDate(new Date()),
    });

    const signatureDictRef = loadedPdf.context.register(signatureDict);

    const widgetDict = loadedPdf.context.obj({
      Type: "Annot",
      Subtype: "Widget",
      FT: "Sig",
      Rect: [
        marginX,
        pages[page].getHeight() - 50 - 100,
        marginX + rectWidth,
        pages[page].getHeight() - 50,
      ], // Signature rect size
      V: signatureDictRef,
      T: PDFString.of("test signature"),
      F: 4,
      P: pages[page].ref,
    });

    const widgetDictRef = loadedPdf.context.register(widgetDict);

    // Add signature widget to the first page
    pages[page].node.set(
      PDFName.of("Annots"),
      loadedPdf.context.obj([widgetDictRef])
    );

    loadedPdf.catalog.set(
      PDFName.of("AcroForm"),
      loadedPdf.context.obj({
        SigFlags: 3,
        Fields: [widgetDictRef],
      })
    );

    // Allows signatures on newer PDFs
    const pdfBytes = await loadedPdf.save({ useObjectStreams: false });

    return SignPDF.unit8ToBuffer(pdfBytes);
  }

  static unit8ToBuffer(unit8) {
    let buf = Buffer.alloc(unit8.byteLength);
    const view = new Uint8Array(unit8);

    for (let i = 0; i < buf.length; ++i) {
      buf[i] = view[i];
    }
    return buf;
  }
}

module.exports = SignPDF;
