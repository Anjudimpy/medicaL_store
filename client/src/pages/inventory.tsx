import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  AlertTriangle,
  Package
} from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AddMedicineModal from "@/components/modals/add-medicine-modal";
import Header from "@/components/layout/header";
import type { Medicine } from "@shared/schema";

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddMedicineModal, setShowAddMedicineModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Medicine | null>(null);
  const { toast } = useToast();

  const { data: medicines, isLoading } = useQuery<Medicine[]>({
    queryKey: ["/api/medicines"],
  });

  const { data: searchResults } = useQuery<Medicine[]>({
    queryKey: ["/api/medicines/search", searchQuery],
    enabled: searchQuery.length > 0,
    queryFn: async () => {
      const response = await fetch(`/api/medicines/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error("Failed to search medicines");
      return response.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/medicines/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/medicines"] });
      toast({
        title: "Success",
        description: "Medicine deleted successfully",
      });
      setDeleteItem(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete medicine",
        variant: "destructive",
      });
    },
  });

  const displayedMedicines = searchQuery ? searchResults : medicines;

  const getLowStockStatus = (quantity: number, minimumStock: number) => {
    if (quantity === 0) return { label: "Out of Stock", variant: "destructive" as const };
    if (quantity <= minimumStock) return { label: "Low Stock", variant: "secondary" as const };
    return { label: "In Stock", variant: "default" as const };
  };

  return (
    <div className="flex-1 overflow-auto">
      <Header title="Inventory Management" subtitle="Manage your medicine inventory and stock levels" searchTerm onSearchChange onSearchSubmit />
      
      
      <div className="p-6 space-y-6">
        {/* Search and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search medicines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-80 pl-10"
              />
            </div>
          </div>
          <Button onClick={() => setShowAddMedicineModal(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Medicine
          </Button>
        </div>

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5" />
              <span>Medicine Inventory</span>
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
            ) : displayedMedicines?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No medicines found</p>
                {searchQuery && (
                  <p className="text-sm">Try adjusting your search query</p>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medicine</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Manufacturer</TableHead>
                      <TableHead>Batch</TableHead>
                      <TableHead>Expiry</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedMedicines?.map((medicine) => {
                      const stockStatus = getLowStockStatus(medicine.quantity, medicine.minimumStock);
                      return (
                        <TableRow key={medicine.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{medicine.name}</p>
                              {medicine.genericName && (
                                <p className="text-sm text-gray-500">{medicine.genericName}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{medicine.category}</TableCell>
                          <TableCell>{medicine.manufacturer}</TableCell>
                          <TableCell>{medicine.batchNumber}</TableCell>
                          <TableCell>
                            {new Date(medicine.expiryDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{medicine.quantity}</span>
                              {medicine.quantity <= medicine.minimumStock && (
                                <AlertTriangle className="w-4 h-4 text-accent" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">${parseFloat(medicine.sellingPrice).toFixed(2)}</p>
                              <p className="text-sm text-gray-500">
                                Cost: ${parseFloat(medicine.purchasePrice).toFixed(2)}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={stockStatus.variant}>
                              {stockStatus.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setDeleteItem(medicine)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the medicine
                "{deleteItem?.name}" from your inventory.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteItem && deleteMutation.mutate(deleteItem.id)}
                disabled={deleteMutation.isPending}
                className="bg-destructive hover:bg-destructive/90"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Add Medicine Modal */}
        <AddMedicineModal open={showAddMedicineModal} onOpenChange={setShowAddMedicineModal} />
      </div>
    </div>
  );
}
