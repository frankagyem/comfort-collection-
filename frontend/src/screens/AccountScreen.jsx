import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useStore from '../store/useStore';

const AccountScreen = () => {
  const { userInfo, logout } = useStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      const fetchOrders = async () => {
        try {
          const config = {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          };
          const { data } = await axios.get('/api/orders/myorders', config);
          setOrders(data);
          setLoading(false);
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      };
      fetchOrders();
    }
  }, [navigate, userInfo]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container" style={{ padding: '4rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ textTransform: 'uppercase' }}>My Account</h1>
        <button onClick={handleLogout} className="btn btn-outline">Logout</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        
        {/* Profile Info */}
        <div style={{ backgroundColor: 'var(--card-bg)', padding: '2rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', textTransform: 'uppercase' }}>Profile</h2>
          <p><strong>Name:</strong> {userInfo?.name}</p>
          <p><strong>Email:</strong> {userInfo?.email || 'N/A'}</p>
          <p><strong>Phone:</strong> {userInfo?.phone || 'N/A'}</p>
          <p><strong>Referral Code:</strong> <span style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{userInfo?.referralCode}</span></p>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Share your referral code with friends and family!
          </p>
          {userInfo?.isAdmin && (
            <div style={{ marginTop: '1rem' }}>
              <a href="/admin" className="btn btn-primary">Admin Dashboard</a>
            </div>
          )}
        </div>

        {/* Order History */}
        <div style={{ backgroundColor: 'var(--card-bg)', padding: '2rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', textTransform: 'uppercase' }}>Order History</h2>
          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p>You have no orders.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                    <th style={{ padding: '0.5rem' }}>ID</th>
                    <th style={{ padding: '0.5rem' }}>DATE</th>
                    <th style={{ padding: '0.5rem' }}>TOTAL</th>
                    <th style={{ padding: '0.5rem' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.5rem' }}>{order._id.substring(0, 8)}...</td>
                      <td style={{ padding: '0.5rem' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: '0.5rem' }}>GH₵ {order.totalPrice.toFixed(2)}</td>
                      <td style={{ padding: '0.5rem' }}>
                        <span style={{
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          backgroundColor: order.status === 'delivered' ? '#10b981' : order.status === 'cancelled' ? '#ef4444' : '#f59e0b',
                          color: 'white',
                          textTransform: 'uppercase'
                        }}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AccountScreen;
