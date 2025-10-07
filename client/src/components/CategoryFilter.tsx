
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TreePine, Leaf, Apple, Flower, Palmtree } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

// Icon mapping for different categories
const getCategoryIcon = (category: string) => {
  const lowerCategory = category.toLowerCase();
  if (lowerCategory.includes('indigenous') || lowerCategory.includes('tree')) {
    return <TreePine className="h-4 w-4" />;
  }
  if (lowerCategory.includes('ornamental')) {
    return <Leaf className="h-4 w-4" />;
  }
  if (lowerCategory.includes('fruit')) {
    return <Apple className="h-4 w-4" />;
  }
  if (lowerCategory.includes('honey')) {
    return <span className="text-yellow-500">🍯</span>;
  }
  if (lowerCategory.includes('flower')) {
    return <Flower className="h-4 w-4" />;
  }
  if (lowerCategory.includes('palm')) {
    return <Palmtree className="h-4 w-4" />;
  }
  if (lowerCategory.includes('herb')) {
    return <Leaf className="h-4 w-4 text-green-500" />;
  }
  // Default icon for any new category
  return <TreePine className="h-4 w-4" />;
};

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onCategoryChange }) => {
  // Fetch categories dynamically from API
  const { data: apiCategories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      return response.json();
    },
  });

  // Build categories array with "All Categories" first, then dynamic categories
  const categories = React.useMemo(() => {
    const allCategories = [
      { value: 'all', label: 'All Categories', icon: <TreePine className="h-4 w-4" /> }
    ];
    
    // Add dynamic categories from API
    apiCategories.forEach((category: string) => {
      allCategories.push({
        value: category,
        label: category,
        icon: getCategoryIcon(category)
      });
    });
    
    return allCategories;
  }, [apiCategories]);

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="animate-pulse bg-gray-200 h-10 rounded"></div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {/* Mobile Select Dropdown */}
      <div className="sm:hidden mb-4">
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full" data-testid="select-category-mobile">
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

      {/* Horizontal Category Tabs - Desktop & Tablet */}
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => onCategoryChange(category.value)}
                data-testid={`tab-category-${category.value}`}
                className={`flex items-center space-x-2 px-6 py-3 whitespace-nowrap border-b-2 transition-all duration-200 ${
                  selectedCategory === category.value 
                    ? "border-green-600 text-green-600 font-semibold" 
                    : "border-transparent text-gray-600 hover:text-green-600 hover:border-gray-300"
                }`}
              >
                {category.icon}
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
