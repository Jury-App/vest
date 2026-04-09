import { Resend } from "resend";
import type { InvestmentRow } from "@/lib/supabase";
import { absoluteUrl } from "@/lib/site";
import { generateSafeDraftPdf } from "@/lib/safe-pdf";

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getResendClient() {
  return new Resend(requireEnv("RESEND_API_KEY"));
}

function getFromEmail() {
  return requireEnv("RESEND_FROM_EMAIL");
}

function getReplyToEmail() {
  return "nicole@meetjury.com";
}

interface EmailParams {
  email: string;
  name: string;
  amountCents?: number;
  magicLink?: string;
  investorReference?: string;
}

const SAFE_GUIDE_URL =
  "https://bookface-static.ycombinator.com/assets/ycdc/Website%20User%20Guide%20Feb%202023%20-%20final-28acf9a3b938e643cc270b7da514194d5c271359be25b631b025605673fa9f95.pdf";
const COMPANY_NAME = "Jury App Inc.";
const SAFE_VALUATION_CAP = "$12,000,000";

function formatAmount(amountCents?: number) {
  if (typeof amountCents !== "number") return null;
  return `$${(amountCents / 100).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

async function sendEmail({
  to,
  subject,
  html,
  text,
  attachments,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
  attachments?: Array<{
    filename: string;
    content: string;
  }>;
}) {
  return getResendClient().emails.send({
    from: getFromEmail(),
    replyTo: getReplyToEmail(),
    to,
    subject,
    html,
    text,
    attachments,
  });
}

export async function sendPaymentFailedEmail({ email, name, amountCents }: EmailParams) {
  const amount = formatAmount(amountCents);
  await sendEmail({
    to: email,
    subject: "Your Jury payment did not go through",
    text: `Hi ${name}, your ${amount ?? "investment"} did not complete successfully. You can return to Jury and try again, or reply to this email if you need help.`,
    html: `<p>Hi ${name}, your ${amount ?? "investment"} did not complete successfully. You can return to Jury and try again, or reply to this email if you need help.</p>`,
  });
}

export async function sendPaymentReceivedEmail({ email, name, amountCents }: EmailParams) {
  const amount = formatAmount(amountCents);
  const schedulingUrl = "https://calendly.com/nicole-meetjury/jury-seed";
  await sendEmail({
    to: email,
    subject: "Your Jury investment deposit is in!",
    text: `Hi ${name}, we received your ${amount ?? "investment"} deposit. Thank you for your support! The early buy-in means a lot. So this is how things are gonna go; Let's start with a quick hello and go over any fine details. I'll send you more info once that's booked, and then follow up with SAFE agreements once mutually confirmed! If not, your money is refunded. Schedule 15m here: ${schedulingUrl}`,
    html: `<p>Hi ${name}, we received your ${amount ?? "investment"} deposit. Thank you for your support! The early buy-in means a lot. So this is how things are gonna go; Let's start with a quick hello and go over any fine details. I'll send you more info once that's booked, and then follow up with SAFE agreements once mutually confirmed! If not, your money is refunded. <a href="${schedulingUrl}">Schedule 15m here.</a></p>`,
  });
}

export async function sendSafeDraftEmail({
  email,
  name,
  amountCents,
  investorReference,
}: EmailParams) {
  const amount = formatAmount(amountCents) ?? "your indicated investment amount";
  const referenceLine = investorReference ? `Investor reference: ${investorReference}` : null;
  const safeDraftPdf = await generateSafeDraftPdf({
    investorName: name,
    investorEmail: email,
    amountCents: amountCents ?? 0,
    investorReference,
  });
  const attachmentName =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "investor";

  await sendEmail({
    to: email,
    subject: `Draft Jury SAFE for ${amount}`,
    text: [
      `Hi ${name},`,
      "",
      `Attached is your draft SAFE agreement PDF for a proposed ${amount} investment in ${COMPANY_NAME}.`,
      "",
      "Draft SAFE terms:",
      `- Investor: ${name}`,
      `- Company: ${COMPANY_NAME}`,
      `- Instrument: Post-Money SAFE`,
      `- Purchase amount: ${amount}`,
      `- Valuation cap: ${SAFE_VALUATION_CAP}`,
      "- Discount: None",
      "",
      "This draft is for review and discussion only and is not countersigned or finalized yet.",
      referenceLine ?? "",
      "",
      `SAFE guide: ${SAFE_GUIDE_URL}`,
    ]
      .filter(Boolean)
      .join("\n"),
    html: [
      `<p>Hi ${name},</p>`,
      `<p>Attached is your draft SAFE agreement PDF for a proposed <strong>${amount}</strong> investment in <strong>${COMPANY_NAME}</strong>.</p>`,
      "<p><strong>Draft SAFE terms</strong></p>",
      "<ul>",
      `<li>Investor: ${name}</li>`,
      `<li>Company: ${COMPANY_NAME}</li>`,
      "<li>Instrument: Post-Money SAFE</li>",
      `<li>Purchase amount: ${amount}</li>`,
      `<li>Valuation cap: ${SAFE_VALUATION_CAP}</li>`,
      "<li>Discount: None</li>",
      "</ul>",
      "<p>This draft is for review and discussion only and is not countersigned or finalized yet.</p>",
      referenceLine ? `<p>${referenceLine}</p>` : "",
      `<p><a href="${SAFE_GUIDE_URL}">Read the SAFE guide</a></p>`,
    ]
      .filter(Boolean)
      .join(""),
    attachments: [
      {
        filename: `jury-safe-draft-${attachmentName}.pdf`,
        content: safeDraftPdf.toString("base64"),
      },
    ],
  });
}

export async function sendInvestmentApprovedEmail({
  email,
  name,
  magicLink,
}: EmailParams) {
  if (!magicLink) {
    throw new Error("Magic link is required for investment approval emails");
  }

  await sendEmail({
    to: email,
    subject: "Your Jury investment is approved!",
    text: `Hi ${name}, your investment has been approved. Use this magic link to access your donor view: ${magicLink}. Thanks for backing Jury!!!`,
    html: `<p>Hi ${name}, your investment has been approved.<a href="${magicLink}">Use this magic link to access your donor view</a>. Thanks for backing Jury!!!</p>`,
  });
}

export async function sendNewMagicLinkEmail({
  email,
  name,
  magicLink,
}: EmailParams) {
  if (!magicLink) {
    throw new Error("Magic link is required for sign-in emails");
  }

  await sendEmail({
    to: email,
    subject: "Your personal magic link!",
    text: `Hi ${name}, to track your investment, here is your new magic link: ${magicLink}`,
    html: `<p>Hi ${name}, <a href="${magicLink}">to track your investment, here is your new magic link</a>.</p>`,
  });
}

export function buildAdminApprovalUrl() {
  return absoluteUrl("/api/admin/process-approvals");
}

export function getInvestmentAmount(investment: Pick<InvestmentRow, "amount">) {
  return investment.amount;
}
