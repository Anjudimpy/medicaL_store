import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Search, Trash2, Plus } from "lucide-react";
import { insertSaleSchema, insertSaleItemSchema } from "@shared/schema";
import type { Customer, Medicine, InsertSaleItem } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface NewSaleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SaleItem = {
  medicineId: number;
  medicineName: string;
  price: number;
  quantity: number;
  total: number;
};

const saleFormSchema = insertSaleSchema.extend({
  items: z.array(insertSaleItemSchema).min(1, "At least one item is required"),
  discountType: z.enum(["fixed", "percentage"]),
  discountValue: z.string().refine(val => !isNaN(parseFloat(val)), {
    message: "Discount must be a number",
  }),
});

export default function NewSaleModal({ open, onOpenChange }: NewSaleModalProps) {
  const [selectedItems, setSelectedItems] = useState<SaleItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof saleFormSchema>>({
    resolver: zodResolver(saleFormSchema),
    defaultValues: {
      customerId: undefined,
      customerName: "",
      subtotal: "0",
      tax: "0",
      discountType: "fixed",
      discountValue: "0",
      total: "0",
      paymentMethod: "cash",
      items: [],
    },
  });

  const { data: customers } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
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

  const createSaleMutation = useMutation({
    mutationFn: async (data: z.infer<typeof saleFormSchema>) => {
      const response = await apiRequest("POST", "/api/sales", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sales"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/medicines"] });
      toast({
        title: "Success",
        description: "Sale processed successfully",
      });
      handleClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to process sale",
        variant: "destructive",
      });
    },
  });

  const addMedicineToSale = (medicine: Medicine) => {
    const existingItem = selectedItems.find(item => item.medicineId === medicine.id);
    
    if (existingItem) {
      toast({
        title: "Item already added",
        description: "This medicine is already in the sale",
        variant: "destructive",
      });
      return;
    }

    if (medicine.quantity === 0) {
      toast({
        title: "Out of stock",
        description: "This medicine is currently out of stock",
        variant: "destructive",
      });
      return;
    }

    const newItem: SaleItem = {
      medicineId: medicine.id,
      medicineName: medicine.name,
      price: parseFloat(medicine.sellingPrice),
      quantity: 1,
      total: parseFloat(medicine.sellingPrice),
    };

    setSelectedItems(prev => [...prev, newItem]);
    setSearchQuery("");
  };

  const updateItemQuantity = (medicineId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(medicineId);
      return;
    }

    setSelectedItems(prev =>
      prev.map(item =>
        item.medicineId === medicineId
          ? { ...item, quantity, total: item.price * quantity }
          : item
      )
    );
  };

  const removeItem = (medicineId: number) => {
    setSelectedItems(prev => prev.filter(item => item.medicineId !== medicineId));
  };

  const discountType = form.watch("discountType");
  const discountValue = parseFloat(form.watch("discountValue") || "0");
  const subtotal = selectedItems.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.05; // 5% tax
  
  let discountAmount = 0;
  if (discountType === "percentage") {
    discountAmount = (subtotal * discountValue) / 100;
  } else {
    discountAmount = discountValue;
  }

  const total = subtotal + tax - discountAmount;

  useEffect(() => {
    form.setValue("subtotal", subtotal.toFixed(2));
    form.setValue("tax", tax.toFixed(2));
    form.setValue("total", total > 0 ? total.toFixed(2) : "0.00");
    form.setValue("items", selectedItems.map(item => ({
      medicineId: item.medicineId,
      medicineName: item.medicineName,
      quantity: item.quantity,
      price: item.price.toFixed(2),
      total: item.total.toFixed(2),
    })));
  }, [selectedItems, subtotal, tax, total, form]);

  const handleCustomerChange = (customerId: string) => {
    const customer = customers?.find(c => c.id.toString() === customerId);
    if (customer) {
      form.setValue("customerId", customer.id);
      form.setValue("customerName", customer.name);
    }
  };

  const handleClose = () => {
    form.reset();
    setSelectedItems([]);
    setSearchQuery("");
    onOpenChange(false);
  };

  const onSubmit = (data: z.infer<typeof saleFormSchema>) => {
    createSaleMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Sale Transaction</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Customer Selection */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <div className="flex space-x-2">
                      <FormControl className="flex-1">
                        <Select onValueChange={handleCustomerChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Customer" />
                          </SelectTrigger>
                          <SelectContent>
                            {customers?.map((customer) => (
                              <SelectItem key={customer.id} value={customer.id.toString()}>
                                {customer.name} - {customer.phone}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <Button type="button" size="icon" variant="outline">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name (if not in list)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter customer name for walk-in"
                        disabled={!!form.watch("customerId")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Medicine Search */}
            <div className="space-y-4">
              <FormLabel>Add Medicines</FormLabel>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search medicines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Search Results */}
              {searchResults && searchResults.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {searchResults.map((medicine) => (
                        <div
                          key={medicine.id}
                          className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                          onClick={() => addMedicineToSale(medicine)}
                        >
                          <div>
                            <p className="font-medium">{medicine.name}</p>
                            <p className="text-sm text-gray-500">
                              ${parseFloat(medicine.sellingPrice).toFixed(2)} - Stock: {medicine.quantity}
                            </p>
                          </div>
                          <Badge variant={medicine.quantity > 0 ? "default" : "destructive"}>
                            {medicine.quantity > 0 ? "Available" : "Out of Stock"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Selected Items */}
            <div className="space-y-4">
              <FormLabel>Selected Items</FormLabel>
              {selectedItems.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-gray-500">
                    <p>No items selected</p>
                    <p className="text-sm">Search and add medicines to continue</p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Medicine</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedItems.map((item) => (
                          <TableRow key={item.medicineId}>
                            <TableCell className="font-medium">
                              {item.medicineName}
                            </TableCell>
                            <TableCell>${item.price.toFixed(2)}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  updateItemQuantity(item.medicineId, parseInt(e.target.value) || 0)
                                }
                                className="w-20"
                              />
                            </TableCell>
                            <TableCell>${item.total.toFixed(2)}</TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.medicineId)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Total Summary */}
            {selectedItems.length > 0 && (
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Subtotal:</span>
                      <span className="text-sm font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Tax (5%):</span>
                      <span className="text-sm font-medium">${tax.toFixed(2)}</span>
                    </div>

                    {/* Discount Input */}
                    <div className="flex justify-between items-center">
                      <FormLabel className="text-sm text-gray-600">Discount:</FormLabel>
                      <div className="flex items-center space-x-2">
                        <FormField
                          control={form.control}
                          name="discountType"
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="w-24">
                                <SelectValue placeholder="Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="fixed">$</SelectItem>
                                <SelectItem value="percentage">%</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="discountValue"
                          render={({ field }) => (
                            <Input
                              {...field}
                              type="number"
                              step="0.01"
                              min="0"
                              className="w-24 h-8 text-right font-medium"
                              placeholder="0.00"
                            />
                          )}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Discount Amount:</span>
                      <span className="text-sm font-medium">
                        -${discountAmount.toFixed(2)}
                        {discountType === "percentage" && ` (${discountValue}%)`}
                      </span>
                    </div>

                    <div className="flex justify-between items-center border-t pt-2">
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-lg font-bold text-primary">${total > 0 ? total.toFixed(2) : "0.00"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Method */}
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash">Cash</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card">Card</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="insurance" id="insurance" />
                        <Label htmlFor="insurance">Insurance</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createSaleMutation.isPending || selectedItems.length === 0}
                className="bg-primary hover:bg-primary/90"
              >
                {createSaleMutation.isPending ? "Processing..." : "Process Sale"}
              </Button>
              
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}