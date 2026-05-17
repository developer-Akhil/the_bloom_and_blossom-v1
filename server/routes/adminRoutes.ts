import express from "express";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Initialize Supabase with the Service Role key to bypass RLS securely from the server
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  db: { schema: 'bb_ecommerce_sc' }
});

router.post("/availability", async (req, res) => {
  try {
    const { updates } = req.body;
    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No updates provided" });
    }

    const records = Object.entries(updates).map(([id, inStock]) => ({
      product_id: id,
      in_stock: inStock,
      updated_at: new Date().toISOString()
    }));

    const { data, error } = await supabaseAdmin
      .from('product_availability')
      .upsert(records, { onConflict: 'product_id' });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Admin Availability Sync Error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/pricing", async (req, res) => {
  try {
    const { updates } = req.body;
    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No updates provided" });
    }

    const records = Object.entries(updates).map(([id, price]) => ({
      product_id: id,
      price: price,
      updated_at: new Date().toISOString()
    }));

    const { data, error } = await supabaseAdmin
      .from('dynamic_prices')
      .upsert(records, { onConflict: 'product_id' });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Admin Pricing Sync Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
