import { LayoutDashboard } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel — blue gradient branding */}
      <div className="relative hidden lg:flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-blue-700 to-blue-600 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_-10%_-10%,rgba(255,255,255,0.08),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_110%_110%,rgba(255,255,255,0.05),transparent)]" />

        <div className="relative flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
            <LayoutDashboard className="h-8 w-8 text-white" />
          </div>
          <span className="text-4xl font-bold tracking-tight">Next Desk</span>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
