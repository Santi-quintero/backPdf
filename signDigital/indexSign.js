const SignPDF = require("./signPdf");
const fs = require("fs");
const path = require("path");

async function main() {
  const pdfBuffer = new SignPDF(
    // path.resolve("./assets/3.pdf.pdf"),
    path.resolve("./exports/exported_file_3278.pdf"),
    path.resolve("./assets/SantiQuintero.pfx")
    // path.resolve("./assets/LuisGonzalez.pfx")
  );

  const signedDocs = await pdfBuffer.signPDF();
  const randomNumber = Math.floor(Math.random() * 5000);
  const pdfName = `./exports/exported_file_${randomNumber}.pdf`;

  fs.writeFileSync(pdfName, signedDocs);
  console.log(`New Signed PDF created called: ${pdfName}`);
}

main();
