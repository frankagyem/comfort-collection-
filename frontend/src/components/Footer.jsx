import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'var(--card-bg)', padding: '4rem 0', marginTop: '4rem', borderTop: '1px solid var(--border-color)' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
        <div>
          <h3 style={{ textTransform: 'uppercase', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Comfort Collections</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Dansoman opposite Abbaya Mall<br />
            Ghana, UK, Nigeria
          </p>
          <a href="tel:0554383476" style={{ display: 'block', marginTop: '1rem', color: 'var(--primary-color)', fontWeight: 500 }}>
            +233 55 438 3476
          </a>
        </div>
        
        <div>
          <h4 style={{ textTransform: 'uppercase', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Shop</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li><Link to="/catalog?category=towels" style={{ color: 'var(--text-muted)' }}>Towels</Link></li>
            <li><Link to="/catalog?category=sheets" style={{ color: 'var(--text-muted)' }}>Bed Sheets</Link></li>
            <li><Link to="/catalog?category=curtains" style={{ color: 'var(--text-muted)' }}>Curtains</Link></li>
            <li><Link to="/catalog" style={{ color: 'var(--text-muted)' }}>All Products</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ textTransform: 'uppercase', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Help & Info</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li><Link to="/faq" style={{ color: 'var(--text-muted)' }}>FAQ</Link></li>
            <li><Link to="/delivery" style={{ color: 'var(--text-muted)' }}>Delivery Info</Link></li>
            <li><Link to="/returns" style={{ color: 'var(--text-muted)' }}>Returns</Link></li>
            <li><a href="mailto:comfortyanso16@gmail.com" style={{ color: 'var(--text-muted)' }}>Contact Us</a></li>
          </ul>
        </div>
      </div>
      <div className="container" style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        &copy; {new Date().getFullYear()} Comfort Collections. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
