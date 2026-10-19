import nodemailer from "nodemailer";

// Lazy transporter initialization
let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const service = process.env.EMAIL_SERVICE; // e.g. 'gmail'

  if (service && user && pass) {
    transporter = nodemailer.createTransport({
      service,
      auth: { user, pass },
    });
  } else if (host && user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  return transporter;
}

/**
 * Send inquiry notification email to student@vidyascope.com
 * @param {Object} inquiryData
 */
export async function sendInquiryNotificationEmail(inquiryData) {
  const recipient = process.env.STUDENT_NOTIFICATION_EMAIL || "student@vidyascope.com";
  const {
    studentName,
    phone,
    email,
    stream,
    targetScore,
    preferredLocation,
    budgetRange,
    admissionYear,
    collegeName,
    source,
    notes,
  } = inquiryData;

  const sourceLabel =
    source === "counseling_page"
      ? "Counseling Page Form"
      : source === "brochure_download"
      ? "Brochure Request"
      : source === "get_free_advice"
      ? "Get Free Advice Banner"
      : source === "request_call_back"
      ? "Request Call Back Button"
      : "Student Inquiry / Counseling Desk";

  const subject = `🎓 New Student Lead: ${studentName || "Prospective Student"} (${phone || "No Phone"}) - ${sourceLabel}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .header { background: #1e1b4b; padding: 24px 32px; color: #ffffff; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.02em; }
        .badge { display: inline-block; background: rgba(147, 51, 234, 0.3); border: 1px solid rgba(168, 85, 247, 0.5); padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #e9d5ff; margin-top: 8px; }
        .content { padding: 28px 32px; }
        .field-group { margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9; }
        .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 4px; }
        .value { font-size: 15px; font-weight: 600; color: #0f172a; }
        .highlight { color: #7c3aed; font-weight: 700; }
        .grid { display: flex; flex-wrap: wrap; gap: 16px; }
        .grid-item { flex: 1 1 45%; }
        .notes-box { background: #faf5ff; border: 1px solid #f3e8ff; border-radius: 12px; padding: 14px; margin-top: 8px; font-size: 13px; color: #581c87; line-height: 1.5; }
        .footer { background: #f8fafc; padding: 16px 32px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; }
        .cta-btn { display: inline-block; background: #7c3aed; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 13px; margin-top: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎓 New Student Admission Inquiry</h1>
          <div class="badge">${sourceLabel}</div>
        </div>
        <div class="content">
          <div class="field-group">
            <div class="label">Student Name</div>
            <div class="value">${studentName || "N/A"}</div>
          </div>

          <div class="field-group grid">
            <div class="grid-item">
              <div class="label">Phone / WhatsApp</div>
              <div class="value"><a href="tel:${phone}" style="color: #7c3aed; text-decoration: none;">📞 ${phone || "N/A"}</a></div>
            </div>
            <div class="grid-item">
              <div class="label">Email Address</div>
              <div class="value"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">✉️ ${email || "Not Provided"}</a></div>
            </div>
          </div>

          <div class="field-group grid">
            <div class="grid-item">
              <div class="label">Target Stream</div>
              <div class="value">${stream || "Engineering"}</div>
            </div>
            <div class="grid-item">
              <div class="label">Admission Session</div>
              <div class="value">${admissionYear || "Upcoming"}</div>
            </div>
          </div>

          ${
            targetScore || budgetRange || preferredLocation
              ? `
            <div class="field-group grid">
              ${targetScore ? `<div class="grid-item"><div class="label">Exam Score / Rank</div><div class="value">${targetScore}</div></div>` : ""}
              ${budgetRange ? `<div class="grid-item"><div class="label">Fee Budget Range</div><div class="value">₹ ${budgetRange}</div></div>` : ""}
              ${preferredLocation ? `<div class="grid-item"><div class="label">Preferred State/City</div><div class="value">${preferredLocation}</div></div>` : ""}
            </div>
          `
              : ""
          }

          ${
            collegeName
              ? `
            <div class="field-group">
              <div class="label">Associated College</div>
              <div class="value highlight">🏛️ ${collegeName}</div>
            </div>
          `
              : ""
          }

          ${
            notes
              ? `
            <div class="field-group">
              <div class="label">Student Message / Query</div>
              <div class="notes-box">&ldquo;${notes}&rdquo;</div>
            </div>
          `
              : ""
          }

          <div style="text-align: center; margin-top: 20px;">
            <a href="tel:${phone}" class="cta-btn">Call Student Now</a>
          </div>
        </div>

        <div class="footer">
          Received via VidyaScope College Platform on ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST.
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const activeTransporter = getTransporter();
    if (activeTransporter) {
      const fromAddress = process.env.SMTP_FROM || `"VidyaScope Inquiries" <${process.env.SMTP_USER || process.env.EMAIL_USER || "student@vidyascope.com"}>`;
      const info = await activeTransporter.sendMail({
        from: fromAddress,
        to: recipient,
        subject,
        html,
      });
      console.log(`[Email Notification] Successfully sent inquiry alert to ${recipient}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } else {
      console.log(
        `[Email Notification Mock] SMTP credentials not set in backend/.env. Simulated dispatch for ${recipient}:\n` +
          `Subject: ${subject}\n` +
          `Student: ${studentName} (${phone}) | Stream: ${stream}\n` +
          `Note: To deliver real emails, add SMTP_USER & SMTP_PASS in backend/.env.`
      );
      return { success: true, simulated: true };
    }
  } catch (error) {
    console.error(`[Email Notification Error] Failed to send email to ${recipient}:`, error.message);
    // Non-blocking error so inquiry submission to database always succeeds
    return { success: false, error: error.message };
  }
}
