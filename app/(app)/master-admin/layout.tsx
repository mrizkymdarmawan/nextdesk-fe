'use client'

import { useState } from 'react'
import { Menu, ShieldCheck } from 'lucide-react'
import { MasterAdminSidebar, MasterAdminSidebarNav } from '@/components/layout/master-admin-sidebar'
import { Topbar } from '@/components/layout/topbar'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

export default function MasterAdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const hamburger = (
    <Button
      variant="ghost"
      size="icon-sm"
      className="lg:hidden"
      onClick={() => setMobileOpen(true)}
      aria-label="Buka menu"
    >
      <Menu className="h-5 w-5" />
    </Button>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <MasterAdminSidebar />

      {/* Mobile Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0" showCloseButton={false}>
          <SheetHeader className="flex h-16 flex-row items-center gap-2.5 border-b px-5 py-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            <SheetTitle className="text-base font-semibold">Master Admin</SheetTitle>
          </SheetHeader>
          <MasterAdminSidebarNav onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar leftSlot={hamburger} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
