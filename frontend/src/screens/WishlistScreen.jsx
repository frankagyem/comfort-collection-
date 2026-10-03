import React from 'react';
import { Link } from 'react-router-dom';
import useStore from '../store/useStore';
import { ProductCard } from './HomeScreen';

const WishlistScreen = () => {
  const { wishlist } = useStore();

  return (
    <div className="container" style={{ padding: '4rem 1rem' }}>
      <h1 style={{ textTransform: 'uppercase', marginBottom: '2rem' }}>My Wishlist</h1>
      
      {wishlist.length === 0 ? (
        <div>
          Your wishlist is empty. <Link to="/catalog" style={{ textDecoration: 'underline' }}>Browse products</Link>
        </div>
      ) : (
        <div className="product-grid">
          {wishlist.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistScreen;
