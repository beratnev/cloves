"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, ShoppingCart, Package, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, ShoppingBag, AlertTriangle, CreditCard, Activity } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useTranslation } from "@/lib/i18n"

export default function AdminDashboard() {
  const { t } = useTranslation()

  const stats = [
    {
      title: t("adminTotalRevenue" as any),
      value: "$0.00",
      change: "0%",
      trend: "stable",
      icon: DollarSign,
    },
    {
      title: t("adminTotalOrders" as any),
      value: "0",
      change: "0%",
      trend: "stable",
      icon: ShoppingCart,
    },
    {
      title: t("adminTotalCustomers" as any),
      value: "0",
      change: "0%",
      trend: "stable",
      icon: Users,
    },
    {
      title: t("adminTotalProducts" as any),
      value: "0",
      change: "0%",
      trend: "stable",
      icon: Package,
    },
    {
      title: t("adminActiveDiscounts" as any),
      value: "0",
      change: "0",
      trend: "stable",
      icon: CreditCard,
    },
    {
      title: t("adminLowStockAlerts" as any),
      value: "0",
      change: "0",
      trend: "stable",
      icon: AlertTriangle,
    },
  ]

  const recentOrders: any[] = []
  const topProducts: any[] = []
  const topCategories: any[] = []

  const quickActions = [
    { name: t("adminAddNewProduct" as any), href: "/admin/products/new", icon: Package },
    { name: t("adminViewOrders" as any), href: "/admin/orders", icon: ShoppingCart },
    { name: t("adminCustomers" as any), href: "/admin/customers", icon: Users },
    { name: t("adminCoupons" as any), href: "/admin/coupons", icon: CreditCard },
  ]





  return (
    <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{t("adminDashboard" as any)}</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="border-0 shadow-luxury bg-card/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="h-3 w-3 text-green-600" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-destructive" />
                    )}
                    <span className={stat.trend === "up" ? "text-green-600" : "text-destructive"}>
                      {stat.change}
                    </span>
                    <span>from last month</span>
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">{t("adminQuickActions" as any)}</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Button
                  variant="outline"
                  className="h-24 w-full flex flex-col items-center justify-center gap-2 hover:bg-gradient-to-br hover:from-purple-600 hover:to-blue-600 hover:text-white hover:border-0 transition-all duration-300"
                  asChild
                >
                  <a href={action.href}>
                    <action.icon className="h-6 w-6" />
                    <span>{action.name}</span>
                  </a>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Recent Orders */}
          <Card className="border-0 shadow-luxury bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t("adminRecentOrders" as any)}</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <a href="/admin/orders">View All</a>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{order.customer}</p>
                      <p className="text-sm text-muted-foreground">{order.product}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{order.amount}</p>
                      <Badge
                        variant={
                          order.status === "Completed"
                            ? "default"
                            : order.status === "Processing"
                            ? "secondary"
                            : "outline"
                        }
                        className="text-xs"
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card className="border-0 shadow-luxury bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Best Selling Products</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <a href="/admin/products">View All</a>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.category} • {product.sales} sales
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{product.revenue}</p>
                      {product.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-destructive" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Performance */}
        <Card className="border-0 shadow-luxury bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              {topCategories.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="border rounded-lg p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                    <div className="flex items-center gap-2 mb-2">
                      <ShoppingBag className="h-4 w-4 text-primary" />
                      <p className="font-semibold">{category.name}</p>
                    </div>
                    <p className="text-2xl font-bold">{category.sales}</p>
                    <p className="text-sm text-muted-foreground">sales</p>
                    <div className="my-2 h-px bg-border" />
                    <p className="text-sm font-medium">{category.revenue}</p>
                    <p className="text-xs text-green-600">{category.growth} growth</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

  )
}
