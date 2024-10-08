import fs from "fs/promises";
import JSzip from "jszip";
import { PATH_TO_CODE_IMAGES } from "./constants.js";

export default class File {
  /**
   *
   * @param {string} csvPath
   * @returns {Promise<{csvHeader: string, csvLines: string[]}>}
   */
  static async getCSVLines(csvPath) {
    const csvLines = (await fs.readFile(csvPath, "utf-8")).split("\r\n");

    const csvHeader = csvLines.shift();

    return {
      csvHeader,
      csvLines,
    };
  }

  static async CSVtoJSON(csvPath) {
    const { csvHeader, csvLines } = await this.getCSVLines(csvPath);

    const csvJSON = {};

    csvLines.forEach((line) => {
      const [code, itemName] = line.split(",");

      csvJSON[code] = this.cleanText(itemName);
    });

    return csvJSON;
  }

  /**
   *
   * @param {string} text
   * @returns string
   */
  static cleanText(text) {
    return text.toUpperCase().replace("\r", "").trim();
  }
}
