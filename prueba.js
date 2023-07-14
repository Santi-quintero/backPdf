// const signer = require("node-signpdf").default;
// const fs = require("fs");
// const { plainAddPlaceholder } = require("node-signpdf/dist/helpers");

// const pdfSignedPath = "./assets/PoderAsambleaAccionistasCCARENDIR.pdf";
// const pdfPath = "./assets/PoderAsambleaAccionistasCCARENDIR.pdf";
// const pfxPath = "./assets/SantiQuintero.pfx";
// const password = "Sq1234%.";

// try {
//   // Leer el archivo PDF y el certificado PFX/P12
//   const pdfBuffer = fs.readFileSync(pdfPath);
//   const certBuffer = fs.readFileSync(pfxPath);
// //   console.log(pdfBuffer);

// //   console.log(`llega, ${certBuffer.length}`);
//   // Generar el objeto de datos de entrada para firmar el PDF
//   let inputBuffer = plainAddPlaceholder({
//     pdfBuffer,
//     reason: 'Signed Certificate.',
//     contactInfo: 'sign@example.com',
//     name: 'Example',
//     location: 'Jakarta',
//     signatureLength: certBuffer.length,
// });

//   // Firmar el PDF utilizando el certificado PFX/P12
//   const signedPdf = signer.sign(inputBuffer, certBuffer, {
//     passphrase: password,
//     asn1StrictParsing: true,

//   });

//   // Escribir el PDF firmado en el archivo de salida
//   fs.writeFileSync(pdfSignedPath, signedPdf);

//   console.log("PDF firmado exitosamente.");
// } catch (error) {
//   console.error("Error al firmar el PDF:", error);
// }

const signer = require("node-signpdf").default;
const fs = require("fs");
const { plainAddPlaceholder } = require("node-signpdf/dist/helpers");

const {
  PDFDocument,
  PDFName,
  PDFNumber,
  PDFHexString,
  PDFString,
} = require("pdf-lib");
const PDFArrayCustom = require("./signDigital/pdfArrayCustom");


// const pdfPath = "./assets/PoderAsambleaAccionistasCCARENDIR.pdf";
const pdfPath = "./exports/exported_file_2137.pdf";
const pfxPath = "./assets/LuizGonzalez.pfx";
const password = "Luis43.%";

async function main() {
  try {
    // Leer el archivo PDF y el certificado PFX/P12
    const pdfBuffer = fs.readFileSync(pdfPath);
    const certBuffer = fs.readFileSync(pfxPath);

    // Cargar el PDF utilizando pdf-lib
    const loadedPdf = await PDFDocument.load(pdfBuffer);
    const ByteRange = PDFArrayCustom.withContext(loadedPdf.context);
    const DEFAULT_BYTE_RANGE_PLACEHOLDER = "**********";
    const SIGNATURE_LENGTH = 3322;

    // Agregar una nueva página antes del placeholder
    loadedPdf.addPage();
    const pages = loadedPdf.getPages();
    const page = pages.length - 1;
    const marginX = 70;
    const rectWidth = 500 - 2 * marginX;

    // Agregar el contenido deseado a la nueva página (rectángulo, imagen, texto, etc.)
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
    const pdfBytes = await loadedPdf.save({
      useObjectStreams: false,
      updateFieldAppearances: true,
    });
    let buffer = unit8ToBuffer(pdfBytes);
    // Firmar el PDF utilizando el certificado PFX/P12
    const signedPdf = signer.sign(buffer, certBuffer, {
      passphrase: password,
      asn1StrictParsing: true,
    });

    // Escribir el PDF firmado en el archivo de salida
    const randomNumber = Math.floor(Math.random() * 5000);
    const pdfSignedPath = `./exports/exported_file_${randomNumber}.pdf`;

    fs.writeFileSync(pdfSignedPath, signedPdf);
    console.log(`New Signed PDF created called: ${pdfSignedPath}`);

    console.log("PDF firmado exitosamente.");
  } catch (error) {
    console.error("Error al firmar el PDF:", error);
  }

  function unit8ToBuffer(unit8) {
    let buf = Buffer.alloc(unit8.byteLength);
    const view = new Uint8Array(unit8);

    for (let i = 0; i < buf.length; ++i) {
      buf[i] = view[i];
    }
    return buf;
  }
}
main();
