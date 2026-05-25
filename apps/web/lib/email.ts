import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

if (!resend) {
  console.warn(
    "⚠️ Warning: RESEND_API_KEY environment variable is missing. Email notifications are disabled."
  );
}

/**
 * Triggers notification emails for new inbox submissions.
 * Automatically falls back to printing safe sandbox console outputs if API keys are missing.
 */
export async function sendContactNotification({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) {
  if (!resend) {
    console.info(
      `📧 Mock Email Dispatch: Submission by ${name} (${email}): "${message}"`
    );
    return { success: true, id: "mock-email-id" };
  }

  try {
    const contactTarget = process.env.CONTACT_EMAIL || "you@yourdomain.com";

    // Dispatches notification to the portfolio owner
    const response = await resend.emails.send({
      from: "Portfolio CMS <onboarding@resend.dev>", // Standard resend sandbox sender, custom domains can be mapped in prod
      to: contactTarget,
      subject: `📩 New Inquiry from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #333; margin-top: 0;">Portfolio Inquiry Received</h2>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; border-left: 4px solid #e8e020; font-style: italic;">
            ${message.replace(/\n/g, "<br/>")}
          </div>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #999;">Received via Moedren Portfolio CMS in real-time.</p>
        </div>
      `,
    });

    if (response.error) {
      console.error("❌ Resend email dispatch failed:", response.error);
      return { success: false, error: response.error };
    }

    return { success: true, data: response.data };
  } catch (error) {
    console.error("❌ Email service exception:", error);
    return { success: false, error };
  }
}
