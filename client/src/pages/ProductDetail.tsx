import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Footer from '@/components/Footer';
import NavigationDropdown from '@/components/NavigationDropdown';
import AuthButton from '@/components/AuthButton';
import { ArrowLeft, Plus, Minus, ShoppingCart, MessageCircle, Leaf } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => apiClient.getProduct(id!) as Promise<any>,
    enabled: !!id,
  });

  const adjustQty = (delta: number) =>
    setQuantity(q => Math.max(1, Math.min(999, q + delta)));

  const handleAddToCart = () => {
    if (!product) return;
    const success = addToCart(product, quantity);
    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleWhatsApp = () => {
    if (!product) return;
    const name = product.name || product.plant_name;
    const price = typeof product.price === 'number' ? `KSH ${product.price}` : product.price;
    const msg = `Hello LittleForest! I'd like to order:\n\n- ${quantity} x ${name} (${price} each)\n\nPlease confirm availability.`;
    window.open(`https://wa.me/2540143538080?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const imageUrl =
    product?.image_url ||
    product?.imageUrl ||
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop';

  const productName = product?.name || product?.plant_name || '';
  const isOutOfStock = product?.status === 'Out of Stock' || product?.stock_quantity === 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold">
                <span className="text-orange-500">Little</span>
                <span className="text-green-600">Forest</span>
              </h1>
            </Link>
            <div className="flex items-center gap-3">
              <AuthButton />
              <Link
                to="/"
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Nav */}
      <div className="fixed top-20 left-4 z-40">
        <NavigationDropdown />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-700 transition-colors mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to shop
        </Link>

        {isLoading && (
          <div className="flex items-center justify-center py-32">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600" />
          </div>
        )}

        {error && (
          <div className="text-center py-24 text-gray-500">
            <p className="text-lg font-medium mb-2">Product not found</p>
            <Link to="/" className="text-green-600 underline">Browse all products</Link>
          </div>
        )}

        {product && (
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Image */}
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-green-50 to-gray-100 shadow-sm aspect-square">
              <img
                src={imageUrl}
                alt={productName}
                className="w-full h-full object-cover"
                onError={e => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop';
                }}
              />
            </div>

            {/* Details */}
            <div className="py-2">
              {/* Category */}
              <Badge variant="outline" className="text-green-700 border-green-300 mb-3">
                <Leaf className="h-3 w-3 mr-1" />
                {product.category}
              </Badge>

              {/* Name */}
              <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
                {productName}
              </h1>

              {/* Scientific name */}
              {product.scientific_name && (
                <p className="text-gray-400 italic text-sm mb-4">{product.scientific_name}</p>
              )}

              {/* Price */}
              <p className="text-4xl font-bold text-green-600 mb-1">
                {typeof product.price === 'number' ? `KSH ${product.price}` : product.price}
              </p>
              {(product.jar_volume || product.volume) && (
                <p className="text-sm text-gray-500 mb-4">per {product.jar_volume || product.volume}</p>
              )}

              {/* Stock status */}
              <div className="mb-6">
                {isOutOfStock ? (
                  <span className="inline-flex items-center text-sm font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full">
                    Out of stock
                  </span>
                ) : (
                  <span className="inline-flex items-center text-sm font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full">
                    ✓ Available
                  </span>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-gray-600 leading-relaxed mb-8 border-t border-gray-100 pt-6">
                  {product.description}
                </p>
              )}

              {/* Quantity + actions */}
              {!isOutOfStock && (
                <div className="space-y-4">
                  {/* Quantity */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 font-medium w-20">Quantity</span>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => adjustQty(-1)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        min={1}
                        max={999}
                        value={quantity}
                        onChange={e => setQuantity(Math.max(1, Math.min(999, parseInt(e.target.value) || 1)))}
                        className="w-16 text-center"
                      />
                      <Button variant="outline" size="sm" onClick={() => adjustQty(1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      onClick={handleAddToCart}
                      className={`flex-1 gap-2 transition-all ${added ? 'bg-green-700' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {added ? 'Added!' : 'Add to Cart'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleWhatsApp}
                      className="flex-1 gap-2 border-green-600 text-green-700 hover:bg-green-50"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Order via WhatsApp
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
