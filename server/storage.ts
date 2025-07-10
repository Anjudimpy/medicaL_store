import { 
  medicines, customers, suppliers, sales, saleItems,
  type Medicine, type InsertMedicine,
  type Customer, type InsertCustomer,
  type Supplier, type InsertSupplier,
  type Sale, type InsertSale,
  type SaleItem, type InsertSaleItem,
  type SaleWithItems, type DashboardStats
} from "@shared/schema";

export interface IStorage {
  // Medicine operations
  getMedicines(): Promise<Medicine[]>;
  getMedicine(id: number): Promise<Medicine | undefined>;
  createMedicine(medicine: InsertMedicine): Promise<Medicine>;
  updateMedicine(id: number, medicine: Partial<InsertMedicine>): Promise<Medicine | undefined>;
  deleteMedicine(id: number): Promise<boolean>;
  searchMedicines(query: string): Promise<Medicine[]>;
  getLowStockMedicines(): Promise<Medicine[]>;

  // Customer operations
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: number): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;
  deleteCustomer(id: number): Promise<boolean>;
  searchCustomers(query: string): Promise<Customer[]>;

  // Supplier operations
  getSuppliers(): Promise<Supplier[]>;
  getSupplier(id: number): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: number, supplier: Partial<InsertSupplier>): Promise<Supplier | undefined>;
  deleteSupplier(id: number): Promise<boolean>;

  // Sale operations
  getSales(): Promise<Sale[]>;
  getSale(id: number): Promise<SaleWithItems | undefined>;
  createSale(sale: InsertSale, items: InsertSaleItem[]): Promise<SaleWithItems>;
  getTodaySales(): Promise<number>;
  getRecentSales(limit?: number): Promise<Sale[]>;

  // Dashboard operations
  getDashboardStats(): Promise<DashboardStats>;
}

export class MemStorage implements IStorage {
  private medicines: Map<number, Medicine> = new Map();
  private customers: Map<number, Customer> = new Map();
  private suppliers: Map<number, Supplier> = new Map();
  private sales: Map<number, Sale> = new Map();
  private saleItems: Map<number, SaleItem> = new Map();
  
  private currentMedicineId = 1;
  private currentCustomerId = 1;
  private currentSupplierId = 1;
  private currentSaleId = 1;
  private currentSaleItemId = 1;

  constructor() {
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Add sample suppliers
    const supplier1: Supplier = {
      id: this.currentSupplierId++,
      name: "PharmaCorp Ltd",
      email: "info@pharmacorp.com",
      phone: "+1-555-0101",
      address: "123 Medical Drive, Health City, HC 12345",
      contactPerson: "Dr. Sarah Wilson",
      createdAt: new Date(),
    };
    
    const supplier2: Supplier = {
      id: this.currentSupplierId++,
      name: "MediSupply Inc",
      email: "orders@medisupply.com",
      phone: "+1-555-0102",
      address: "456 Pharma Street, Medicine Town, MT 67890",
      contactPerson: "James Chen",
      createdAt: new Date(),
    };

    this.suppliers.set(supplier1.id, supplier1);
    this.suppliers.set(supplier2.id, supplier2);

    // Add sample medicines
    const medicine1: Medicine = {
      id: this.currentMedicineId++,
      name: "Paracetamol 500mg",
      genericName: "Acetaminophen",
      category: "Pain Relief",
      manufacturer: "Generic Pharma",
      batchNumber: "PC2024001",
      expiryDate: "2025-12-31",
      quantity: 8,
      purchasePrice: "1.50",
      sellingPrice: "2.50",
      minimumStock: 50,
      supplierId: supplier1.id,
      description: "Pain relief and fever reducer",
      createdAt: new Date(),
    };

    const medicine2: Medicine = {
      id: this.currentMedicineId++,
      name: "Ibuprofen 400mg",
      genericName: "Ibuprofen",
      category: "Pain Relief",
      manufacturer: "MediCorp",
      batchNumber: "IB2024002",
      expiryDate: "2025-08-15",
      quantity: 15,
      purchasePrice: "2.00",
      sellingPrice: "3.25",
      minimumStock: 30,
      supplierId: supplier2.id,
      description: "Anti-inflammatory pain reliever",
      createdAt: new Date(),
    };

    this.medicines.set(medicine1.id, medicine1);
    this.medicines.set(medicine2.id, medicine2);

    // Add sample customers
    const customer1: Customer = {
      id: this.currentCustomerId++,
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1-555-0201",
      address: "789 Oak Street, Anytown, AT 54321",
      dateOfBirth: "1985-03-15",
      createdAt: new Date(),
    };

    this.customers.set(customer1.id, customer1);
  }

  // Medicine operations
  async getMedicines(): Promise<Medicine[]> {
    return Array.from(this.medicines.values());
  }

  async getMedicine(id: number): Promise<Medicine | undefined> {
    return this.medicines.get(id);
  }

  async createMedicine(medicine: InsertMedicine): Promise<Medicine> {
    const id = this.currentMedicineId++;
    const newMedicine: Medicine = {
      ...medicine,
      id,
      createdAt: new Date(),
    };
    this.medicines.set(id, newMedicine);
    return newMedicine;
  }

  async updateMedicine(id: number, medicine: Partial<InsertMedicine>): Promise<Medicine | undefined> {
    const existing = this.medicines.get(id);
    if (!existing) return undefined;
    
    const updated: Medicine = { ...existing, ...medicine };
    this.medicines.set(id, updated);
    return updated;
  }

  async deleteMedicine(id: number): Promise<boolean> {
    return this.medicines.delete(id);
  }

  async searchMedicines(query: string): Promise<Medicine[]> {
    const allMedicines = Array.from(this.medicines.values());
    const searchTerm = query.toLowerCase();
    
    return allMedicines.filter(medicine => 
      medicine.name.toLowerCase().includes(searchTerm) ||
      medicine.genericName?.toLowerCase().includes(searchTerm) ||
      medicine.category.toLowerCase().includes(searchTerm) ||
      medicine.manufacturer.toLowerCase().includes(searchTerm)
    );
  }

  async getLowStockMedicines(): Promise<Medicine[]> {
    const allMedicines = Array.from(this.medicines.values());
    return allMedicines.filter(medicine => medicine.quantity <= medicine.minimumStock);
  }

  // Customer operations
  async getCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }

  async getCustomer(id: number): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const id = this.currentCustomerId++;
    const newCustomer: Customer = {
      ...customer,
      id,
      createdAt: new Date(),
    };
    this.customers.set(id, newCustomer);
    return newCustomer;
  }

  async updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const existing = this.customers.get(id);
    if (!existing) return undefined;
    
    const updated: Customer = { ...existing, ...customer };
    this.customers.set(id, updated);
    return updated;
  }

  async deleteCustomer(id: number): Promise<boolean> {
    return this.customers.delete(id);
  }

  async searchCustomers(query: string): Promise<Customer[]> {
    const allCustomers = Array.from(this.customers.values());
    const searchTerm = query.toLowerCase();
    
    return allCustomers.filter(customer => 
      customer.name.toLowerCase().includes(searchTerm) ||
      customer.email?.toLowerCase().includes(searchTerm) ||
      customer.phone.toLowerCase().includes(searchTerm)
    );
  }

  // Supplier operations
  async getSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliers.values());
  }

  async getSupplier(id: number): Promise<Supplier | undefined> {
    return this.suppliers.get(id);
  }

  async createSupplier(supplier: InsertSupplier): Promise<Supplier> {
    const id = this.currentSupplierId++;
    const newSupplier: Supplier = {
      ...supplier,
      id,
      createdAt: new Date(),
    };
    this.suppliers.set(id, newSupplier);
    return newSupplier;
  }

  async updateSupplier(id: number, supplier: Partial<InsertSupplier>): Promise<Supplier | undefined> {
    const existing = this.suppliers.get(id);
    if (!existing) return undefined;
    
    const updated: Supplier = { ...existing, ...supplier };
    this.suppliers.set(id, updated);
    return updated;
  }

  async deleteSupplier(id: number): Promise<boolean> {
    return this.suppliers.delete(id);
  }

  // Sale operations
  async getSales(): Promise<Sale[]> {
    return Array.from(this.sales.values());
  }

  async getSale(id: number): Promise<SaleWithItems | undefined> {
    const sale = this.sales.get(id);
    if (!sale) return undefined;
    
    const items = Array.from(this.saleItems.values()).filter(item => item.saleId === id);
    return { ...sale, items };
  }

  async createSale(sale: InsertSale, items: InsertSaleItem[]): Promise<SaleWithItems> {
    const saleId = this.currentSaleId++;
    const newSale: Sale = {
      ...sale,
      id: saleId,
      createdAt: new Date(),
    };
    this.sales.set(saleId, newSale);

    const saleItemsData: SaleItem[] = [];
    for (const item of items) {
      const saleItemId = this.currentSaleItemId++;
      const newSaleItem: SaleItem = {
        ...item,
        id: saleItemId,
        saleId,
      };
      this.saleItems.set(saleItemId, newSaleItem);
      saleItemsData.push(newSaleItem);

      // Update medicine stock
      const medicine = this.medicines.get(item.medicineId);
      if (medicine) {
        medicine.quantity -= item.quantity;
        this.medicines.set(medicine.id, medicine);
      }
    }

    return { ...newSale, items: saleItemsData };
  }

  async getTodaySales(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaySales = Array.from(this.sales.values()).filter(sale => {
      const saleDate = new Date(sale.createdAt!);
      saleDate.setHours(0, 0, 0, 0);
      return saleDate.getTime() === today.getTime();
    });

    return todaySales.reduce((total, sale) => total + parseFloat(sale.total), 0);
  }

  async getRecentSales(limit: number = 10): Promise<Sale[]> {
    const allSales = Array.from(this.sales.values());
    return allSales
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
      .slice(0, limit);
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const totalMedicines = this.medicines.size;
    const lowStockItems = (await this.getLowStockMedicines()).length;
    const todaySales = await this.getTodaySales();
    const activeCustomers = this.customers.size;

    return {
      totalMedicines,
      lowStockItems,
      todaySales,
      activeCustomers,
    };
  }
}

export const storage = new MemStorage();
