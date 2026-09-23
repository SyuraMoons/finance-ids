import { Suspense } from "react";
import { DashboardCards, DashboardTop } from "@/components/dashboard/DashboardSections";
import CashBankSection from "@/components/accounting/CashBankSection";
import NeedsAttentionSection from "@/components/accounting/NeedsAttentionSection";
import SectionBoundary from "@/components/accounting/SectionBoundary";
import SectionSkeleton from "@/components/accounting/SectionSkeleton";
import { isCashFlowRange, type CashFlowRange } from "@/lib/accounting-period";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range: rangeParam } = await searchParams;
  const range: CashFlowRange = isCashFlowRange(rangeParam) ? rangeParam : "30d";

  return (
    <>
      <Suspense fallback={<SectionSkeleton className="h-48" />}>
        <DashboardTop />
      </Suspense>

      <div className="mt-4">
        <SectionBoundary title="Needs attention">
          <Suspense fallback={<SectionSkeleton className="h-40" />}>
            <NeedsAttentionSection />
          </Suspense>
        </SectionBoundary>
      </div>

      <div className="mt-4">
        <SectionBoundary title="Cash & Bank">
          <Suspense key={range} fallback={<SectionSkeleton />}>
            <CashBankSection range={range} basePath="/" />
          </Suspense>
        </SectionBoundary>
      </div>

      <Suspense fallback={<SectionSkeleton className="mt-4 h-96" />}>
        <DashboardCards />
      </Suspense>
    </>
  );
}
