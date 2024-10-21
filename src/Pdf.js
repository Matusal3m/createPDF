import bwip from "bwip-js";
import File from "./File.js";
import fs from "fs/promises";
import { PDFDocument } from "pdf-lib";

import { createCanvas, loadImage, registerFont } from "canvas";
import { PATH_TO_CODE_IMAGES } from "./constants.js";

export default class Pdf {
  static async generateHtmlToBarcodeList(csvPath) {
    const csvJson = await File.CSVtoJSON(csvPath);
    const style = `<style>body {display: flex;flex-direction: column;align-items: center;justify-content: center;height: 100vh;margin: 0;padding: 0;}</style>`;

    let body = "<body>";

    for (const code in csvJson) {
      await this.generateBarcodeImage(code, csvJson[code]);

      const relatedHtmlImageTag = `<img src="${PATH_TO_CODE_IMAGES}/${code}.png" /><br>`;

      body += relatedHtmlImageTag;
    }

    const html = style + body + "</body>";

    fs.writeFile("./data/output.html", html, "utf-8");
  }

  static async getBarcodePng(code) {
    const pngBuffer = await bwip.toBuffer({
      bcid: "code39",
      text: code,
      scale: 2,
      height: 10,
      includetext: true,
      textxalign: "center",
    });

    return pngBuffer;
  }

  static async generateBarcodeImage(code, itemName, createImage = false) {
    const canvas = createCanvas(300, 200);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barcodeBuffer = await this.getBarcodePng(code);

    const barcodeImage = await loadImage(barcodeBuffer);

    ctx.drawImage(
      barcodeImage,
      (canvas.width - barcodeImage.width) / 2,
      (canvas.height - barcodeImage.height) / 2,
      barcodeImage.width,
      barcodeImage.height
    );

    ctx.font = "18px Arial";

    ctx.fillStyle = "darkblue";

    ctx.fillText(itemName, 0, (canvas.height - barcodeImage.height) / 2 - 20);

    const outputBuffer = canvas.toBuffer("image/png");

    if (createImage)
      await fs.writeFile(`${PATH_TO_CODE_IMAGES}/${code}.png`, outputBuffer);

    return outputBuffer;
  }

  static async generateAllBarcodeImages(csvPath, createImage = false) {
    const csvJson = await File.CSVtoJSON(csvPath);
    const promises = [];

    for (const code in csvJson) {
      promises.push(
        await this.generateBarcodeImage(code, csvJson[code], createImage)
      );
    }

    const barcodeBuffers = await Promise.all(promises);

    return barcodeBuffers;
  }

  static async generateBarcodesPDF(csvPath, createImage = false) {
    const imagesBuffers = await this.generateAllBarcodeImages(
      csvPath,
      createImage
    );

    const pdfDoc = await PDFDocument.create();

    for (let i = 0; i < Math.round(imagesBuffers.length / 10); i++) {
      const page = pdfDoc.addPage();
      for (let j = 0; j < 10; j++) {
        const currentIndex = i * 10 + j;
        if (!imagesBuffers[currentIndex]) break;

        await fs.writeFile(
          `${PATH_TO_CODE_IMAGES}/${1000 + currentIndex}.png`,
          imagesBuffers[currentIndex]
        );

        const img = await pdfDoc.embedPng(imagesBuffers[currentIndex]);

        const collumn = Math.floor(j / 5);
        const row = j % 5;

        page.drawImage(img, {
          x: collumn * 300 + 20,
          y: page.getHeight() - img.height - 150 * row,
          width: img.width,
          height: img.height,
        });
      }
    }

    const pdfBytes = await pdfDoc.save();
    const outputPath = `./output/${csvPath
      .split("/")
      .pop()
      .replace(".csv", "")}.pdf`;

    await fs.writeFile(outputPath, pdfBytes);
  }
}
