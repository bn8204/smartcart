import React, { useState, useEffect } from 'react';
import { productService } from '../services/api';

function Products({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts();
      // Handle both old format (array) and new format (object with data property)
      const productsData = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      setProducts(productsData);
      if (productsData.length === 0) {
        setError('No products available');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading products...</div>;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  if (products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>No products available. Please add some products to your database first.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Products</h1>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : (
                <div style={{ display: 'flex' }}>📦</div>
              )}
              <div style={{ display: 'none', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                📦
              </div>
            </div>
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">₹{parseFloat(product.price).toFixed(2)}</p>
              <button 
                className="btn"
                onClick={() => onAddToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
