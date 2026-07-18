"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  Layers, 
  Tag, 
  Box, 
  ShoppingCart, 
  Users, 
  Star, 
  Ticket, 
  BarChart3, 
  Megaphone, 
  Image as ImageIcon, 
  Sparkles, 
  Settings, 
  Shield, 
  LogOut 
} from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

import { signOut } from 'next-auth/react'

const navigation = [
  { nameKey: 'adminDashboard', href: '/admin', icon: LayoutDashboard },
  { nameKey: 'adminProducts', href: '/admin/products', icon: Package },
  { nameKey: 'adminCategories', href: '/admin/categories', icon: FolderTree },
  { nameKey: 'adminCollections', href: '/admin/collections', icon: Layers },
  { nameKey: 'adminBrands', href: '/admin/brands', icon: Tag },
  { nameKey: 'adminInventory', href: '/admin/inventory', icon: Box },
  { nameKey: 'adminOrders', href: '/admin/orders', icon: ShoppingCart },
  { nameKey: 'adminCustomers', href: '/admin/customers', icon: Users },
  { nameKey: 'adminReviews', href: '/admin/reviews', icon: Star },
  { nameKey: 'adminCoupons', href: '/admin/coupons', icon: Ticket },
  { nameKey: 'adminAnalytics', href: '/admin/analytics', icon: BarChart3 },
  { nameKey: 'adminMarketing', href: '/admin/marketing', icon: Megaphone },
  { nameKey: 'adminMedia', href: '/admin/media', icon: ImageIcon },
  { nameKey: 'adminSettings', href: '/admin/settings', icon: Settings },
  { nameKey: 'adminStoreView', href: '/', icon: Shield },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { t } = useTranslation()

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-slate-50 dark:bg-slate-900">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600">
            <span className="text-sm font-bold text-white">AI</span>
          </div>
          <span className="text-lg">Shop Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.nameKey}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              )}
            >
              <item.icon className="h-4 w-4" />
              {t(item.nameKey as any) || item.nameKey}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="border-t p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-300 dark:hover:bg-red-950 dark:hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          {t("signOut" as any) || "Logout"}
        </button>
      </div>
    </div>
  )
}
