import { Suspense } from "react";
import { Spinner } from "@/components/ui";
import CriteriaPageContent from "./CriteriaPageContent";

export default function CriteriaPage() {
  return (
    <Suspense fallback={<Spinner label="Loading…" />}>
      <CriteriaPageContent />
    </Suspense>
  );
}
