require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer')
const path = require('path')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');


const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN,  // Replace with your frontend URL
  credentials: true  // Allows cookies to be sent
})); // Enable CORS for all routes
// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Schemas and Models
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const userDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  phone : String,
  street: String,
  city: String,
  state: String,
  postalCode: String,
  country : String,
  lastLogin : {
    type : Date,
    default : Date.now,
  }
});

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  productImage: {
    type: String,  // Store the path to the image or the image URL
    required: false,  // Optional, since not every product might have an image
  },
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Directory to store images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Generate unique filename
  }
});
const upload = multer({ storage });


const CartSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  products: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      quantity: Number,
    },
  ],
});

const User = mongoose.model('User', UserSchema);
const Product = mongoose.model('Product', ProductSchema);
const Cart = mongoose.model('Cart', CartSchema);
const UserData = mongoose.model('UserData', userDataSchema);

//Middleware to verify Token
const verifyToken = (req, res, next) => {
  const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1]; // headers is for postmman
  if (!token) return res.status(403).json({ message: 'Access denied. No token provided.' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token.' });
    req.user = decoded;  // Attach user info to request object
    next();
  });
};

// Routes

//UserInfo Route
app.get('/api/users/info',verifyToken,async(req,res)=>{
  try {
    const info = await UserData.find(req.user.userId);
    res.json(info[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})


// User Routes
app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password:hashedPassword });
    await user.save();
    const userData = new UserData({userId:user._id,phone:'',street:'',city:'',state:'',postalCode:'',country:'',lastLogin:Date.now()})
    await userData.save();
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.cookie("token", token, {
      maxAge: 24 * 3600000, // 24 hour
    });
    res.status(201).json({ message: 'User registered successfully',token });
  } catch (err) {
    console.log(err);
    
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const isMatch = bcrypt.compare(password,user.password)
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
    const userData = await UserData.updateOne(
      { userId: user._id }, // Find by _id
      { $set: { lastLogin: Date.now() } } // Update lastLogin
    );
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.cookie("token", token, {
      maxAge: 24 * 3600000, // 24 hour
    });
    res.json({ token, userId: user._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Product Routes
app.post('/api/products',upload.single('productImage'), async (req, res) => {
  try {
    const { name, price, description, stock } = req.body;

    
    // const productImage = req.file ? req.file.path : null;
    const product = new Product({ name, price, description, stock });
    // const product = new Product({ name, price, description, stock,productImage });
    await product.save();
    res.status(201).json({ message: 'Product added successfully',product:product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cart Routes
app.post('/api/cart', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    const productIndex = cart.products.findIndex(
      p => p.productId.toString() === productId
    );

    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }

    await cart.save();
    res.json({ message: 'Cart updated successfully', cart });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.delete('/api/cart/:userId', async (req, res) => {
  try {
    const { productId } = req.body;
    // console.log(productId);
    
    const userId=req.params.userId;
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }
    const productIndex = cart.products.findIndex(
      p =>  (p.productId.toString() === productId)
    );
    
    if (productIndex > -1) {
      const updatedCart = await Cart.findOneAndUpdate(
        { _id: cart._id },
        { $pull: { products: { productId: productId } } },
        { new: true, upsert: false }  // Make sure upsert is false and new is true
      );
      
      res.json({ message: 'Product Removed successfully', updatedCart });
    } else {
      res.status(400).json({ message: 'Cart Have No Product of This ProductId' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/cart/:userId', async (req, res) => {
  try {

    
    const cart = await Cart.findOne({ userId: req.params.userId }).populate(
      'products.productId'
    );
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
