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

// src/data/temp_products.ts
var temp_products_exports = {};
__export(temp_products_exports, {
  categories: () => categories,
  products: () => products,
  rawHomeImages: () => rawHomeImages,
  rawLogoData: () => rawLogoData,
  rawProductImages: () => rawProductImages
});
module.exports = __toCommonJS(temp_products_exports);

// src/config/config_product.json
var config_product_default = {
  logo: {
    "public/images/logo/logo.jpeg": { Name: "Logo" }
  },
  home_images: {
    "public/images/home_images/photo_1.jpg": { Name: "photo1" },
    "public/images/home_images/photo_2.jpg": { Name: "photo2" },
    "public/images/home_images/photo_3.jpg": { Name: "photo3" }
  },
  product_images: {
    "public/images/product_images/alligator_clips.jpg": { Name: "Alligator Clips" },
    "public/images/product_images/bows.jpg": { Name: "Bows" },
    "public/images/product_images/crochet_clips.jpg": { Name: "Crochet Clips" },
    "public/images/product_images/customised_caps.jpg": { Name: "Customised Caps" },
    "public/images/product_images/customised_name_bows.jpg": { Name: "Customised Name Bows" },
    "public/images/product_images/customised_name_sunglasses.jpg": { Name: "Customised Name Sunglasses" },
    "public/images/product_images/embroidery_bows.jpg": { Name: "Embroidery Bows" },
    "public/images/product_images/hairbands.jpg": { Name: "Hairbands" },
    "public/images/product_images/headbands.jpg": { Name: "Headbands" },
    "public/images/product_images/jewelled_bows.jpg": { Name: "Jewelled Bows" },
    "public/images/product_images/premium_doll_bows.jpg": { Name: "Premium Doll Bows" },
    "public/images/product_images/scrunchies.jpg": { Name: "Scrunchies" }
  },
  Collections: {
    "Customised Name Bows": {
      "public/images/collections/customised_name_bows/golden_glitter_bow.jpeg": {
        Code: "CNB-GGB-001",
        Name: "Golden Glitter Bow",
        Price: "200",
        stock: 9,
        rating: "4.8",
        isCustomizable: true,
        isBestSeller: true
      },
      "Daisy Name Bows": {
        "public/images/collections/customised_name_bows/daisy_name_bows/black.jpg": {
          Code: "CNB-DNB-BLK-001",
          Name: "Daisy Black Bow",
          Price: "200",
          stock: 9,
          rating: "4.8",
          isCustomizable: true,
          isBestSeller: true
        },
        "public/images/collections/customised_name_bows/daisy_name_bows/light_purple.jpg": {
          Code: "CNB-DNB-BLK-002",
          Name: "Daisy Light Purple Bow",
          Price: "200",
          stock: 9,
          rating: "4.6",
          isCustomizable: true,
          isBestSeller: true
        },
        "public/images/collections/customised_name_bows/daisy_name_bows/pink.jpg": {
          Code: "CNB-DNB-PNK-003",
          Name: "Daisy Pink Bow",
          Price: "200",
          stock: 9,
          rating: "4.3",
          isCustomizable: true,
          isBestSeller: true
        },
        "public/images/collections/customised_name_bows/daisy_name_bows/red.jpg": {
          Code: "CNB-DNB-RED-004",
          Name: "Daisy Red Bow",
          Price: "200",
          stock: 9,
          rating: "4.2",
          isCustomizable: true,
          isBestSeller: true
        },
        "public/images/collections/customised_name_bows/daisy_name_bows/skyblue.jpg": {
          Code: "CNB-DNB-SKB-005",
          Name: "Daisy Skyblue Bow",
          Price: "200",
          stock: 9,
          rating: "4.2",
          isCustomizable: true,
          isBestSeller: true
        }
      },
      "Pearl Name Bows": {
        "public/images/collections/customised_name_bows/pearl_name_bows/black.jpg": {
          Code: "CNB-PNB-BLK-001",
          Name: "Pearl Name Bow",
          Price: "200",
          stock: 9,
          rating: "4.3",
          isCustomizable: true,
          isBestSeller: true
        },
        "public/images/collections/customised_name_bows/pearl_name_bows/red.jpg": {
          Code: "CNB-PNB-RED-002",
          Name: "Pearl Name Bow",
          Price: "200",
          stock: 9,
          rating: "4.2",
          isCustomizable: true,
          isBestSeller: true
        },
        "public/images/collections/customised_name_bows/pearl_name_bows/pink.jpg": {
          Code: "CNB-PNB-PNK-003",
          Name: "Pearl Name Bow",
          Price: "200",
          stock: 9,
          rating: "4.4",
          isCustomizable: true,
          isBestSeller: true
        },
        "public/images/collections/customised_name_bows/pearl_name_bows/skyblue.jpg": {
          Code: "CNB-PNB-SKB-004",
          Name: "Pearl Name Bow",
          Price: "200",
          stock: 9,
          rating: "4.1",
          isCustomizable: true,
          isBestSeller: true
        },
        "public/images/collections/customised_name_bows/pearl_name_bows/light_purple.jpg": {
          Code: "CNB-PNB-LPLE-005",
          Name: "Pearl Name Bow",
          Price: "200",
          stock: 9,
          rating: "4.3",
          isCustomizable: true,
          isBestSeller: true
        }
      },
      "public/images/collections/customised_name_bows/daisy_name_without_tail_bow.jpg": {
        Code: "CNB-DNWTB-PNK001",
        Name: "Daisy Name Without Tail",
        Price: "180",
        stock: 9,
        rating: "4.8",
        isCustomizable: true,
        isBestSeller: true
      }
    },
    "Premium Doll Bows": {
      "public/images/collections/premium_doll_bows/skyblue_doll.jpg": {
        Code: "PDB-SDB-001",
        Name: "Skyblue Doll Bow",
        Price: "300",
        stock: 9,
        rating: "4.8",
        isCustomizable: true,
        isBestSeller: true
      },
      "public/images/collections/premium_doll_bows/yellow_doll.jpg": {
        Code: "PDB-YDB-001",
        Name: "Yellow Doll Bow",
        Price: "300",
        rating: "4.8",
        stock: 10,
        isCustomizable: true,
        isBestSeller: true
      }
    },
    "Jewelled Bows": {
      "public/images/collections/jewelled_bows/golden.jpg": {
        Code: "JB-PJB-GLD-001",
        Name: "Golden Jewelled Bow",
        Price: "320",
        rating: "4.8",
        stock: 20,
        isCustomizable: false,
        isBestSeller: true
      },
      "public/images/collections/jewelled_bows/pink.jpg": {
        Name: "Pink Jewelled Bow",
        Code: "JB-GJB-GLD-001",
        Price: "320",
        rating: "4.3",
        stock: 15,
        isCustomizable: false,
        isBestSeller: true
      }
    },
    "Alligator Clips": {
      "public/images/collections/alligator_clips/popsicle_clip.jpg": {
        Code: "AC-PC-PNK-001",
        Name: "Popsicle Clip",
        Price: "90",
        rating: "4.8",
        stock: 25,
        isCustomizable: false,
        isBestSeller: true
      },
      "public/images/collections/alligator_clips/valentine_bow.jpg": {
        Code: "AC-VSB-RED-001",
        Name: "Valentine Bow Clip",
        Price: "100",
        rating: "4.2",
        stock: 12,
        isCustomizable: false,
        isBestSeller: true
      },
      "public/images/collections/alligator_clips/rainbow_alligator_clip.jpg": {
        Code: "AC-VSB-RAC-001",
        Name: "Rainbow Alligator Clip",
        Price: "100",
        rating: "4.2",
        stock: 12,
        isCustomizable: false,
        isBestSeller: true
      },
      "Velvet Stone Bows": {
        "public/images/collections/alligator_clips/velvet_stone_bows/maroon.jpg": {
          Code: "AC-VSB-MRN-001",
          Name: "Maroon",
          Price: "130",
          rating: "4.2",
          stock: 15,
          isCustomizable: false,
          isBestSeller: true
        },
        "public/images/collections/alligator_clips/velvet_stone_bows/black.jpg": {
          Code: "AC-VSB-BLK-002",
          Name: "Black",
          Price: "130",
          rating: "4.2",
          stock: 15,
          isCustomizable: false,
          isBestSeller: true
        }
      },
      "Pearl Satin Bows": {
        "public/images/collections/alligator_clips/pearl_satin_bows/red.jpg": {
          Code: "AC-PSB-RED-001",
          Name: "Red",
          Price: "130",
          rating: "4.0",
          stock: 10,
          isCustomizable: false,
          isBestSeller: true
        },
        "public/images/collections/alligator_clips/pearl_satin_bows/black.jpg": {
          Code: "AC-PSB-BLK-002",
          Name: "Black",
          Price: "130",
          rating: "4.3",
          stock: 15,
          isCustomizable: false,
          isBestSeller: true
        },
        "public/images/collections/alligator_clips/pearl_satin_bows/pink.jpg": {
          Code: "AC-PSB-PNK-003",
          Name: "Pink",
          Price: "130",
          rating: "4.2",
          stock: 15,
          isCustomizable: false,
          isBestSeller: true
        },
        "public/images/collections/alligator_clips/pearl_satin_bows/blue.jpg": {
          Code: "AC-PSB-BLU-004",
          Name: "Blue",
          Price: "130",
          rating: "4.2",
          stock: 15,
          isCustomizable: false,
          isBestSeller: true
        }
      },
      "Pearl Hairclips": {
        "public/images/collections/alligator_clips/pearl_hairclips/red.jpg": {
          Code: "AC-PHC-RED-001",
          Name: "Red",
          Price: "130",
          rating: "4.2",
          stock: 10,
          isCustomizable: false,
          isBestSeller: true
        },
        "public/images/collections/alligator_clips/pearl_hairclips/black.jpg": {
          Code: "AC-PHC-BLK-002",
          Name: "Black",
          Price: "130",
          rating: "4.1",
          stock: 12,
          isCustomizable: false,
          isBestSeller: true
        },
        "public/images/collections/alligator_clips/pearl_hairclips/white.jpg": {
          Code: "AC-PHC-WHT-003",
          Name: "White",
          Price: "130",
          rating: "4.2",
          stock: 12,
          isCustomizable: false,
          isBestSeller: true
        },
        "public/images/collections/alligator_clips/pearl_hairclips/pink.jpg": {
          Code: "AC-PHC-PNK-004",
          Name: "Pink",
          Price: "130",
          rating: "4.5",
          stock: 8,
          isCustomizable: false,
          isBestSeller: true
        }
      }
    },
    Scrunchies: {
      Scrunchies: {
        "public/images/collections/scrunchies/red.jpg": {
          Code: "SCR-RED-001",
          Name: "Red",
          Price: "40",
          rating: "4.3",
          stock: 12,
          isCustomizable: false,
          isBestSeller: true
        },
        "public/images/collections/scrunchies/black.jpg": {
          Code: "SCR-BLK-002",
          Name: "Black",
          Price: "40",
          rating: "4.8",
          stock: 10,
          isCustomizable: false,
          isBestSeller: true
        },
        "public/images/collections/scrunchies/white.jpg": {
          Code: "SCR-WHT-003",
          Name: "White",
          Price: "40",
          rating: "4.8",
          stock: 14,
          isCustomizable: false,
          isBestSeller: true
        },
        "public/images/collections/scrunchies/purple.jpg": {
          Code: "SCR-PLE-004",
          Name: "Purple",
          Price: "40",
          rating: "4.8",
          stock: 16,
          isCustomizable: false,
          isBestSeller: true
        }
      },
      "public/images/collections/scrunchies/rainbow.jpg": {
        Code: "SCR-RS-001",
        Name: "Rainbow Scrunchie",
        Price: "55",
        rating: "4.8",
        stock: 10,
        isCustomizable: false,
        isBestSeller: true
      },
      "public/images/collections/scrunchies/rang_birangi.jpg": {
        Code: "SCR-RBS-001",
        Name: "Rang Birangi Scrunchie",
        Price: "55",
        rating: "4.4",
        stock: 16,
        isCustomizable: false,
        isBestSeller: true
      },
      "public/images/collections/scrunchies/skyblue_check.jpg": {
        Code: "SCR-SCS-001",
        Name: "Skyblue Check Scrunchie",
        Price: "55",
        rating: "4.5",
        stock: 12,
        isCustomizable: false,
        isBestSeller: true
      },
      "public/images/collections/scrunchies/flamingo.jpg": {
        Code: "SCR-FS-001",
        Name: "Flamingo Scrunchie",
        Price: "55",
        rating: "4.2",
        stock: 10,
        isCustomizable: false,
        isBestSeller: true
      },
      "public/images/collections/scrunchies/pinky.jpg": {
        Code: "SCR-PS-001",
        Name: "Pinky Scrunchie",
        Price: "55",
        rating: "4.6",
        stock: 16,
        isCustomizable: false,
        isBestSeller: true
      }
    },
    Bows: {
      "public/images/collections/bows/mickey_mouse_bow.jpg": {
        Code: "BOW-MMB-001",
        Name: "Mickey Mouse Bow",
        Price: "70",
        rating: "4.8",
        stock: 16,
        isCustomizable: false,
        isBestSeller: true
      },
      "public/images/collections/bows/pink_heart_bow.jpg": {
        Code: "BOW-PHB-001",
        Name: "Pink Heart Bow",
        Price: "70",
        rating: "4.8",
        stock: 20,
        isCustomizable: false,
        isBestSeller: true
      },
      "public/images/collections/bows/skyblue_check_bow.jpg": {
        Code: "BOW-SCB-001",
        Name: "Skyblue Check Bow",
        Price: "70",
        rating: "4.8",
        stock: 15,
        isCustomizable: false,
        isBestSeller: true
      }
    },
    Headbands: {
      "public/images/collections/headbands/white_headband.jpg": {
        Code: "HDD-WH-001",
        Name: "White Headband",
        Price: "120",
        rating: "4.5",
        stock: 15,
        isCustomizable: false,
        isBestSeller: true
      }
    },
    Hairbands: {
      "public/images/collections/hairbands/cup_cake.jpg": {
        Code: "HRD-CCH-001",
        Name: "Cupcake Hairband",
        Price: "120",
        rating: "4.5",
        stock: 12,
        isCustomizable: false,
        isBestSeller: true
      },
      "public/images/collections/hairbands/colourful.jpg": {
        Code: "HRD-CFH-001",
        Name: "Colourful Hairband",
        Price: "120",
        rating: "4.2",
        stock: 16,
        isCustomizable: false,
        isBestSeller: true
      }
    },
    "Embroidery Bows": {
      "public/images/collections/embroidery_bows/embroidery_name_tail_bow.jpg": {
        Code: "EB-ETB-RED-001",
        Name: "Embroidery Name Tail Bow",
        Price: "200",
        rating: "4.5",
        stock: 30,
        isCustomizable: true,
        isBestSeller: true
      },
      "Embroidery Tail Bows": {
        "public/images/collections/embroidery_bows/embroidery_tail_bow/Red.jpg": {
          Code: "EB-ETB-RED-001",
          Name: "Red",
          Price: "150",
          rating: "4.5",
          stock: 30,
          isCustomizable: false,
          isBestSeller: true
        },
        "public/images/collections/embroidery_bows/embroidery_tail_bow/white.jpg": {
          Code: "EB-ETB-WHT-002",
          Name: "White",
          Price: "150",
          rating: "4.4",
          stock: 32,
          isCustomizable: false,
          isBestSeller: true
        },
        "public/images/collections/embroidery_bows/embroidery_tail_bow/black.jpg": {
          Code: "EB-ETB-PNK-003",
          Name: "Black",
          Price: "150",
          rating: "4.2",
          stock: 30,
          isCustomizable: false,
          isBestSeller: true
        },
        "public/images/collections/embroidery_bows/embroidery_tail_bow/brown.jpg": {
          Code: "EB-ETB-BRN-004",
          Name: "Brown",
          Price: "150",
          rating: "4.2",
          stock: 10,
          isCustomizable: false,
          isBestSeller: true
        }
      },
      "Embroidery Alligator Clips": {
        "public/images/collections/embroidery_bows/embroidery_alligator_clip/peach.jpg": {
          Code: "EB-EAC-PCE-001",
          Name: "Peach",
          Price: "120",
          rating: "4.2",
          stock: 30,
          isCustomizable: false,
          isBestSeller: true
        },
        "public/images/collections/embroidery_bows/embroidery_alligator_clip/red.jpg": {
          Code: "EB-EAC-RED-002",
          Name: "Red",
          Price: "120",
          rating: "4.6",
          stock: 30,
          isCustomizable: false,
          isBestSeller: true
        },
        "public/images/collections/embroidery_bows/embroidery_alligator_clip/pink.jpg": {
          Code: "EB-EAC-PNK-003",
          Name: "Pink",
          Price: "120",
          rating: "4.2",
          stock: 10,
          isCustomizable: false,
          isBestSeller: true
        },
        "public/images/collections/embroidery_bows/embroidery_alligator_clip/purple.jpg": {
          Code: "EB-EAC-PLE-004",
          Name: "Purple",
          Price: "120",
          rating: "4.5",
          stock: 10,
          isCustomizable: false,
          isBestSeller: true
        }
      }
    },
    "Crochet Clips": {
      "public/images/collections/crochet_clips/crochet_rainbow_clip.jpg": {
        Code: "CC-CRC-001",
        Name: "Crochet Rainbow Clips",
        Price: "90",
        rating: "4.5",
        stock: 30,
        isCustomizable: false,
        isBestSeller: true
      },
      "public/images/collections/crochet_clips/flower_hairband.jpg": {
        Code: "CC-FHC-001",
        Name: "Flower Hairband Crochet",
        Price: "120",
        rating: "4.5",
        stock: 30,
        isCustomizable: false,
        isBestSeller: true
      },
      "public/images/collections/crochet_clips/flower_tik_tak_pin.jpg": {
        Code: "CC-FTTP-001",
        Name: "Flower Tik Tak Pin Crochet",
        Price: "120",
        rating: "4.5",
        stock: 30,
        isCustomizable: false,
        isBestSeller: true
      },
      "Crochet Clips": {
        "public/images/collections/crochet_clips/oragne.jpg": {
          Code: "CC-CC-ORG-001",
          Name: "Orange",
          Price: "100",
          rating: "4.5",
          stock: 30,
          isCustomizable: false,
          isBestSeller: true
        },
        "public/images/collections/crochet_clips/off_white.jpg": {
          Code: "CC-CC-OWHT-002",
          Name: "OFF White",
          Price: "100",
          rating: "4.5",
          stock: 30,
          isCustomizable: false,
          isBestSeller: true
        },
        "public/images/collections/crochet_clips/red.jpg": {
          Code: "CC-CC-RED-003",
          Name: "Red",
          Price: "100",
          rating: "4.2",
          stock: 30,
          isCustomizable: false,
          isBestSeller: true
        },
        "public/images/collections/crochet_clips/pink.jpg": {
          Code: "CC-CC-PNK-004",
          Name: "Pink",
          Price: "100",
          rating: "4.2",
          stock: 30,
          isCustomizable: false,
          isBestSeller: true
        },
        "public/images/collections/crochet_clips/yellow.jpg": {
          Code: "CC-CC-YEL-004",
          Name: "Yellow",
          Price: "100",
          rating: "4.5",
          stock: 30,
          isCustomizable: false,
          isBestSeller: true
        }
      }
    },
    "Customised Caps": {
      "public/images/collections/customised_caps/red.jpg": {
        Code: "CNC-RED-001",
        Name: "Red Cap",
        Price: "200",
        rating: "4.5",
        stock: 30,
        isCustomizable: true,
        isBestSeller: true
      },
      "public/images/collections/customised_caps/pink.jpg": {
        Code: "CNC-PNK-002",
        Name: "Pink Cap",
        Price: "200",
        rating: "4.5",
        stock: 30,
        isCustomizable: true,
        isBestSeller: true
      },
      "public/images/collections/customised_caps/black.jpg": {
        Code: "CNC-BLK-003",
        Name: "Black Cap",
        Price: "200",
        rating: "4.5",
        stock: 30,
        isCustomizable: true,
        isBestSeller: true
      },
      "public/images/collections/customised_caps/white.jpg": {
        Code: "CNC-WHT-004",
        Name: "White Cap",
        Price: "200",
        rating: "4.5",
        stock: 30,
        isCustomizable: true,
        isBestSeller: true
      },
      "public/images/collections/customised_caps/yellow.jpg": {
        Code: "CNC-YEL-004",
        Name: "Yellow Cap",
        Price: "200",
        rating: "4.5",
        stock: 30,
        isCustomizable: true,
        isBestSeller: true
      }
    },
    "Customised Name Sunglasses": {
      "public/images/collections/customised_name_sunglasses/pink.jpg": {
        Code: "CNS-PNK-001",
        Name: "Pink Sunglass",
        Price: "200",
        rating: "4.5",
        stock: 30,
        isCustomizable: true,
        isBestSeller: true
      },
      "public/images/collections/customised_name_sunglasses/skyblue.jpg": {
        Code: "CNS-SKB-002",
        Name: "Skyblue Sunglass",
        Price: "200",
        rating: "4.5",
        stock: 30,
        isCustomizable: true,
        isBestSeller: true
      },
      "public/images/collections/customised_name_sunglasses/red.jpg": {
        Code: "CNS-RED-003",
        Name: "Red Sunglass",
        Price: "200",
        rating: "4.5",
        stock: 30,
        isCustomizable: true,
        isBestSeller: true
      },
      "public/images/collections/customised_name_sunglasses/purple.jpg": {
        Code: "CNS-PLE-004",
        Name: "Purple Sunglass",
        Price: "200",
        rating: "4.5",
        stock: 30,
        isCustomizable: true,
        isBestSeller: true
      },
      "public/images/collections/customised_name_sunglasses/black.jpg": {
        Code: "CNS-BLK-004",
        Name: "Black Sunglass",
        Price: "200",
        rating: "4.5",
        stock: 30,
        isCustomizable: true,
        isBestSeller: true
      },
      "public/images/collections/customised_name_sunglasses/green.jpg": {
        Code: "CNS-GRN-005",
        Name: "Green Sunglass",
        Price: "200",
        rating: "4.5",
        stock: 30,
        isCustomizable: true,
        isBestSeller: true
      }
    }
  }
};

// src/data/temp_products.ts
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
var collectionsObj = config_product_default.Collections || config_product_default;
var rawHomeImages = config_product_default.home_images || {};
var rawProductImages = config_product_default.product_images || {};
var rawLogoData = config_product_default.logo || {};
for (const [macroCategory, macroCategoryObj] of Object.entries(collectionsObj)) {
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
      const stockVal = configData.Stock ?? configData.stock;
      const ratingVal = configData.Rating ?? configData.rating;
      const customVal = configData.IsCustomizable ?? configData.isCustomizable;
      const bestVal = configData.IsBestSeller ?? configData.isBestSeller;
      const stock = stockVal !== void 0 ? parseInt(String(stockVal), 10) : 50;
      const rating = ratingVal !== void 0 ? parseFloat(String(ratingVal)) : 5;
      const isCustomizable = customVal !== void 0 ? String(customVal).toLowerCase() === "true" : false;
      const isBestSeller = bestVal !== void 0 ? String(bestVal).toLowerCase() === "true" : false;
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
      let groupCustomizable = false;
      let groupBestSeller = true;
      let groupRating = 5;
      let isFirst = true;
      for (const [varLocation, varConfig] of Object.entries(variantsObj)) {
        if (!varLocation.startsWith("public/")) continue;
        const cleanUrl = varLocation.startsWith("public") ? varLocation.substring(6) : varLocation;
        images.push(cleanUrl);
        processedLocations.add(cleanUrl);
        const vPrice = parsePrice(varConfig.Price);
        const vStockVal = varConfig.Stock ?? varConfig.stock;
        const vRatingVal = varConfig.Rating ?? varConfig.rating;
        const vCustomVal = varConfig.IsCustomizable ?? varConfig.isCustomizable;
        const vBestVal = varConfig.IsBestSeller ?? varConfig.isBestSeller;
        const vStock = vStockVal !== void 0 ? parseInt(String(vStockVal), 10) : 50;
        if (isFirst) {
          groupPrice = vPrice;
          groupCustomizable = vCustomVal !== void 0 ? String(vCustomVal).toLowerCase() === "true" : false;
          groupBestSeller = vBestVal !== void 0 ? String(vBestVal).toLowerCase() === "true" : false;
          groupRating = vRatingVal !== void 0 ? parseFloat(String(vRatingVal)) : 5;
          isFirst = false;
        }
        variants.push({
          code: varConfig.Code,
          color: varConfig.Name || "Standard",
          image: cleanUrl,
          price: vPrice,
          stock: vStock,
          rating: vRatingVal !== void 0 ? parseFloat(String(vRatingVal)) : 5
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
          rating: groupRating,
          isCustomizable: groupCustomizable,
          isBestSeller: groupBestSeller,
          options: [{
            name: "Color",
            values: variants.map((v) => v.color || "Standard")
          }]
        });
      }
    }
  }
}
var diskImages = { glob: () => ({}) }.glob("/public/images/collections/**/*.{jpg,jpeg,png,webp}", { eager: true });
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
  products,
  rawHomeImages,
  rawLogoData,
  rawProductImages
});
