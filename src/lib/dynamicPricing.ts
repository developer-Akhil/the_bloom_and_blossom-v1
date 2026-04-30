import { useProductContext } from '../context/ProductContext';
import { supabase } from './supabase';

// Legacy hook wrapper for compatibility
export const useDynamicProducts = (baseProducts?: any) => {
  const { products } = useProductContext();
  return products;
};

export const updateDynamicPricesBatch = async (updates: Record<string, number>) => {
  if (Object.keys(updates).length === 0) return;

  // 1. Instantly update local
  const dynamicPrices = JSON.parse(localStorage.getItem('bloom_dynamic_prices') || '{}');
  Object.entries(updates).forEach(([id, price]) => {
    dynamicPrices[id] = price;
  });
  localStorage.setItem('bloom_dynamic_prices', JSON.stringify(dynamicPrices));
  window.dispatchEvent(new Event('dynamic_price_updated'));

  // 2. Persist to Supabase
  try {
    const records = Object.entries(updates).map(([id, price]) => ({
      product_id: id,
      price: price
    }));

    const { error } = await supabase
      .from('dynamic_prices')
      .upsert(records, { onConflict: 'product_id' });
      
    if (error) {
      console.error("Failed to sync prices to DB:", error);
    }
  } catch (e) {
    console.error("Supabase sync exception:", e);
  }
};

export const updateDynamicPrice = async (productId: string, newPrice: number) => {
  return updateDynamicPricesBatch({ [productId]: newPrice });
};

export const updateBestSellers = async (bestSellerIds: string[]) => {
  localStorage.setItem('bloom_best_sellers', JSON.stringify(bestSellerIds));
  window.dispatchEvent(new Event('best_sellers_updated'));
};

export const updateNewArrivals = async (newArrivalIds: string[]) => {
  localStorage.setItem('bloom_new_arrivals', JSON.stringify(newArrivalIds));
  window.dispatchEvent(new Event('new_arrivals_updated'));
};

export const updateAvailabilityBatch = async (updates: Record<string, boolean>) => {
  if (Object.keys(updates).length === 0) return;

  // 1. Instantly update local
  const localAvailability = JSON.parse(localStorage.getItem('bloom_product_availability') || '{}');
  Object.entries(updates).forEach(([id, inStock]) => {
    localAvailability[id] = inStock;
  });
  localStorage.setItem('bloom_product_availability', JSON.stringify(localAvailability));
  window.dispatchEvent(new Event('availability_updated'));

  // 2. Persist to Supabase
  try {
    const records = Object.entries(updates).map(([id, inStock]) => ({
      product_id: id,
      in_stock: inStock
    }));

    const { error } = await supabase
      .from('product_availability')
      .upsert(records, { onConflict: 'product_id' });
      
    if (error) {
      console.error("Failed to sync availability to DB:", error);
    }
  } catch (e) {
    console.error("Supabase sync exception:", e);
  }
};

