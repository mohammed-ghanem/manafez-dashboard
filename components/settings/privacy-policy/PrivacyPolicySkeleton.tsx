import { Skeleton } from "@/components/ui/skeleton";

/* ================= Title ================= */
export function PrivacyPolicyTitleSkeleton() {
  return <Skeleton className="h-8 w-64 bg-amber-400" />;
}

/* ================= Editor ================= */
export function PrivacyPolicyEditorSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-5 w-48 bg-amber-400" />
      <Skeleton className="h-10 w-full bg-amber-400" />
      <Skeleton className="h-64 w-full bg-amber-400" />
    </div>
  );
}

/* ================= Button ================= */
export function PrivacyPolicyButtonSkeleton() {
  return <Skeleton className="h-10 w-32 rounded-lg" />;
}

/* ================= Page ================= */
export default function PrivacyPolicyPageSkeleton() {
  return (
    <div className="p-6 mx-4 my-10 space-y-6 bg-white rounded-2xl border border-solid border-[#ddd]">
      <PrivacyPolicyTitleSkeleton />
      <PrivacyPolicyEditorSkeleton />
      <PrivacyPolicyEditorSkeleton />
      <PrivacyPolicyButtonSkeleton />
    </div>
  );
}
