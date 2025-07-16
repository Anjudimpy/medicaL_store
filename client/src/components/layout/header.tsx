import { useState } from "react";
import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  // New props for search functionality
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSearchSubmit: () => void;
}

export default function Header({ title = "Dashboard", subtitle = "Welcome back! Here's your store overview", searchTerm, onSearchChange, onSearchSubmit }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">{title}</h2>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Search Bar - Moved back to Header component */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search medicines..."
              value={searchTerm}
              onChange={(e) => {
                // Defensive check to ensure onSearchChange is a function before calling
                if (typeof onSearchChange === 'function') {
                  onSearchChange(e.target.value);
                } else {
                  console.error("Header: onSearchChange prop is not a function!", onSearchChange);
                }
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  // Defensive check for onSearchSubmit as well
                  if (typeof onSearchSubmit === 'function') {
                    onSearchSubmit();
                  } else {
                    console.error("Header: onSearchSubmit prop is not a function!", onSearchSubmit);
                  }
                }
              }}
              className="w-64 pl-10 rounded-md" // Added rounded-md for consistency
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-xs"
              >
                3
              </Badge>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
