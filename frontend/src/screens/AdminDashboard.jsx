import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useStore from '../store/useStore';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { userInfo } = useStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        
        const [ordersRes, productsRes] = await Promise.all([
          axios.get('/api/orders', config),
          axios.get('/api/products')
        ]);
        
        setOrders(ordersRes.data);
        setProducts(productsRes.data);
      } catch (error) {
        toast.error('Failed to load admin data');
      }
    };
    fetchData();
  }, [userInfo, navigate]);

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`/api/orders/${id}/status`, { status }, config);
      toast.success('Order status updated');
      setOrders(orders.map(o => o._id === id ? { ...o, status } : o));
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const revenue = orders.filter(o => o.isPaid || o.status !== 'cancelled').reduce((acc, o) => acc + o.totalPrice, 0);

  return (
    <div className="container" style={{ padding: '4rem 1rem' }}>
      <h1 style={{ textTransform: 'uppercase', marginBottom: '2rem' }}>Admin Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1.5rem', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
          <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Total Orders</h3>
          <p style={{ fontSize: '2rem', fontWeight: 600 }}>{orders.length}</p>
        </div>
        <div style={{ padding: '1.5rem', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
          <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Total Revenue</h3>
          <p style={{ fontSize: '2rem', fontWeight: 600 }}>GH₵ {revenue.toFixed(2)}</p>
        </div>
        <div style={{ padding: '1.5rem', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
          <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Total Products</h3>
          <p style={{ fontSize: '2rem', fontWeight: 600 }}>{products.length}</p>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
        <button 
          className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button 
          className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
      </div>

      {activeTab === 'orders' && (
        <div style={{ backgroundColor: 'var(--card-bg)', padding: '1rem', borderRadius: '4px', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '0.5rem' }}>ID</th>
                <th style={{ padding: '0.5rem' }}>USER</th>
                <th style={{ padding: '0.5rem' }}>DATE</th>
                <th style={{ padding: '0.5rem' }}>TOTAL</th>
                <th style={{ padding: '0.5rem' }}>STATUS</th>
                <th style={{ padding: '0.5rem' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.5rem' }}>{order._id.substring(0, 8)}</td>
                  <td style={{ padding: '0.5rem' }}>{order.customerName}</td>
                  <td style={{ padding: '0.5rem' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '0.5rem' }}>GH₵ {order.totalPrice.toFixed(2)}</td>
                  <td style={{ padding: '0.5rem' }}>{order.status}</td>
                  <td style={{ padding: '0.5rem' }}>
                    <select 
                      value={order.status} 
                      onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                      style={{ padding: '0.25rem', backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'products' && (
        <div style={{ backgroundColor: 'var(--card-bg)', padding: '1rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
          <p style={{ marginBottom: '1rem' }}>Product management CRUD UI goes here. (Can use Supabase Storage for image uploads via /api/upload endpoint).</p>
          {/* Full CRUD logic omitted for brevity, but table structure follows orders */}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
