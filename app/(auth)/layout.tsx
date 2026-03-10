export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel - branding */}
      <div className="hidden lg:flex flex-col justify-between bg-foreground text-background p-10">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-background" />
          <span className="text-lg font-semibold">Next Desk</span>
        </div>
        <blockquote className="space-y-2">
          <p className="text-lg">
            &ldquo;Next Desk has simplified our HR and attendance management significantly.
            Everything we need in one clean interface.&rdquo;
          </p>
          <footer className="text-sm text-background/70">PT TechCorp Indonesia</footer>
        </blockquote>
      </div>
      {/* Right panel - form */}
      <div className="flex items-center justify-center p-8">
        {children}
      </div>
    </div>
  )
}
