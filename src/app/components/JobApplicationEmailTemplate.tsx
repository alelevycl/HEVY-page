interface JobApplicationEmailTemplateProps {
  name: string;
  howHeavy: string;
  hasAttachment: boolean;
  fileName?: string;
}

export function JobApplicationEmailTemplate({
                                              name,
                                              howHeavy,
                                              hasAttachment,
                                              fileName,
                                            }: JobApplicationEmailTemplateProps) {
  return (
    <div>
      <h1>New Job Application - HEVY Team</h1>
      <p><strong>Applicant Name:</strong> {name}</p>
      <p><strong>Why they are HEVY:</strong></p>
      <p style={{whiteSpace: 'pre-wrap'}}>{howHeavy}</p>
      {hasAttachment && (
        <p><strong>CV Attached:</strong> {fileName || 'Yes'}</p>
      )}
    </div>
  );
}