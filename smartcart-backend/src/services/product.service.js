const productRepo = require('../repositories/product.repository');

exports.getAllProducts = async () => {
  return await productRepo.findAll();
};

exports.getProductById = async (productId) => {
  return await productRepo.findById(productId);
};