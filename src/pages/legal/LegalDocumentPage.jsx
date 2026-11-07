import LegalDocument from "../../components/legal/LegalDocument.js";
import { LEGAL_DATE_LABEL, LEGAL_VERSION, legalDocuments } from "../../content/legalDocuments.js";
import "../../styles/legal.css";

export default function LegalDocumentPage({ documentKey }) {
  const policy = legalDocuments.find((item) => item.key === documentKey);
  if (!policy) throw new Error("Documento legale non configurato.");

  return (
    <LegalDocument
      policy={policy}
      policies={legalDocuments}
      version={LEGAL_VERSION}
      dateLabel={LEGAL_DATE_LABEL}
    />
  );
}
