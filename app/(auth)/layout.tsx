import { LayoutDashboard, Users, MapPin, Wallet } from "lucide-react";

const highlights = [
  { icon: Users, text: "Kelola karyawan, absensi, dan penggajian" },
  { icon: MapPin, text: "Geofencing berbasis GPS untuk absensi akurat" },
  { icon: Wallet, text: "Penggajian otomatis sesuai aturan Indonesia" },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      {/* Left panel — branding */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 p-12 text-white">
        {/* Subtle texture */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_-10%_-10%,rgba(255,255,255,0.06),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_110%_110%,rgba(99,179,237,0.08),transparent)]" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
            <LayoutDashboard className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Next Desk</span>
        </div>

        {/* Main copy */}
        <div className="relative space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight leading-snug">
              Kantor digital Anda,<br />
              <span className="text-blue-300">dalam satu platform.</span>
            </h1>
            <p className="mt-3 text-sm text-white/60 leading-relaxed max-w-xs">
              Dirancang khusus untuk bisnis Indonesia. Sederhana, andal, dan siap pakai.
            </p>
          </div>

          <ul className="space-y-4">
            {highlights.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Icon className="h-3.5 w-3.5 text-blue-300" />
                </div>
                <span className="text-sm text-white/75 leading-relaxed">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer tagline */}
        <p className="relative text-xs text-white/35">
          © {new Date().getFullYear()} Next Desk
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex min-h-screen items-center justify-center bg-background p-8 lg:min-h-0">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
