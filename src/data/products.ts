import { type Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Golden Glitter Bow',
    category: 'Customised Name Bows',
    price: 499,
    description: 'Beautiful soft velvet bow with your name embroidered perfectly.',
    images: ['/images/our_best_sellers/premium_name_bows.jpg'],
    stock: 9,
    isCustomizable: true,
    rating: 4.8,
    options: [
      {
        name: 'Color',
        values: ['Black', 'Blue', 'Pink', 'Red', 'Green', 'Yellow', 'Purple']
      }
    ]
  },
  {
    id: '2',
    name: 'Popsicle Clip',
    category: 'Alligator Clips',
    price: 199,
    description: 'Adorable colorful popsicle designs perfect for a playful look.',
    images: ['/images/our_best_sellers/popsicle_clips.jpg'],
    stock: 100,
    isCustomizable: false,
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
    price: 299,
    description: 'Handcrafted crochet rainbows to brighten up any hairstyle.',
    images: ['/images/our_best_sellers/crochet_rainbow_clips.jpg'],
    stock: 75,
    isCustomizable: false,
    rating: 4.7
  },
  {
    id: '4',
    name: 'Velvet Stone Bows',
    category: 'Alligator Clips',
    price: 899,
    description: 'Luxurious velvet bow adorned with premium sparkling stones.',
    images: ['/images/our_best_sellers/velvet_stone_bows.jpg'],
    stock: 20,
    isCustomizable: false,
    rating: 5.0
  },
  {
    id: '5',
    name: 'Daisy Name Bow',
    category: 'Customised Name Bows',
    price: 499,
    description: 'Beautiful daisy decorated customized bow with unique finish.',
    images: ['/images/collections/customised_name_bows/daisy_name_bow.jpg'],
    stock: 15,
    isCustomizable: true,
    rating: 4.8
  },
  {
    id: '6',
    name: 'Pearl Name Bow',
    category: 'Customised Name Bows',
    price: 549,
    description: 'Elegant pearl customized bow for a sparkling look.',
    images: ['/images/collections/customised_name_bows/pearl_name_bow.jpg'],
    stock: 10,
    isCustomizable: true,
    rating: 4.9
  },
  {
    id: '7',
    name: 'Daisy Name Without Tail Bow',
    category: 'Customised Name Bows',
    price: 399,
    description: 'Daisy bow without tail for a clean minimal accessory.',
    images: ['/images/collections/customised_name_bows/daisy_name_without_tail_bow.jpg'],
    stock: 12,
    isCustomizable: true,
    rating: 4.7
  },
  {
    id: '8',
    name: 'Red Scrunchie',
    category: 'Scrunchies',
    price: 149,
    description: 'Classic Red Scrunchie.',
    images: ['/images/collections/scrunchies/red.jpg'],
    stock: 50,
    isCustomizable: false,
    rating: 4.8
  },
  {
    id: '9',
    name: 'Black Scrunchie',
    category: 'Scrunchies',
    price: 149,
    description: 'Classic Black Scrunchie.',
    images: ['/images/collections/scrunchies/black.jpg'],
    stock: 60,
    isCustomizable: false,
    rating: 4.9
  },
  {
    id: '10',
    name: 'Purple Scrunchie',
    category: 'Scrunchies',
    price: 149,
    description: 'Classic Purple Scrunchie.',
    images: ['/images/collections/scrunchies/purple.jpg'],
    stock: 45,
    isCustomizable: false,
    rating: 4.7
  },
  {
    id: '11',
    name: 'White Scrunchie',
    category: 'Scrunchies',
    price: 149,
    description: 'Classic White Scrunchie.',
    images: ['/images/collections/scrunchies/white.jpg'],
    stock: 55,
    isCustomizable: false,
    rating: 4.8
  },
  {
    id: '12',
    name: 'Skyblue Doll Bow',
    category: 'Premium Doll Bows',
    price: 349,
    description: 'Premium skyblue doll styling bow.',
    images: ['/images/collections/premium_doll_bows/skyblue_doll.jpg'],
    stock: 20,
    isCustomizable: false,
    rating: 4.9
  },
  {
    id: '13',
    name: 'Yellow Doll Bow',
    category: 'Premium Doll Bows',
    price: 349,
    description: 'Premium yellow doll styling bow.',
    images: ['/images/collections/premium_doll_bows/yellow_doll.jpg'],
    stock: 18,
    isCustomizable: false,
    rating: 4.8
  },
  {
    id: '14',
    name: 'Pink Jewelled Bow',
    category: 'Jewelled Bows',
    price: 699,
    description: 'Stunning pink jewelled bow.',
    images: ['/images/collections/jewelled_bows/pink.jpg'],
    stock: 8,
    isCustomizable: false,
    rating: 5.0
  },
  {
    id: '15',
    name: 'Cupcake Hairband',
    category: 'Hairbands',
    price: 299,
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
    price: 299,
    description: 'Vibrant colourful hairband.',
    images: ['/images/collections/hairbands/colourful.jpg'],
    stock: 30,
    isCustomizable: false,
    rating: 4.8
  },
  {
    id: '17',
    name: 'Embroidery Tail Bow',
    category: 'Embroidery Bows',
    price: 449,
    description: 'Intricate embroidery on a tail bow.',
    images: ['/images/collections/embroidery_bows/embroidery_tail_bow.jpg'],
    stock: 15,
    isCustomizable: false,
    rating: 4.9
  },
  {
    id: '18',
    name: 'Embroidery Alligator Clip',
    category: 'Embroidery Bows',
    price: 399,
    description: 'Beautifully embroidered alligator clip.',
    images: ['/images/collections/embroidery_bows/embroidery_alligator.png'],
    stock: 22,
    isCustomizable: false,
    rating: 4.8
  },
  {
    id: '19',
    name: 'Crochet Rainbow Clip Classic',
    category: 'Crochet Clips',
    price: 299,
    description: 'Handcrafted crochet rainbow clip.',
    images: ['/images/collections/crochet_clips/crochet_rainbow_clip.jpg'],
    stock: 18,
    isCustomizable: false,
    rating: 4.8
  },
  {
    id: '20',
    name: 'Flower HairBand Crochet',
    category: 'Crochet Clips',
    price: 349,
    description: 'Elegant crochet flower hair band.',
    images: ['/images/collections/crochet_clips/flower_hairband.jpg'],
    stock: 15,
    isCustomizable: false,
    rating: 4.8
  },
  {
    id: '21',
    name: 'Bow Crochet Clip',
    category: 'Crochet Clips',
    price: 249,
    description: 'Classic crochet design clip.',
    images: ['/images/collections/crochet_clips/bow_crochet_clip.jpg'],
    stock: 25,
    isCustomizable: false,
    rating: 4.7
  },
  {
    id: '24',
    name: 'Customised Name Sunglasses',
    category: 'Customised Name Sunglasses',
    price: 1299,
    description: 'Stylish sunglasses with your custom text.',
    images: ['/images/collections/customised_name_sunglasses/customised_name_sunglasses.jpg'],
    stock: 10,
    isCustomizable: true,
    rating: 4.9
  },
  {
    id: '25',
    name: 'White Headband',
    category: 'Headbands',
    price: 199,
    description: 'Clean and simple white headband.',
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
