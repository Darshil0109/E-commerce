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
app.use(cookieParser());
app.use('/uploads',express.static('uploads'))
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
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png') {
      cb(null, true);
  } else {
      return cb(new Error('Only PNG files are allowed!'), false);
  }
};
const upload = multer({ storage,fileFilter:fileFilter });


const CartSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  products: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      quantity: Number,
      price:Number,
    },
  ],
});

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  items: [
    {
      productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Product", // References the Product model
        required: true 
      },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  createdAt : { type: Date},
  status : {
    type:String,
    default:"packaging",
  }
})


const User = mongoose.model('User', UserSchema);
const Product = mongoose.model('Product', ProductSchema);
const Cart = mongoose.model('Cart', CartSchema);
const UserData = mongoose.model('UserData', userDataSchema);
const Order = mongoose.model('Order',OrderSchema);

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
app.put('/api/users/info',verifyToken,async(req,res)=>{
  try {
    const info = await UserData.findOneAndUpdate(
      { userId: req.body.userId },  
      {
        $set: {
          phone: req.body.phone,
          street: req.body.street,
          city: req.body.city,
          state: req.body.state,
          country: req.body.country,
          postalCode: req.body.postalCode,
        }
      },
      {returnDocument: "after"}
    );

    res.json(info);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

app.get('/api/users/orders/:userid',async(req,res)=>{
  try {
    const {userid} =req.params;
    // console.log(userid);
    
    const orders = await Order.find({userId : userid})
    res.json(orders)
  } catch (error) {
    res.json(error)
  }
})

app.post('/api/users/orders',async(req,res)=>{
  try {
    const {userid,items,price,createdAt} = req.body;
    const newOrder = new Order({userId:userid,items:items,totalPrice:price,createdAt:createdAt})
    // console.log("this is new Order",newOrder);
    await newOrder.save();
    res.json(newOrder)
  } catch (error) {
    res.json(error)
  }
})


// User Routes
app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password:hashedPassword });
    await user.save();
    const cart = new Cart({ userId:user._id, products: [] });
    await cart.save()
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

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const productImage = req.file ? req.file.path : null;
    const product = new Product({ name, price, description, stock ,productImage });
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
    const { userId, productId, quantity,price } = req.body;
    
    let cart = await Cart.findOne({ userId:userId });
    
    const productIndex = cart.products.findIndex(
      p => p.productId.toString() === productId
    );

    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ productId, quantity,price });
    }

    await cart.save();
    res.json({ message: 'Cart updated successfully', cart });
  } catch (err) {
    console.log(err);
    
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
app.put('/api/users/clearcart', async (req, res) => {
  const { userId } = req.body;
  try {
    // Update the user's cart by setting the products array to an empty array
    const updatedCart = await Cart.findOneAndUpdate(
      { userId },
      { $set: { products: [] } },
      { new: true } // Return the updated document
    );

    if (!updatedCart) {
      return res.status(404).send('Cart not found for this user.');
    }

    res.status(200).send('Cart cleared successfully.');
  } catch (error) {
    res.status(500).send('Error clearing cart: ' + error.message);
  }
});
app.get('/api/cart/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.json([cart]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
