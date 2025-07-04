import { NextRequest, NextResponse } from 'next/server';
import { JobApplicationEmailTemplate } from '@/app/components/JobApplicationEmailTemplate';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    const name = formData.get('name') as string;
    const howHeavy = formData.get('howHeavy') as string;
    const cvFile = formData.get('cvFile') as File | null;

    if (!name || !howHeavy) {
      return NextResponse.json({ error: 'Name and howHeavy are required' }, { status: 400 });
    }

    let attachments = [];
    if (cvFile) {
      const bytes = await cvFile.arrayBuffer();
      attachments.push({
        filename: cvFile.name,
        content: Buffer.from(bytes),
      });
    }

    const { data, error } = await resend.emails.send({
      from: 'HEVY Job Application <onboarding@resend.dev>',
      to: ['ale@iamhevy.com'],
      subject: `New Job Application from ${name}`,
      react: JobApplicationEmailTemplate({ 
        name, 
        howHeavy, 
        hasAttachment: !!cvFile,
        fileName: cvFile?.name 
      }),
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}