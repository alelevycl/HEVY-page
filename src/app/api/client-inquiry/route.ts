import { NextRequest, NextResponse } from 'next/server';
import { ClientInquiryEmailTemplate } from '@/app/components/ClientInquiryEmailTemplate';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { companyName, contactPerson, clientEmail, clientPhone, projectDescription } = await req.json();

    const { data, error } = await resend.emails.send({
      from: 'HEVY Client Inquiry <onboarding@resend.dev>',
      to: ['ale@iamhevy.com'],
      subject: `New Client Inquiry from ${companyName}`,
      react: ClientInquiryEmailTemplate({ 
        companyName, 
        contactPerson, 
        clientEmail, 
        clientPhone, 
        projectDescription 
      }),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}