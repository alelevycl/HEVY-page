'use client';

interface UploadProgressProps {
  isUploading: boolean;
  progress: number;
  fileName?: string;
}

export default function UploadProgress({ isUploading, progress, fileName }: UploadProgressProps) {
  if (!isUploading) return null;

  return (
    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
      <div className="flex items-center space-x-3">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        <div className="flex-1">
          <p className="text-sm font-medium text-blue-900">
            Subiendo archivo...
          </p>
          {fileName && (
            <p className="text-xs text-blue-700">{fileName}</p>
          )}
          <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
} 