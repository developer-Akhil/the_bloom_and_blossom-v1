import { type Product, type Category, type ProductVariant } from '../types';
import productConfigRaw from '../config/config_product.json';

export const categories: string[] = [
  'Customised Name Bows',
  'Premium Doll Bows',
  'Jewelled Bows',
  'Alligator Clips',
  'Scrunchies',
  'Bows',
  'Headbands',
  'Hairbands',
  'Embroidery Bows',
  'Crochet Clips',
  'Customised Name Sunglasses',
  'Customised Caps'
];

export const products: Product[] = [];
let autoId = 1000;
const processedLocations = new Set<string>();

/**
 * Helper to safely parse string prices (e.g. "", "200") into stable numbers.
 */
function parsePrice(val: any, defaultPrice = 199): number {
  if (val === undefined || val === null || val === "") return defaultPrice;
  const parsed = parseFloat(String(val));
  return isNaN(parsed) ? defaultPrice : parsed;
}

/**
 * 1. Parse and map all fields from config_product.json
 * 
 * The JSON configuration uses a 2-level macro structure:
 * Top-level -> Category names (e.g. "Customised Name Bows")
 * Second-level -> 
 *   Case A: Image Path (e.g. "public/images/...") -> Standalone Product
 *   Case B: Product Name (e.g. "Scrunchies") -> Grouped Product with variations
 */
const collectionsObj = (productConfigRaw as any).Collections || productConfigRaw;

export const rawHomeImages = (productConfigRaw as any).home_images || {};
export const rawProductImages = (productConfigRaw as any).product_images || {};
export const rawLogoData = (productConfigRaw as any).logo || {};

for (const [macroCategory, macroCategoryObj] of Object.entries(collectionsObj)) {
  if (!macroCategoryObj || typeof macroCategoryObj !== 'object') continue;

  // Dynamically push any missing categories
  if (!categories.includes(macroCategory)) {
    categories.push(macroCategory);
  }

  for (const [subKey, subValue] of Object.entries(macroCategoryObj)) {
    if (!subValue || typeof subValue !== 'object') continue;

    if (subKey.startsWith('public/')) {
      // --- Case A: Standalone Product ---
      const location = subKey;
      const cleanUrl = location.startsWith('public') ? location.substring(6) : location;
      
      const configData = subValue as any;
      const parts = location.split('/');
      const filename = parts.pop() || '';
      
      // Auto-generate a friendly name from filename if not defined in JSON
      const friendlyProductName = filename.replace(/\.[^/.]+$/, "").replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

      // Destructure and assign JSON strongly typed properties
      const name = configData.Name || friendlyProductName;
      const price = parsePrice(configData.Price);
      const code = configData.Code;
      const stock = configData.Stock !== undefined ? parseInt(String(configData.Stock), 10) : 50;
      const rating = configData.Rating !== undefined ? parseFloat(String(configData.Rating)) : 5.0;
      const isCustomizable = configData.IsCustomizable !== undefined ? String(configData.IsCustomizable).toLowerCase() === 'true' : false;
      const isBestSeller = configData.IsBestSeller !== undefined ? String(configData.IsBestSeller).toLowerCase() === 'true' : false;

      products.push({
        id: `prod_${autoId++}`,
        code,
        name,
        category: macroCategory as Category,
        price,
        description: `Premium ${macroCategory.toLowerCase()} designed to elevate your everyday style.`,
        images: [cleanUrl],
        stock,
        rating,
        isCustomizable,
        isBestSeller
      });

      processedLocations.add(cleanUrl);

    } else {
      // --- Case B: Grouped Product with Variants (The subKey is the Grouped Product Title) ---
      const productName = subKey;
      const variantsObj = subValue as Record<string, any>;
      
      const variants: ProductVariant[] = [];
      const images: string[] = [];
      let groupPrice = 199; // Fallback price
      
      let isFirst = true;

      for (const [varLocation, varConfig] of Object.entries(variantsObj)) {
        if (!varLocation.startsWith('public/')) continue;
        
        const cleanUrl = varLocation.startsWith('public') ? varLocation.substring(6) : varLocation;
        images.push(cleanUrl);
        processedLocations.add(cleanUrl);

        const vPrice = parsePrice(varConfig.Price);
        const vStock = varConfig.Stock !== undefined ? parseInt(String(varConfig.Stock), 10) : 50;
        
        // Parent matches the price of the first child variant parsed
        if (isFirst) {
          groupPrice = vPrice;
          isFirst = false;
        }

        variants.push({
          code: varConfig.Code,
          color: varConfig.Name || 'Standard',
          image: cleanUrl,
          price: vPrice,
          stock: vStock,
          rating: varConfig.Rating !== undefined ? parseFloat(String(varConfig.Rating)) : 5.0
        });
      }

      if (images.length > 0) {
        products.push({
          id: `prod_grp_${autoId++}`,
          name: productName,
          category: macroCategory as Category,
          price: groupPrice,
          description: `Premium ${productName.toLowerCase()} available in multiple variations designed to elevate your everyday style.`,
          images,
          variants,
          stock: variants.reduce((total, v) => total + (v.stock || 0), 0),
          rating: 4.8,
          isCustomizable: false,
          isBestSeller: true
        });
      }
    }
  }
}

// 2. Fallback Auto-discovery Scanner
// Finds any unmapped images residing in collections on disk, ignoring .keep or generic root levels.
const diskImages = (import.meta as any).glob('/public/images/collections/**/*.{jpg,jpeg,png,webp}', { eager: true });

Object.keys(diskImages).forEach(path => {
    if (path.endsWith('.keep')) return;
    
    // Clean public directory referencing
    const cleanUrl = path.replace('/public', '');
    
    // Skip if already mapped properly by JSON above
    if (processedLocations.has(cleanUrl)) return; 

    const parts = path.split('/');
    const filename = parts.pop() || '';
    const folderName = parts.pop() || ''; // Folder maps to naive category
    
    // Ignore top structural folder
    if (folderName === 'collections') return;

    const categoryName = folderName.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const friendlyProductName = filename.replace(/\.[^/.]+$/, "").replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    if (categoryName && !categories.includes(categoryName)) {
        categories.push(categoryName);
    }

    products.push({
        id: `auto_${autoId++}`,
        name: friendlyProductName,
        category: categoryName as Category,
        price: 199, // default fallback price
        description: `Premium ${categoryName.toLowerCase()} designed to elevate your everyday style.`,
        images: [cleanUrl],
        stock: 50,
        rating: 5.0,
        isCustomizable: false,
        isBestSeller: false
    });
});

