import express from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import Category from './models/category.js';
import Product from './models/product.js';

const app = express();
app.use(express.json());

const port = process.env.PORT;
const dbURI = process.env.MONGO_URI;

if (!port || !dbURI) {
  throw new Error('PORT and MONGO_URI are required in .env file');
}

mongoose
  .connect(dbURI)
  .then(() => {
    console.log('Connection to MongoDB is successfully');
  })
  .catch((err) => {
    console.log('Failed to connect to MongoDB ', err);
  });

app.get('/', (req, res) => {
  res.status(200).send('Server running');
});

app.post('/categories', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ message: 'Name is required' });
    }

    const category = new Category({ name });
    await category.save();

    res
      .status(201)
      .json({ message: `Category ${name} was successfully created` });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error when creating category', error: error.message });
  }
});

app.post('/products', async (req, res) => {
  try {
    const { name, price, category } = req.body;

    if (!name || !price || !category) {
      res
        .status(400)
        .json({ message: 'Name, price and category are required' });
    }

    const product = new Product({ name, price, category });
    await product.save();

    res
      .status(201)
      .json({ message: `Product was successfully created`, product });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error when creating product', error: error.message });
  }
});

app.get('/products', async (req, res) => {
  try {
    const products = await Product.find().populate('category');

    res.status(200).json({ message: 'All products:', products });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error when getting products', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
