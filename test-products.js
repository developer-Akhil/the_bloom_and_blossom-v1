var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/data/products.ts
var products_exports = {};
__export(products_exports, {
  categories: () => categories,
  products: () => products
});
module.exports = __toCommonJS(products_exports);

// src/config/config_product.json
var config_product_default = {
  "Customised Name Bows": {
    "public/images/collections/customised_name_bows/golden_glitter_bow.jpeg": {
      Code: "CNB-GGB-001",
      Name: "Golden Glitter Bow",
      Price: "200"
    },
    "public/images/collections/customised_name_bows/daisy_name_bow.jpg": {
      Code: "CNB-DNB-BLK-001",
      Name: "Daisy Name Bow",
      Price: "200"
    },
    "public/images/collections/customised_name_bows/pearl_name_bow.jpg": {
      Code: "CNB-PNB-BLK-001",
      Name: "Pearl Name Bow",
      Price: "200"
    },
    "public/images/collections/customised_name_bows/daisy_name_without_tail_bow.jpg": {
      Code: "CNB-DNWTB-PNK001",
      Name: "Daisy Name Without Tail",
      Price: "180"
    }
  },
  "Premium Doll Bows": {
    "public/images/collections/premium_doll_bows/skyblue_doll.jpg": {
      Code: "PDB-SDB-001",
      Name: "Skyblue Doll Bow",
      Price: "300"
    },
    "public/images/collections/premium_doll_bows/yellow_doll.jpg": {
      Code: "PDB-YDB-001",
      Name: "Yellow Doll Bow",
      Price: "300"
    }
  },
  "Jewelled Bows": {
    "public/images/collections/jewelled_bows/golden.jpg": {
      Code: "JB-PJB-GLD-001",
      Name: "Golden Jewelled Bow",
      Price: "320"
    },
    "public/images/collections/jewelled_bows/pink.jpg": {
      Name: "JB-GJB-GLD-001",
      Code: "Pink Jewelled Bow",
      Price: "320"
    }
  },
  "Alligator Clips": {
    "public/images/collections/alligator_clips/popsicle_clip.jpg": {
      Code: "AC-PC-PNK-001",
      Name: "Popsicle Clip",
      Price: "90"
    },
    "public/images/collections/alligator_clips/velvet_stone_bow.jpg": {
      Code: "AC-VSB-MRN-001",
      Name: "Velvet Stone Bow",
      Price: "130"
    },
    "public/images/collections/alligator_clips/valentine_bow.jpg": {
      Code: "AC-VSB-RED-001",
      Name: "Valentine BowClip",
      Price: "100"
    }
  },
  Scrunchies: {
    Scrunchies: {
      "public/images/collections/scrunchies/red.jpg": {
        Code: "SCR-RED-001",
        Name: "Red",
        Price: ""
      },
      "public/images/collections/scrunchies/black.jpg": {
        Code: "SCR-BLK-002",
        Name: "Black",
        Price: ""
      },
      "public/images/collections/scrunchies/white.jpg": {
        Code: "SCR-WHT-003",
        Name: "White",
        Price: ""
      },
      "public/images/collections/scrunchies/purple.jpg": {
        Code: "SCR-PLE-004",
        Name: "Purple",
        Price: ""
      }
    },
    "public/images/collections/scrunchies/rainbow.jpg": {
      Code: "SCR-RS-001",
      Name: "Rainbow Scrunchie",
      Price: ""
    },
    "public/images/collections/scrunchies/rang_birangi.jpg": {
      Code: "SCR-RBS-001",
      Name: "Rang Birangi Scrunchie",
      Price: ""
    },
    "public/images/collections/scrunchies/skyblue_check.jpg": {
      Code: "SCR-SCS-001",
      Name: "Skyblue Check Scrunchie",
      Price: ""
    },
    "public/images/collections/scrunchies/flamingo.jpg": {
      Code: "SCR-FS-001",
      Name: "Flamingo Scrunchie",
      Price: ""
    },
    "public/images/collections/scrunchies/pinky.jpg": {
      Code: "SCR-PS-001",
      Name: "Pinky Scrunchie",
      Price: ""
    }
  },
  Bows: {
    "public/images/collections/bows/mickey_mouse_bow.jpg": {
      Code: "BOW-MMB-001",
      Name: "Mickey Mouse Bow",
      Price: ""
    },
    "public/images/collections/bows/pink_heart_bow.jpg": {
      Code: "BOW-PHB-001",
      Name: "Pink Heart Bow",
      Price: ""
    },
    "public/images/collections/bows/skyblue_check_bow.jpg": {
      Code: "BOW-SCB-001",
      Name: "Skyblue Check Bow",
      Price: ""
    }
  },
  Headbands: {
    "public/images/collections/headbands/white_headband.jpg": {
      Code: "HDD-WH-001",
      Name: "White Headband",
      Price: ""
    }
  },
  Hairbands: {
    "public/images/collections/hairbands/cup_cake.jpg": {
      Code: "HRD-CCH-001",
      Name: "Cupcake Hairband",
      Price: ""
    },
    "public/images/collections/hairbands/colourful.jpg": {
      Code: "HRD-CFH-001",
      Name: "Colourful Hairband",
      Price: ""
    }
  },
  "Embroidery Bows": {
    "Embroidery Tail Bows": {
      "public/images/collections/embroidery_bows/embroidery_tail_bow/Red.jpg": {
        Code: "EB-ETB-RED-001",
        Name: "Red",
        Price: ""
      },
      "public/images/collections/embroidery_bows/embroidery_tail_bow/white.jpg": {
        Code: "EB-ETB-WHT-002",
        Name: "White",
        Price: ""
      },
      "public/images/collections/embroidery_bows/embroidery_tail_bow/black.jpg": {
        Code: "EB-ETB-PNK-003",
        Name: "Black",
        Price: ""
      },
      "public/images/collections/embroidery_bows/embroidery_tail_bow/brown.jpg": {
        Code: "EB-ETB-BRN-004",
        Name: "Brown",
        Price: ""
      }
    },
    "Embroidery Alligator Clips": {
      "public/images/collections/embroidery_bows/embroidery_alligator_clip/peach.jpg": {
        Code: "EB-EAC-PCE-001",
        Name: "Peach",
        Price: ""
      },
      "public/images/collections/embroidery_bows/embroidery_alligator_clip/red.jpg": {
        Code: "EB-EAC-RED-002",
        Name: "Red",
        Price: ""
      },
      "public/images/collections/embroidery_bows/embroidery_alligator_clip/pink.jpg": {
        Code: "EB-EAC-PNK-003",
        Name: "Pink",
        Price: ""
      },
      "public/images/collections/embroidery_bows/embroidery_alligator_clip/purple.jpg": {
        Code: "EB-EAC-PLE-004",
        Name: "Purple",
        Price: ""
      }
    }
  },
  "Crochet Clips": {
    "public/images/collections/crochet_clips/crochet_rainbow_clip.jpg": {
      Code: "CC-CRC-001",
      Name: "Crochet Rainbow Clips",
      Price: ""
    },
    "public/images/collections/crochet_clips/flower_hairband.jpg": {
      Code: "CC-FHC-001",
      Name: "Flower Hairband Crochet",
      Price: ""
    },
    "Crochet Clips": {
      "public/images/collections/crochet_clips/oragne.jpg": {
        Code: "CC-CC-ORG-001",
        Name: "Orange",
        Price: ""
      },
      "public/images/collections/crochet_clips/off_white.jpg": {
        Code: "CC-CC-OWHT-002",
        Name: "OFF White",
        Price: ""
      },
      "public/images/collections/crochet_clips/red.jpg": {
        Code: "CC-CC-RED-003",
        Name: "Red",
        Price: ""
      },
      "public/images/collections/crochet_clips/pink.jpg": {
        Code: "CC-CC-PNK-004",
        Name: "Pink",
        Price: ""
      },
      "public/images/collections/crochet_clips/yellow.jpg": {
        Code: "CC-CC-YEL-004",
        Name: "Yellow",
        Price: ""
      }
    }
  },
  "Customised Caps": {
    "Customised Caps": {
      "public/images/collections/customised_caps/red.jpg": {
        Code: "CNC-RED-001",
        Name: "Red",
        Price: ""
      },
      "public/images/collections/customised_caps/pink.jpg": {
        Code: "CNC-PNK-002",
        Name: "Pink",
        Price: "200"
      },
      "public/images/collections/customised_caps/black.jpg": {
        Code: "CNC-BLK-003",
        Name: "Black",
        Price: "200"
      },
      "public/images/collections/customised_caps/white.jpg": {
        Code: "CNC-WHT-004",
        Name: "White",
        Price: "200"
      },
      "public/images/collections/customised_caps/yellow.jpg": {
        Code: "CNC-YEL-004",
        Name: "Yellow",
        Price: "200"
      }
    }
  }
};

// src/data/products.ts
var import_meta = {};
var categories = [
  "Customised Name Bows",
  "Premium Doll Bows",
  "Jewelled Bows",
  "Alligator Clips",
  "Scrunchies",
  "Bows",
  "Headbands",
  "Hairbands",
  "Embroidery Bows",
  "Crochet Clips",
  "Customised Name Sunglasses",
  "Customised Caps"
];
var products = [];
var autoId = 1e3;
var processedLocations = /* @__PURE__ */ new Set();
function parsePrice(val, defaultPrice = 199) {
  if (val === void 0 || val === null || val === "") return defaultPrice;
  const parsed = parseFloat(String(val));
  return isNaN(parsed) ? defaultPrice : parsed;
}
for (const [macroCategory, macroCategoryObj] of Object.entries(config_product_default)) {
  if (!macroCategoryObj || typeof macroCategoryObj !== "object") continue;
  if (!categories.includes(macroCategory)) {
    categories.push(macroCategory);
  }
  for (const [subKey, subValue] of Object.entries(macroCategoryObj)) {
    if (!subValue || typeof subValue !== "object") continue;
    if (subKey.startsWith("public/")) {
      const location = subKey;
      const cleanUrl = location.startsWith("public") ? location.substring(6) : location;
      const configData = subValue;
      const parts = location.split("/");
      const filename = parts.pop() || "";
      const friendlyProductName = filename.replace(/\.[^/.]+$/, "").replace(/_/g, " ").split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      const name = configData.Name || friendlyProductName;
      const price = parsePrice(configData.Price);
      const code = configData.Code;
      const stock = configData.Stock !== void 0 ? parseInt(String(configData.Stock), 10) : 50;
      const rating = configData.Rating !== void 0 ? parseFloat(String(configData.Rating)) : 5;
      const isCustomizable = configData.IsCustomizable !== void 0 ? String(configData.IsCustomizable).toLowerCase() === "true" : false;
      const isBestSeller = configData.IsBestSeller !== void 0 ? String(configData.IsBestSeller).toLowerCase() === "true" : false;
      products.push({
        id: `prod_${autoId++}`,
        code,
        name,
        category: macroCategory,
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
      const productName = subKey;
      const variantsObj = subValue;
      const variants = [];
      const images = [];
      let groupPrice = 199;
      let isFirst = true;
      for (const [varLocation, varConfig] of Object.entries(variantsObj)) {
        if (!varLocation.startsWith("public/")) continue;
        const cleanUrl = varLocation.startsWith("public") ? varLocation.substring(6) : varLocation;
        images.push(cleanUrl);
        processedLocations.add(cleanUrl);
        const vPrice = parsePrice(varConfig.Price);
        const vStock = varConfig.Stock !== void 0 ? parseInt(String(varConfig.Stock), 10) : 50;
        if (isFirst) {
          groupPrice = vPrice;
          isFirst = false;
        }
        variants.push({
          code: varConfig.Code,
          color: varConfig.Name || "Standard",
          image: cleanUrl,
          price: vPrice,
          stock: vStock,
          rating: varConfig.Rating !== void 0 ? parseFloat(String(varConfig.Rating)) : 5
        });
      }
      if (images.length > 0) {
        products.push({
          id: `prod_grp_${autoId++}`,
          name: productName,
          category: macroCategory,
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
var diskImages = import_meta.glob("/public/images/collections/**/*.{jpg,jpeg,png,webp}", { eager: true });
Object.keys(diskImages).forEach((path) => {
  if (path.endsWith(".keep")) return;
  const cleanUrl = path.replace("/public", "");
  if (processedLocations.has(cleanUrl)) return;
  const parts = path.split("/");
  const filename = parts.pop() || "";
  const folderName = parts.pop() || "";
  if (folderName === "collections") return;
  const categoryName = folderName.replace(/_/g, " ").split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const friendlyProductName = filename.replace(/\.[^/.]+$/, "").replace(/_/g, " ").split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  if (categoryName && !categories.includes(categoryName)) {
    categories.push(categoryName);
  }
  products.push({
    id: `auto_${autoId++}`,
    name: friendlyProductName,
    category: categoryName,
    price: 199,
    // default fallback price
    description: `Premium ${categoryName.toLowerCase()} designed to elevate your everyday style.`,
    images: [cleanUrl],
    stock: 50,
    rating: 5,
    isCustomizable: false,
    isBestSeller: false
  });
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  categories,
  products
});
