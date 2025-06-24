
import React from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TreePine, Leaf, Apple } from "lucide-react";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { value: 'all', label: 'All Categories', icon: <TreePine className="h-4 w-4" /> },
  { value: 'Indigenous Trees', label: 'Indigenous Trees', icon: <TreePine className="h-4 w-4" /> },
  { value: 'Ornamental Trees', label: 'Ornamental Trees', icon: <Leaf className="h-4 w-4" /> },
  { value: 'Fruit Trees', label: 'Fruit Trees', icon: <Apple className="h-4 w-4" /> },
];

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div className="mb-8">
      {/* Mobile Select Dropdown */}
      <div className="md:hidden mb-4">
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                <div className="flex items-center space-x-2">
                  {category.icon}
                  <span>{category.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Filter Buttons */}
      <div className="hidden md:flex flex-wrap gap-3 justify-center">
        {categories.map((category) => (
          <Button
            key={category.value}
            variant={selectedCategory === category.value ? "default" : "outline"}
            onClick={() => onCategoryChange(category.value)}
            className={`flex items-center space-x-2 ${
              selectedCategory === category.value 
                ? "bg-green-600 hover:bg-green-700 text-white" 
                : "border-green-600 text-green-600 hover:bg-green-50"
            }`}
          >
            {category.icon}
            <span>{category.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
