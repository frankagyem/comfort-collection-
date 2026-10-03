import mongoose from 'mongoose';
import dotenv from 'dotenv';
import products from './data/products.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import Review from './models/Review.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();

    const adminUserDoc = await User.create({
      name: 'Admin User',
      email: 'comfortyanso16@gmail.com',
      password: '0554383476@Jj',
      isAdmin: true,
      phone: '0554383476',
      referralCode: 'ADMIN123',
    });

    const adminUser = adminUserDoc._id;

    const sampleProducts = products.map((p) => {
      return { ...p, user: adminUser };
    });

    await Product.insertMany(sampleProducts);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
