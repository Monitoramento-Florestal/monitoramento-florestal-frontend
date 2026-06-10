import { ApprovalsPageContent } from "@/components/features/approvals/ApprovalsPageContent";

export default function ResearcherApprovalsPage() {
  return (
    <ApprovalsPageContent
      title="Minhas solicitações"
      canReview={false}
      scope="mine"
      readOnlyReason="Acompanhe aqui o status das solicitações enviadas para análise da gestão."
    />
  );
}
