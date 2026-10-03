import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import { ProductCard } from './HomeScreen';
import { Filter, X } from 'lucide-react';

const CatalogScreen = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const urlCategory = queryParams.get('category');
  const urlSale = queryParams.get('sale');
  const urlNew = queryParams.get('new');

  // Filter States
  const [filters, setFilters] = useState({
    category: urlCategory || '',
    size: '',
    color: '',
    fabric: '',
    priceRange: '',
    sale: urlSale === 'true' || false,
    newArrival: urlNew === 'true' || false,
  });

  const [sortOption, setSortOption] = useState('Newest');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];

    if (filters.category) {
      result = result.filter((p) => p.category.toLowerCase().includes(filters.category.toLowerCase()));
    }
    if (filters.color) {
      result = result.filter((p) => p.color && p.color.toLowerCase() === filters.color.toLowerCase());
    }
    if (filters.fabric) {
      result = result.filter((p) => p.fabric && p.fabric.toLowerCase() === filters.fabric.toLowerCase());
    }
    if (filters.sale) {
      result = result.filter((p) => p.isFlashSale || p.discountPercent > 0);
    }
    if (filters.newArrival) {
      result = result.filter((p) => p.isNewArrival);
    }
    if (filters.size) {
      result = result.filter((p) => p.sizes && p.sizes.some((s) => s.size.toLowerCase() === filters.size.toLowerCase() && s.stock > 0));
    }
    if (filters.priceRange) {
      if (filters.priceRange === 'under-100') result = result.filter((p) => p.calculatedPrice < 100);
      if (filters.priceRange === '100-300') result = result.filter((p) => p.calculatedPrice >= 100 && p.calculatedPrice <= 300);
      if (filters.priceRange === 'over-300') result = result.filter((p) => p.calculatedPrice > 300);
    }

    // Sort
    switch (sortOption) {
      case 'Price: Low → High':
        result.sort((a, b) => a.calculatedPrice - b.calculatedPrice);
        break;
      case 'Price: High → Low':
        result.sort((a, b) => b.calculatedPrice - a.calculatedPrice);
        break;
      case 'Biggest Discount':
        result.sort((a, b) => b.discountPercent - a.discountPercent);
        break;
      case 'Alphabetical':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Newest':
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFilteredProducts(result);
  }, [products, filters, sortOption]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      size: '',
      color: '',
      fabric: '',
      priceRange: '',
      sale: false,
      newArrival: false,
    });
  };

  const uniqueCategories = [...new Set(products.map(p => p.category))];
  const uniqueColors = [...new Set(products.filter(p => p.color).map(p => p.color))];
  const uniqueFabrics = [...new Set(products.filter(p => p.fabric).map(p => p.fabric))];

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ textTransform: 'uppercase', fontSize: '1.5rem' }}>Collection</h1>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="btn-outline d-md-none" onClick={() => setIsMobileFilterOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
            <Filter size={16} /> Filters
          </button>

          <select 
            value={sortOption} 
            onChange={(e) => setSortOption(e.target.value)}
            style={{ padding: '0.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--background-color)', color: 'var(--text-color)', outline: 'none' }}
          >
            <option>Newest</option>
            <option>Price: Low → High</option>
            <option>Price: High → Low</option>
            <option>Biggest Discount</option>
            <option>Alphabetical</option>
          </select>
        </div>
      </div>

      <div className="catalog-layout">
        {/* Sidebar Filters */}
        <aside className={`filter-sidebar ${isMobileFilterOpen ? 'mobile-open' : ''}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ textTransform: 'uppercase', fontSize: '1rem' }}>Filters</h3>
            {isMobileFilterOpen && (
              <button onClick={() => setIsMobileFilterOpen(false)} style={{ background: 'none', border: 'none' }}>
                <X size={20} />
              </button>
            )}
          </div>
          
          <button onClick={clearFilters} style={{ background: 'none', border: 'none', textDecoration: 'underline', color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>Clear All</button>

          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Category</h4>
            {uniqueCategories.map(cat => (
              <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                <input type="radio" name="category" value={cat} checked={filters.category === cat} onChange={handleFilterChange} />
                {cat}
              </label>
            ))}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Price Range</h4>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
              <input type="radio" name="priceRange" value="under-100" checked={filters.priceRange === 'under-100'} onChange={handleFilterChange} />
              Under GH₵ 100
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
              <input type="radio" name="priceRange" value="100-300" checked={filters.priceRange === '100-300'} onChange={handleFilterChange} />
              GH₵ 100 - GH₵ 300
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
              <input type="radio" name="priceRange" value="over-300" checked={filters.priceRange === 'over-300'} onChange={handleFilterChange} />
              Over GH₵ 300
            </label>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Status</h4>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
              <input type="checkbox" name="sale" checked={filters.sale} onChange={handleFilterChange} />
              Sale
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
              <input type="checkbox" name="newArrival" checked={filters.newArrival} onChange={handleFilterChange} />
              New Arrivals
            </label>
          </div>
        </aside>

        {/* Product Grid */}
        <div>
          {loading ? (
            <p>Loading...</p>
          ) : filteredProducts.length === 0 ? (
            <p>No products match your filters.</p>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogScreen;
