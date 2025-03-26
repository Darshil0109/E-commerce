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

const AdminSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
})

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


const reviewSchema = new mongoose.Schema({
  user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // Reference to the User model
      required: true
  },
  name: {
      type: String,
      required: true
  },
  rating: {
      type: Number,
      required: true,
      min: 0.5,
      max: 5
  },
  comment: {
      type: String,
      required: true
  },
  createdAt: {
      type: Date,
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
  numReviews: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  reviews:[reviewSchema],
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
  },
  paymentType:{
    type:String,
    required:true
  }
})


const User = mongoose.model('User', UserSchema);
const Product = mongoose.model('Product', ProductSchema);
const Cart = mongoose.model('Cart', CartSchema);
const UserData = mongoose.model('UserData', userDataSchema);
const Order = mongoose.model('Order',OrderSchema);
const Admin = mongoose.model('Admin',AdminSchema);

const isProduction = process.env.ENV === "PROD";
//Middleware to verify Token
const verifyToken = (req, res, next) => {
  
  const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1]; // headers is for postmman
  if (!token) return res.status(403).json({ message: 'Access denied. No token provided.' });
  // console.log(req.cookies);
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token.' });
    req.user = decoded;  // Attach user info to request object
    // console.log(decoded);
    
    next();
  });
};

// Routes
app.get('/',async(req,res)=>{
  res.send('api for e-commerce app');
})
//UserInfo Route
app.get('/api/users/info',verifyToken,async(req,res)=>{
  try {
    const info = await UserData.findOne({ userId: req.user.id });
    res.json(info);
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
    const {userid,items,price,createdAt,paymentType} = req.body;
    const newOrder = new Order({userId:userid,items:items,totalPrice:price,createdAt:createdAt,paymentType:paymentType})
    // console.log("this is new Order",newOrder);
    for (const item of items) {
      const productId = item.productId;  // Assuming productId is a field in each item
      const quantityOrdered = item.quantity;

      // Update product stock
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: productId, stock: { $gte: quantityOrdered } }, // Check if enough stock exists
        { $inc: { stock: -quantityOrdered } },               // Reduce stock
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(400).json({ message: `Insufficient stock for product ID: ${productId}` });
      }
    }

    await newOrder.save();
    res.json(newOrder)
  } catch (error) {
    res.json(error)
  }
})

app.post('/api/products/:id/reviews', verifyToken, async (req, res) => {
  const { rating, comment,createdAt } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user has already reviewed
    const alreadyReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user.id
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed by You' });
    }
    
    // Create the review
    const review = {
      user: req.user.id,
      name: req.user.name,
      rating: Number(rating),
      comment,
      createdAt : createdAt,
    };

    // Add review to product
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = ((product.rating * (product.numReviews - 1)) + Number(rating))/ product.numReviews;

    // Calculate average rating
    // let totalRating = 0;
    // product.reviews.forEach((rev) => {
    //   totalRating += rev.rating;
    // });


    await product.save();

    res.status(201).json({ message: 'Review added successfully' , review : review });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: 'Server Error', error });
  }
});

app.delete('/api/products/:id/reviews/:userId', verifyToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const review = product.reviews.find(
      (rev) => rev.user.toString() === req.params.userId
    );
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    const index = product.reviews.indexOf(review);
    product.reviews.splice(index, 1);
    product.numReviews = product.reviews.length;
    if (product.numReviews === 0) {
      product.rating = 0;
    } else {
      let totalRating = 0;
      product.reviews.forEach((rev) => {
        totalRating += rev.rating;
      });
      product.rating = totalRating / product.numReviews;
    }
    await product.save();
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
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
      httpOnly: true, // Don't Allow client-side access
      secure: isProduction, // Only true in production (requires HTTPS)
      sameSite: isProduction ? "None" : "Lax", // "None" for cross-origin cookies in PROD
      maxAge: 24 * 3600000, // 24 hours
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
    const isMatch = await bcrypt.compare(password,user.password)
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
      httpOnly: true, // Don't Allow client-side access
      secure: isProduction, // Only true in production (requires HTTPS)
      sameSite: isProduction ? "None" : "Lax", // "None" for cross-origin cookies in PROD
      maxAge: 24 * 3600000, // 24 hours
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

// get all cookies
app.get("/get-cookies", (req, res) => {
  console.log("Cookies received:", req.cookies); // Debugging in backend console
  res.json(req.cookies); // Send all cookies as JSON response
});

app.post("/remove-cookie", (req, res) => {
  const { cookieName } = req.body; // Get cookie name from request body

  if (!cookieName) {
    return res.status(400).json({ success: false, message: "Cookie name is required" });
  }

  res.clearCookie(cookieName, {
    httpOnly: true, // Don't Allow client-side access
    secure: isProduction, // Only true in production (requires HTTPS)
    sameSite: isProduction ? "None" : "Lax", // "None" for cross-origin cookies in PROD
    maxAge: 24 * 3600000, // 24 hours
  });
  res.cookie(cookieName, "", { expires: new Date(0) });
  res.json({ success: true, message: `Cookie '${cookieName}' removed successfully` });
});

//Admin Panel Data

app.get('/api/admin/data', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const result = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = result.length > 0 ? result[0].total : 0;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 4);
    startDate.setHours(0, 0, 0, 0);
    const orders = await Order.aggregate([
      {
        $match: { createdAt: { $gte: startDate } }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const lastFiveDaysOrders = Array.from({ length: 5 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (4 - i));
      const formattedDate = date.toISOString().split('T')[0];
      const dayData = orders.find(o => o._id === formattedDate);
      return { date: formattedDate, noOfOrders: dayData ? dayData.count : 0 };
    });

    const products = await Product.find();
    const outOfStock = products.filter(p => p.stock === 0).length;
    const zerotoTen = products.filter(p => p.stock > 0 && p.stock <= 10).length;
    const eleventoTwenty = products.filter(p => p.stock > 10 && p.stock <= 20).length;
    const twentyOneToFourty = products.filter(p => p.stock > 20 && p.stock <= 40).length;
    const fortyOneToFifty = products.filter(p => p.stock > 40 && p.stock <= 50).length;
    const fiftplus = products.filter(p => p.stock > 50).length;

    const outofstockproducts = products.filter(p => p.stock === 0);
    const stockData = [
      {"name":"Out of Stock", "value" :outOfStock},
      {"name":"1-10 Stock", "value" :zerotoTen},
      {"name":"11-20 Stock", "value" :eleventoTwenty},
      {"name":"21-40 Stock", "value" :twentyOneToFourty},
      {"name":"41-50 Stock", "value" :fortyOneToFifty},
      {"name":"50+ Stock", "value" :fiftplus},
    ]
    res.json({ totalUsers, totalProducts, totalOrders ,totalRevenue,lastFiveDaysOrders,stockData,outofstockproducts});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await Admin.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid Email' });
    const isMatch = bcrypt.compare(password,user.password)
    if (!isMatch) return res.status(400).json({ error: "Invalid Password" });
    const userData = await UserData.updateOne(
      { userId: user._id }, // Find by _id
      { $set: { lastLogin: Date.now() } } // Update lastLogin
    );
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );
    res.cookie("adminToken", token, {
      httpOnly: true, // Don't Allow client-side access
      secure: isProduction, // Only true in production (requires HTTPS)
      sameSite: isProduction ? "None" : "Lax", // "None" for cross-origin cookies in PROD
      maxAge: 3 * 3600000, // 3 hours
    });
    res.json({ message : "Admin Login Successfull" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
