import React, { useState, useEffect } from 'react';
import { productService } from '../services/api';

function Home({ onAddToCart }) {
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
      setProducts(response.data || []);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    const category = product.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  const categories = Object.keys(groupedProducts).sort();

  return (
    <div>
      <div className="home-hero">
        <h1>Welcome to SmartCart</h1>
        <p>Your one-stop shop for amazing products and great deals</p>
        <div className="home-buttons">
          <button onClick={() => window.location.href = '/#products'}>
            Start Shopping
          </button>
          <button onClick={() => window.location.href = '/#products'}>
            Browse All
          </button>
        </div>
      </div>

      <div className="features">
        <h2>Why Choose SmartCart?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🚚 Fast Shipping</h3>
            <p>Get your orders delivered quickly</p>
          </div>
          <div className="feature-card">
            <h3>💳 Secure Payment</h3>
            <p>Your payments are safe and encrypted</p>
          </div>
          <div className="feature-card">
            <h3>✨ Best Prices</h3>
            <p>Competitive pricing on all products</p>
          </div>
          <div className="feature-card">
            <h3>🎁 Great Support</h3>
            <p>24/7 customer support available</p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h2 style={{ marginBottom: '2rem', paddingLeft: '1rem' }}>Shop by Category</h2>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading products...</div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : categories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>No products available</div>
        ) : (
          categories.map(category => (
            <div key={category} style={{ marginBottom: '3rem' }}>
              <h3 style={{ 
                marginBottom: '1.5rem',
                paddingLeft: '1rem',
                borderBottom: '2px solid #3498db',
                paddingBottom: '0.5rem'
              }}>
                {category}
              </h3>
              <div className="products-grid">
                {groupedProducts[category].map((product) => (
                  <div key={product.id} className="product-card">
                    <div className="product-image">
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            borderRadius: '8px 8px 0 0'
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
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
