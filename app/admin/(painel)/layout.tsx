import type { Metadata } from "next";
import type { ReactNode } from "react";
import { logout } from "@/app/admin/actions";
import { AdminTabs } from "@/components/admin/forms";
import { Stage } from "@/components/Section";
import { requireAdmin } from "@/lib/admin-auth";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();
  return (
    <main>
      <Stage className="pt-10 md:pt-14">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
          <div className="flex items-center gap-5">
            <span className="font-mono text-sm text-accent-ink">~/puctech/admin</span>
            <AdminTabs />
          </div>
          <form action={logout}>
            <button type="submit" className="font-mono text-sm text-muted underline underline-offset-4 hover:text-ink">
              sair
            </button>
          </form>
        </div>
      </Stage>
      <Stage className="pt-12 pb-20 md:pt-16 md:pb-28">{children}</Stage>
    </main>
  );
}
