import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Package,
  AlertTriangle,
  Calendar
} from "lucide-react";
import Header from "@/components/layout/header";
import type { DashboardStats, Sale, Medicine } from "@shared/schema";

export default function Reports() {
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: sales, isLoading: salesLoading } = useQuery<Sale[]>({
    queryKey: ["/api/sales"],
  });

  const { data: medicines, isLoading: medicinesLoading } = useQuery<Medicine[]>({
    queryKey: ["/api/medicines"],
  });

  const { data: lowStockItems, isLoading: lowStockLoading } = useQuery<Medicine[]>({
    queryKey: ["/api/medicines/low-stock"],
  });

  // Calculate additional metrics
  const totalRevenue = sales?.reduce((sum, sale) => sum + parseFloat(sale.total), 0) || 0;
  const averageOrderValue = sales?.length ? totalRevenue / sales.length : 0;
  
  const salesThisMonth = sales?.filter(sale => {
    const saleDate = new Date(sale.createdAt!);
    const now = new Date();
    return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
  }) || [];

  const monthlyRevenue = salesThisMonth.reduce((sum, sale) => sum + parseFloat(sale.total), 0);

  const topCategories = medicines?.reduce((acc, medicine) => {
    const category = medicine.category;
    if (!acc[category]) {
      acc[category] = { count: 0, value: 0 };
    }
    acc[category].count++;
    acc[category].value += parseFloat(medicine.sellingPrice) * medicine.quantity;
    return acc;
  }, {} as Record<string, { count: number; value: number }>);

  const topCategoriesArray = Object.entries(topCategories || {})
    .map(([category, data]) => ({ category, ...data }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div className="flex-1 overflow-auto">
      <Header title="Reports & Analytics" subtitle="View comprehensive reports and business insights" />
      
      <div className="p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-20 mt-2" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
                  )}
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-sm text-secondary">All time earnings</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Monthly Revenue</p>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-20 mt-2" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">${monthlyRevenue.toFixed(2)}</p>
                  )}
                </div>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-secondary" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-sm text-secondary">This month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg. Order Value</p>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-20 mt-2" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">${averageOrderValue.toFixed(2)}</p>
                  )}
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-warning" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-sm text-secondary">Per transaction</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Inventory Value</p>
                  {medicinesLoading ? (
                    <Skeleton className="h-8 w-20 mt-2" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">
                      ${medicines?.reduce((sum, medicine) => 
                        sum + (parseFloat(medicine.sellingPrice) * medicine.quantity), 0
                      ).toFixed(2) || '0.00'}
                    </p>
                  )}
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-accent" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-sm text-secondary">Total stock value</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Top Categories by Value</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {medicinesLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between py-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              ) : topCategoriesArray.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No category data available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {topCategoriesArray.map((category, index) => (
                    <div key={category.category} className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center text-xs font-medium text-primary">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{category.category}</p>
                          <p className="text-sm text-gray-500">{category.count} items</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${category.value.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stock Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5" />
                <span>Stock Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lowStockLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between py-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              ) : lowStockItems?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>All items are well stocked</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {lowStockItems?.slice(0, 10).map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-accent">{item.quantity} units</p>
                        <p className="text-sm text-gray-500">Min: {item.minimumStock}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Sales Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>Recent Sales Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {salesLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : sales?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No sales data available</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Method</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sales?.slice(0, 10).map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell>
                          {new Date(sale.createdAt!).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{sale.customerName}</TableCell>
                        <TableCell>${parseFloat(sale.total).toFixed(2)}</TableCell>
                        <TableCell className="capitalize">{sale.paymentMethod}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
