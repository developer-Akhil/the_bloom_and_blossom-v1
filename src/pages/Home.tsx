import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Star, Heart, ShoppingBag } from 'lucide-react';
import { products as baseProducts, categories as baseCategories } from '../data/products';
import { useMediaContext } from '../context/MediaContext';
import { useProductContext } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { type Product } from '../types';

import { OptimizedImage } from '../components/common/OptimizedImage';

export function Home() {
  const { products, categories } = useProductContext();
  const { assets } = useMediaContext();
  
  // Custom helper to dynamically find an overridden image from the admin "home_images" folder
  const getHeroImage = () => {
    const customHero = assets.find(a => a.folder_id === 'home_images');
    return customHero ? customHero.file_url : 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=60&w=1920';
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden floral-gradient py-12 md:py-0">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.15, scale: 1 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 bg-gray-50 bg-cover bg-center"
            style={{ backgroundImage: `url('${getHeroImage()}')` }}
          />
          <div className="absolute inset-0 bg-white/40 md:bg-transparent" />
          
          {/* Floating Petals for extra variety */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * 100 + "%", 
                y: -100,
                rotate: 0,
                opacity: 0.5 
              }}
              animate={{ 
                y: "120vh",
                x: i % 2 === 0 ? "20%" : "80%",
                rotate: 360,
              }}
              transition={{ 
                duration: 10 + Math.random() * 10, 
                repeat: Infinity, 
                ease: "linear",
                delay: i * 2
              }}
              className="absolute pointer-events-none"
            >
              <div className="w-4 h-4 bg-bloom-pink/30 rounded-full blur-[2px]" />
            </motion.div>
          ))}
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 w-full">
          <div className="max-w-3xl space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-5 py-2 bg-bloom-pink text-bloom-rose text-xs font-bold tracking-[0.2em] uppercase rounded-full mb-6">
                Handcrafted with Love
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-6xl md:text-8xl font-bold leading-[1.1] text-gray-900"
            >
              Your Hair’s <br />
              <span className="text-bloom-rose italic relative inline-block">
                New Best
                <motion.span 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="absolute bottom-2 left-0 h-1 bg-bloom-pink/50 -z-10" 
                />
              </span> Friend
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-gray-600 font-light max-w-xl leading-relaxed"
            >
              Discover our curated collection of delicate hair accessories, 
              from customized velvet bows to premium silk scrunchies. 
              <span className="block mt-2 font-medium text-bloom-rose/70">Every piece tells a story.</span>
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pt-6"
            >
              <Link 
                to="/collections" 
                className="w-full sm:w-auto px-10 py-5 bg-bloom-rose text-white rounded-full font-bold shadow-xl shadow-bloom-rose/30 hover:scale-105 transition-all text-center flex items-center justify-center group"
              >
                Shop Collection 
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/new-arrivals" 
                className="w-full sm:w-auto px-10 py-5 bg-white text-gray-900 border border-gray-100 rounded-full font-bold hover:bg-gray-50 transition-all text-center shadow-lg"
              >
                New Arrivals
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Floating Decorative Elements - Bow Collection */}
        <div className="absolute right-[5%] top-[15%] bottom-[10%] hidden lg:flex flex-col items-center justify-center pointer-events-none">
          {/* photo_1 - Main Large Image (Bows on Mat) */}
          <motion.div 
            animate={{ y: [0, -20, 0], rotate: [3, -1, 3] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-80 h-80 rounded-[4rem] overflow-hidden border-8 border-white shadow-[0_25px_50px_-12px_rgba(255,182,193,0.5)] z-20"
          >
             <OptimizedImage src="/images/home_images/photo_1.jpg" alt="Handcrafted Bow Collection" className="w-full h-full object-cover" />
          </motion.div>

          {/* photo_2 - Overlapping Smaller Image 1 (Name Bows) */}
          <motion.div 
            animate={{ y: [0, 25, 0], rotate: [-5, -12, -5] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -left-16 bottom-[10%] w-56 h-56 rounded-[3.5rem] overflow-hidden border-4 border-white shadow-2xl z-30"
          >
             <OptimizedImage src="/images/home_images/photo_2.jpg" alt="Customised Name Bows" className="w-full h-full object-cover" />
          </motion.div>

          {/* photo_3 - Overlapping Smaller Image 2 (Character Bows) */}
          <motion.div 
            animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -right-12 top-[5%] w-44 h-44 rounded-full overflow-hidden border-4 border-white shadow-xl z-10 opacity-90"
          >
             <OptimizedImage src="/images/home_images/photo_3.jpg" alt="Doll & Character Bows" className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4 md:space-y-0 text-center md:text-left">
          <div className="space-y-2">
            <h2 className="font-serif text-3xl md:text-4xl font-bold">Shop by Category</h2>
            <p className="text-gray-400">Explore our diverse range of handcrafted delights</p>
          </div>
          <Link to="/collections" className="text-bloom-rose font-bold text-sm hover:underline underline-offset-4 inline-flex items-center mx-auto md:mx-0">
            View All Collections <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <CategoryCard key={cat} title={cat} index={idx} />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-bloom-pink/30 py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-serif text-3xl md:text-5xl font-bold">Our Best Sellers</h2>
            <p className="text-gray-500 max-w-xl mx-auto">These are the pieces our community loves the most. Hand-picked for their timeless appeal and quality.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} redirectToCategory={true} />
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Section */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="bg-bloom-rose rounded-[3rem] p-12 md:p-20 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-white opacity-10 -skew-x-12 translate-x-1/2" />
          <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-white leading-tight">
              Get 5% Off Your First Order
            </h2>
            <p className="text-pink-100 text-lg">
              Join our Bloom Circle and stay updated with new drops, exclusive offers, and styling tips.
            </p>
            <div className="flex w-full max-w-md flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-grow bg-white/10 border border-white/20 rounded-full px-8 py-4 text-white placeholder:text-pink-200 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
              />
              <button className="px-8 py-4 bg-white text-bloom-rose rounded-full font-bold hover:bg-gray-100 transition-all shadow-xl">
                Subscribe
              </button>
            </div>
            <div className="pt-6 border-t border-white/20 w-full text-center">
              <Link to="/returns" className="text-white hover:text-pink-200 text-sm font-medium underline underline-offset-4 transition-colors">
                View our Returns & Refunds Policy (Final Sale)
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function CategoryCard({ title, index }: { title: string; index: number }) {
  const navigate = useNavigate();
  const { assets } = useMediaContext();
  
  const getCategoryImage = () => {
    // 1. Try to find a custom uploaded image securely placed in the product_images folder
    // whose file name matches the category title roughly.
    const slug = title.toLowerCase().replace(/\s+/g, '_');
    const customProdImage = assets.reverse().find(a => 
       a.folder_id === 'product_images' && a.file_name.toLowerCase().includes(slug)
    );
    if (customProdImage) return customProdImage.file_url;

    // 2. Try the collections/ fallback
    const customColImage = assets.reverse().find(a => 
      a.folder_id === `collections/${slug}`
    );
    if (customColImage) return customColImage.file_url;

    // 3. System Defaults
    const defaults: Record<string, string> = {
      'Customised Name Bows': '/images/product_images/customised_name_bows.jpg',
      'Premium Doll Bows': '/images/product_images/premium_doll_bows.jpg',
      'Jewelled Bows': '/images/product_images/jewelled_bows.jpg',
      'Hairbands': '/images/product_images/hairbands.jpg',
      'Embroidery Bows': '/images/product_images/embroidery_bows.jpg',
      'Crochet Clips': '/images/product_images/crochet_clips.jpg',
      'Alligator Clips': '/images/product_images/alligator_clips.jpg',
      'Customised Name Sunglasses': '/images/product_images/customised_name_sunglasses.jpg',
      'Headbands': '/images/product_images/headbands.jpg',
      'Customised Caps': '/images/product_images/customised_caps.jpg'
    };
    
    // Final check: if everything else fails, try to construct a direct path based on slug
    const directPathFallback = `/images/product_images/${slug}.jpg`;
    
    return defaults[title] || directPathFallback || 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&q=60&w=600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onClick={() => navigate(`/collections?cat=${encodeURIComponent(title)}`)}
      className="group relative h-64 overflow-hidden rounded-3xl bg-pink-100 cursor-pointer shadow-sm hover:shadow-xl transition-all"
    >
      <div className="absolute inset-0 z-0">
        <OptimizedImage 
          src={getCategoryImage()} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
      </div>
      <div className="absolute inset-0 z-10 flex flex-col justify-end p-6">
        <h3 className="text-white font-serif text-xl font-bold">{title}</h3>
        <p className="text-gray-200 text-xs mt-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">Explore Category</p>
      </div>
    </motion.div>
  );
}

export function ProductCard({ product, redirectToCategory = false }: { product: Product, redirectToCategory?: boolean }) {
  const { addToCart } = useCart();
  const targetUrl = redirectToCategory ? `/collections?cat=${encodeURIComponent(product.category)}` : `/products/${product.id}`;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    const defaultOptions: Record<string, string> = {};
    product.options?.forEach(opt => {
      defaultOptions[opt.name] = opt.values[0];
    });
    addToCart(product, undefined, defaultOptions);
  };

  return (
    <div className="group space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-gray-50 shadow-sm border border-gray-50">
        <OptimizedImage 
          src={product.images[0].includes('unsplash.com') ? `${product.images[0]}&w=600` : product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4">
          {product.isCustomizable && (
            <span className="px-3 py-1 bg-bloom-rose text-white text-[10px] font-bold uppercase rounded-full">Customizable</span>
          )}
        </div>

        {/* Hover Actions (Desktop) / Action Bar (Mobile) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 md:group-hover:opacity-100 transition-all duration-300 bg-black/20 md:group-hover:bg-black/40">
          <Link 
            to={targetUrl}
            className="hidden md:block mb-4 px-6 py-2.5 bg-white text-gray-900 rounded-full text-sm font-bold shadow-xl hover:bg-bloom-rose hover:text-white transition-all transform translate-y-4 md:group-hover:translate-y-0"
          >
            {redirectToCategory ? 'Explore Category' : 'View Details'}
          </Link>
          <div className="flex space-x-2 translate-y-4 md:group-hover:translate-y-0 transition-all duration-300 delay-75">
            <button 
              onClick={handleQuickAdd}
              className="p-3 bg-white/90 rounded-full text-gray-700 hover:text-bloom-rose hover:scale-110 transition-all shadow-lg shadow-black/10"
            >
              <ShoppingBag size={18} />
            </button>
            <button className="p-3 bg-white/90 rounded-full text-gray-700 hover:text-bloom-rose hover:scale-110 transition-all shadow-lg shadow-black/10">
              <Heart size={18} />
            </button>
          </div>
        </div>

        {/* Mobile Action Bar Overlay */}
        <div className="md:hidden absolute bottom-4 left-0 right-0 px-4">
           <div className="flex space-x-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-2xl shadow-lg border border-white/50">
              <Link 
                to={targetUrl}
                className="flex-grow flex items-center justify-center bg-bloom-rose text-white text-[10px] font-bold uppercase rounded-xl py-2"
              >
                {redirectToCategory ? 'Explore Category' : 'View Details'}
              </Link>
              <button 
                onClick={handleQuickAdd}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 rounded-xl"
              >
                <ShoppingBag size={14} />
              </button>
           </div>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{product.category}</span>
          <div className="flex items-center text-xs text-amber-500 font-bold">
            <Star size={12} className="fill-current mr-1" />
            <span>{product.rating}</span>
          </div>
        </div>
        <Link to={targetUrl}>
          <h3 className="font-serif text-lg font-bold text-gray-900 group-hover:text-bloom-rose transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-bloom-rose font-bold">₹{product.price}</p>
      </div>
    </div>
  );
}
