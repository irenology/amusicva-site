import emailjs from '@emailjs/browser';

// ─── EmailJS Setup ────────────────────────────────────────────
// 1. Create a free account at https://www.emailjs.com
// 2. Email Services → Add Service → Gmail → connect appassionatava@gmail.com
//    Copy the Service ID it generates.
// 3. Email Templates → Create New Template.
//    In the template body use: {{subject}}, {{from_name}}, {{from_email}}, {{message}}
//    Set the "To Email" field to: appassionatava@gmail.com
//    Copy the Template ID.
// 4. Account → API Keys → copy the Public Key.
// Replace the three placeholder strings below with your real values.
export const EMAILJS_SERVICE_ID  = 'service_2q25cjh';
export const EMAILJS_TEMPLATE_ID = 'xvm0xzm';
export const EMAILJS_PUBLIC_KEY  = 'pKbo0ztm-LqP9bSc_';

export async function sendEmail(params: {
  fromName: string;
  fromEmail: string;
  subject: string;
  message: string;
}) {
  return emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    {
      to_email:   'appassionatava@gmail.com',
      from_name:  params.fromName,
      from_email: params.fromEmail,
      reply_to:   params.fromEmail,
      subject:    params.subject,
      message:    params.message,
    },
    EMAILJS_PUBLIC_KEY,
  );
}
