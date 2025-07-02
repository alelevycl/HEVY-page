export interface FormData {
  name: string;
  whyHeavy: string;
  attachment: File | null;
}

export interface UploadResponse {
  message: string;
  driveLink?: string;
}

export interface GoogleDriveUploadResult {
  fileId: string;
  webViewLink: string | null;
}

export interface FormspreeData {
  name: string;
  whyHeavy: string;
  driveLink?: string;
} 