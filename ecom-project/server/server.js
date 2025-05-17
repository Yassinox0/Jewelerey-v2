const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const { connectDB } = require('./config/db');
const productService = require('./services/productService');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
// Force the port to be 7777 regardless of environment variables
process.env.PORT = 7777;
const PORT = 7777;

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve image files from client's assets directory with /static URL path
app.use('/static', express.static(path.join(__dirname, '../client/src/assets')));

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the E-Commerce API');
});

// Initialize Stripe with the API key from environment variables
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
// const orderRoutes = require('./routes/orderRoutes'); // Commented out as it doesn't exist yet
const reviewRoutes = require('./routes/reviewRoutes');
const addressRoutes = require('./routes/addressRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Route mounting
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
// app.use('/api/orders', orderRoutes); // Commented out as it doesn't exist yet
app.use('/api/reviews', reviewRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/notifications', notificationRoutes);

// Stripe payment endpoint
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    console.log('Received checkout request:', req.body);
    const { items, customerEmail } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items in cart' });
    }
    
    // Create line items for Stripe
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: [item.image || 'https://via.placeholder.com/100'],
          description: item.description || '',
        },
        unit_amount: Math.round(item.price * 100), // Stripe requires cents
      },
      quantity: item.quantity,
    }));

    console.log('Creating Stripe session with line items:', lineItems);

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customerEmail,
      success_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/cart`,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'FR', 'DE'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0,
              currency: 'usd',
            },
            display_name: 'Free shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
      ],
    });

    console.log('Stripe session created:', session.id);
    res.status(200).json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add test routes for debugging
app.get('/test-routes', (req, res) => {
  // Return a list of all routes
  const routes = [];
  
  app._router.stack.forEach(middleware => {
    if (middleware.route) {
      // Routes registered directly on the app
      routes.push(`${Object.keys(middleware.route.methods)[0].toUpperCase()} ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
      // Router middleware
      middleware.handle.stack.forEach(handler => {
        if (handler.route) {
          const method = Object.keys(handler.route.methods)[0].toUpperCase();
          routes.push(`${method} ${middleware.regexp.toString().replace(/[^\/]*$/,'') + handler.route.path}`);
        }
      });
    }
  });
  
  res.json({ routes });
});

// Make sure this appears BEFORE other routes
// Specific route to serve the create-admin.html file
app.get('/create-admin', (req, res) => {
  try {
    const filePath = path.join(__dirname, 'public', 'create-admin.html');
    console.log('Serving file from path:', filePath);
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error serving create-admin.html:', error);
    res.status(500).send('Error serving the admin creation page');
  }
});

// Add test route for MongoDB connection
app.get('/api/test-mongo', async (req, res) => {
  try {
    const db = require('./config/db').getDB();
    const collections = await db.listCollections().toArray();
    
    res.status(200).json({
      success: true,
      message: 'MongoDB connection is working',
      collections: collections.map(c => c.name)
    });
  } catch (error) {
    console.error('MongoDB test route error:', error);
    res.status(500).json({
      success: false,
      message: 'MongoDB connection failed',
      error: error.message
    });
  }
});

// Add endpoint to update product images
app.get('/api/update-product-images', async (req, res) => {
  try {
    const productService = require('./services/productService');
    const result = await productService.updateProductImages();
    
    if (result) {
      res.status(200).json({
        success: true,
        message: 'Product images updated successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to update product images'
      });
    }
  } catch (error) {
    console.error('Error updating product images:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product images',
      error: error.message
    });
  }
});

// Add endpoint to update all product images with local assets
app.get('/api/update-product-images-local', async (req, res) => {
  try {
    const productService = require('./services/productService');
    const result = await productService.updateProductImagesWithLocalAssets();
    
    if (result) {
      res.status(200).json({
        success: true,
        message: 'Product images updated with local assets successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to update product images with local assets'
      });
    }
  } catch (error) {
    console.error('Error updating product images with local assets:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product images with local assets',
      error: error.message
    });
  }
});

// Add endpoint to update Rose Gold Ring image
app.get('/api/update-rose-gold-ring', async (req, res) => {
  try {
    const productService = require('./services/productService');
    const result = await productService.updateRoseGoldRingImage();
    
    if (result) {
      res.status(200).json({
        success: true,
        message: 'Rose Gold Ring image updated successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Rose Gold Ring product not found or could not be updated'
      });
    }
  } catch (error) {
    console.error('Error updating Rose Gold Ring image:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating Rose Gold Ring image',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('MongoDB connection has been established successfully.');

    // Initialize products if necessary
    await productService.initializeProducts();

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer(); 