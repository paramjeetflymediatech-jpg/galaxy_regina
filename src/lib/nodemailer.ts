import nodemailer from 'nodemailer';

/**
 * Parses dynamic recipient email addresses from environment variables.
 * Supports comma-separated or space-separated lists in RECIPIENT_EMAILS or SMTP_TO_EMAIL.
 * e.g. RECIPIENT_EMAILS="info@example.com, sales@example.com, manager@example.com"
 */
export function getRecipientEmails(): string[] {
  const rawEmails = process.env.RECIPIENT_EMAILS || process.env.SMTP_TO_EMAIL || process.env.SMTP_USER || '';
  if (!rawEmails) {
    console.warn('[Nodemailer] Warning: No recipient email address found in environment variables (RECIPIENT_EMAILS / SMTP_TO_EMAIL / SMTP_USER).');
    return [];
  }

  return rawEmails
    .split(/[,;\s]+/)
    .map(email => email.trim())
    .filter(email => email.length > 0 && email.includes('@'));
}

/**
 * Creates Nodemailer Transporter instance from environment variables.
 */
export function createTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user && pass ? { user, pass } : undefined,
  });
}

export interface QuoteEmailData {
  full_name: string;
  email?: string;
  mobile?: string;
  move_type?: string;
  pickup_address?: string;
  dropoff_address?: string;
  moving_date?: string;
  comments?: string;
}

export interface ContactEmailData {
  name: string;
  email?: string;
  mobile?: string;
  message?: string;
}

/**
 * Sends quote submission notification email to all dynamic recipients.
 */
export async function sendQuoteNotificationEmail(data: QuoteEmailData) {
  const recipients = getRecipientEmails();
  if (recipients.length === 0) {
    console.warn('[Nodemailer] Skipping sending quote email because no recipient emails are configured.');
    return { success: false, message: 'No recipient emails configured' };
  }

  const transporter = createTransporter();
  const fromName = process.env.SMTP_FROM_NAME || 'Galaxy Movers Regina';
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || 'no-reply@galaxymovers.ca';
  const fromAddress = `"${fromName}" <${fromEmail}>`;

  const subject = `🚚 New Quote Request from ${data.full_name}`;

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 30px 15px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
        <div style="background-color: #C61818; padding: 24px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 1px;">New Moving Quote Request</h1>
          <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.9;">Submitted via Galaxy Movers Website</p>
        </div>
        
        <div style="padding: 24px;">
          <h2 style="color: #333333; font-size: 18px; border-bottom: 2px solid #f0f0f0; padding-bottom: 8px; margin-top: 0;">Customer Details</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555555; width: 140px;">Full Name:</td>
              <td style="padding: 8px 0; color: #222222;">${data.full_name || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555555;">Email:</td>
              <td style="padding: 8px 0; color: #222222;"><a href="mailto:${data.email || ''}" style="color: #C61818; text-decoration: none;">${data.email || 'N/A'}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555555;">Mobile:</td>
              <td style="padding: 8px 0; color: #222222;"><a href="tel:${data.mobile || ''}" style="color: #C61818; text-decoration: none;">${data.mobile || 'N/A'}</a></td>
            </tr>
          </table>

          <h2 style="color: #333333; font-size: 18px; border-bottom: 2px solid #f0f0f0; padding-bottom: 8px;">Moving Information</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555555; width: 140px;">Move Type:</td>
              <td style="padding: 8px 0; color: #222222;">${data.move_type || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555555;">Pickup Address:</td>
              <td style="padding: 8px 0; color: #222222;">${data.pickup_address || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555555;">Drop-off Address:</td>
              <td style="padding: 8px 0; color: #222222;">${data.dropoff_address || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555555;">Moving Date:</td>
              <td style="padding: 8px 0; color: #222222; font-weight: bold; color: #C61818;">${data.moving_date || 'N/A'}</td>
            </tr>
          </table>

          ${data.comments ? `
          <h2 style="color: #333333; font-size: 18px; border-bottom: 2px solid #f0f0f0; padding-bottom: 8px;">Comments / Notes</h2>
          <div style="background-color: #f8f9fa; border-left: 4px solid #C61818; padding: 12px 16px; margin-bottom: 20px; white-space: pre-wrap; color: #333333; font-size: 14px;">
            ${data.comments}
          </div>
          ` : ''}
        </div>

        <div style="background-color: #f0f3f6; padding: 15px; text-align: center; color: #777777; font-size: 12px;">
          Sent automatically by <strong>Galaxy Movers Regina Notification System</strong>
        </div>
      </div>
    </div>
  `;

  const textBody = `
NEW MOVING QUOTE REQUEST
------------------------
Full Name: ${data.full_name}
Email: ${data.email || 'N/A'}
Mobile: ${data.mobile || 'N/A'}
Move Type: ${data.move_type || 'N/A'}
Pickup Address: ${data.pickup_address || 'N/A'}
Drop-off Address: ${data.dropoff_address || 'N/A'}
Moving Date: ${data.moving_date || 'N/A'}
Comments: ${data.comments || 'None'}
  `.trim();

  try {
    const info = await transporter.sendMail({
      from: fromAddress,
      to: recipients,
      subject,
      text: textBody,
      html: htmlBody,
      replyTo: data.email || undefined,
    });
    console.log('[Nodemailer] Quote notification email sent successfully:', info.messageId, 'to recipients:', recipients);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('[Nodemailer] Failed to send quote email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Sends contact form submission notification email to all dynamic recipients.
 */
export async function sendContactNotificationEmail(data: ContactEmailData) {
  const recipients = getRecipientEmails();
  if (recipients.length === 0) {
    console.warn('[Nodemailer] Skipping sending contact email because no recipient emails are configured.');
    return { success: false, message: 'No recipient emails configured' };
  }

  const transporter = createTransporter();
  const fromName = process.env.SMTP_FROM_NAME || 'Galaxy Movers Regina';
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || 'no-reply@galaxymovers.ca';
  const fromAddress = `"${fromName}" <${fromEmail}>`;

  const subject = `📩 New Contact Form Submission from ${data.name}`;

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 30px 15px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
        <div style="background-color: #06056C; padding: 24px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 1px;">New Contact Message</h1>
          <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.9;">Submitted via Galaxy Movers Contact Form</p>
        </div>
        
        <div style="padding: 24px;">
          <h2 style="color: #333333; font-size: 18px; border-bottom: 2px solid #f0f0f0; padding-bottom: 8px; margin-top: 0;">Contact Details</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555555; width: 140px;">Name:</td>
              <td style="padding: 8px 0; color: #222222;">${data.name || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555555;">Email:</td>
              <td style="padding: 8px 0; color: #222222;"><a href="mailto:${data.email || ''}" style="color: #06056C; text-decoration: none;">${data.email || 'N/A'}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555555;">Mobile No:</td>
              <td style="padding: 8px 0; color: #222222;"><a href="tel:${data.mobile || ''}" style="color: #06056C; text-decoration: none;">${data.mobile || 'N/A'}</a></td>
            </tr>
          </table>

          ${data.message ? `
          <h2 style="color: #333333; font-size: 18px; border-bottom: 2px solid #f0f0f0; padding-bottom: 8px;">Message</h2>
          <div style="background-color: #f8f9fa; border-left: 4px solid #06056C; padding: 12px 16px; margin-bottom: 20px; white-space: pre-wrap; color: #333333; font-size: 14px;">
            ${data.message}
          </div>
          ` : ''}
        </div>

        <div style="background-color: #f0f3f6; padding: 15px; text-align: center; color: #777777; font-size: 12px;">
          Sent automatically by <strong>Galaxy Movers Regina Notification System</strong>
        </div>
      </div>
    </div>
  `;

  const textBody = `
NEW CONTACT FORM SUBMISSION
---------------------------
Name: ${data.name}
Email: ${data.email || 'N/A'}
Mobile: ${data.mobile || 'N/A'}
Message: ${data.message || 'None'}
  `.trim();

  try {
    const info = await transporter.sendMail({
      from: fromAddress,
      to: recipients,
      subject,
      text: textBody,
      html: htmlBody,
      replyTo: data.email || undefined,
    });
    console.log('[Nodemailer] Contact notification email sent successfully:', info.messageId, 'to recipients:', recipients);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('[Nodemailer] Failed to send contact email:', error);
    return { success: false, error: error.message };
  }
}
