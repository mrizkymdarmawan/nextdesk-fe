'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, LayoutDashboard, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'
import { isAxiosError } from 'axios'
import type { PlatformUser, TenantUser } from '@/types/auth'

export default function AuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const token = useAuthStore((s) => s.token)
  const tenantToken = useAuthStore((s) => s.tenantToken)
  const setAuth = useAuthStore((s) => s.setAuth)
  const setTenantAuth = useAuthStore((s) => s.setTenantAuth)
  const setMe = useAuthStore((s) => s.setMe)

  const isAuthenticated = !!token || !!tenantToken
  const defaultTab = searchParams.get('tab') === 'register' ? 'register' : 'login'
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [registerSuccess, setRegisterSuccess] = useState(false)

  useEffect(() => {
    if (isAuthenticated) router.replace('/home')
  }, [isAuthenticated, router])

  // ── Login state ──
  type LoginStep = 'email' | 'password'
  const [loginStep, setLoginStep] = useState<LoginStep>('email')
  const [accountType, setAccountType] = useState<'platform' | 'tenant' | null>(null)
  const [loginForm, setLoginForm] = useState({ email: '', password: '', schema_name: '' })
  const [loginError, setLoginError] = useState<string | null>(null)
  const [loginLoading, setLoginLoading] = useState(false)
  const [showLoginPw, setShowLoginPw] = useState(false)

  // ── Register state ──
  const [regForm, setRegForm] = useState({ full_name: '', email: '', password: '' })
  const [regError, setRegError] = useState<string | null>(null)
  const [regLoading, setRegLoading] = useState(false)
  const [showRegPw, setShowRegPw] = useState(false)

  async function handleIdentify(e: React.FormEvent) {
    e.preventDefault()
    setLoginError(null)
    setLoginLoading(true)
    try {
      const res = await authService.identify({ email: loginForm.email })
      setAccountType(res.data.data.account_type)
      setLoginStep('password')
    } catch (err) {
      setLoginError(
        isAxiosError(err)
          ? (err.response?.data?.message ?? 'Email tidak ditemukan.')
          : 'Terjadi kesalahan.'
      )
    } finally {
      setLoginLoading(false)
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginError(null)
    setLoginLoading(true)
    try {
      if (accountType === 'platform') {
        const res = await authService.login({ email: loginForm.email, password: loginForm.password })
        const { token, user } = res.data.data
        setAuth(token, user as PlatformUser)
        // fetch role + permissions (fire-and-forget; silently fails if BE down)
        try {
          const meRes = await authService.getMe()
          setMe(meRes.data.data.role, meRes.data.data.permissions)
        } catch { /* non-blocking */ }
      } else {
        const res = await authService.tenantLogin({
          schema_name: loginForm.schema_name,
          email: loginForm.email,
          password: loginForm.password,
        })
        const { token, user } = res.data.data
        setTenantAuth(token, user as TenantUser)
        try {
          const meRes = await authService.getTenantMe()
          setMe(meRes.data.data.role, meRes.data.data.permissions)
        } catch { /* non-blocking */ }
      }
      router.push('/home')
    } catch (err) {
      setLoginError(
        isAxiosError(err)
          ? (err.response?.data?.message ?? 'Login gagal. Coba lagi.')
          : 'Terjadi kesalahan.'
      )
    } finally {
      setLoginLoading(false)
    }
  }

  function resetLoginStep() {
    setLoginStep('email')
    setAccountType(null)
    setLoginError(null)
    setLoginForm((p) => ({ ...p, password: '', schema_name: '' }))
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setRegError(null)
    setRegLoading(true)
    try {
      await authService.register(regForm)
      setRegisterSuccess(true)
      setActiveTab('login')
    } catch (err) {
      setRegError(
        isAxiosError(err)
          ? (err.response?.data?.message ?? 'Pendaftaran gagal. Coba lagi.')
          : 'Terjadi kesalahan.'
      )
    } finally {
      setRegLoading(false)
    }
  }

  function switchTab(tab: string) {
    setActiveTab(tab)
    setRegisterSuccess(false)
  }

  return (
    <div className="space-y-6">
      {/* Mobile logo */}
      <div className="flex items-center gap-2 lg:hidden">
        <LayoutDashboard className="h-5 w-5" />
        <span className="font-semibold">Next Desk</span>
      </div>

      <Tabs value={activeTab} onValueChange={switchTab}>
        <TabsList className="w-full">
          <TabsTrigger value="login" className="flex-1">Masuk</TabsTrigger>
          <TabsTrigger value="register" className="flex-1">Daftar</TabsTrigger>
        </TabsList>

        {/* ── Login ── */}
        <TabsContent value="login" className="space-y-5 pt-4">

          {loginStep === 'email' ? (
            <>
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">Masuk ke akun Anda</h1>
                <p className="text-sm text-muted-foreground">Masukkan email untuk melanjutkan</p>
              </div>

              {registerSuccess && (
                <div className="flex items-start gap-2 rounded-md border border-green-500/50 bg-green-500/10 px-3 py-2 text-sm text-green-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>Akun berhasil dibuat! Silakan masuk.</span>
                </div>
              )}

              <form onSubmit={handleIdentify} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="anda@perusahaan.id"
                    autoComplete="email"
                    required
                    value={loginForm.email}
                    onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
                  />
                </div>

                {loginError && (
                  <div className="flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loginLoading}>
                  {loginLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Memuat…</> : 'Lanjutkan'}
                </Button>
              </form>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <button
                  onClick={resetLoginStep}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  {loginForm.email}
                </button>
                <h1 className="text-2xl font-semibold tracking-tight">
                  {accountType === 'tenant' ? 'Masuk ke workspace' : 'Masukkan kata sandi'}
                </h1>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {accountType === 'tenant' && (
                  <div className="space-y-2">
                    <Label htmlFor="schema-name">ID Perusahaan</Label>
                    <Input
                      id="schema-name"
                      type="text"
                      placeholder="contoh: tenant_7"
                      required
                      value={loginForm.schema_name}
                      onChange={(e) => setLoginForm((p) => ({ ...p, schema_name: e.target.value }))}
                    />
                    <p className="text-xs text-muted-foreground">
                      ID perusahaan diberikan saat pendaftaran workspace.
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password">Kata Sandi</Label>
                    <Link href="/forgot-password" className="text-xs text-muted-foreground underline-offset-4 hover:underline">
                      Lupa kata sandi?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showLoginPw ? 'text' : 'password'}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                      className="pr-10"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPw((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showLoginPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {loginError && (
                  <div className="flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loginLoading}>
                  {loginLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Masuk…</> : 'Masuk'}
                </Button>
              </form>
            </>
          )}
        </TabsContent>

        {/* ── Register ── */}
        <TabsContent value="register" className="space-y-5 pt-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Buat akun</h1>
            <p className="text-sm text-muted-foreground">Mulai kelola bisnis Anda dengan Next Desk</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reg-name">Nama lengkap</Label>
              <Input
                id="reg-name"
                type="text"
                placeholder="Budi Santoso"
                autoComplete="name"
                required
                value={regForm.full_name}
                onChange={(e) => setRegForm((p) => ({ ...p, full_name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-email">Email</Label>
              <Input
                id="reg-email"
                type="email"
                placeholder="anda@perusahaan.id"
                autoComplete="email"
                required
                value={regForm.email}
                onChange={(e) => setRegForm((p) => ({ ...p, email: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-password">Kata Sandi</Label>
              <div className="relative">
                <Input
                  id="reg-password"
                  type={showRegPw ? 'text' : 'password'}
                  placeholder="Minimal 8 karakter"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  className="pr-10"
                  value={regForm.password}
                  onChange={(e) => setRegForm((p) => ({ ...p, password: e.target.value }))}
                />
                <button
                  type="button"
                  onClick={() => setShowRegPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showRegPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {regError && (
              <div className="flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{regError}</span>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={regLoading}>
              {regLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Mendaftar…</> : 'Buat akun'}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            Dengan mendaftar, Anda menyetujui{' '}
            <Link href="/terms" className="underline underline-offset-4 hover:text-foreground">
              Syarat Layanan
            </Link>.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
