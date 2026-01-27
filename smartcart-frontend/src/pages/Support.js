import React, { useState } from 'react';

function Support() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'General'
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate submission
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'General'
      });

      setTimeout(() => {
        setSubmitted(false);
      }, 4000);
    }, 1000);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h1>💬 Customer Support</h1>

      {/* Support Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        <div style={{
          backgroundColor: '#e3f2fd',
          padding: '2rem',
          borderRadius: '8px',
          textAlign: 'center',
          border: '2px solid #3498db'
        }}>
          <h3 style={{ color: '#3498db', marginBottom: '0.5rem' }}>📧 Email Support</h3>
          <p style={{ margin: '0.5rem 0' }}>support@smartcart.com</p>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Response time: 24 hours</p>
        </div>

        <div style={{
          backgroundColor: '#f3e5f5',
          padding: '2rem',
          borderRadius: '8px',
          textAlign: 'center',
          border: '2px solid #9c27b0'
        }}>
          <h3 style={{ color: '#9c27b0', marginBottom: '0.5rem' }}>📱 Phone Support</h3>
          <p style={{ margin: '0.5rem 0' }}>+91 1800-SMARTCART</p>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Mon-Fri: 10AM - 6PM IST</p>
        </div>

        <div style={{
          backgroundColor: '#e8f5e9',
          padding: '2rem',
          borderRadius: '8px',
          textAlign: 'center',
          border: '2px solid #27ae60'
        }}>
          <h3 style={{ color: '#27ae60', marginBottom: '0.5rem' }}>💬 Live Chat</h3>
          <p style={{ margin: '0.5rem 0' }}>Available 24/7</p>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Instant assistance</p>
        </div>
      </div>

      {/* Contact Form */}
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '3rem'
      }}>
        <h2>📝 Send Us a Message</h2>

        {submitted && (
          <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
            ✅ Thank you for contacting us! We'll get back to you within 24 hours.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your name"
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            >
              <option value="General">General Inquiry</option>
              <option value="Order">Order Related</option>
              <option value="Payment">Payment Issue</option>
              <option value="Product">Product Question</option>
              <option value="Return">Returns & Exchange</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Subject *</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="Brief subject"
            />
          </div>

          <div className="form-group">
            <label>Message *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Describe your issue..."
              rows="6"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                fontFamily: 'Arial, sans-serif'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: loading ? '#ccc' : '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s'
            }}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>

      {/* FAQ Section */}
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2>❓ Frequently Asked Questions</h2>

        <div style={{ marginTop: '1.5rem' }}>
          {[
            {
              q: 'How long does delivery take?',
              a: 'Standard delivery takes 3-5 business days. Express delivery is available for 1-2 day delivery.'
            },
            {
              q: 'What is your return policy?',
              a: 'We accept returns within 30 days of purchase. Products must be unused and in original packaging.'
            },
            {
              q: 'How can I track my order?',
              a: 'You can track your order using our Order Tracking page. Enter your Order ID to see real-time updates.'
            },
            {
              q: 'Do you accept all payment methods?',
              a: 'Yes! We accept Credit Cards, Debit Cards, UPI, and Cash on Delivery (COD).'
            },
            {
              q: 'How do I cancel an order?',
              a: 'You can cancel orders within 24 hours of placement. Contact support for assistance.'
            },
            {
              q: 'Is my payment secure?',
              a: 'Yes! All payments are encrypted and secure. We use industry-standard security protocols.'
            }
          ].map((faq, idx) => (
            <div key={idx} style={{
              marginBottom: '1.5rem',
              paddingBottom: '1.5rem',
              borderBottom: idx < 5 ? '1px solid #eee' : 'none'
            }}>
              <h3 style={{ color: '#333', marginBottom: '0.5rem' }}>Q: {faq.q}</h3>
              <p style={{ color: '#666', marginLeft: '1rem' }}>A: {faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Support;
