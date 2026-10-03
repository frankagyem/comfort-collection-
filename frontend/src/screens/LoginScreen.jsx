import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import useStore from '../store/useStore';

const LoginScreen = () => {
  const [identifier, setIdentifier] = useState(''); // email or phone
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { search } = useLocation();
  const { userInfo, setUserInfo } = useStore();

  const redirect = new URLSearchParams(search).get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const isEmail = identifier.includes('@');
      const payload = isEmail ? { email: identifier, password } : { phone: identifier, password };
      
      const { data } = await axios.post('/api/users/login', payload);
      setUserInfo(data);
      toast.success('Logged in successfully');
      navigate(redirect);
    } catch (error) {
      toast.error(error.response && error.response.data.message ? error.response.data.message : error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '500px', margin: '0 auto' }}>
      <h1 style={{ textTransform: 'uppercase', marginBottom: '2rem', textAlign: 'center' }}>Sign In</h1>
      
      <form onSubmit={submitHandler} style={{ backgroundColor: 'var(--card-bg)', padding: '2rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
        <div className="form-group">
          <label className="form-label">Email or Phone Number</label>
          <input 
            type="text" 
            className="form-input" 
            required 
            value={identifier} 
            onChange={(e) => setIdentifier(e.target.value)} 
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Password</label>
          <input 
            type="password" 
            className="form-input" 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginScreen;
