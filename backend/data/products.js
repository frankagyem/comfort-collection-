const products = [
  {
    name: 'Luxury Cotton Bath Towel',
    description: 'Ultra-soft, highly absorbent 100% Egyptian cotton bath towel.',
    category: 'Bathroom Towels',
    price: 150,
    discountPercent: 0,
    images: ['/images/towel1.jpg'],
    stock: 50,
    isNewArrival: true,
    isFlashSale: false,
    fabric: 'Egyptian Cotton',
    color: 'White',
    sizes: [
      { size: 'Standard', stock: 50 },
      { size: 'Large', stock: 20 },
    ],
  },
  {
    name: 'Premium Silk Blend Bed Sheets',
    description: 'Experience ultimate comfort with our silk-blend bed sheet collection. Breathable and smooth.',
    category: 'Bed Sheets',
    price: 350,
    discountPercent: 15,
    images: ['/images/sheets1.jpg'],
    stock: 30,
    isNewArrival: false,
    isFlashSale: true,
    fabric: 'Silk Blend',
    color: 'Navy Blue',
    sizes: [
      { size: 'Queen', stock: 15 },
      { size: 'King', stock: 15 },
    ],
  },
  {
    name: 'Elegant Velvet Door Curtains',
    description: 'Heavyweight velvet door curtains to block out light and add a touch of elegance to any room.',
    category: 'Door Curtains',
    price: 250,
    discountPercent: 0,
    images: ['/images/curtain1.jpg'],
    stock: 10,
    isNewArrival: true,
    isFlashSale: false,
    fabric: 'Velvet',
    color: 'Emerald Green',
    sizes: [
      { size: '84 inch', stock: 10 },
    ],
  },
];

export default products;
