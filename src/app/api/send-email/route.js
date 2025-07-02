import { Resend } from 'resend';

export async function POST(request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const formData = await request.formData();
    const formType = formData.get('formType');
    let subject = '';
    let html = '';
    let attachments = [];

    if (formType === 'applicationForm') {
      // Formulario con archivo adjunto
      const name = formData.get('name');
      const howHeavy = formData.get('howHeavy');
      const file = formData.get('attachment');
      let fileAttachment = undefined;
      if (file) {
        const arrayBuffer = await file.arrayBuffer();
        fileAttachment = {
          filename: file.name,
          content: Buffer.from(arrayBuffer),
        };
        attachments.push(fileAttachment);
      }
      subject = 'New Application Form Submission';
      html = `<h2>Application Form</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Why HEVY:</b> ${howHeavy}</p>
        <p><b>Attachment:</b> ${file ? file.name : 'No file attached'}</p>`;
    } else if (formType === 'contactForm') {
      // Formulario de contacto sin archivo
      const companyName = formData.get('companyName');
      const contactPerson = formData.get('contactPerson');
      const clientEmail = formData.get('clientEmail');
      const clientPhone = formData.get('clientPhone');
      const projectDescription = formData.get('projectDescription');
      subject = 'New Contact Form Submission';
      html = `<h2>Contact Form</h2>
        <p><b>Company Name:</b> ${companyName}</p>
        <p><b>Contact Person:</b> ${contactPerson}</p>
        <p><b>Email:</b> ${clientEmail}</p>
        <p><b>Phone:</b> ${clientPhone}</p>
        <p><b>Project Description:</b> ${projectDescription}</p>`;
    } else {
      return new Response(JSON.stringify({ error: 'Invalid form type' }), { status: 400 });
    }

    const emailOptions = {
      from: 'noreply@hevy.com',
      to: 'ale@iamhevy.com',
      subject,
      html,
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    await resend.emails.send(emailOptions);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
} 