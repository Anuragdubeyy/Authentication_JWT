const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoute');
const { default: mongoose } = require('mongoose');

dotenv.config();

const MONGO = process.env.DB_PASSWORD;
mongoose
  .connect(
    `mongodb+srv://anuragdubey16017:${MONGO}@crm.e6a4o.mongodb.net/CRM`,
  )
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });


const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

const PORT =  5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));