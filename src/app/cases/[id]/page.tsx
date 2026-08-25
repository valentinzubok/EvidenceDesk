import { CasesView } from "@/components/CasesView";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CaseDetailPage({ params }: Props) {
  const { id } = await params;
  return <CasesView initialCaseId={decodeURIComponent(id)} />;
}
