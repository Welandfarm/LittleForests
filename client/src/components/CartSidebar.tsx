
import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Minus, Plus, ShoppingCart } from 'lucide-react';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();

  const handleWhatsAppOrder = () => {
    console.log('WhatsApp order button clicked!');
    console.log('Cart items:', cartItems);
    
    if (cartItems.length === 0) {
      console.log('Cart is empty, returning');
      return;
    }

    const orderItems = cartItems.map(item => 
      `- ${item.quantity} x ${item.name} (${item.price} each)`
    ).join('\n');

    const message = `Hi

I would like to place an order for the following seedlings:

${orderItems}

Please confirm availability and let me know`;
    
    const whatsappUrl = `https://wa.me/254108029407?text=${encodeURIComponent(message)}`;
    console.log('Opening WhatsApp URL:', whatsappUrl);
    
    window.open(whatsappUrl, '_blank');
    clearCart();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="ml-auto h-full w-96 bg-white shadow-xl relative z-10">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-semibold flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Your Cart ({cartItems.length})
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                Your cart is empty
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm mb-1">{item.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-green-600">Qty: {item.quantity}</span>
                          <span className="text-sm text-gray-500">× {item.price}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <input
                          type="number"
                          min="1"
                          max="9999"
                          value={item.quantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 1;
                            updateQuantity(item.id, Math.max(1, Math.min(9999, value)));
                          }}
                          onFocus={(e) => e.target.select()}
                          className="w-20 text-center font-semibold text-gray-700 border-2 border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="text-sm font-medium text-gray-700">@ {item.price}</span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="border-t p-4 space-y-2">
              <Button
                onClick={handleWhatsAppOrder}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                data-testid="button-whatsapp-order"
              >
                Order via WhatsApp
              </Button>
              <Button
                variant="outline"
                onClick={clearCart}
                className="w-full"
              >
                Clear Cart
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
