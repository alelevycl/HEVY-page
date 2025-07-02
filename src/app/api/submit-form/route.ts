import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

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
      body: require('fs').createReadStream(filePath),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id,webViewLink',
    });

    return {
      fileId: response.data.id,
      webViewLink: response.data.webViewLink,
    };
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    throw new Error('Error al subir archivo a Google Drive');
  }
}

// Función para enviar email a través de Formspree
async function sendEmailToFormspree(data: {
  name: string;
  whyHeavy: string;
  driveLink?: string;
}) {
  try {
    const emailData = {
      name: data.name,
      whyHeavy: data.whyHeavy,
      driveLink: data.driveLink || 'No se adjuntó archivo',
    };

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
    const name = formData.get('name') as string;
    const whyHeavy = formData.get('whyHeavy') as string;
    const attachment = formData.get('attachment') as File | null;

    if (!name || !whyHeavy) {
      return NextResponse.json(
        { error: 'Nombre y descripción son requeridos' },
        { status: 400 }
      );
    }

    let driveLink: string | undefined;

    // Si hay un archivo adjunto, subirlo a Google Drive
    if (attachment) {
      const bytes = await attachment.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Guardar archivo temporalmente
      const tempFilePath = join(tmpdir(), attachment.name);
      await writeFile(tempFilePath, buffer);

      try {
        // Subir a Google Drive
        const uploadResult = await uploadToGoogleDrive(tempFilePath, attachment.name);
        driveLink = uploadResult.webViewLink || undefined;

        // Limpiar archivo temporal
        await unlink(tempFilePath);
      } catch (error) {
        // Limpiar archivo temporal en caso de error
        try {
          await unlink(tempFilePath);
        } catch (cleanupError) {
          console.error('Error cleaning up temp file:', cleanupError);
        }
        throw error;
      }
    }

    // Enviar email a través de Formspree
    await sendEmailToFormspree({
      name,
      whyHeavy,
      driveLink: driveLink || undefined,
    });

    return NextResponse.json(
      { 
        message: 'Formulario enviado exitosamente',
        driveLink 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing form:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 