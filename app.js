import express from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';

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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
