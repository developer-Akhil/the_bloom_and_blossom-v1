import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { products as baseProducts } from '../data/products';
import { useDynamicProducts } from '../lib/dynamicPricing';
import { ProductCard } from './Home';
import { Package, Heart, Clock, Settings, User as UserIcon, LogOut, ChevronRight, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useNavigate, Link } from 'react-router-dom';

export function Dashboard() {
  const products = useDynamicProducts(baseProducts);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'recent' | 'settings'>('orders');

  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Beautiful User';

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full md:w-64 space-y-8">
          <div className="flex items-center space-x-4 p-4">
            <div className="w-16 h-16 rounded-full bg-bloom-pink flex items-center justify-center text-bloom-rose font-serif text-2xl font-bold uppercase">
              {name[0]}
            </div>
            <div>
              <h3 className="font-bold text-lg">{name}</h3>
              <p className="text-xs text-gray-400">Blossom Member</p>
            </div>
          </div>

          <nav className="flex flex-col space-y-1">
            <SidebarLink icon={<Package size={18} />} title="Orders" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
            <SidebarLink icon={<Heart size={18} />} title="Wishlist" active={activeTab === 'wishlist'} onClick={() => setActiveTab('wishlist')} />
            <SidebarLink icon={<Clock size={18} />} title="Recently Viewed" active={activeTab === 'recent'} onClick={() => setActiveTab('recent')} />
            <SidebarLink icon={<Settings size={18} />} title="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
            
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-50 rounded-xl transition-all mt-8"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-grow space-y-8">
          <div className="space-y-2">
            <h1 className="font-serif text-4xl font-bold capitalize">{activeTab}</h1>
            <p className="text-gray-400 text-sm">Manage your account and track your blooming collection.</p>
          </div>

          {activeTab === 'orders' && (
            <div className="space-y-6">
              <OrderCard id="BB-98745" status="Delivered" date="Jan 12, 2026" total="₹1,299" />
              <OrderCard id="BB-98746" status="In Transit" date="Apr 16, 2026" total="₹499" />
            </div>
          )}

          {(activeTab === 'wishlist' || activeTab === 'recent') && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.slice(0, 3).map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 space-y-8">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                 <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Display Name</label>
                   <input className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-bloom-rose/20" value={name} readOnly />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                   <input className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-bloom-rose/20" value={user?.email || ''} readOnly />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Mobile Number</label>
                   <input className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-bloom-rose/20" value={user?.phone || user?.user_metadata?.phone || ''} readOnly />
                 </div>
               </div>
               <button className="px-8 py-4 bg-bloom-rose text-white rounded-full font-bold shadow-lg shadow-bloom-rose/20">
                 Save Changes
               </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function SidebarLink({ icon, title, active, onClick }: { icon: React.ReactNode, title: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition-all",
        active ? "bg-bloom-pink text-bloom-rose font-bold" : "text-gray-500 hover:bg-gray-50"
      )}
    >
      {icon}
      <span>{title}</span>
    </button>
  );
}

function OrderCard({ id, status, date, total }: { id: string, status: string, date: string, total: string }) {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl hover:shadow-bloom-pink/20 transition-all">
      <div className="flex items-center space-x-6">
        <div className="p-4 bg-gray-50 rounded-2xl text-gray-400">
          <Package size={24} />
        </div>
        <div className="space-y-1">
          <p className="font-bold text-gray-900">{id}</p>
          <p className="text-xs text-gray-400">Placed on {date}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-12">
        <div className="text-right">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Total</p>
          <p className="font-bold text-bloom-rose">{total}</p>
        </div>
        <div className="text-right">
          <div className={cn(
            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block",
            status === 'Delivered' ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
          )}>
            {status}
          </div>
        </div>
        <button className="p-2 text-gray-300 hover:text-bloom-rose transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
