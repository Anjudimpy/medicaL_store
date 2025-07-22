import { useState, useRef } from "react";
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
  Calendar,
} from "lucide-react";
import NewSaleModal from "@/components/modals/new-sale-modal";
import Header from "@/components/layout/header";
import type { Sale } from "@shared/schema";

export default function Sales() {
  const [showNewSaleModal, setShowNewSaleModal] = useState(false);
  const [saleToPrint, setSaleToPrint] = useState<Sale | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

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
  const todaySales =
    sales?.filter((sale) => {
      const today = new Date();
      const saleDate = new Date(sale.createdAt!);
      return saleDate.toDateString() === today.toDateString();
    }) || [];

  const handlePrintSale = (sale: Sale) => {
    setSaleToPrint(sale);
    setTimeout(() => {
      if (printRef.current) {
        const printContent = printRef.current.innerHTML;
        const printWindow = window.open("", "_blank", "width=800,height=600");
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>Print Receipt</title>
                <style>
                  body { font-family: Arial; padding: 20px; }
                  h2 { margin-top: 0; }
                  table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                  th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                </style>
              </head>
              <body>
                ${printContent}
              </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.focus();
          printWindow.print();
          printWindow.close();
        }
      }
    }, 100);
  };

  return (
    <div className="flex-1 overflow-auto">
      <Header title="Sales Management" subtitle="Track and manage all your sales transactions" />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Cards code here (Total Sales, Today's Sales, etc.) */}
        </div>

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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Receipt className="w-5 h-5" />
              <span>Recent Sales</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                    <TableHead>Payment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales?.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>#{sale.id}</TableCell>
                      <TableCell>{sale.customerName}</TableCell>
                      <TableCell>{new Date(sale.createdAt!).toLocaleString()}</TableCell>
                      <TableCell>View Items</TableCell>
                      <TableCell>${sale.subtotal}</TableCell>
                      <TableCell>${sale.tax}</TableCell>
                      <TableCell>${sale.total}</TableCell>
                      <TableCell>
                        <Badge variant={getPaymentMethodBadge(sale.paymentMethod)}>
                          {sale.paymentMethod}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => handlePrintSale(sale)}>Print</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <NewSaleModal open={showNewSaleModal} onOpenChange={setShowNewSaleModal} />

        {/* Hidden printable receipt */}
        <div style={{ display: 'none' }}>
          <div ref={printRef}>
            {saleToPrint && (
              <div>
                <h2>Receipt - Sale #{saleToPrint.id}</h2>
                <p>Customer: {saleToPrint.customerName}</p>
                <p>Date: {new Date(saleToPrint.createdAt!).toLocaleString()}</p>
                <table>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {saleToPrint.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.medicineName}</td>
                        <td>{item.quantity}</td>
                        <td>${item.price}</td>
                        <td>${item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p>Subtotal: ${saleToPrint.subtotal}</p>
                <p>Tax: ${saleToPrint.tax}</p>
                <p>Total: ${saleToPrint.total}</p>
                <p>Payment: {saleToPrint.paymentMethod}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
