import type { ReactNode } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

/** Standard inner-page wrapper: fixed header, padded content, shared footer. */
export default function PageShell({
  children,
  max = "max-w-4xl",
}: {
  children: ReactNode;
  max?: string;
}) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#f4efe4] px-6 pb-24 pt-32 text-[#201810] md:px-10">
        <div className={`mx-auto ${max}`}>{children}</div>
      </main>
      <SiteFooter />
    </>
  );
}
