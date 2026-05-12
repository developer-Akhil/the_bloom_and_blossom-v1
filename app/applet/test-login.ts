import { supabase } from "./server/services/supabaseService.js";
import { config } from "./server/config/config.js";

async function main() {
  console.log("Config URL:", config.supabase.url);
  console.log("Testing findByEmail...");
  try {
    const { data, error } = await supabase.schema('bb_ecommerce_sc').from('app_users').select('*').eq('email', 'akhileshchand04@gmail.com').maybeSingle();
    console.log("Data:", data);
    console.log("Error:", error);
  } catch (err: any) {
    console.error("Exception:", err);
  }
}
main();
