import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  const newArrivals = products.filter(p => p.isNewArrival).slice(0, 4);
  const flashSales = products.filter(p => p.isFlashSale).slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <img 
          src="https://images.unsplash.com/photo-1616627547584-bf28cee262db?q=80&w=2070&auto=format&fit=crop" 
          alt="Comfort Collections Banner" 
          className="hero-img" 
        />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Elevate Your Space</h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
            Premium bathroom towels, bed sheets, and door curtains.
          </p>
          <Link to="/catalog" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
            Shop the Collection
          </Link>
        </div>
      </section>

      {/* Flash Sales */}
      {flashSales.length > 0 && (
        <section className="container" style={{ padding: '4rem 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2rem', textTransform: 'uppercase' }}>Flash Sales</h2>
            <Link to="/catalog?sale=true" style={{ textDecoration: 'underline' }}>View All</Link>
          </div>
          <div className="product-grid">
            {flashSales.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      <section style={{ backgroundColor: 'var(--card-bg)', padding: '4rem 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', textTransform: 'uppercase', marginBottom: '2rem', textAlign: 'center' }}>Shop by Category</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            
            <Link to="/catalog?category=towels" style={{ position: 'relative', height: '400px', overflow: 'hidden', display: 'block' }}>
              <img src="https://images.unsplash.com/photo-1616627561839-07a82b0e6e73?q=80&w=2070&auto=format&fit=crop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Towels" />
              <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h3 style={{ color: 'white', fontSize: '2rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Towels</h3>
              </div>
            </Link>

            <Link to="/catalog?category=sheets" style={{ position: 'relative', height: '400px', overflow: 'hidden', display: 'block' }}>
              <img src="https://images.unsplash.com/photo-1629948618342-832104576aeb?q=80&w=1964&auto=format&fit=crop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Bed Sheets" />
              <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h3 style={{ color: 'white', fontSize: '2rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Bed Sheets</h3>
              </div>
            </Link>

            <Link to="/catalog?category=curtains" style={{ position: 'relative', height: '400px', overflow: 'hidden', display: 'block' }}>
              <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Curtains" />
              <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h3 style={{ color: 'white', fontSize: '2rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Curtains</h3>
              </div>
            </Link>
            
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="container" style={{ padding: '4rem 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2rem', textTransform: 'uppercase' }}>New Arrivals</h2>
            <Link to="/catalog?new=true" style={{ textDecoration: 'underline' }}>View All</Link>
          </div>
          <div className="product-grid">
            {newArrivals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky Call/WhatsApp action could be globally placed in layout, but let's just make it simple */}
      <a href="https://wa.me/233554383476" target="_blank" rel="noreferrer" style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        backgroundColor: '#25D366',
        color: 'white',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        zIndex: 100
      }}>
        {/* WhatsApp Icon placeholder */}
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
        </svg>
      </a>
    </div>
  );
};

// Extracted to be reused later or kept here for simplicity
export const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`} className="product-card">
      {product.isFlashSale && <span className="product-badge badge-sale">Sale</span>}
      {product.isNewArrival && !product.isFlashSale && <span className="product-badge badge-new">New</span>}
      
      <div className="product-image-wrapper">
        <img src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/300x400'} alt={product.name} />
      </div>
      
      <div className="product-info">
        <span className="product-brand">Comfort Collections</span>
        <h3 className="product-title">{product.name}</h3>
        <div className="product-price">
          {product.discountPercent > 0 ? (
            <>
              <span className="price-original">GH₵ {product.price.toFixed(2)}</span>
              <span className="price-discounted">GH₵ {product.calculatedPrice.toFixed(2)}</span>
            </>
          ) : (
            <span>GH₵ {product.price.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default HomeScreen;
