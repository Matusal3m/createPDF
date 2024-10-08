import Pdf from "./Pdf.js";
import File from "./File.js";

(async () => {
  const csvPath = "./data/sistema-codigos.csv";
  const createImages = process.argv.includes("--create-images" || "--ci");

  await Pdf.generateBarcodesPDF(csvPath, createImages);
})();
