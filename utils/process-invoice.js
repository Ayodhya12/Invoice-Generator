import fs from "fs";
import path from "path";
import chalk from "chalk";
import PDFDocument from "pdfkit";
import { fileURLToPath } from "url";

export const processInvoice = (invoice) => {
  console.log(chalk.blue("🧮 Calculating totals..."));

  let subtotal = 0;

  invoice.items.forEach((item) => {
    subtotal += item.quantity * item.unitPrice;
  });

  const tax = subtotal * invoice.taxRate;
  const total = subtotal + tax - invoice.discount;

  console.log(chalk.green(`Subtotal: $${subtotal.toFixed(2)}`));
  console.log(
    chalk.green(`Tax (${invoice.taxRate * 100}%): $${tax.toFixed(2)}`)
  );
  console.log(chalk.green(`Discount: -$${invoice.discount.toFixed(2)}`));
  console.log(chalk.green(`Total: $${total.toFixed(2)}`));

  generatePDF(invoice, subtotal, tax, total);
};

const generatePDF = (invoice, subtotal, tax, total) => {
  console.log(chalk.blue("🖨️  Generating PDF invoice..."));

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const parentDir = path.join(__dirname, "..");
  const outputDir = path.join(parentDir, "output");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const pdfPath = path.join(outputDir, `${invoice.invoiceNumber}.pdf`);
  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(pdfPath));

  doc.fontSize(20).text("Invoice", { align: "center" });
  doc.moveDown();

  doc.fontSize(14).text(`Invoice Number: ${invoice.invoiceNumber}`);
  doc.text(`Date: ${invoice.date}`);
  doc.moveDown();

  doc.text(`Customer: ${invoice.customer.name}`);
  doc.text(`Email: ${invoice.customer.email}`);
  doc.text(`Address: ${invoice.customer.address}`);
  doc.moveDown();

  doc.fontSize(12).text("Items:");
  invoice.items.forEach((item) => {
    doc.text(
      `${item.description} - ${item.quantity} x $${item.unitPrice.toFixed(2)}`
    );
  });
  doc.moveDown();

  doc.text(`Subtotal: $${subtotal.toFixed(2)}`);
  doc.text(`Tax (${invoice.taxRate * 100}%): $${tax.toFixed(2)}`);
  doc.text(`Discount: -$${invoice.discount.toFixed(2)}`);
  doc.text(`Total: $${total.toFixed(2)}`);

  doc.end();

  console.log(chalk.green(`✅ Invoice saved as ${pdfPath}`));
};
