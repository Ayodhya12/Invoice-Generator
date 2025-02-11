import fs from "fs";
import chalk from "chalk";
import Ajv from "ajv";

const ajv = new Ajv();

const schema = JSON.parse(fs.readFileSync("schema.json", "utf-8"));

export const readAndValidateInvoice = async (inputFile) => {
  try {
    console.log(chalk.blue(`📂 Reading file: ${inputFile}...`));

    const fileData = fs.readFileSync(inputFile, "utf-8");
    const invoiceData = JSON.parse(fileData);
    const isValid = ajv.validate(schema, invoiceData);

    if (!isValid) {
      console.log(chalk.red("❌ Invalid invoice format:"));
      console.log(ajv.errors);
      process.exit(1);
    }
    return invoiceData;
  } catch (error) {
    throw new Error(`❌ Error reading or parsing the file: ${error.message}`);
  }
};
