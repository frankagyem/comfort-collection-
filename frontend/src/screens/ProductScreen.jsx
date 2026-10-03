import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Heart, ShoppingBag } from 'lucide-react';
import useStore from '../store/useStore';
import { toast } from 'react-toastify';

const ProductScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedSize, setSelectedSize] = useState('');
  const [qty, setQty] = useState(1);

  const { addToCart, toggleWishlist, wishlist } = useStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0].size);
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="container" style={{ padding: '4rem 0' }}>Loading...</div>;
  if (!product) return <div className="container" style={{ padding: '4rem 0' }}>Product not found</div>;

  const isWishlisted = wishlist.some(item => item._id === product._id);

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    
    addToCart({
      product: product._id,
      name: product.name,
      image: product.images[0],
      priceAtOrder: product.calculatedPrice,
      size: selectedSize,
      qty,
    });
    
    toast.success('Added to cart');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const getStockForSelectedSize = () => {
    if (!product.sizes || product.sizes.length === 0) return product.stock;
    const sizeObj = product.sizes.find(s => s.size === selectedSize);
    return sizeObj ? sizeObj.stock : 0;
  };

  const stockAvailable = getStockForSelectedSize();

  return (
    <div className="container" style={{ padding: '4rem 1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
        
        {/* Images */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <img src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/600x800'} alt={product.name} style={{ width: '100%', objectFit: 'cover', aspectRatio: '3/4' }} />
          {/* Implement carousel/thumbnails if multiple images */}
        </div>

        {/* Details */}
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', textTransform: 'uppercase' }}>{product.name}</h1>
          
          <div style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {product.discountPercent > 0 ? (
              <>
                <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '1.2rem' }}>GH₵ {product.price.toFixed(2)}</span>
                <span style={{ color: 'var(--secondary-color)' }}>GH₵ {product.calculatedPrice.toFixed(2)}</span>
              </>
            ) : (
              <span>GH₵ {product.price.toFixed(2)}</span>
            )}
            
            {product.isFlashSale && <span style={{ fontSize: '0.875rem', backgroundColor: 'var(--secondary-color)', color: '#000', padding: '0.25rem 0.5rem', borderRadius: '4px', textTransform: 'uppercase' }}>Sale</span>}
          </div>

          <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>{product.description}</p>

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 500 }}>Size</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {product.sizes.map((s) => (
                  <button
                    key={s.size}
                    disabled={s.stock === 0}
                    onClick={() => setSelectedSize(s.size)}
                    style={{
                      padding: '0.5rem 1rem',
                      border: selectedSize === s.size ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                      backgroundColor: selectedSize === s.size ? 'rgba(13, 59, 46, 0.05)' : 'transparent',
                      color: s.stock === 0 ? 'var(--text-muted)' : 'var(--text-color)',
                      textDecoration: s.stock === 0 ? 'line-through' : 'none',
                      cursor: s.stock === 0 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {s.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div style={{ marginBottom: '2rem' }}>
            <span style={{ fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Quantity</span>
            <select 
              value={qty} 
              onChange={(e) => setQty(Number(e.target.value))}
              style={{ padding: '0.5rem', border: '1px solid var(--border-color)', width: '100px', backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}
              disabled={stockAvailable === 0}
            >
              {[...Array(stockAvailable > 10 ? 10 : stockAvailable).keys()].map((x) => (
                <option key={x + 1} value={x + 1}>
                  {x + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            {stockAvailable > 0 ? (
              <>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleAddToCart}>
                  <ShoppingBag size={18} style={{ marginRight: '0.5rem' }} /> Add to Cart
                </button>
                <button className="btn btn-accent" style={{ flex: 1 }} onClick={handleBuyNow}>
                  Quick Buy
                </button>
              </>
            ) : (
              <button className="btn btn-outline" style={{ flex: 2 }} disabled>
                Out of Stock (Join Waitlist)
              </button>
            )}

            <button 
              className="btn btn-outline" 
              onClick={() => toggleWishlist(product)}
              style={{ padding: '0.75rem', borderColor: isWishlisted ? 'var(--primary-color)' : 'var(--border-color)', color: isWishlisted ? 'var(--primary-color)' : 'var(--text-color)' }}
            >
              <Heart size={20} fill={isWishlisted ? 'var(--primary-color)' : 'none'} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductScreen;
