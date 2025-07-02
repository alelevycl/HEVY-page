import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import fs from 'fs';

// Configuración de Google Drive API
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID; // ID de la carpeta en Google Drive

// Configuración de Formspree
const FORMSPREE_ENDPOINT = process.env.FORMSPREE_ENDPOINT; // Tu endpoint de Formspree

// Función para autenticar con Google Drive
async function getGoogleDriveAuth() {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS, // Ruta al archivo de credenciales
    scopes: SCOPES,
  });
  return auth;
}

// Función para subir archivo a Google Drive
async function uploadToGoogleDrive(filePath: string, fileName: string) {
  try {
    const auth = await getGoogleDriveAuth();
    const drive = google.drive({ version: 'v3', auth });

    const fileMetadata = {
      name: fileName,
      parents: [FOLDER_ID!],
    };

    const media = {
      mimeType: 'application/octet-stream',
      body: fs.createReadStream(filePath),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id,webViewLink',
    });

    return {
      fileId: response.data.id,
      webViewLink: response.data.webViewLink || undefined,
    };
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    throw new Error('Error al subir archivo a Google Drive');
  }
}

// Función para enviar email a través de Formspree
async function sendEmailToFormspree(data: {
  type: 'cv' | 'client';
  name?: string;
  howHeavy?: string;
  companyName?: string;
  contactPerson?: string;
  clientEmail?: string;
  clientPhone?: string;
  projectDescription?: string;
  driveLink?: string;
}) {
  try {
    let emailData: Record<string, string> = {};

    if (data.type === 'cv') {
      emailData = {
        type: 'CV Application',
        name: data.name || '',
        howHeavy: data.howHeavy || '',
        driveLink: data.driveLink || 'No CV attached',
      };
    } else {
      emailData = {
        type: 'Client Application',
        companyName: data.companyName || '',
        contactPerson: data.contactPerson || '',
        clientEmail: data.clientEmail || '',
        clientPhone: data.clientPhone || 'Not provided',
        projectDescription: data.projectDescription || '',
      };
    }

    const response = await fetch(FORMSPREE_ENDPOINT!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      throw new Error('Error al enviar email');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error al enviar email');
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Determine form type based on fields present
    const hasCvFile = formData.has('cvFile');
    const hasCompanyName = formData.has('companyName');
    
    let driveLink: string | undefined;

    if (hasCvFile) {
      // CV Application Form
      const name = formData.get('name') as string;
      const howHeavy = formData.get('howHeavy') as string;
      const cvFile = formData.get('cvFile') as File;

      if (!name || !howHeavy || !cvFile) {
        return NextResponse.json(
          { error: 'Name, howHeavy, and CV file are required' },
          { status: 400 }
        );
      }

      // Validate file type
      if (cvFile.type !== 'application/pdf') {
        return NextResponse.json(
          { error: 'Only PDF files are allowed' },
          { status: 400 }
        );
      }

      // Upload CV to Google Drive
      const bytes = await cvFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const tempFilePath = join(tmpdir(), cvFile.name);
      await writeFile(tempFilePath, buffer);

      try {
        const uploadResult = await uploadToGoogleDrive(tempFilePath, cvFile.name);
        driveLink = uploadResult.webViewLink;

        await unlink(tempFilePath);
      } catch (error) {
        try {
          await unlink(tempFilePath);
        } catch (cleanupError) {
          console.error('Error cleaning up temp file:', cleanupError);
        }
        throw error;
      }

      // Send email for CV application
      await sendEmailToFormspree({
        type: 'cv',
        name,
        howHeavy,
        driveLink,
      });

      return NextResponse.json(
        { 
          message: 'CV sent successfully! We will contact you soon.',
          driveLink 
        },
        { status: 200 }
      );

    } else if (hasCompanyName) {
      // Client Application Form
      const companyName = formData.get('companyName') as string;
      const contactPerson = formData.get('contactPerson') as string;
      const clientEmail = formData.get('clientEmail') as string;
      const clientPhone = formData.get('clientPhone') as string;
      const projectDescription = formData.get('projectDescription') as string;

      if (!companyName || !contactPerson || !clientEmail || !projectDescription) {
        return NextResponse.json(
          { error: 'Company name, contact person, email, and project description are required' },
          { status: 400 }
        );
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(clientEmail)) {
        return NextResponse.json(
          { error: 'Please enter a valid email address' },
          { status: 400 }
        );
      }

      // Send email for client application
      await sendEmailToFormspree({
        type: 'client',
        companyName,
        contactPerson,
        clientEmail,
        clientPhone,
        projectDescription,
      });

      return NextResponse.json(
        { 
          message: 'Application sent successfully! We will contact you soon.'
        },
        { status: 200 }
      );

    } else {
      return NextResponse.json(
        { error: 'Invalid form data' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error processing form:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 