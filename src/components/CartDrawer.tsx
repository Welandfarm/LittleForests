
import React from 'react';
import { Button } from "@/components/ui/button";
import { X, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

  const handleWhatsAppOrder = () => {
    if (cartItems.length === 0) return;
    
    const orderDetails = cartItems.map(item => 
      `- ${item.quantity} x ${item.name} (KSh ${item.price} each)`
    ).join('\n');
    
    const total = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    const message = `Hello LittleForest!\n\nI would like to place an order for the following seedlings:\n\n${orderDetails}\n\nTotal: KSh ${total.toFixed(2)}\n\nPlease confirm availability and delivery details.\n\nThank you!`;
    
    const whatsappUrl = `https://wa.me/254108029407?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={onClose}>
      <div 
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-lg transform transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500 mt-8">Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">KSh {item.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {cartItems.length > 0 && (
          <div className="border-t p-4">
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={handleWhatsAppOrder}
            >
              Order via WhatsApp
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
