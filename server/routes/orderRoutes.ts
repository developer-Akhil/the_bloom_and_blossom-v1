import express from "express";
import { supabase } from "../services/supabaseService.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { data: order, error: orderError } = await (supabase as any).from('orders').select('*').eq('id', id).single();
    
    if (orderError || !order) {
      console.error('Order fetch error:', orderError);
      return res.status(404).json({ error: "Order not found" });
    }

    const { data: items, error: itemsError } = await (supabase as any).from('order_items').select('*').eq('order_id', id);

    if (itemsError) {
      console.error('Order items fetch error:', itemsError);
      return res.status(500).json({ error: "Failed to fetch order items" });
    }

    return res.status(200).json({ order, items });
  } catch (err) {
    console.error('Order API error:', err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
