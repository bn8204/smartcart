const productService = require('../services/product.service');

exports.getAllProducts = async (req, res) => {
  try {
    console.log('Fetching all products...');
    const products = await productService.getAllProducts();
    console.log(`Fetched ${products ? products.length : 0} products`);
    res.json({
      success: true,
      data: products || [],
      message: 'Products fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Failed to fetch products',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    console.log(`Fetching product with ID: ${req.params.id}`);
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }
    res.json({
      success: true,
      data: product,
      message: 'Product fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Failed to fetch product',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};