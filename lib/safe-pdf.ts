import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFFont,
  type PDFPage,
} from "pdf-lib";
import { readFile } from "node:fs/promises";

const COMPANY_NAME = "Jury App Inc.";
const COMPANY_STATE = "Delaware";
const SAFE_INSTRUMENT = "Post-Money SAFE";
const VALUATION_CAP = "$12,000,000";
const DISCOUNT_TERMS = "None";

function formatCurrency(amountCents: number) {
  return `$${(amountCents / 100).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

function wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, fontSize) <= maxWidth) {
      currentLine = candidate;
      continue;
    }

    if (currentLine) lines.push(currentLine);
    currentLine = word;
  }

  if (currentLine) lines.push(currentLine);
  return lines;
}

function drawWrappedText({
  page,
  text,
  x,
  y,
  font,
  fontSize,
  lineHeight,
  maxWidth,
  color = rgb(0, 0, 0),
}: {
  page: PDFPage;
  text: string;
  x: number;
  y: number;
  font: PDFFont;
  fontSize: number;
  lineHeight: number;
  maxWidth: number;
  color?: ReturnType<typeof rgb>;
}) {
  const lines = wrapText(text, font, fontSize, maxWidth);
  let currentY = y;

  for (const line of lines) {
    page.drawText(line, { x, y: currentY, size: fontSize, font, color });
    currentY -= lineHeight;
  }

  return currentY;
}

export async function generateSafeDraftPdf({
  investorName,
  amountCents,
  investorEmail,
  investorReference,
}: {
  investorName: string;
  amountCents: number;
  investorEmail: string;
  investorReference?: string;
}) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]);
  const { width, height } = page.getSize();
  const margin = 56;
  const contentWidth = width - margin * 2;
  const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const bodyFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  let y = height - margin;
  let logoDrawn = false;

  try {
    const logoBytes = await readFile("/Volumes/SSD/jurybrand/JuryLogo.png");
    const logoImage = await pdfDoc.embedPng(logoBytes);
    const targetWidth = 140;
    const scale = targetWidth / logoImage.width;
    const targetHeight = logoImage.height * scale;

    page.drawImage(logoImage, {
      x: margin,
      y: y - targetHeight + 8,
      width: targetWidth,
      height: targetHeight,
      opacity: 0.92,
    });

    y -= targetHeight + 24;
    logoDrawn = true;
  } catch {
    // If the logo is unavailable, keep PDF generation working without it.
  }

  page.drawText("Draft SAFE Agreement", {
    x: margin,
    y,
    size: 22,
    font: titleFont,
    color: rgb(0.1, 0.1, 0.1),
  });
  y -= 28;

  page.drawText(`${SAFE_INSTRUMENT} summary for review`, {
    x: margin,
    y,
    size: 11,
    font: bodyFont,
    color: rgb(0.35, 0.35, 0.35),
  });
  y -= 34;

  const draftDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  const keyTerms = [
    ["Company", `${COMPANY_NAME} (${COMPANY_STATE} C Corp)`],
    ["Investor", investorName],
    ["Investor email", investorEmail],
    ...(investorReference ? ([["Investor reference", investorReference]] as const) : []),
    ["Purchase amount", formatCurrency(amountCents)],
    ["Instrument", SAFE_INSTRUMENT],
    ["Valuation cap", VALUATION_CAP],
    ["Discount", DISCOUNT_TERMS],
    ["Draft date", draftDate],
  ] as const;

  for (const [label, value] of keyTerms) {
    page.drawText(`${label}:`, {
      x: margin,
      y,
      size: 11,
      font: titleFont,
      color: rgb(0.1, 0.1, 0.1),
    });
    y = drawWrappedText({
      page,
      text: value,
      x: margin + 120,
      y,
      font: bodyFont,
      fontSize: 11,
      lineHeight: 15,
      maxWidth: contentWidth - 120,
    });
    y -= 6;
  }

  y -= 24;

  y = drawWrappedText({
    page,
    text:
      "This document is a draft summary of the proposed SAFE terms based on the amount submitted through Jury. It is provided for review and discussion only and is not countersigned, final, or legally complete on its own.",
    x: margin,
    y,
    font: bodyFont,
    fontSize: 11,
    lineHeight: 16,
    maxWidth: contentWidth,
  });
  y -= 14;

  y = drawWrappedText({
    page,
    text:
      "If your legal name, email, or investment amount should be corrected before final paperwork is issued, reply to the SAFE draft email and we will update the agreement before execution.",
    x: margin,
    y,
    font: bodyFont,
    fontSize: 11,
    lineHeight: 16,
    maxWidth: contentWidth,
  });
  y -= 24;

  page.drawText("Acknowledgement", {
    x: margin,
    y,
    size: 13,
    font: titleFont,
    color: rgb(0.1, 0.1, 0.1),
  });
  y -= 22;

  drawWrappedText({
    page,
    text:
      "By proceeding to final documentation, the investor acknowledges that startup investments are risky, illiquid, and may result in complete loss of capital. Final SAFE paperwork remains subject to review, approval, and countersignature.",
    x: margin,
    y,
    font: bodyFont,
    fontSize: 11,
    lineHeight: 16,
    maxWidth: contentWidth,
  });

  if (!logoDrawn) {
    page.drawText(COMPANY_NAME, {
      x: margin,
      y: 52,
      size: 10,
      font: titleFont,
      color: rgb(0.2, 0.2, 0.2),
    });
  }

  return Buffer.from(await pdfDoc.save());
}
