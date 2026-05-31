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
const groupedProductFolders = new Map<string, Product>();

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
      const baseCleanUrl = location.startsWith('public') ? location.substring(6) : location;
      const cleanUrl = baseCleanUrl;
      
      const configData = subValue as any;
      const parts = location.split('/');
      const filename = parts.pop() || '';
      
      // Auto-generate a friendly name from filename if not defined in JSON
      const friendlyProductName = filename.replace(/\.[^/.]+$/, "").replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

      // Destructure and assign JSON strongly typed properties
      const name = configData.Name || friendlyProductName;
      const price = parsePrice(configData.Price);
      const code = configData.Code;
      const stockVal = configData.Stock ?? configData.stock;
      const ratingVal = configData.Rating ?? configData.rating;
      const customVal = configData.IsCustomizable ?? configData.isCustomizable;
      const bestVal = configData.IsBestSeller ?? configData.isBestSeller;

      const stock = stockVal !== undefined ? parseInt(String(stockVal), 10) : 50;
      const rating = ratingVal !== undefined ? parseFloat(String(ratingVal)) : 5.0;
      const isCustomizable = customVal !== undefined ? String(customVal).toLowerCase() === 'true' : false;
      const isBestSeller = bestVal !== undefined ? String(bestVal).toLowerCase() === 'true' : false;

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

      processedLocations.add(baseCleanUrl);

    } else {
      // --- Case B: Grouped Product with Variants (The subKey is the Grouped Product Title) ---
      const productName = subKey;
      const variantsObj = subValue as Record<string, any>;
      
      const variants: ProductVariant[] = [];
      const images: string[] = [];
      let groupPrice = 199; // Fallback price
      let groupCustomizable = false;
      let groupBestSeller = true;
      let groupRating = 5.0;
      
      let isFirst = true;

      for (const [varLocation, varConfig] of Object.entries(variantsObj)) {
        if (!varLocation.startsWith('public/')) continue;
        
        const baseCleanUrl = varLocation.startsWith('public') ? varLocation.substring(6) : varLocation;
        const cleanUrl = baseCleanUrl;
        images.push(cleanUrl);
        processedLocations.add(baseCleanUrl);

        const vPrice = parsePrice(varConfig.Price);
        const vStockVal = varConfig.Stock ?? varConfig.stock;
        const vRatingVal = varConfig.Rating ?? varConfig.rating;
        const vCustomVal = varConfig.IsCustomizable ?? varConfig.isCustomizable;
        const vBestVal = varConfig.IsBestSeller ?? varConfig.isBestSeller;

        const vStock = vStockVal !== undefined ? parseInt(String(vStockVal), 10) : 50;
        
        // Parent matches the price & fields of the first child variant parsed
        if (isFirst) {
          groupPrice = vPrice;
          groupCustomizable = vCustomVal !== undefined ? String(vCustomVal).toLowerCase() === 'true' : false;
          groupBestSeller = vBestVal !== undefined ? String(vBestVal).toLowerCase() === 'true' : false;
          groupRating = vRatingVal !== undefined ? parseFloat(String(vRatingVal)) : 5.0;
          isFirst = false;
        }

        variants.push({
          code: varConfig.Code,
          color: varConfig.Name || 'Standard',
          image: cleanUrl,
          price: vPrice,
          stock: vStock,
          rating: vRatingVal !== undefined ? parseFloat(String(vRatingVal)) : 5.0
        });
      }

      if (images.length > 0) {
        const prod = {
          id: `prod_grp_${autoId++}`,
          name: productName,
          category: macroCategory as Category,
          price: groupPrice,
          description: `Premium ${productName.toLowerCase()} available in multiple variations designed to elevate your everyday style.`,
          images,
          variants,
          stock: variants.reduce((total, v) => total + (v.stock || 0), 0),
          rating: groupRating,
          isCustomizable: groupCustomizable,
          isBestSeller: groupBestSeller,
          options: [{
            name: 'Color',
            values: variants.map(v => v.color || 'Standard')
          }]
        };
        products.push(prod as Product);
        
        const firstVar = Object.keys(variantsObj).find(k => k.startsWith('public/'));
        if (firstVar) {
             const baseCleanUrl = firstVar.startsWith('public') ? firstVar.substring(6) : firstVar;
             const parentFolder = baseCleanUrl.substring(0, baseCleanUrl.lastIndexOf('/'));
             groupedProductFolders.set(parentFolder, prod as Product);
        }
      }
    }
  }
}

// 2. Fallback Auto-discovery Scanner
// Finds any unmapped images residing in collections on disk, ignoring .keep or generic root levels.
const diskImages = {"/public/images/collections/alligator_clips/pearl_satin_bows/pink.jpg": {}, "/public/images/collections/alligator_clips/pearl_satin_bows/blue.jpg": {}, "/public/images/collections/alligator_clips/pearl_satin_bows/some_new_image.jpg": {} };

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

    
    const parentFolder = cleanUrl.substring(0, cleanUrl.lastIndexOf('/'));
    if (groupedProductFolders.has(parentFolder)) {
        const targetProd = groupedProductFolders.get(parentFolder);
        if (targetProd && targetProd.variants) {
            targetProd.variants.push({
               code: `AUTO-${targetProd.variants.length + 1}`,
               color: friendlyProductName,
               image: cleanUrl,
               price: targetProd.price,
               stock: 50,
               rating: targetProd.rating || 5.0
            });
            targetProd.images.push(cleanUrl);
            const colorOption = targetProd.options?.find(o => o.name === 'Color');
            if (colorOption && !colorOption.values.includes(friendlyProductName)) {
                colorOption.values.push(friendlyProductName);
            }
            return;
        }
    }

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

console.log('PRODUCTS DUMP:', products.filter(p => p.name.includes('Pearl')));

