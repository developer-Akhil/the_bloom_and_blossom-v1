import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useMediaContext } from '../../context/MediaContext';
import { rawLogoData } from '../../data/products';
import { OptimizedImage } from './OptimizedImage';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { assets } = useMediaContext();

  const logoKeys = Object.keys(rawLogoData);
  const getLogoPath = () => {
    const customLogo = assets?.find(a => a.folder_id === 'logo');
    if (customLogo) return customLogo.file_url;
    return logoKeys.length > 0 ? logoKeys[0].replace('public', '') : '/images/logo/logo.jpeg';
  };
  const logoPath = getLogoPath();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/collections?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300 glass-morphism border-b bg-white/80">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-3 -ml-2 text-gray-600 hover:text-bloom-rose"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-bloom-rose/20 group-hover:border-bloom-rose transition-all duration-500 shadow-inner">
              <OptimizedImage 
                src={logoPath} 
                alt="Logo" 
                className="w-full h-full object-cover transition-transform group-hover:scale-110" 
              />
            </div>
            <span className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-bloom-rose">
              The Bloom <span className="text-gray-400 font-light">&</span> Blossom
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/collections">Collections</NavLink>
            <NavLink to="/new-arrivals">New Arrivals</NavLink>
            <NavLink to="/about">Our Story</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="hidden sm:flex items-center">
              <form onSubmit={handleSearch} className={`flex items-center transition-all duration-300 ${isSearchOpen ? 'w-48 opacity-100 mr-2' : 'w-0 opacity-0 overflow-hidden'}`}>
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-sm border-b border-gray-300 focus:border-bloom-rose outline-none py-1 bg-transparent placeholder:text-gray-400"
                />
              </form>
              <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 text-gray-500 hover:text-bloom-rose transition-colors relative z-10">
                <Search size={20} />
              </button>
            </div>
            
            <Link to="/wishlist" className="p-2 text-gray-500 hover:text-bloom-rose transition-colors relative">
              <Heart size={20} />
            </Link>
            <Link to={user ? "/dashboard" : "/auth"} className="p-2 text-gray-500 hover:text-bloom-rose transition-colors">
              <User size={20} />
            </Link>
            <Link to="/cart" className="p-2 text-gray-500 hover:text-bloom-rose transition-colors relative">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-bloom-rose text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-white overflow-hidden shadow-2xl"
          >
            <div className="flex flex-col space-y-1 p-4 font-medium">
              <MobileNavLink to="/" onClick={() => setIsMenuOpen(false)}>Home</MobileNavLink>
              <MobileNavLink to="/collections" onClick={() => setIsMenuOpen(false)}>Collections</MobileNavLink>
              <MobileNavLink to="/new-arrivals" onClick={() => setIsMenuOpen(false)}>New Arrivals</MobileNavLink>
              <MobileNavLink to="/about" onClick={() => setIsMenuOpen(false)}>Our Story</MobileNavLink>
              <MobileNavLink to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</MobileNavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link 
      to={to} 
      className="text-sm font-medium text-gray-600 hover:text-bloom-rose transition-colors relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-bloom-rose transition-all group-hover:w-full" />
    </Link>
  );
}

function MobileNavLink({ to, children, onClick }: { to: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className="text-lg text-gray-700 hover:text-bloom-rose transition-colors py-4 px-2 border-b border-gray-50 flex items-center justify-between group"
    >
      <span>{children}</span>
      <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
}
