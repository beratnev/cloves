"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MoreHorizontal, Eye, Truck, Package, CheckCircle, XCircle, Clock, Download, Filter } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

interface Order {
  id: string
  orderNumber: string
  customer: {
    name: string
    email: string
  }
  items: number
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  shippingStatus: "pending" | "processing" | "shipped" | "delivered"
  createdAt: string
  updatedAt: string
}

const orders: Order[] = []

const statusConfig = {
  pending: { label: "Pending", icon: Clock, color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" },
  processing: { label: "Processing", icon: Package, color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
  shipped: { label: "Shipped", icon: Truck, color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300" },
  delivered: { label: "Delivered", icon: CheckCircle, color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" },
  refunded: { label: "Refunded", icon: XCircle, color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300" },
}

export default function AdminOrdersPage() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

 const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailDialogOpen(true)
  }

  return (
    <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("adminOrders" as any)}</h1>
            <p className="text-muted-foreground mt-1">
              Manage your store orders and shipments
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              {t("adminExport" as any) || "Export"}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between pb-6">
            <div className="flex items-center gap-2 flex-1 w-full md:w-auto">
              <div className="relative flex-1 md:w-[300px] md:flex-none">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("adminSearch" as any) || "Search orders..."}
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Orders Table */}
        <Card className="border-0 shadow-luxury bg-card/50 backdrop-blur-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>{t("adminStatus" as any) || "Status"}</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">{t("adminActions" as any) || "Actions"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const statusInfo = statusConfig[order.status]
                  const StatusIcon = statusInfo.icon
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.orderNumber}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customer.name}</div>
                          <div className="text-sm text-muted-foreground">{order.customer.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={order.paymentStatus === "paid" ? "default" : "secondary"}>
                          {order.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={order.shippingStatus === "delivered" ? "default" : "outline"}>
                          {order.shippingStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusInfo.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Package className="h-4 w-4 mr-2" />
                              Update Status
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Truck className="h-4 w-4 mr-2" />
                              Track Shipment
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download Invoice
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Order Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Order Details - {selectedOrder?.orderNumber}</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="py-4 space-y-6">
                {/* Order Info */}
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="border-0 shadow-luxury bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-base">Customer Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-muted-foreground">Name:</span>
                          <span className="ml-2 font-medium">{selectedOrder.customer.name}</span>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Email:</span>
                          <span className="ml-2">{selectedOrder.customer.email}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-luxury bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-base">Order Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Order Status:</span>
                          <Badge className={statusConfig[selectedOrder.status].color}>
                            {statusConfig[selectedOrder.status].label}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Payment:</span>
                          <Badge variant={selectedOrder.paymentStatus === "paid" ? "default" : "secondary"}>
                            {selectedOrder.paymentStatus}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Shipping:</span>
                          <Badge variant={selectedOrder.shippingStatus === "delivered" ? "default" : "outline"}>
                            {selectedOrder.shippingStatus}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Order Summary */}
                <Card className="border-0 shadow-luxury bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Items:</span>
                        <span className="font-medium">{selectedOrder.items}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span className="font-medium">${selectedOrder.total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping:</span>
                        <span className="font-medium">$0.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax:</span>
                        <span className="font-medium">$0.00</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="font-semibold">Total:</span>
                        <span className="font-semibold text-lg">${selectedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Timeline */}
                <Card className="border-0 shadow-luxury bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Order Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                        <div>
                          <div className="font-medium">Order Placed</div>
                          <div className="text-sm text-muted-foreground">{new Date(selectedOrder.createdAt).toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                        <div>
                          <div className="font-medium">Payment {selectedOrder.paymentStatus}</div>
                          <div className="text-sm text-muted-foreground">{new Date(selectedOrder.updatedAt).toLocaleString()}</div>
                        </div>
                      </div>
                      {selectedOrder.shippingStatus !== "pending" && (
                        <div className="flex gap-4">
                          <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                          <div>
                            <div className="font-medium">Shipped</div>
                            <div className="text-sm text-muted-foreground">{new Date(selectedOrder.updatedAt).toLocaleString()}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                    Close
                  </Button>
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
                    <Download className="h-4 w-4 mr-2" />
                    Download Invoice
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

  )
}
