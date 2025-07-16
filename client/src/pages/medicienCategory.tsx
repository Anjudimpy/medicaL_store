import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input"; // Assuming shadcn/ui input component is available
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Assuming shadcn/ui table components are available
import { Button } from "@/components/ui/button"; // Assuming shadcn/ui button component is available

import {
  Tablets,
  Syringe,
  FlaskRound,
  Pill,
  Droplets,
  Feather,
  PenLine,
  Wheat,
  SprayCan,
  Heart,
  ArrowLeft, // Icon for back button
} from "lucide-react";

// Main component to display medicine categories and their details
function App() {
  // State to keep track of the currently selected category for detailed view
  // If null, the main category grid is shown.
  const [selectedCategory, setSelectedCategory] = useState(null);
  // State to store the search query for the table
  const [searchTerm, setSearchTerm] = useState("");

  // Define the list of medicine categories
  const categories = [
    { name: "Tablets", count: "123 items", icon: Tablets, bgColor: "bg-green-500" },
    { name: "Ointment", count: "45 items", icon: PenLine, bgColor: "bg-red-500" },
    { name: "Injections", count: "67 items", icon: Syringe, bgColor: "bg-blue-500" },
    { name: "Syrups", count: "89 items", icon: FlaskRound, bgColor: "bg-purple-500" },
    { name: "Capsules", count: "101 items", icon: Pill, bgColor: "bg-orange-500" },
    { name: "Lotion", count: "23 items", icon: Droplets, bgColor: "bg-pink-500" },
    { name: "Inhaler", count: "34 items", icon: SprayCan, bgColor: "bg-sky-400" },
    { name: "Diapers", count: "56 items", icon: Feather, bgColor: "bg-yellow-500" },
    { name: "Surgicals", count: "78 items", icon: Heart, bgColor: "bg-teal-500" },
    { name: "Food Products", count: "90 items", icon: Wheat, bgColor: "bg-yellow-700" },
  ];

  // Dummy data for Tablets (can be extended for other categories)
  const tabletData = [
    { id: 1, name: "Paracetamol", strength: "500mg", quantity: 100, price: "₹2.50" },
    { id: 2, name: "Ibuprofen", strength: "400mg", quantity: 50, price: "₹4.00" },
    { id: 3, name: "Amoxicillin", strength: "250mg", quantity: 75, price: "₹7.20" },
    { id: 4, name: "Cetirizine", strength: "10mg", quantity: 30, price: "₹1.80" },
    { id: 5, name: "Omeprazole", strength: "20mg", quantity: 60, price: "₹3.10" },
    { id: 6, name: "Aspirin", strength: "75mg", quantity: 120, price: "₹1.00" },
  ];

  // Handler for when a category card is clicked
  const handleCardClick = (categoryName) => {
    setSelectedCategory(categoryName);
    setSearchTerm(""); // Reset search term when changing categories
  };

  // Handler to go back to the main categories view
  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSearchTerm(""); // Reset search term when going back
  };

  // Filter tablet data based on search term
  const filteredTabletData = tabletData.filter(tablet =>
    tablet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tablet.strength.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Conditional rendering based on selectedCategory state
  return (
     <div>
      {selectedCategory === null ? (
        // Display the grid of medicine categories
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-gray-800">Medicine Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-105 shadow-sm"
                  onClick={() => handleCardClick(category.name)}
                >
                  <div className={`w-14 h-14 ${category.bgColor} rounded-lg flex items-center justify-center mx-auto mb-3 shadow-md`}>
                    <category.icon className="text-white text-2xl" />
                  </div>
                  <p className="font-semibold text-gray-900 text-base">{category.name}</p>
                  <p className="text-sm text-gray-500">{category.count}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        // Display the detailed view for the selected category
        <Card className="rounded-xl shadow-lg ">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBackToCategories}
                className="rounded-full hover:bg-gray-200"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Button>
              {selectedCategory} Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedCategory === "Tablets" ? (
              // Specific content for Tablets
              <>
                <div className="mb-4 flex flex-row-reverse">
                  <Input
                    type="text"
                    placeholder="Search by name or strength..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-sm rounded-md border  border-gray-300 outline-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="overflow-x-auto">
                  {filteredTabletData.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Strength</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTabletData.map((tablet) => (
                          <TableRow key={tablet.id}>
                            <TableCell className="font-medium">{tablet.id}</TableCell>
                            <TableCell>{tablet.name}</TableCell>
                            <TableCell>{tablet.strength}</TableCell>
                            <TableCell>{tablet.quantity}</TableCell>
                            <TableCell className="text-right">{tablet.price}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-gray-600 py-8">No tablets found matching your search.</p>
                  )}
                </div>
              </>
            ) : (
              // Generic content for other categories
              <div className="text-center p-8 text-gray-600">
                <p className="text-lg font-medium">
                  Detailed view for "{selectedCategory}" is coming soon!
                </p>
                <p className="text-sm mt-2">
                  This section will display specific items and information for {selectedCategory}.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default App;
