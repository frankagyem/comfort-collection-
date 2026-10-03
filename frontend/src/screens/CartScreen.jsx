import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { Trash2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CartScreen = () => {
  const { cart, removeFromCart, addToCart, clearCart, userInfo } = useStore();
  const navigate = useNavigate();

  // Checkout form state
  const [customerName, setCustomerName] = useState(userInfo ? userInfo.name : '');
  const [phone, setPhone] = useState(userInfo && userInfo.phone ? userInfo.phone : '');
  const [deliveryLocation, setDeliveryLocation] = useState('GHANA'); // Default
  const [deliveryAddress, setDeliveryAddress] = useState('');
  
  // Delivery Fee logic
  const getDeliveryFee = (location) => {
    const freeLocations = ['GHANA', 'UK', 'NIGERIA'];
    return freeLocations.includes(location.toUpperCase()) ? 0 : 50; // default fee for others
  };

  const itemsPrice = cart.reduce((acc, item) => acc + item.priceAtOrder * item.qty, 0);
  const deliveryFee = getDeliveryFee(deliveryLocation);
  const totalPrice = itemsPrice + deliveryFee;

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        }
      };

      if (userInfo && userInfo.token) {
        config.headers.Authorization = `Bearer ${userInfo.token}`;
      }

      const orderData = {
        orderItems: cart,
        deliveryAddress,
        deliveryLocation,
        customerName,
        phone,
        itemsPrice,
        deliveryFee,
        totalPrice,
      };

      const { data } = await axios.post('/api/orders', orderData, config);
      
      clearCart();
      
      // WhatsApp Redirect
      const message = `*New Order: ${data._id}*%0A*Name:* ${customerName}%0A*Total:* GH₵${totalPrice.toFixed(2)}%0A*Items:* ${cart.map(c => `${c.qty}x ${c.name} (${c.size})`).join(', ')}`;
      const waLink = `https://wa.me/233554383476?text=${message}`;
      
      window.location.href = waLink;

    } catch (error) {
      toast.error(error.response && error.response.data.message ? error.response.data.message : error.message);
    }
  };

  return (
    <div className="container" style={{ padding: '4rem 1rem' }}>
      <h1 style={{ textTransform: 'uppercase', marginBottom: '2rem' }}>Shopping Cart</h1>
      
      {cart.length === 0 ? (
        <div>
          Your cart is empty. <Link to="/catalog" style={{ textDecoration: 'underline' }}>Go back</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }} className="catalog-layout">
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cart.map((item) => (
              <div key={`${item.product}-${item.size}`} style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <img src={item.image} alt={item.name} style={{ width: '100px', height: '130px', objectFit: 'cover' }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem' }}>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Size: {item.size}</p>
                    <p style={{ fontWeight: 600, marginTop: '0.5rem' }}>GH₵ {item.priceAtOrder.toFixed(2)}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <select 
                      value={item.qty} 
                      onChange={(e) => addToCart({ ...item, qty: Number(e.target.value) })}
                      style={{ padding: '0.25rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}
                    >
                      {[...Array(10).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                      ))}
                    </select>
                    <button 
                      onClick={() => removeFromCart(item.product, item.size)} 
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ backgroundColor: 'var(--card-bg)', padding: '2rem', borderRadius: '4px', border: '1px solid var(--border-color)', height: 'fit-content' }}>
            <h2 style={{ fontSize: '1.25rem', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Order Summary</h2>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Subtotal ({cart.reduce((acc, item) => acc + item.qty, 0)} items)</span>
              <span>GH₵ {itemsPrice.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <span>Delivery</span>
              <span>{deliveryFee === 0 ? 'Free' : `GH₵ ${deliveryFee.toFixed(2)}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontWeight: 600, fontSize: '1.25rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <span>Total</span>
              <span>GH₵ {totalPrice.toFixed(2)}</span>
            </div>

            <form onSubmit={handleCheckout}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input type="text" className="form-input" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input type="tel" className="form-input" required value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Delivery Country</label>
                <select className="form-input" required value={deliveryLocation} onChange={(e) => setDeliveryLocation(e.target.value)}>
                  <option value="GHANA">Ghana</option>
                  <option value="UK">United Kingdom</option>
                  <option value="NIGERIA">Nigeria</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Detailed Address</label>
                <textarea className="form-input" required rows="2" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)}></textarea>
              </div>
              
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                Order via WhatsApp
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
};

export default CartScreen;
