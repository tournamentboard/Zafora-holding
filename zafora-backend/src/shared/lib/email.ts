import { Resend } from "resend";
import { db, siteSettingsTable } from "@/db/index.js";
import { eq } from "drizzle-orm";

const API_KEY = process.env["RESEND_API_KEY"];
const FROM_EMAIL = process.env["RESEND_FROM_EMAIL"] ?? "";
const DEFAULT_ADMIN_EMAIL = process.env["ADMIN_EMAIL"] ?? "";

let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) _resend = new Resend(API_KEY!);
  return _resend;
}

export function isEmailConfigured(): boolean {
  return !!API_KEY;
}

async function getAdminEmail(): Promise<{ email: string; notifyOnInquiry: boolean; notifyOnInterest: boolean }> {
  try {
    const [row] = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.key, "notifications")).limit(1);
    if (!row) {
      return { email: DEFAULT_ADMIN_EMAIL, notifyOnInquiry: true, notifyOnInterest: true };
    }
    const parsed = JSON.parse(row.value) as Record<string, unknown>;
    return {
      email: (parsed["adminEmail"] as string) || DEFAULT_ADMIN_EMAIL,
      notifyOnInquiry: parsed["notifyOnInquiry"] !== false,
      notifyOnInterest: parsed["notifyOnInterest"] !== false,
    };
  } catch {
    return { email: DEFAULT_ADMIN_EMAIL, notifyOnInquiry: true, notifyOnInterest: true };
  }
}

function badge(text: string, color: string) {
  return `<span style="background:${color};color:#fff;padding:2px 10px;border-radius:20px;font-size:12px;font-weight:700;letter-spacing:.5px;">${text}</span>`;
}

function emailWrapper(title: string, body: string): string {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="margin:0;padding:0;background:#f7f4ef;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">
      <tr><td style="background:#173f35;padding:28px 36px;text-align:center;">
        <p style="margin:0;font-size:11px;letter-spacing:3px;color:#c59b4a;text-transform:uppercase;font-weight:700;">Zafora Holdings</p>
        <h1 style="margin:8px 0 0;color:#fff;font-size:22px;font-weight:700;">${title}</h1>
      </td></tr>
      <tr><td style="padding:36px;">${body}</td></tr>
      <tr><td style="background:#f7f4ef;padding:20px 36px;text-align:center;">
        <p style="margin:0;font-size:12px;color:#8a958f;">This is an automated notification from your Zafora Holdings admin panel.<br>
        <a href="https://zaforaholdings.com/admin" style="color:#173f35;font-weight:600;">Open Admin Panel</a></p>
      </td></tr>
    </table>
  </td></tr>
</table></body></html>`;
}

function row(label: string, value: string | null | undefined) {
  if (!value) return "";
  return `<tr>
    <td style="padding:8px 0;width:140px;vertical-align:top;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#8a958f;">${label}</td>
    <td style="padding:8px 0;font-size:14px;color:#10231f;">${value}</td>
  </tr>`;
}

export async function sendInquiryNotification(lead: {
  fullName: string; organization: string; email: string; phone?: string | null;
  country: string; requestType: string; projectSector?: string | null;
  roleType?: string | null; message: string; budgetFundingNeed?: string | null;
  projectTimeline?: string | null;
}) {
  if (!API_KEY) return;
  const config = await getAdminEmail();
  if (!config.email || !config.notifyOnInquiry) return;

  const resend = getResend();
  const body = `
    <p style="margin:0 0 20px;color:#65736f;font-size:14px;">A new inquiry has been submitted through your website.</p>
    <div style="background:#f7f4ef;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${row("Name", lead.fullName)}
        ${row("Organization", lead.organization)}
        ${row("Email", `<a href="mailto:${lead.email}" style="color:#173f35;">${lead.email}</a>`)}
        ${row("Phone", lead.phone)}
        ${row("Country", lead.country)}
        ${row("Role", lead.roleType)}
        ${row("Request Type", lead.requestType)}
        ${row("Sector", lead.projectSector)}
        ${row("Budget / Need", lead.budgetFundingNeed)}
        ${row("Timeline", lead.projectTimeline)}
      </table>
    </div>
    ${lead.message ? `<div style="background:#f0f7f5;border-left:4px solid #173f35;border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#8a958f;">Message</p>
      <p style="margin:0;font-size:14px;color:#10231f;line-height:1.6;">${lead.message}</p>
    </div>` : ""}
    <div style="text-align:center;">
      <a href="https://zaforaholdings.com/admin" style="display:inline-block;background:#173f35;color:#fff;padding:14px 32px;border-radius:10px;font-weight:700;font-size:14px;text-decoration:none;">View in Admin Panel</a>
    </div>`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: config.email,
    subject: `New Inquiry: ${lead.fullName} (${lead.organization}) — ${lead.requestType}`,
    html: emailWrapper("New Inquiry Received", body),
  });
}

export async function sendInterestNotification(
  interest: {
    fullName: string; organization: string; email: string; phone?: string | null;
    roleType: string; message?: string | null;
  },
  projectName: string,
) {
  if (!API_KEY) return;
  const config = await getAdminEmail();
  if (!config.email || !config.notifyOnInterest) return;

  const resend = getResend();
  const body = `
    <p style="margin:0 0 20px;color:#65736f;font-size:14px;">Someone has expressed interest in one of your pipeline projects.</p>
    <div style="background:#f7f4ef;border-radius:12px;padding:16px 24px;margin-bottom:20px;">
      <p style="margin:0 0 4px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#8a958f;">Project</p>
      <p style="margin:0;font-size:16px;font-weight:700;color:#173f35;">${projectName}</p>
    </div>
    <div style="background:#f7f4ef;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${row("Name", interest.fullName)}
        ${row("Organization", interest.organization)}
        ${row("Email", `<a href="mailto:${interest.email}" style="color:#173f35;">${interest.email}</a>`)}
        ${row("Phone", interest.phone)}
        ${row("Role", interest.roleType)}
      </table>
    </div>
    ${interest.message ? `<div style="background:#f0f7f5;border-left:4px solid #173f35;border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#8a958f;">Message</p>
      <p style="margin:0;font-size:14px;color:#10231f;line-height:1.6;">${interest.message}</p>
    </div>` : ""}
    <div style="text-align:center;">
      <a href="https://zaforaholdings.com/admin" style="display:inline-block;background:#173f35;color:#fff;padding:14px 32px;border-radius:10px;font-weight:700;font-size:14px;text-decoration:none;">View in Admin Panel</a>
    </div>`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: config.email,
    subject: `New Interest: ${interest.fullName} (${interest.organization}) — ${projectName}`,
    html: emailWrapper("New Project Interest", body),
  });
}

export async function sendTestEmail(toEmail: string): Promise<{ ok: boolean; error?: string }> {
  if (!API_KEY) return { ok: false, error: "RESEND_API_KEY is not configured." };
  try {
    const resend = getResend();
    const body = `
      <p style="margin:0 0 20px;color:#65736f;font-size:14px;">Your email notifications are working correctly.</p>
      <div style="text-align:center;">
        <a href="https://zaforaholdings.com/admin" style="display:inline-block;background:#173f35;color:#fff;padding:14px 32px;border-radius:10px;font-weight:700;font-size:14px;text-decoration:none;">Open Admin Panel</a>
      </div>`;
    await resend.emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      subject: "Test Notification — Zafora Admin",
      html: emailWrapper("Email Notifications Active", body),
    });
    return { ok: true };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { ok: false, error: message };
  }
}
