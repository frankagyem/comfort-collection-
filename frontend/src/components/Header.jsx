import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, User, Sun, Moon } from 'lucide-react';
import useStore from '../store/useStore';

const Header = () => {
  const { cart, wishlist, userInfo, theme, toggleTheme } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleAuthClick = () => {
    if (userInfo) {
      navigate('/account');
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="header">
      <div className="container nav-container">
        <Link to="/" className="logo">
          Comfort Collections
        </Link>
        
        <nav className="nav-links">
          <Link to="/catalog?category=towels" className="nav-link">Towels</Link>
          <Link to="/catalog?category=sheets" className="nav-link">Sheets</Link>
          <Link to="/catalog?category=curtains" className="nav-link">Curtains</Link>
          <Link to="/catalog" className="nav-link" style={{ color: 'var(--secondary-color)' }}>Sale</Link>
        </nav>

        <div className="nav-actions">
          <button className="btn-outline" style={{ border: 'none' }} onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          
          <button className="btn-outline" style={{ border: 'none', position: 'relative' }} onClick={() => navigate('/wishlist')} aria-label="Wishlist">
            <Heart size={20} />
            {wishlist.length > 0 && (
              <span style={{ position: 'absolute', top: -5, right: -5, background: 'var(--primary-color)', color: 'white', borderRadius: '50%', width: 18, height: 18, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {wishlist.length}
              </span>
            )}
          </button>

          <button className="btn-outline" style={{ border: 'none' }} onClick={handleAuthClick} aria-label="Account">
            <User size={20} />
          </button>

          <button className="btn-outline" style={{ border: 'none', position: 'relative' }} onClick={() => navigate('/cart')} aria-label="Cart">
            <ShoppingBag size={20} />
            {cart.length > 0 && (
              <span style={{ position: 'absolute', top: -5, right: -5, background: 'var(--secondary-color)', color: 'black', borderRadius: '50%', width: 18, height: 18, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {cart.reduce((a, c) => a + c.qty, 0)}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
