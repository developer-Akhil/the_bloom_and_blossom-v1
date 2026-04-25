import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { type Product } from '../types';
import { products as baseProducts, categories as baseCategories } from '../data/products';
import { useMediaContext } from './MediaContext';
import { supabase } from '../lib/supabase';

interface ProductContextType {
  products: Product[];
  categories: string[];
  loading: boolean;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const { assets, allAssets, folders, loading: mediaLoading } = useMediaContext();
  const [priceOverrides, setPriceOverrides] = useState<Record<string, number>>(() => {
    const localPrices = localStorage.getItem('bloom_dynamic_prices');
    return localPrices ? JSON.parse(localPrices) : {};
  });
  const [bestSellersSet, setBestSellersSet] = useState<Set<string>>(() => {
    const localBestSellers = localStorage.getItem('bloom_best_sellers');
    return localBestSellers ? new Set(JSON.parse(localBestSellers)) : new Set();
  });

  const fetchSupabasePrices = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('dynamic_prices').select('product_id, price');
      if (!error && data && data.length > 0) {
        const newMap = JSON.parse(localStorage.getItem('bloom_dynamic_prices') || '{}');
        data.forEach(item => { newMap[item.product_id] = item.price; });
        localStorage.setItem('bloom_dynamic_prices', JSON.stringify(newMap));
        setPriceOverrides(newMap);
      }
    } catch (e) {
      console.error("Supabase Price Sync Error:", e);
    }
  }, []);

  useEffect(() => {
    fetchSupabasePrices();
    const handleUpdate = () => {
      const localPrices = localStorage.getItem('bloom_dynamic_prices');
      if (localPrices) setPriceOverrides(JSON.parse(localPrices));
    };
    const handleBestSellersUpdate = () => {
      const localBestSellers = localStorage.getItem('bloom_best_sellers');
      if (localBestSellers) setBestSellersSet(new Set(JSON.parse(localBestSellers)));
    };
    window.addEventListener('dynamic_price_updated', handleUpdate);
    window.addEventListener('best_sellers_updated', handleBestSellersUpdate);
    return () => {
       window.removeEventListener('dynamic_price_updated', handleUpdate);
       window.removeEventListener('best_sellers_updated', handleBestSellersUpdate);
    };
  }, [fetchSupabasePrices]);

  const mergedProducts = useMemo(() => {
    const consumedAssetIds = new Set<string>();

    let updatedProducts = baseProducts.map((product) => {
      let updatedProduct = { ...product };
      if (priceOverrides[product.id]) updatedProduct.price = priceOverrides[product.id];
      
      const adminBestSellersStr = localStorage.getItem('bloom_best_sellers');
      if (adminBestSellersStr) {
          updatedProduct.isBestSeller = bestSellersSet.has(product.id);
      }

      const productAssets = allAssets.filter(a => a.id.startsWith(`builtin_${product.id}_`));
      updatedProduct.images = product.images.filter((img, idx) => {
         const builtinMatch = productAssets.find(a => a.id === `builtin_${product.id}_${idx}`);
         return builtinMatch ? builtinMatch.is_active : true;
      });

      const slug = product.category.toLowerCase().replace(/\s+/g, '_');
      const customImages = assets
         .filter(a => a.folder_id === `collections/${slug}` || a.folder_id === 'our_best_sellers')
         .filter(a => {
            if (a.id.startsWith('builtin_')) { consumedAssetIds.add(a.id); return false; }
            const categoryWords = product.category.toLowerCase().split(' ');
            // Remove 's' from category words for singular matching (e.g. 'scrunchies' -> 'scrunchie')
            const singularCategoryWords = categoryWords.map(w => w.endsWith('s') ? w.slice(0, -1) : w);
            const ignoreWords = new Set([...categoryWords, ...singularCategoryWords]);
            
            const searchName = a.file_name.toLowerCase();
            const keywords = product.name.toLowerCase().split(' ')
                 .filter(k => !ignoreWords.has(k) && k.length > 2);
                 
            // If we successfully filtered it down to distinguishing words, use those. 
            // If it's empty (e.g. the product name is just "Scrunchies"), fallback to just requiring the name.
            if (keywords.length > 0) {
               return keywords.some(k => searchName.includes(k));
            }
            return searchName.includes(product.name.toLowerCase());
         });

      if (customImages.length > 0) {
         customImages.forEach(a => consumedAssetIds.add(a.id));
         const mergedImageUrls = [...customImages.map(a => a.file_url).reverse(), ...updatedProduct.images];
         updatedProduct.images = Array.from(new Set(mergedImageUrls));
      }
      return updatedProduct;
    }).filter(p => p.images.length > 0);

    const newlyConstructedProducts: Product[] = [];
    assets.forEach((asset) => {
        if (asset.id.startsWith('builtin_') || consumedAssetIds.has(asset.id)) return;
        
        let categoryTitle = '';
        if (asset.folder_id.startsWith('collections/')) {
          const foundFolder = folders.find(f => f.id === asset.folder_id);
          categoryTitle = foundFolder ? foundFolder.name : asset.folder_id.replace('collections/', '');
        } else if (asset.folder_id === 'product_images') {
          categoryTitle = asset.file_name.replace(/\.[^/.]+$/, "").replace(/_/g, ' ');
        } else return;
        
        categoryTitle = categoryTitle.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        const productName = asset.file_name.replace(/\.[^/.]+$/, "").replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

        // Skip products where the name matches the category exactly (likely a category thumbnail)
        if (asset.folder_id === 'product_images' && productName.toLowerCase() === categoryTitle.toLowerCase()) return;

        const productId = `custom_${asset.id}`;
        let isBestSeller = false;
        const adminBestSellersStr = localStorage.getItem('bloom_best_sellers');
        if (adminBestSellersStr) {
           isBestSeller = bestSellersSet.has(productId);
        }

        newlyConstructedProducts.push({
           id: productId,
           name: productName, 
           category: categoryTitle,
           price: priceOverrides[productId] || 149,
           description: `Beautifully handcrafted ${categoryTitle}.`,
           images: [asset.file_url],
           stock: 10,
           isCustomizable: false,
           isBestSeller,
           rating: 5.0
        });
    });

    return [...updatedProducts, ...newlyConstructedProducts];
  }, [baseProducts, assets, allAssets, folders, priceOverrides, bestSellersSet]);

  const mergedCategories = useMemo(() => {
    const adminFolders = folders
      .filter(f => f.parent === 'collections')
      .map(f => f.name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
    
    // Use relative path for production build consistency
    const diskImages = (import.meta as any).glob('../../public/images/product_images/*', { eager: true });
    const autoCategories = Object.keys(diskImages)
      .filter(path => !path.endsWith('.keep'))
      .map(path => {
        const filename = path.split('/').pop() || '';
        const slug = filename.replace(/\.[^/.]+$/, "");
        return slug.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      });

    return Array.from(new Set([...baseCategories, ...adminFolders, ...autoCategories]));
  }, [folders]);

  return (
    <ProductContext.Provider value={{ products: mergedProducts, categories: mergedCategories, loading: mediaLoading, refreshProducts: fetchSupabasePrices }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProductContext() {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProductContext must be used within a ProductProvider');
  return context;
}

// Keep the hook for backward compatibility but make it a wrapper
export const useDynamicProducts = (incomingBaseProducts?: any) => {
  const { products } = useProductContext();
  return products;
};
