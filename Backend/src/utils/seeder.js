const { sequelize, User, Category, Product, ProductImage } = require('../models/Index');
const bcrypt = require('bcrypt');

const seedDatabase = async () => {
  try {
    // FORCE: TRUE drops tables if they already exist
    await sequelize.sync({ force: true });
    console.log('Database synced & dropped');

    // Users
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@amazon.com',
      password_hash: 'password123',
      role: 'admin'
    });
    
    const demoUser = await User.create({
      name: 'Demo Customer',
      email: 'customer@amazon.com',
      password_hash: 'password123',
      role: 'customer'
    });

    // Categories
    const categoriesData = [
      { name: 'Electronics', slug: 'electronics', image_url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&q=80' },
      { name: 'Books', slug: 'books', image_url: 'https://images.unsplash.com/photo-1495640388908-05fd920703a2?w=200&q=80' },
      { name: 'Clothing', slug: 'clothing', image_url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&q=80' },
      { name: 'Home & Kitchen', slug: 'home-kitchen', image_url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200&q=80' },
      { name: 'Sports & Fitness', slug: 'sports-fitness', image_url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&q=80' },
      { name: 'Beauty & Personal Care', slug: 'beauty', image_url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&q=80' }
    ];
    
    const createdCategories = await Category.bulkCreate(categoriesData, { returning: true });

    // Precise Product Data per category (High quality Unsplash images)
    const productDataMap = {
      'Electronics': [
        { name: 'Apple iPhone 15 Pro (128GB) - Titanium', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80', price: '134900.00', brand: 'Apple' },
        { name: 'Samsung Galaxy S24 Ultra 5G AI Smartphone', image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80', price: '129999.00', brand: 'Samsung' },
        { name: 'Sony WH-1000XM5 Wireless Headphones', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80', price: '29990.00', brand: 'Sony' },
        { name: 'Apple MacBook Air M2 chip Laptop', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80', price: '99990.00', brand: 'Apple' },
        { name: 'Canon EOS M50 Mark II Mirrorless Camera', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80', price: '58990.00', brand: 'Canon' }
      ],
      'Books': [
        { name: 'Atomic Habits: An Easy & Proven Way to Build Good Habits', image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80', price: '499.00', brand: 'Penguin' },
        { name: 'The Psychology of Money', image: 'https://images.unsplash.com/photo-1554774853-719586f82d77?w=800&q=80', price: '299.00', brand: 'Jaico' },
        { name: 'To Kill a Mockingbird', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80', price: '350.00', brand: 'HarperCollins' },
        { name: 'Sapiens: A Brief History of Humankind', image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80', price: '450.00', brand: 'Vintage' },
        { name: 'Dune (Chronicles of Dune)', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80', price: '399.00', brand: 'Hodder' }
      ],
      'Clothing': [
        { name: "Men's Solid Regular Fit Cotton T-Shirt", image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80', price: '499.00', brand: 'Allen Solly' },
        { name: "Women's Floral Printed Maxi Dress", image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80', price: '1299.00', brand: 'Biba' },
        { name: "Men's Slim Fit Mid-Rise Jeans", image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80', price: '1899.00', brand: "Levi's" },
        { name: 'Nike Men Air Max Running Shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', price: '4999.00', brand: 'Nike' },
        { name: "Puma Men's Graphic Print Sweatshirt", image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80', price: '1499.00', brand: 'Puma' }
      ],
      'Home & Kitchen': [
        { name: 'Philips Digital Air Fryer XL with Rapid Air Technology', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80', price: '8999.00', brand: 'Philips' },
        { name: 'Pigeon Aluminium Non-Stick Cookware Set', image: 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?w=800&q=80', price: '1299.00', brand: 'Pigeon' },
        { name: 'Wakefit Orthopedic Memory Foam Mattress', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80', price: '12499.00', brand: 'Wakefit' },
        { name: 'Bajaj Room Heater with Advanced Safety', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80', price: '2499.00', brand: 'Bajaj' },
        { name: 'Bombay Dyeing Premium Cotton Double Bedsheet', image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80', price: '899.00', brand: 'Bombay Dyeing' }
      ],
      'Sports & Fitness': [
        { name: 'Nivia Storm Football (Size 5)', image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=80', price: '499.00', brand: 'Nivia' },
        { name: 'Yonex Muscle Power 29 Lite Badminton Racket', image: 'https://images.unsplash.com/photo-1626243313104-c5a47805adfb?w=800&q=80', price: '1999.00', brand: 'Yonex' },
        { name: 'AmazonBasics Rubber Encased Hex Dumbbell Set', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80', price: '2499.00', brand: 'AmazonBasics' },
        { name: 'Boldfit Yoga Mat for Men and Women', image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80', price: '699.00', brand: 'Boldfit' },
        { name: 'Kore PVC Weight Lifting Home Gym Equipment Set', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80', price: '1599.00', brand: 'Kore' }
      ],
      'Beauty & Personal Care': [
        { name: "L'Oreal Paris Revitalift Hyaluronic Acid Serum", image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80', price: '899.00', brand: "L'Oreal Paris" },
        { name: 'Nivea Nourishing Lotion Body Milk', image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=800&q=80', price: '349.00', brand: 'Nivea' },
        { name: 'MAC Retro Matte Lipstick - Ruby Woo', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80', price: '1950.00', brand: 'MAC' },
        { name: 'Philips Essential Care Hair Dryer', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80', price: '849.00', brand: 'Philips' },
        { name: 'Calvin Klein CK One Eau de Toilette', image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80', price: '4500.00', brand: 'Calvin Klein' }
      ]
    };

    // Products
    const imagePromises = [];
    for (const cat of createdCategories) {
      const prodsForCat = productDataMap[cat.name] || [];
      
      for (let i = 0; i < 5; i++) {
        // Fallback in case we change categories and don't match the hardcoded map
        const prodData = prodsForCat[i] || {
          name: `Awesome ${cat.name} Item ${i + 1}`,
          image: `https://picsum.photos/seed/${cat.name}${i}/800`,
          price: (Math.random() * 2000 + 100).toFixed(2),
          brand: `Brand${Math.floor(Math.random() * 5) + 1}`
        };

        const product = await Product.create({
          category_id: cat.id,
          name: prodData.name,
          description: `Premium ${prodData.brand} product with excellent reviews. Ideal choice for ${cat.name} enthusiasts. Fast delivery and zero compromise on quality.`,
          price: prodData.price,
          stock: Math.floor(Math.random() * 50) + 10,
          brand: prodData.brand,
          rating: (Math.random() * 1.0 + 4.0).toFixed(1), // Between 4.0 and 5.0
          review_count: Math.floor(Math.random() * 5000) + 500,
          is_prime: true
        });

        // 3 images per product (duplicate the main image to ensure no broken placeholders)
        imagePromises.push(ProductImage.bulkCreate([
          { product_id: product.id, image_url: prodData.image, display_order: 1 },
          { product_id: product.id, image_url: prodData.image, display_order: 2 },
          { product_id: product.id, image_url: prodData.image, display_order: 3 },
        ]));
      }
    }

    await Promise.all(imagePromises);
    console.log('Seeding successful with real images!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
