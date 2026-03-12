import Link from 'next/link'
import {
  ArrowRight,
  Check,
  Users,
  MapPin,
  Wallet,
  Building2,
  LayoutDashboard,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme-toggle'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold tracking-tight">Next Desk</span>
          </div>
          <nav className="hidden items-center gap-5 text-sm md:flex">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <div className="h-4 w-px bg-border" />
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link href="/login?tab=register">
              <Button size="sm">
                Get started <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </nav>
          <div className="flex items-center gap-1.5 md:hidden">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link href="/login?tab=register">
              <Button size="sm">Start</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-28">
        {/* Soft gradient — works in both light and dark */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(var(--color-primary)/0.08),transparent)]" />

        <div className="relative container mx-auto px-6 text-center">
          <Badge variant="secondary" className="mb-6 font-medium">
            Digital Office Management
          </Badge>
          <h1 className="mx-auto mb-5 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-[3.5rem] lg:leading-tight">
            Manage your office,{' '}
            <span className="text-primary">all in one place</span>
          </h1>
          <p className="mx-auto mb-10 max-w-md text-base text-muted-foreground leading-relaxed">
            Next Desk helps Indonesian businesses streamline HR, attendance, payroll, and project management — simple, fast, and reliable.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/login?tab=register">
              <Button size="lg" className="w-full sm:w-auto">
                Start free trial <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                See how it works
              </Button>
            </Link>
          </div>
          <p className="mt-7 text-xs text-muted-foreground">
            Trusted by businesses across Indonesia · No credit card required
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t">
        <div className="container mx-auto px-6 py-24">
          <div className="mb-14 text-center">
            <Badge variant="secondary" className="mb-4 font-medium">Features</Badge>
            <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">Everything you need</h2>
            <p className="mx-auto max-w-md text-sm text-muted-foreground leading-relaxed">
              From employee management to payroll and attendance — Next Desk covers your complete office workflow.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/15 transition-colors group-hover:bg-primary/15">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-1.5 font-semibold text-sm">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t bg-muted/40">
        <div className="container mx-auto px-6 py-24">
          <div className="mb-14 text-center">
            <Badge variant="secondary" className="mb-4 font-medium">Pricing</Badge>
            <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">Simple pricing</h2>
            <p className="text-sm text-muted-foreground">Start free, scale as you grow. No hidden fees.</p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-xl border p-6 transition-shadow ${
                  plan.highlighted
                    ? 'border-primary bg-primary text-primary-foreground shadow-lg'
                    : 'bg-card shadow-sm hover:shadow-md'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="border-0 bg-foreground text-background text-xs">Most popular</Badge>
                  </div>
                )}
                <p className={`mb-1 text-xs font-medium uppercase tracking-wide ${plan.highlighted ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {plan.name}
                </p>
                <p className="mb-1 text-2xl font-bold">{plan.price}</p>
                <p className={`mb-6 text-sm ${plan.highlighted ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {plan.description}
                </p>
                <ul className="mb-8 space-y-2.5 text-sm">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <Check className={`h-4 w-4 shrink-0 ${plan.highlighted ? 'text-primary-foreground/80' : 'text-primary'}`} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/login?tab=register" className="block">
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? 'secondary' : 'outline'}
                  >
                    Get started
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 py-20 text-center">
          <h2 className="mb-3 text-2xl font-bold sm:text-3xl">Ready to get started?</h2>
          <p className="mb-8 text-sm text-primary-foreground/70 leading-relaxed">
            Join hundreds of Indonesian businesses already using Next Desk.
          </p>
          <Link href="/login?tab=register">
            <Button size="lg" variant="secondary">
              Create your account <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Next Desk</span>
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Next Desk. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    icon: Users,
    title: 'HR Management',
    description: 'Manage employees, roles, and organizational structure with ease.',
  },
  {
    icon: MapPin,
    title: 'Attendance',
    description: 'GPS-based attendance with geofencing for accurate tracking.',
  },
  {
    icon: Wallet,
    title: 'Payroll',
    description: 'Automated payroll calculation following Indonesian regulations.',
  },
  {
    icon: Building2,
    title: 'Projects',
    description: 'Manage work sites with location data and team assignments.',
  },
]

const plans = [
  {
    name: 'Starter',
    price: 'Rp 49.000/mo',
    description: 'For small teams getting started',
    features: ['Up to 5 employees', 'Attendance tracking', '1 project site'],
    highlighted: false,
  },
  {
    name: 'Pro',
    price: 'Rp 299.000/mo',
    description: 'Most popular for growing businesses',
    features: ['Up to 50 employees', 'Full HR module', '10 project sites', 'Payroll'],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations',
    features: ['Unlimited employees', 'All modules', 'Priority support', 'Custom setup'],
    highlighted: false,
  },
]
