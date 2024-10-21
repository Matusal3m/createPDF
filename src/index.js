import Pdf from "./Pdf.js";
import fs from "fs/promises";
import File from "./File.js";

(async () => {
  const csvPath = "./data/csv";
  const createImages = process.argv.includes("--create-images" || "--ci");

  const csvFilesNames = await fs.readdir(csvPath);

  csvFilesNames.forEach(async (fileName) => {
    await Pdf.generateBarcodesPDF(`${csvPath}/${fileName}`, createImages);
  });
})();
