import { NextResponse } from 'next/server';
import { dbService } from '@/lib/dbService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, subject, message } = body;

    if (!name || !phone || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // 1. Save to database
    const savedMessage = await dbService.saveContactMessage({
      customer_name: name,
      customer_phone: phone,
      customer_email: email,
      subject,
      customer_message: message,
    });

    // 2. Send emails
    const resendApiKey = process.env.RESEND_API_KEY;
    const submittedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // Admin Email HTML
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 12px; background-color: #fcfcfc;">
        <h2 style="color: #1e3f20; border-bottom: 2px solid #1e3f20; padding-bottom: 10px; margin-top: 0;">New Contact Form Submission - Mana Inti Farms</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr>
            <td style="padding: 6px 0; font-weight: bold; color: #555; width: 120px;">Name:</td>
            <td style="padding: 6px 0; color: #222;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; color: #555;">Phone:</td>
            <td style="padding: 6px 0; color: #222;">+91 ${phone}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; color: #555;">Email:</td>
            <td style="padding: 6px 0; color: #222;"><a href="mailto:${email}" style="color: #ff6f00; text-decoration: none;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; color: #555;">Subject:</td>
            <td style="padding: 6px 0; color: #222; font-weight: 500;">${subject}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; color: #555;">Submitted At:</td>
            <td style="padding: 6px 0; color: #222; font-size: 13px;">${submittedAt}</td>
          </tr>
        </table>
        <div style="margin-top: 20px; padding: 15px; border-radius: 8px; background-color: #f5ebd6; border: 1px solid #e1ebd5;">
          <h4 style="margin: 0 0 8px 0; color: #1e3f20; font-size: 14px;">Message:</h4>
          <p style="margin: 0; font-size: 14px; color: #2d2b28; line-height: 1.5; white-space: pre-wrap;">${message}</p>
        </div>
      </div>
    `;

    // Customer Confirmation Email HTML
    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 12px; background-color: #ffffff; color: #2d2b28;">
        <div style="text-align: center; border-bottom: 1px solid #f0f0f0; padding-bottom: 15px; mb-20px;">
          <h2 style="color: #1e3f20; margin: 0; font-size: 24px;">Mana Inti Farms</h2>
          <span style="font-size: 11px; color: #ff6f00; letter-spacing: 2px; font-weight: bold; text-transform: uppercase;">Organic & Free Range</span>
        </div>
        <p style="font-size: 15px; line-height: 1.6; margin-top: 20px;">Dear ${name},</p>
        <p style="font-size: 14px; line-height: 1.6;">Thank you for contacting Mana Inti Farms. We have successfully received your message.</p>
        <p style="font-size: 14px; line-height: 1.6;">Our team will review your inquiry and contact you shortly.</p>
        <p style="font-size: 14px; line-height: 1.6; padding: 12px; background-color: #fdfbf7; border-left: 3px solid #ff6f00; border-radius: 4px; margin-top: 20px;">
          If your enquiry is urgent, please call or WhatsApp us directly at:<br/>
          <strong>Phone: <a href="tel:+917981544848" style="color: #1e3f20; text-decoration: none;">+91 7981544848</a></strong>
        </p>
        <div style="margin-top: 30px; border-top: 1px solid #f0f0f0; padding-top: 15px; font-size: 13px; color: #777;">
          Regards,<br/>
          <strong>Mana Inti Farms Team</strong><br/>
          <span style="font-size: 11px;">Bowrampet, Hyderabad, Telangana</span>
        </div>
      </div>
    `;

    if (resendApiKey) {
      try {
        // Send to Admin
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: 'Mana Inti Farms <onboarding@resend.dev>',
            to: 'sampyadav12@gmail.com',
            subject: 'New Contact Form Submission - Mana Inti Farms',
            html: adminEmailHtml,
          }),
        });

        // Send to Customer
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: 'Mana Inti Farms <onboarding@resend.dev>',
            to: email,
            subject: 'Thank You for Contacting Mana Inti Farms',
            html: customerEmailHtml,
          }),
        });
        
        console.log('Emails sent successfully via Resend API.');
      } catch (emailErr) {
        console.error('Error sending emails via Resend:', emailErr);
      }
    } else {
      console.log('\n==================================================');
      console.log('📬 --- MOCK EMAIL DISPATCH (No RESEND_API_KEY) ---');
      console.log('To: sampyadav12@gmail.com');
      console.log('Subject: New Contact Form Submission - Mana Inti Farms');
      console.log('--------------------------------------------------');
      console.log(`Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nSubject: ${subject}\nMessage:\n${message}`);
      console.log('==================================================');
      console.log('📬 --- CUSTOMER CONFIRMATION EMAIL ---');
      console.log(`To: ${email}`);
      console.log('Subject: Thank You for Contacting Mana Inti Farms');
      console.log('--------------------------------------------------');
      console.log(`Dear ${name},\nThank you for contacting Mana Inti Farms...\nPhone: +91 7981544848`);
      console.log('==================================================\n');
    }

    return NextResponse.json({ success: true, message: savedMessage });
  } catch (error: any) {
    console.error('Error in contact API:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
