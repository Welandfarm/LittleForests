
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Plus, Minus } from "lucide-react";
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  image_url?: string;
  imageUrl?: string;
  description?: string;
  status: string;
  [key: string]: any;
}

interface ProductCarouselProps {
  products: Product[];
  categoryName: string;
  quantities: {[key: string]: number};
  onUpdateQuantity: (productId: string, change: number) => void;
  onSetQuantity: (productId: string, quantity: number) => void;
  onAddToCart: (product: Product) => void;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ 
  products, 
  categoryName, 
  quantities, 
  onUpdateQuantity,
  onSetQuantity, 
  onAddToCart 
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-green-800 mb-4">{categoryName}</h3>
      <Carousel 
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {products.map((product) => (
            <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                <div className="relative">
                  <img 
                    src={product.image_url || product.imageUrl || "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop"} 
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant={product.status === 'Available' ? "default" : "secondary"}>
                      {product.status}
                    </Badge>
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge variant="outline" className="bg-white">
                      {product.category}
                    </Badge>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-semibold mb-2">{product.name}</h4>
                  <p className="text-gray-600 mb-4 text-sm">{product.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-green-600">{product.price}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateQuantity(product.id, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        max="999"
                        value={quantities[product.id] || 1}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 1;
                          onSetQuantity(product.id, Math.max(1, Math.min(999, value)));
                        }}
                        className="w-16 text-center text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateQuantity(product.id, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button 
                      size="sm" 
                      disabled={product.status !== 'Available'}
                      onClick={() => onAddToCart(product)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </div>
  );
};

export default ProductCarousel;
