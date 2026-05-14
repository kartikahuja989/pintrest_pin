import Link from "next/link";
import { BarChart3, CalendarClock, CreditCard, LayoutDashboard, PackagePlus, Settings, Shirt, UploadCloud } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

const nav = [
  ["Dashboard", "/dashboard", LayoutDashboard],
  ["Create Pin", "/create-pin", PackagePlus],
  ["Bulk Generator", "/bulk-generator", UploadCloud],
  ["Outfit Builder", "/outfit-builder", Shirt],
  ["Analytics", "/analytics", BarChart3],
  ["Scheduled", "/scheduled-posts", CalendarClock],
  ["Settings", "/settings", Settings],
  ["Billing", "/billing", CreditCard]
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,.14),transparent_34%),linear-gradient(135deg,rgba(20,184,166,.08),transparent_28%)]">
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r bg-card/70 p-4 backdrop-blur-xl lg:block">
      <Link href="/dashboard" className="mb-8 flex items-center gap-3 px-2 text-xl font-bold"><span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground">P</span> PinFashion AI</Link>
      <nav className="space-y-1">{nav.map(([label, href, Icon]) => <Link key={href} href={href} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"><Icon className="h-4 w-4" />{label}</Link>)}</nav>
    </aside>
    <main className="lg:pl-64"><header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/75 px-4 backdrop-blur-xl lg:px-8"><div><p className="text-sm text-muted-foreground">Pinterest fashion automation</p></div><ModeToggle /></header><div className="p-4 lg:p-8">{children}</div></main>
  </div>;
}
