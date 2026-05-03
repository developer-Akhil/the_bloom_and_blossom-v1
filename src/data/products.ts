import { type Product } from '../types';

const hardcodedProducts: Product[] = [
  {
    id: '1',
    name: 'Golden Glitter Bow',
    category: 'Customised Name Bows',
    price: 200,
    description: 'Add a personal touch to your style with our Customized Name Bows. Designed with care, each bow is beautifully crafted and personalized with your chosen name. Perfect for kids, gifting, or special occasions.',
    images: ['/images/collections/customised_name_bows/golden_glitter_bow.jpeg'],
    stock: 9,
    isCustomizable: true,
    isBestSeller: true,
    rating: 4.8
  },
  {
    id: '2',
    name: 'Popsicle Clip',
    category: 'Alligator Clips',
    price: 90,
    description: 'Add a magical touch with these adorable pink glitter unicorn bow clips, designed to brighten any hairstyle.Soft, stylish, and secure, they’re perfect for kids daily wear, parties, or gifting.',
    images: ['/images/collections/alligator_clips/popsicle_clips.jpg'],
    stock: 100,
    isCustomizable: false,
    isBestSeller: true,
    rating: 4.9,
    options: [
      {
        name: 'Size',
        values: ['Classic', 'Large', 'Extra Large']
      }
    ]
  },
  {
    id: '3',
    name: 'Crochet Rainbow Clips',
    category: 'Crochet Clips',
    price: 90,
    description: 'Brighten up any hairstyle with this adorable crochet rainbow clip, handcrafted with soft yarn and vibrant colors..',
    images: ['/images/collections/crochet_clips/crochet_rainbow_clip.jpg'],
    stock: 75,
    isCustomizable: false,
    isBestSeller: true,
    rating: 4.7
  },
  {
    id: '4',
    name: 'Velvet Stone Bows',
    category: 'Alligator Clips',
    price: 120,
    description: 'Add a touch of elegance with these velvet stone bows, crafted from soft velvet and embellished with sparkling stones for a luxurious look..',
    images: ['/images/collections/alligator_clips/velvet_stone_bows.jpg'],
    stock: 20,
    isCustomizable: false,
    isBestSeller: true,
    rating: 5.0
  },
  {
    id: '4_1',
    name: 'Valentine Bow Clip',
    category: 'Alligator Clips',
    price: 100,
    description: 'A beautiful valentine themed bow clip to celebrate the season of love.',
    images: ['/images/collections/alligator_clips/valentine_bow.jpg'],
    stock: 25,
    isCustomizable: false,
    rating: 4.8
  },
  {
    id: '5',
    name: 'Daisy Name Bow',
    category: 'Customised Name Bows',
    price: 200,
    description: 'Add a personal touch to your style with our Customized Name Bows. Designed with care, each bow is beautifully crafted and personalized with your chosen name. Perfect for kids, gifting, or special occasions.',
    images: ['/images/collections/customised_name_bows/daisy_name_bow.jpg'],
    stock: 15,
    isCustomizable: true,
    rating: 4.8
  },
  {
    id: '6',
    name: 'Pearl Name Bow',
    category: 'Customised Name Bows',
    price: 200,
    description: 'Add a personal touch to your style with our Customized Name Bows. Designed with care, each bow is beautifully crafted and personalized with your chosen name. Perfect for kids, gifting, or special occasions.',
    images: ['/images/collections/customised_name_bows/pearl_name_bow.jpg'],
    stock: 10,
    isCustomizable: true,
    rating: 4.9
  },
  {
    id: '7',
    name: 'Daisy Name Without Tail Bow',
    category: 'Customised Name Bows',
    price: 170,
    description: 'Daisy bow without tail for a clean minimal accessory.',
    images: ['/images/collections/customised_name_bows/daisy_name_without_tail_bow.jpg'],
    stock: 12,
    isCustomizable: true,
    rating: 4.7
  },
  {
    id: '8',
    name: 'Scrunchies',
    category: 'Scrunchies',
    price: 40,
    description: 'Elevate your everyday style with this soft satin scrunchie, designed to be gentle on hair and reduce breakage. Smooth, stylish, and comfortable, it’s perfect for daily wear or adding a chic touch to any outfit.',
    images: ['/images/collections/scrunchies/red.jpg', '/images/collections/scrunchies/black.jpg', '/images/collections/scrunchies/purple.jpg', '/images/collections/scrunchies/white.jpg'],
    stock: 210,
    rating: 4.8,
    isCustomizable: false,
    variants: [
      {
        color: 'Red',
        image: '/images/collections/scrunchies/red.jpg',
        stock: 50,
        rating: 4.8
      },
      {
        color: 'Black',
        image: '/images/collections/scrunchies/black.jpg',
        stock: 60,
        rating: 4.9
      },
      {
        color: 'Purple',
        image: '/images/collections/scrunchies/purple.jpg',
        stock: 45,
        rating: 4.7
      },
      {
        color: 'White',
        image: '/images/collections/scrunchies/white.jpg',
        stock: 55,
        rating: 4.8
      }
    ]
  },
  {
    id: '11_1',
    name: 'Rainbow Scrunchie',
    category: 'Scrunchies',
    price: 40,
    description: 'Brighten up your day with this vibrant rainbow scrunchie.',
    images: ['/images/collections/scrunchies/rainbow.jpg'],
    stock: 30,
    isCustomizable: false,
    rating: 4.8
  },
  {
    id: '11_2',
    name: 'Rang Birangi Scrunchie',
    category: 'Scrunchies',
    price: 40,
    description: 'Add a pop of color with this lovely rang birangi scrunchie.',
    images: ['/images/collections/scrunchies/rang_birangi.jpg'],
    stock: 25,
    isCustomizable: false,
    rating: 4.7
  },
  {
    id: '11_3',
    name: 'Skyblue Check Scrunchie',
    category: 'Scrunchies',
    price: 40,
    description: 'Chic skyblue check pattern scrunchie for a stylish look.',
    images: ['/images/collections/scrunchies/skyblue_check.jpg'],
    stock: 40,
    isCustomizable: false,
    rating: 4.9
  },
  {
    id: '11_4',
    name: 'Flamingo Scrunchie',
    category: 'Scrunchies',
    price: 40,
    description: 'Beautiful flamingo print scrunchie for a fun and playful style.',
    images: ['/images/collections/scrunchies/flamingo.jpg'],
    stock: 35,
    isCustomizable: false,
    rating: 4.8
  },
  {
    id: '11_5',
    name: 'Pinky Scrunchie',
    category: 'Scrunchies',
    price: 40,
    description: 'Sweet pinky scrunchie, perfect for matching with pastel outfits.',
    images: ['/images/collections/scrunchies/pinky.jpg'],
    stock: 50,
    isCustomizable: false,
    rating: 4.7
  },
  {
    id: '12',
    name: 'Skyblue Doll Bow',
    category: 'Premium Doll Bows',
    price: 300,
    description: 'Add a touch of charm with our premium handmade doll bows, beautifully crafted with intricate detail and care.Each bow features a lovingly handmade doll, making every piece unique—perfect for special occasions or thoughtful gifting.',
    images: ['/images/collections/premium_doll_bows/skyblue_doll.jpg'],
    stock: 20,
    isCustomizable: false,
    rating: 4.9
  },
  {
    id: '13',
    name: 'Yellow Doll Bow',
    category: 'Premium Doll Bows',
    price: 300,
    description: 'Add a touch of charm with our premium handmade doll bows, beautifully crafted with intricate detail and careEach bow features a lovingly handmade doll, making every piece unique—perfect for special occasions or thoughtful gifting.',
    images: ['/images/collections/premium_doll_bows/yellow_doll.jpg'],
    stock: 18,
    isCustomizable: false,
    rating: 4.8
  },
  {
    id: '14',
    name: 'Pink Jewelled Bow',
    category: 'Jewelled Bows',
    price: 320,
    description: ' Add a touch of luxury with our premium handmade jewelled bow, beautifully crafted with sparkling embellishments and fine detailing.Elegant and unique, it’s perfect for special occasions or elevating everyday hairstyles with a glamorous finish.',
    images: ['/images/collections/jewelled_bows/pink.jpg'],
    stock: 8,
    isCustomizable: false,
    rating: 5.0
  },
  {
    id: '14_1',
    name: 'Golden Jewelled Bow',
    category: 'Jewelled Bows',
    price: 320,
    description: 'Add a touch of luxury with our premium handmade golden jewelled bow, beautifully crafted with sparkling embellishments and fine detailing.',
    images: ['/images/collections/jewelled_bows/golden.jpg'],
    stock: 10,
    isCustomizable: false,
    rating: 4.9
  },
  {
    id: '15',
    name: 'Cupcake Hairband',
    category: 'Hairbands',
    price: 120,
    description: 'Cute cupcake themed hairband.',
    images: ['/images/collections/hairbands/cup_cake.jpg'],
    stock: 25,
    isCustomizable: false,
    rating: 4.7
  },
  {
    id: '16',
    name: 'Colourful Hairband',
    category: 'Hairbands',
    price: 120,
    description: 'Add a playful charm to your look with this pastel bow hairband, beautifully designed with soft, multicolor mini bows.',
    images: ['/images/collections/hairbands/colourful.jpg'],
    stock: 30,
    isCustomizable: false,
    rating: 4.8
  },
  {
    id: '17',
    name: 'Embroidery Tail Bow',
    category: 'Embroidery Bows',
    price: 150,
    description: 'Add a graceful touch with this embroidered tail bow, beautifully detailed with delicate pearl accents for an elegant finish.',
    images: ['/images/collections/embroidery_bows/embroidery_tail_bow.jpg'],
    stock: 15,
    isCustomizable: false,
    rating: 4.9
  },
  {
    id: '18',
    name: 'Embroidery Alligator Clip',
    category: 'Embroidery Bows',
    price: 100,
    description: 'Add a graceful touch with this embroidered alligator clip, beautifully detailed with delicate pearl accents for an elegant finish.',
    images: ['/images/collections/embroidery_bows/embroidery_alligator.jpeg'],
    stock: 22,
    isCustomizable: false,
    rating: 4.8
  },
  {
    id: '20',
    name: 'Flower Hairband Crochet',
    category: 'Crochet Clips',
    price: 120,
    description: 'Add a touch of handmade charm with this crochet flower hairband, beautifully crafted with soft yarn and delicate floral details.',
    images: ['/images/collections/crochet_clips/flower_hairband.jpg'],
    stock: 15,
    isCustomizable: false,
    rating: 4.8
  },
  {
    id: '21',
    name: 'Crochet Clip',
    category: 'Crochet Clips',
    price: 100,
    description: 'Add a handmade touch to your hairstyle with this crochet alligator clip, crafted with soft yarn and neat detailing.',
    images: ['/images/collections/crochet_clips/crochet_clip.jpg'],
    stock: 25,
    isCustomizable: false,
    rating: 4.7
  },
  {
    id: '24',
    name: 'Customised Name Sunglasses',
    category: 'Customised Name Sunglasses',
    price: 200,
    description: 'Make your little one shine with these customised name sunglasses, designed with their name for a fun and unique touch.',
    images: ['/images/collections/customised_name_sunglasses/customised_name_sunglasses.jpg'],
    stock: 10,
    isCustomizable: true,
    rating: 4.9
  },
  {
    id: '25',
    name: 'White Headband',
    category: 'Headbands',
    price: 120,
    description: 'Add a touch of elegance with this white lace headband, featuring delicate lace detailing for a soft and graceful look.',
    images: ['/images/collections/headbands/white_headband.jpg'],
    stock: 35,
    isCustomizable: false,
    rating: 4.7
  },
  {
    id: '26',
    name: 'Customised Caps',
    category: 'Customised Caps',
    price: 199,
    description: 'Stylish and high-quality customised caps.',
    images: ['/images/collections/customised_caps/customised_caps.jpg'],
    stock: 35,
    isCustomizable: true,
    rating: 4.7
  }
];

export const categories = [
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

// Dynamically seed physical collections from disk into the store:
const diskImages = (import.meta as any).glob('/public/images/collections/**/*.{jpg,jpeg,png,webp}', { eager: true });
const diskImagePaths = new Set(Object.keys(diskImages).map(p => p.replace('/public', '')));

// Filter out hardcoded products if their images are no longer present on disk
export const products: Product[] = hardcodedProducts.map(p => {
    if (!p.images) {
        // @ts-ignore
        p.images = p.variants ? p.variants.map(v => v.image).filter(Boolean) : [];
    }
    return p;
}).filter(product => {
    // Keep it if it has no images matching the collections folder pattern, or if it does, the image still exists.
    let isValid = true;
    if (product.images) {
        isValid = product.images.every(img => {
            if (img.startsWith('/images/collections/')) {
                return diskImagePaths.has(img);
            }
            return true;
        });
    }
    
    if (isValid && product.variants) {
         isValid = product.variants.every(variant => {
             if (variant.image && variant.image.startsWith('/images/collections/')) {
                 return diskImagePaths.has(variant.image);
             }
             return true;
         });
    }

    return isValid;
});

let autoId = 1000;

Object.keys(diskImages).forEach(path => {
    if (path.endsWith('.keep')) return;
    const parts = path.split('/');
    const filename = parts.pop() || '';
    const folderName = parts.pop() || ''; 
    
    // Ignore direct uploads to 'collections/' that aren't properly inside a sub-category folder
    if(folderName === 'collections') return;

    // Build friendly strings
    const categoryName = folderName.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    let friendlyProductName = filename.replace(/\.[^/.]+$/, "").replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    // Check against existing hard-coded products using path matching to prevent duplicate cards
    const cleanUrl = path.replace('/public', '');
    if (products.some(p => p.images.includes(cleanUrl))) {
        return;
    }

    products.push({
        id: `auto_${autoId++}`,
        name: friendlyProductName,
        category: categoryName as any,
        price: 199, // generic base price
        description: `Premium ${categoryName.toLowerCase()} designed to elevate your everyday style.`,
        images: [cleanUrl],
        stock: 50,
        isCustomizable: false,
        rating: 5.0
    });
    
    // Automatically inject the parent directory into categories map if it's uniquely new!
    if (!categories.includes(categoryName)) {
        categories.push(categoryName);
    }
});
