interface ClientInquiryEmailTemplateProps {
  companyName: string;
  contactPerson: string;
  clientEmail: string;
  clientPhone?: string;
  projectDescription: string;
}

export function ClientInquiryEmailTemplate({
                                             companyName,
                                             contactPerson,
                                             clientEmail,
                                             clientPhone,
                                             projectDescription,
                                           }: ClientInquiryEmailTemplateProps) {
  return (
    <div>
      <h1>New Client Inquiry - HEVY Services</h1>
      <p><strong>Company Name:</strong> {companyName}</p>
      <p><strong>Contact Person:</strong> {contactPerson}</p>
      <p><strong>Email:</strong> {clientEmail}</p>
      {clientPhone && <p><strong>Phone:</strong> {clientPhone}</p>}
      <p><strong>Project Description:</strong></p>
      <p style={{whiteSpace: 'pre-wrap'}}>{projectDescription}</p>
    </div>
  );
}