import { Resend } from 'resend'

const FROM  = process.env.FROM_EMAIL ?? 'noreply@joshtvr.com'
const TO_ME = 'josh@joshtvr.com'

function client() {
  return new Resend(process.env.RESEND_API_KEY)
}

export async function sendNewInquiryNotification(data: {
  name: string
  email: string
  message: string
  budget: string | null
  serviceTitle?: string | null
}) {
  if (!process.env.RESEND_API_KEY) return
  const resend = client()
  await resend.emails.send({
    from:    FROM,
    to:      TO_ME,
    subject: `New inquiry from ${data.name}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:#7c3aed;margin-bottom:4px">New Inquiry</h2>
        <p style="color:#888;font-size:14px;margin-bottom:24px">${new Date().toLocaleString('en-US')}</p>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#888;font-size:13px;width:100px">Name</td><td style="padding:8px 0;font-weight:600">${data.name}</td></tr>
          <tr><td style="padding:8px 0;color:#888;font-size:13px">Email</td><td style="padding:8px 0"><a href="mailto:${data.email}" style="color:#7c3aed">${data.email}</a></td></tr>
          ${data.serviceTitle ? `<tr><td style="padding:8px 0;color:#888;font-size:13px">Service</td><td style="padding:8px 0">${data.serviceTitle}</td></tr>` : ''}
          ${data.budget ? `<tr><td style="padding:8px 0;color:#888;font-size:13px">Budget</td><td style="padding:8px 0">${data.budget}</td></tr>` : ''}
        </table>
        <div style="margin-top:20px;padding:16px;background:#f9f9f9;border-radius:8px;border-left:3px solid #7c3aed">
          <p style="color:#333;line-height:1.6;white-space:pre-wrap;margin:0">${data.message}</p>
        </div>
        <a href="https://joshtvr.com/admin/inquiries" style="display:inline-block;margin-top:24px;padding:12px 24px;background:#7c3aed;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">
          View in Admin →
        </a>
      </div>
    `,
  })
}

export async function sendInquiryConfirmation(data: {
  toEmail: string
  toName: string
}) {
  if (!process.env.RESEND_API_KEY) return
  const resend = client()
  await resend.emails.send({
    from:    FROM,
    to:      data.toEmail,
    subject: 'Got your message — JoshTVR',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:#7c3aed">Hey ${data.toName},</h2>
        <p style="color:#444;line-height:1.7">
          Thanks for reaching out! I've received your message and will get back to you as soon as possible — usually within 24–48 hours.
        </p>
        <p style="color:#444;line-height:1.7">
          In the meantime, feel free to check out my portfolio at <a href="https://joshtvr.com" style="color:#7c3aed">joshtvr.com</a>.
        </p>
        <p style="color:#888;font-size:13px;margin-top:32px">— Joshua Hernandez / JoshTVR</p>
      </div>
    `,
  })
}

export async function sendTestimonialRequest(data: {
  toEmail: string
  toName: string
  inquiryId: string
}) {
  if (!process.env.RESEND_API_KEY) return
  const resend = client()
  await resend.emails.send({
    from:    FROM,
    to:      data.toEmail,
    subject: 'How did it go? — JoshTVR',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:#7c3aed">Hey ${data.toName},</h2>
        <p style="color:#444;line-height:1.7">
          I'm glad we got to work together! If you have a moment, I'd really appreciate a short testimonial about your experience.
        </p>
        <p style="color:#444;line-height:1.7">
          It only takes a minute and helps other clients know what to expect.
        </p>
        <a href="https://joshtvr.com/en/services/track/${data.inquiryId}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#7c3aed;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">
          Leave a Testimonial →
        </a>
        <p style="color:#888;font-size:13px;margin-top:32px">— Joshua Hernandez / JoshTVR</p>
      </div>
    `,
  })
}
