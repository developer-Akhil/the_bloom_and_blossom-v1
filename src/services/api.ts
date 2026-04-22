import { supabase } from '../lib/supabase';
import { type Product, type Category } from '../types';

export const ProductService = {
  async getAllProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)');
    
    if (error) throw error;
    return data;
  },

  async getProductsByCategory(categoryName: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories!inner(name)')
      .eq('categories.name', categoryName);
    
    if (error) throw error;
    return data;
  },

  async getProductById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async toggleWishlist(userId: string, productId: string) {
    // Check if exists
    const { data: existing } = await supabase
      .from('wishlist')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    if (existing) {
      return supabase.from('wishlist').delete().eq('id', existing.id);
    } else {
      return supabase.from('wishlist').insert({ user_id: userId, product_id: productId });
    }
  }
};

export const OrderService = {
  async createOrder(userId: string, totalAmount: number, items: any[], address: any) {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total_amount: totalAmount,
        shipping_address: address,
        payment_status: 'paid' // Simulated for now
      })
      .select()
      .single();

    if (orderError) throw orderError;

    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
      customization_name: item.customizationName
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    if (itemsError) throw itemsError;

    return order;
  }
};
