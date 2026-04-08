import { Resend } from "resend";
import type { InvestmentRow } from "@/lib/supabase";
import { absoluteUrl } from "@/lib/site";

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

interface EmailParams {
  email: string;
  name: string;
  amountCents?: number;
  magicLink?: string;
}

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
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  return getResendClient().emails.send({
    from: getFromEmail(),
    to,
    subject,
    html,
    text,
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
