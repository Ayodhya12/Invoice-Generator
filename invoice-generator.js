import chalk from "chalk";
import Ajv from "ajv";
import { readAndValidateInvoice } from "./utils/read-and-validate-invoice.js";
import { processInvoice } from "./utils/process-invoice.js";

const ajv = new Ajv();

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log(chalk.red("❌ Please provide an invoice JSON file."));
  process.exit(1);
}
const inputFile = args[0];

readAndValidateInvoice(inputFile)
  .then((invoiceData) => {
    console.log(chalk.green("✅ Invoice validated successfully!"));
    processInvoice(invoiceData);
  })
  .catch((error) => {
    console.log(chalk.red(error.message));
    process.exit(1);
  });
