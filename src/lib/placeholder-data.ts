import type { Product, Order, User } from './types';

export const products: Product[] = [
  {
    id: 'classic-denim-jacket',
    name: 'Classic Denim Jacket',
    category: 'Jackets',
    price: 79.99,
    description: 'A timeless wardrobe staple, our Classic Denim Jacket is crafted from premium, durable denim. It features a comfortable fit, classic button-front closure, and versatile styling options that make it perfect for any season.',
    images: [
      { id: '1', url: 'https://picsum.photos/seed/101/800/800', alt: 'Front view of a classic denim jacket.', hint: 'denim jacket' },
      { id: '2', url: 'https://picsum.photos/seed/102/800/800', alt: 'Back view of a classic denim jacket.', hint: 'denim jacket model' },
    ],
    specs: ['100% Cotton', 'Machine Washable', 'Button Closure', 'Chest Pockets'],
    rating: 4.5,
    reviewCount: 120,
  },
  {
    id: 'linen-blend-shirt',
    name: 'Linen Blend Shirt',
    category: 'Shirts',
    price: 49.99,
    description: 'Stay cool and stylish with our Linen Blend Shirt. Made from a lightweight and breathable mix of linen and cotton, this shirt offers a relaxed fit and a sophisticated look, perfect for warm weather and casual outings.',
    images: [
      { id: '1', url: 'https://picsum.photos/seed/103/800/800', alt: 'A man wearing a linen blend shirt.', hint: 'linen shirt' },
      { id: '2', url: 'https://picsum.photos/seed/104/800/800', alt: 'Close up of a linen blend shirt fabric.', hint: 'fabric texture' },
    ],
    specs: ['55% Linen, 45% Cotton', 'Breathable Fabric', 'Button-down Collar', 'Regular Fit'],
    rating: 4.7,
    reviewCount: 95,
  },
  {
    id: 'slim-fit-chinos',
    name: 'Slim-Fit Chinos',
    category: 'Pants',
    price: 64.99,
    description: 'Our Slim-Fit Chinos are the perfect combination of comfort and style. Tailored for a modern silhouette from soft, stretch-infused cotton, they provide all-day comfort while maintaining a sharp, polished appearance.',
    images: [
      { id: '1', url: 'https://picsum.photos/seed/105/800/800', alt: 'A person wearing slim-fit chinos.', hint: 'chinos pants' },
      { id: '2', url: 'https://picsum.photos/seed/106/800/800', alt: 'Side view of slim-fit chinos.', hint: 'pants fashion' },
    ],
    specs: ['98% Cotton, 2% Spandex', 'Slim Fit', 'Zip Fly with Button Closure', 'Four-pocket Styling'],
    rating: 4.6,
    reviewCount: 210,
  },
  {
    id: 'merino-wool-sweater',
    name: 'Merino Wool Sweater',
    category: 'Sweaters',
    price: 89.99,
    description: 'Experience luxury and warmth with our Merino Wool Sweater. Knitted from extra-fine merino wool, it’s incredibly soft, naturally insulating, and lightweight. A classic crewneck design makes it a versatile layering piece.',
    images: [
      { id: '1', url: 'https://picsum.photos/seed/107/800/800', alt: 'A merino wool sweater on a hanger.', hint: 'wool sweater' },
      { id: '2', url: 'https://picsum.photos/seed/108/800/800', alt: 'Close up of merino wool texture.', hint: 'wool texture' },
    ],
    specs: ['100% Merino Wool', 'Ultra-Soft Handfeel', 'Crewneck', 'Ribbed Cuffs and Hem'],
    rating: 4.9,
    reviewCount: 150,
  },
  {
    id: 'leather-biker-jacket',
    name: 'Leather Biker Jacket',
    category: 'Jackets',
    price: 299.99,
    description: 'Unleash your inner rebel with our iconic Leather Biker Jacket. Made from supple, high-quality genuine leather, it features classic asymmetrical zip details, notched lapels, and a tailored fit for an effortlessly cool edge.',
    images: [
      { id: '1', url: 'https://picsum.photos/seed/109/800/800', alt: 'A person wearing a leather biker jacket.', hint: 'leather jacket' },
      { id: '2', url: 'https://picsum.photos/seed/110/800/800', alt: 'Detail of the leather biker jacket zipper.', hint: 'jacket zipper' },
    ],
    specs: ['100% Genuine Leather', 'Asymmetrical Zip Closure', 'Multiple Zip Pockets', 'Professional Leather Clean Only'],
    rating: 4.8,
    reviewCount: 88,
  },
  {
    id: 'graphic-print-t-shirt',
    name: 'Graphic Print T-Shirt',
    category: 'T-Shirts',
    price: 29.99,
    description: 'Make a statement with our Graphic Print T-Shirt. Cut from soft, breathable cotton for a comfortable fit, it features a unique, artist-designed graphic that adds a touch of personality to your casual wardrobe.',
    images: [
      { id: '1', url: 'https://picsum.photos/seed/111/800/800', alt: 'Front of a graphic print t-shirt.', hint: 'graphic tshirt' },
      { id: '2', url: 'https://picsum.photos/seed/112/800/800', alt: 'Model wearing a graphic print t-shirt.', hint: 'tshirt model' },
    ],
    specs: ['100% Combed Cotton', 'Crewneck', 'High-Quality Print', 'Modern Fit'],
    rating: 4.4,
    reviewCount: 180,
  },
  {
    id: 'tailored-wool-blazer',
    name: 'Tailored Wool Blazer',
    category: 'Jackets',
    price: 199.99,
    description: 'Elevate any outfit with our Tailored Wool Blazer. Expertly crafted from a fine wool blend, this single-breasted blazer is designed for a flattering, structured fit. It’s a timeless piece for both formal and smart-casual occasions.',
    images: [
      { id: '1', url: 'https://picsum.photos/seed/113/800/800', alt: 'Front of a tailored wool blazer.', hint: 'wool blazer' },
      { id: '2', url: 'https://picsum.photos/seed/114/800/800', alt: 'Side of a tailored wool blazer.', hint: 'blazer fashion' },
    ],
    specs: ['70% Wool, 30% Polyester', 'Fully Lined', 'Notched Lapels', 'Two-Button Closure'],
    rating: 4.8,
    reviewCount: 65,
  },
  {
    id: 'silk-evening-gown',
    name: 'Silk Evening Gown',
    category: 'Dresses',
    price: 349.99,
    description: 'Command attention in our luxurious Silk Evening Gown. Flowing gracefully with every step, this gown is made from pure, lustrous silk. It features an elegant V-neckline and a floor-sweeping silhouette for a truly glamorous entrance.',
    images: [
      { id: '1', url: 'https://picsum.photos/seed/115/800/800', alt: 'A woman in a silk evening gown.', hint: 'evening gown' },
      { id: '2', url: 'https://picsum.photos/seed/116/800/800', alt: 'Detail of the silk fabric on an evening gown.', hint: 'silk fabric' },
    ],
    specs: ['100% Mulberry Silk', 'V-Neckline', 'Concealed Zip Fastening', 'Dry Clean Only'],
    rating: 4.9,
    reviewCount: 42,
  },
];

export const user: User = {
  id: 'user-1',
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
};

export const orders: Order[] = [
  {
    id: 'TC-1701',
    date: '2023-10-22',
    status: 'Delivered',
    total: 114.98,
    items: [
      { id: 'linen-blend-shirt', name: 'Linen Blend Shirt', image: 'https://picsum.photos/seed/103/100/100', alt: 'Linen Shirt', price: 49.99, quantity: 1 },
      { id: 'slim-fit-chinos', name: 'Slim-Fit Chinos', image: 'https://picsum.photos/seed/105/100/100', alt: 'Chinos', price: 64.99, quantity: 1 },
    ]
  },
  {
    id: 'TC-1658',
    date: '2023-09-05',
    status: 'Delivered',
    total: 29.99,
    items: [
      { id: 'graphic-print-t-shirt', name: 'Graphic Print T-Shirt', image: 'https://picsum.photos/seed/111/100/100', alt: 'T-Shirt', price: 29.99, quantity: 1 },
    ]
  },
    {
    id: 'TC-1802',
    date: '2024-01-15',
    status: 'Shipped',
    total: 89.99,
    items: [
      { id: 'merino-wool-sweater', name: 'Merino Wool Sweater', image: 'https://picsum.photos/seed/107/100/100', alt: 'Sweater', price: 89.99, quantity: 1 },
    ]
  }
];
