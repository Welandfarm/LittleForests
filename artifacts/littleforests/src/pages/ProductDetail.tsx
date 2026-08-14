import { useState, useEffect } from 'react';
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
import { ArrowLeft, Plus, Minus, ShoppingCart, MessageCircle, Leaf, Share2, Copy, Check, Facebook } from 'lucide-react';
import DonateButton from '@/components/DonateButton';
import SEO from '@/components/SEO';
<<<<<<< HEAD
import BrandName from '@/components/BrandName';
=======
>>>>>>> 95c8ffdb2e9c18f0fccbce5e86f5122a9459e81f

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareMenuRef = useEffect(() => {}, []) as any; // placeholder, real ref below

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => apiClient.getProduct(id!) as Promise<any>,
    enabled: !!id,
  });

  const { data: allProducts = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => apiClient.getProducts() as Promise<any[]>,
  });

  const sameCat = (allProducts as any[]).filter(p => p.id !== id && p.category === product?.category);
  const related = sameCat.length > 0
    ? sameCat.slice(0, 4)
    : (allProducts as any[]).filter(p => p.id !== id).slice(0, 4);

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

  const handleShare = async () => {
    const name = product?.name || product?.plant_name || 'this plant';
    const price = typeof product?.price === 'number' ? `KSH ${product.price}` : product?.price || '';
    const url = window.location.href;
    const text = `Check out ${name} (${price}) at LittleForest 🌿`;

    if (navigator.share) {
      // Native share sheet — opens WhatsApp, Facebook, Messages, etc. on mobile
      try {
        await navigator.share({ title: name, text, url });
      } catch (_) {
        // User cancelled — do nothing
      }
    } else {
      // Desktop fallback: show share menu
      setShowShareMenu(s => !s);
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => { setCopied(false); setShowShareMenu(false); }, 2000);
  };

  const shareToWhatsApp = () => {
    const name = product?.name || product?.plant_name || 'this plant';
    const price = typeof product?.price === 'number' ? `KSH ${product.price}` : product?.price || '';
    const text = `Check out ${name} (${price}) at LittleForest 🌿\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    setShowShareMenu(false);
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
    setShowShareMenu(false);
  };

  const imageUrl =
    product?.image_url ||
    product?.imageUrl ||
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop';

  const productName = product?.name || product?.plant_name || '';
  const isOutOfStock = product?.status === 'Out of Stock' || product?.stock_quantity === 0;

  // Structured Product schema for this listing (passed to <SEO>, which
  // renders it into <head> via react-helmet-async).
  const productJsonLd = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": productName,
    "description": product.description || `${productName} — available from LittleForest Nursery, Bomet County, Kenya.`,
    "image": imageUrl,
    "brand": { "@type": "Brand", "name": "LittleForest Nursery" },
    "category": product.category,
    "offers": {
      "@type": "Offer",
      "url": `https://littleforest.co.ke/products/${product.id}`,
      "priceCurrency": "KES",
      "price": typeof product.price === 'number' ? product.price : String(product.price).replace(/[^0-9.]/g, ''),
      "availability": isOutOfStock
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
      "seller": { "@type": "Organization", "name": "LittleForest Nursery" }
    }
  } : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {productName && (
        <SEO
          title={`${productName} — LittleForest Nursery`}
          description={
            product?.description
              ? String(product.description).slice(0, 160)
              : `Buy ${productName} from LittleForest Nursery, Bomet County, Kenya. Order via WhatsApp.`
          }
          path={`/products/${id}`}
          image={imageUrl}
          type="product"
          jsonLd={productJsonLd}
        />
      )}

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2">
<<<<<<< HEAD
              <BrandName className="text-2xl" />
=======
              <h1 className="text-2xl font-bold">
                <span className="text-orange-500">Little</span>
                <span className="text-green-600">Forest</span>
              </h1>
>>>>>>> 95c8ffdb2e9c18f0fccbce5e86f5122a9459e81f
            </Link>
            <div className="flex items-center gap-3">
              <AuthButton />
              <DonateButton />
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
                loading="lazy"
                className="w-full h-full object-cover"
                onError={e => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop';
                }}
              />
            </div>

            {/* Details */}
            <div className="py-2">
              {/* Category + Share */}
              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline" className="text-green-700 border-green-300">
                  <Leaf className="h-3 w-3 mr-1" />
                  {product.category}
                </Badge>

                {/* Share button */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                    className="gap-1.5 text-gray-500 hover:text-green-700"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>

                  {/* Desktop fallback share menu */}
                  {showShareMenu && (
                    <div className="absolute right-0 top-10 z-20 bg-white border border-gray-100 rounded-xl shadow-lg p-2 w-44 flex flex-col gap-1">
                      <button
                        onClick={shareToWhatsApp}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                      >
                        <MessageCircle className="h-4 w-4 text-green-600" />
                        WhatsApp
                      </button>
                      <button
                        onClick={shareToFacebook}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                      >
                        <Facebook className="h-4 w-4 text-blue-600" />
                        Facebook
                      </button>
                      <button
                        onClick={copyLink}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-gray-500" />}
                        {copied ? 'Copied!' : 'Copy link'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

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

      {/* Related products */}
      {related.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-xl font-bold text-gray-800 mb-6">You might also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map((p: any) => {
              const name = p.name || p.plant_name;
              const price = typeof p.price === 'number' ? `KSH ${p.price}` : p.price;
              const img = p.image_url || p.imageUrl ||
                'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop';
              return (
                <button
                  key={p.id}
                  onClick={() => { navigate(`/products/${p.id}`); window.scrollTo(0, 0); }}
                  className="group text-left bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                >
                  <div className="aspect-square overflow-hidden bg-green-50">
                    <img
                      src={img}
                      alt={name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-800 line-clamp-1">{name}</p>
                    <p className="text-sm font-bold text-green-600 mt-0.5">{price}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default ProductDetail;
