import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/layout/header";
import { 
  PillBottle, 
  AlertTriangle, 
  DollarSign, 
  Users, 
  Plus, 
  Receipt,
  UserPlus,
  TrendingUp,
  Clock,
  Tablets,
  Syringe,
  FlaskRound,
  Package2,
  Bandage,
  Heart,
  Pill,
  Droplets,
  Feather,
  PenLine,
  Wheat,
  SprayCan,
  
} from "lucide-react";
import { FaRupeeSign } from "react-icons/fa";

import { useState } from "react";
import NewSaleModal from "@/components/modals/new-sale-modal";
import AddMedicineModal from "@/components/modals/add-medicine-modal";
import AddCustomerModal from "@/components/modals/add-customer-modal";
import type { DashboardStats, Sale, Medicine } from "@shared/schema";
import MedicineCategories from "./medicienCategory";

export default function Dashboard() {
  const [showNewSaleModal, setShowNewSaleModal] = useState(false);
  const [showAddMedicineModal, setShowAddMedicineModal] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: recentSales, isLoading: salesLoading } = useQuery<Sale[]>({
    queryKey: ["/api/sales/recent"],
  });

  const { data: lowStockItems, isLoading: lowStockLoading } = useQuery<Medicine[]>({
    queryKey: ["/api/medicines/low-stock"],
  });
  

  const quickActions = [
    {
      title: "New Sale",
      description: "Process transaction",
      icon: Plus,
      color: "bg-primary",
      onClick: () => setShowNewSaleModal(true),
    },
    {
      title: "Add Medicine",
      description: "Add to inventory",
      icon: PillBottle,
      color: "bg-secondary",
      onClick: () => setShowAddMedicineModal(true),
    },
    {
      title: "Add Customer",
      description: "Register new customer",
      icon: UserPlus,
      color: "bg-yellow-400",
      onClick: () => setShowAddCustomerModal(true),
    },
    {
      title: "View Reports",
      description: "Sales & inventory",
      icon: TrendingUp,
      color: "bg-accent",
      onClick: () => {},
    },
  ];
  const handleClick=()=>{
    alert("hi")
  }
  // const categories = [
  //   { name: "Tablets", count: "0 items", icon: Tablets, bgColor: "bg-green-500" },
  //   { name: "Oientment", count: "0 items", icon: PenLine, bgColor: "bg-red-500" },
  //   { name: "Injections", count: "0 items", icon: Syringe, bgColor: "bg-blue-500" },
  //   { name: "Syrups", count: "0 items", icon: FlaskRound, bgColor: "bg-purple-500" },
  //   { name: "Capsules", count: "0 items", icon: Pill, bgColor: "bg-orange-500" },
  //   { name: "Lotion", count: "0 items", icon: Droplets, bgColor: "bg-pink-500" },
  //   { name: "Inhaler", count: "0 items", icon: SprayCan, bgColor: "bg-sky-400" },
  //   { name: "Diapers", count: "0 items", icon: Feather, bgColor: "bg-yellow-500" },
  //   { name: "Surgicals", count: "0 items", icon: Heart, bgColor: "bg-teal-500" },
  //   { name: "Food Products", count: "0 items", icon: Wheat, bgColor: "bg-yellow-700" },
  // ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
        <Header searchTerm={""} onSearchChange={function (term: string): void {
        throw new Error("Function not implemented.");
      } } onSearchSubmit={function (): void {
        throw new Error("Function not implemented.");
      } } />  
    <div className="p-6 space-y-8">
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Medicines</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-16 mt-2" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalMedicines || 0}</p>
                )}
              </div>
              <div className="stats-icon bg-primary/10 text-primary">
                <PillBottle />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-secondary">Active inventory</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock Items</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-16 mt-2" />
                ) : (
                  <p className="text-2xl font-bold text-accent">{stats?.lowStockItems || 0}</p>
                )}
              </div>
              <div className="stats-icon bg-accent/10 text-accent">
                <AlertTriangle />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-accent">Requires attention</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Sales</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-20 mt-2" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900">${stats?.todaySales?.toFixed(2) || '0.00'}</p>
                )}
              </div>
              <div className="stats-icon bg-secondary/10 text-secondary">
                <DollarSign />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-secondary">Revenue today</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Customers</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-16 mt-2" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{stats?.activeCustomers || 0}</p>
                )}
              </div>
              <div className="stats-icon bg-warning/10 text-warning">
                <Users />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-secondary">Registered users</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <div
                key={action.title}
                className="quick-action-card"
                onClick={action.onClick}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{action.title}</p>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activities & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Receipt className="w-5 h-5" />
              <span>Recent Sales</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salesLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between py-3">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-4 w-16 mb-1" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </div>
                ))
              ) : recentSales?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Receipt className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No recent sales</p>
                </div>
              ) : (
                recentSales?.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                        <Receipt className="w-4 h-4 text-secondary" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{sale.customerName}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(sale.createdAt!).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${parseFloat(sale.total).toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{sale.paymentMethod}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            {recentSales && recentSales.length > 0 && (
              <div className="pt-4 border-t border-gray-200">
                <Button variant="ghost" className="w-full text-primary hover:text-primary/90">
                  View All Sales
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5" />
                <span>Low Stock Alerts</span>
              </div>
              {lowStockItems && lowStockItems.length > 0 && (
                <Badge variant="destructive">{lowStockItems.length}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between py-3">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-4 w-16 mb-1" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </div>
                ))
              ) : lowStockItems?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <PillBottle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>All items are well stocked</p>
                </div>
              ) : (
                lowStockItems?.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.manufacturer}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-accent">{item.quantity} units</p>
                      <p className="text-sm text-gray-500">Min: {item.minimumStock}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            {lowStockItems && lowStockItems.length > 0 && (
              <div className="pt-4 border-t border-gray-200">
                <Button variant="ghost" className="w-full text-accent hover:text-accent/90">
                  View All Low Stock Items
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}


      {/* <Card>
        <CardHeader>
          <CardTitle>Medicine Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <div
                key={index}
                className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={handleClick}
              >
                <div className={`w-12 h-12 ${category.bgColor} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                  <category.icon className="text-white text-xl" />
                </div>
                <p className="font-medium text-gray-900">{category.name}</p>
                <p className="text-sm text-gray-500">{category.count}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}
      <MedicineCategories/>

      <NewSaleModal open={showNewSaleModal} onOpenChange={setShowNewSaleModal} />
      <AddMedicineModal open={showAddMedicineModal} onOpenChange={setShowAddMedicineModal} />
      <AddCustomerModal open={showAddCustomerModal} onOpenChange={setShowAddCustomerModal} />
    </div></div>
  
  );
}
