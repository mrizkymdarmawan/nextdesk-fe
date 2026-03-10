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
import { Separator } from '@/components/ui/separator'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-lg font-semibold tracking-tight">Next Desk</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <Link href="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">
                Get started <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </nav>
          <div className="flex items-center gap-2 md:hidden">
            <Link href="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-6 py-24 text-center">
        <Badge variant="secondary" className="mb-6">Digital Office Management</Badge>
        <h1 className="mx-auto mb-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Manage your office operations, all in one place
        </h1>
        <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground">
          Next Desk helps Indonesian businesses streamline HR, attendance, payroll, and project management — simple, fast, and reliable.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/register">
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
      </section>

      <Separator />

      {/* Features */}
      <section id="features" className="container mx-auto px-6 py-24">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight">Everything you need</h2>
          <p className="mx-auto max-w-lg text-muted-foreground">
            From employee management to payroll and attendance — Next Desk covers your complete office workflow.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-lg border p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
                <feature.icon className="h-5 w-5 text-secondary-foreground" />
              </div>
              <h3 className="mb-2 font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Pricing */}
      <section id="pricing" className="container mx-auto px-6 py-24">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight">Simple pricing</h2>
          <p className="text-muted-foreground">Start free, scale as you grow. No hidden fees.</p>
        </div>
        <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg border p-6 ${plan.highlighted ? 'border-foreground bg-foreground text-background' : ''}`}
            >
              <p className="mb-1 text-sm font-medium">{plan.name}</p>
              <p className="mb-4 text-3xl font-bold">{plan.price}</p>
              <p className={`mb-6 text-sm ${plan.highlighted ? 'text-background/70' : 'text-muted-foreground'}`}>
                {plan.description}
              </p>
              <ul className="mb-8 space-y-2.5 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className={`h-4 w-4 shrink-0 ${plan.highlighted ? 'text-background' : 'text-foreground'}`} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block">
                <Button className="w-full" variant={plan.highlighted ? 'secondary' : 'outline'}>
                  Get started
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-foreground text-background">
        <div className="container mx-auto px-6 py-20 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to get started?</h2>
          <p className="mb-8 text-background/70">
            Join hundreds of Indonesian businesses already using Next Desk.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary">
              Create your account <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="text-sm font-medium">Next Desk</span>
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
