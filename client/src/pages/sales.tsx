import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Plus, 
  Receipt, 
  TrendingUp,
  DollarSign,
  Calendar
} from "lucide-react";
import NewSaleModal from "@/components/modals/new-sale-modal";
import Header from "@/components/layout/header";
import type { Sale } from "@shared/schema";

export default function Sales() {
  const [showNewSaleModal, setShowNewSaleModal] = useState(false);

  const { data: sales, isLoading } = useQuery<Sale[]>({
    queryKey: ["/api/sales"],
  });

  const getPaymentMethodBadge = (method: string) => {
    const variants = {
      cash: "default" as const,
      card: "secondary" as const,
      insurance: "outline" as const,
    };
    return variants[method.toLowerCase() as keyof typeof variants] || "default";
  };

  const totalSales = sales?.reduce((sum, sale) => sum + parseFloat(sale.total), 0) || 0;
  const todaySales = sales?.filter(sale => {
    const today = new Date();
    const saleDate = new Date(sale.createdAt!);
    return saleDate.toDateString() === today.toDateString();
  }) || [];

  return (
    <div className="flex-1 overflow-auto">
      <Header title="Sales Management" subtitle="Track and manage all your sales transactions" />
      
      <div className="p-6 space-y-6">
        {/* Sales Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Sales</p>
                  <p className="text-xl font-bold">${totalSales.toFixed(2)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Today's Sales</p>
                  <p className="text-xl font-bold">{todaySales.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-secondary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Transactions</p>
                  <p className="text-xl font-bold">{sales?.length || 0}</p>
                </div>
                <Receipt className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg. Sale Value</p>
                  <p className="text-xl font-bold">
                    ${sales?.length ? (totalSales / sales.length).toFixed(2) : '0.00'}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Sales Transactions</h3>
            <p className="text-sm text-gray-500">View and manage all sales transactions</p>
          </div>
          <Button onClick={() => setShowNewSaleModal(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            New Sale
          </Button>
        </div>

        {/* Sales Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Receipt className="w-5 h-5" />
              <span>Recent Sales</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 py-4">
                    <Skeleton className="h-10 w-10 rounded" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-48 mb-2" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                ))}
              </div>
            ) : sales?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Receipt className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No sales recorded yet</p>
                <p className="text-sm">Start by creating your first sale transaction</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sale ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Subtotal</TableHead>
                      <TableHead>Tax</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sales?.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell>
                          <span className="font-mono text-sm">#{sale.id.toString().padStart(4, '0')}</span>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{sale.customerName}</p>
                            {sale.customerId && (
                              <p className="text-sm text-gray-500">ID: {sale.customerId}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p>{new Date(sale.createdAt!).toLocaleDateString()}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(sale.createdAt!).toLocaleTimeString()}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-500">View Items</span>
                        </TableCell>
                        <TableCell>${parseFloat(sale.subtotal).toFixed(2)}</TableCell>
                        <TableCell>${parseFloat(sale.tax).toFixed(2)}</TableCell>
                        <TableCell>
                          <span className="font-medium">${parseFloat(sale.total).toFixed(2)}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPaymentMethodBadge(sale.paymentMethod)}>
                            {sale.paymentMethod}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                            <Button variant="ghost" size="sm">
                              Print
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* New Sale Modal */}
        <NewSaleModal open={showNewSaleModal} onOpenChange={setShowNewSaleModal} />
      </div>
    </div>
  );
}
