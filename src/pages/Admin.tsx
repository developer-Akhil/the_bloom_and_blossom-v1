import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { products as baseProducts } from '../data/products';
import { updateDynamicPrice, updateDynamicPricesBatch, useDynamicProducts } from '../lib/dynamicPricing';
import { Settings, Save, CheckCircle2, ShieldAlert, Image as ImageIcon, IndianRupee, LogOut } from 'lucide-react';
import { AdminImageManager } from '../components/admin/AdminImageManager';
import { useAdminAuth } from '../context/AdminAuthContext';

export function Admin() {
  const { isAdminAuthenticated, logout } = useAdminAuth();
  const dynamicProducts = useDynamicProducts(baseProducts);
  const [edits, setEdits] = useState<Record<string, number>>({});
  const [showSaved, setShowSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'media' | 'pricing'>('media');

  // Check for admin privileges. Redirect to login if not authenticated.
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: { pathname: '/admin' } }} replace />;
  }

  const handlePriceChange = (id: string, value: string) => {
    if (value === '') {
      setEdits({ ...edits, [id]: 0 }); // Or handle empty state appropriately
      return;
    }
    const num = Number(value);
    if (!isNaN(num)) {
      setEdits({ ...edits, [id]: num });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      await updateDynamicPricesBatch(edits);
      setEdits({});
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 3000);
    } catch (err) {
      console.error("Failed to apply pricing updates:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-6 gap-6">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-bloom-pink rounded-xl text-bloom-rose">
                <Settings size={28} />
              </div>
              <div>
                <h1 className="font-serif text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-gray-500 text-sm">Configure modules and control UI dynamically.</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="flex items-center space-x-2 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest"
            >
              <LogOut size={14} />
              <span>Secure Logout</span>
            </button>
          </div>
          
          <div className="flex bg-gray-50 p-1.5 rounded-2xl w-full md:w-auto">
             <button
                onClick={() => setActiveTab('media')}
                className={`flex-1 md:flex-none flex items-center space-x-2 px-6 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'media' ? 'bg-white shadow-sm text-bloom-rose' : 'text-gray-500 hover:text-gray-900'}`}
             >
                <ImageIcon size={16} />
                <span>Media Manager</span>
             </button>
             <button
                onClick={() => setActiveTab('pricing')}
                className={`flex-1 md:flex-none flex items-center space-x-2 px-6 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'pricing' ? 'bg-white shadow-sm text-bloom-rose' : 'text-gray-500 hover:text-gray-900'}`}
             >
                <IndianRupee size={16} />
                <span>Dynamic Pricing</span>
             </button>
          </div>
        </div>

        {activeTab === 'media' && (
          <AdminImageManager />
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button 
                onClick={handleSave}
                disabled={Object.keys(edits).length === 0 || isSaving}
                className={`mt-4 md:mt-0 flex items-center space-x-2 px-6 py-3 rounded-full font-bold transition-all shadow-lg ${
                  Object.keys(edits).length > 0 && !isSaving
                    ? 'bg-bloom-rose text-white hover:scale-105 shadow-bloom-rose/20' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                }`}
              >
                {showSaved ? <CheckCircle2 size={18} /> : <Save size={18} />}
                <span>{isSaving ? 'Saving to DB...' : showSaved ? 'Saved Successfully' : 'Apply Dynamic Pricing'}</span>
              </button>
            </div>

            <div className="bg-white border rounded-3xl shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="p-4 font-bold border-b">Product</th>
                    <th className="p-4 font-bold border-b">Category</th>
                    <th className="p-4 font-bold border-b w-48">Dynamic Price (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {dynamicProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded-xl" />
                          <span className="font-bold text-gray-900">{product.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-500">{product.category}</td>
                      <td className="p-4">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
                          <input 
                            type="number"
                            value={edits[product.id] !== undefined ? edits[product.id] : product.price}
                            onChange={(e) => handlePriceChange(product.id, e.target.value)}
                            className={`w-full pl-8 pr-4 py-2 border rounded-xl font-bold ${
                              edits[product.id] !== undefined 
                                ? 'bg-bloom-pink/20 border-bloom-rose/50 text-bloom-rose' 
                                : 'bg-white border-gray-200 focus:border-bloom-rose focus:ring-1 focus:ring-bloom-rose outline-none text-gray-900'
                            }`}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
