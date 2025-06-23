import { useState, useEffect } from 'react';
import { Search, Loader2, AlertCircle, ChevronLeft, ChevronRight, Plus, Edit, Trash2 } from 'lucide-react';

// Types
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  createdAt: string;
}

interface ApiResponse<T> {
  data: T;
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
}

const API_BASE_URL = 'https://localhost:7270/api';

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0
  });
  const [submitting, setSubmitting] = useState(false);

  const pageSize = 10;
  const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports'];

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(categoryFilter && { category: categoryFilter })
      });

      const response = await fetch(`${API_BASE_URL}/products?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data: ApiResponse<Product[]> = await response.json();
      setProducts(data.data);
      setTotalCount(data.totalCount);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Load products on mount and when filters change
  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, categoryFilter]);

  // Filter products (client-side fallback)
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock
    });
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingProduct(null);
    setFormData({ name: '', description: '', price: 0, category: '', stock: 0 });
  };

  const saveProduct = async () => {
    setSubmitting(true);
    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const url = editingProduct 
        ? `${API_BASE_URL}/products/${editingProduct.id}`
        : `${API_BASE_URL}/products`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save product');
      }

      await fetchProducts(); // Refresh the list
      handleCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      await fetchProducts(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Electronics: '#6366f1',
      Clothing: '#ec4899',
      Books: '#10b981',
      Home: '#f59e0b',
      Sports: '#ef4444'
    };
    return colors[category as keyof typeof colors] || '#6b7280';
  };

  return (
    <>
      <style jsx>{`
        .container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 1rem;
          position: relative;
          overflow: hidden;
        }

        .background-pattern {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          z-index: 0;
        }

        .wrapper {
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .header {
          margin-bottom: 2rem;
          text-align: center;
          color: white;
        }

        .title {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 900;
          margin-bottom: 0.75rem;
          background: linear-gradient(45deg, #fff, #f0f0f0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 4px 8px rgba(0,0,0,0.2);
          letter-spacing: -1px;
        }

        .subtitle {
          font-size: clamp(1rem, 2.5vw, 1.125rem);
          opacity: 0.9;
          margin-bottom: 1.5rem;
          font-weight: 300;
        }

        .stats-bar {
          display: flex;
          justify-content: center;
          gap: clamp(1rem, 5vw, 3rem);
          margin-top: 1.5rem;
          flex-wrap: wrap;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: clamp(1.5rem, 4vw, 2rem);
          font-weight: 800;
          color: #fff;
        }

        .stat-label {
          font-size: 0.875rem;
          opacity: 0.8;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .error-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(239, 68, 68, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 1rem;
          padding: 1.25rem;
          margin-bottom: 1.5rem;
          color: white;
        }

        .error-icon {
          color: #ef4444;
          flex-shrink: 0;
          width: 20px;
          height: 20px;
        }

        .error-title {
          font-weight: bold;
          color: #fff;
          margin-bottom: 0.25rem;
        }

        .error-text {
          color: rgba(255,255,255,0.9);
        }

        .error-close {
          margin-left: auto;
          color: #ef4444;
          background: none;
          border: none;
          font-size: 1.25rem;
          cursor: pointer;
          padding: 0.25rem;
        }

        .controls {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 1.25rem;
          padding: 1.5rem;
          margin-bottom: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        @media (max-width: 768px) {
          .controls {
            flex-direction: column;
            align-items: stretch;
          }
        }

        .filters {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }

        @media (max-width: 640px) {
          .filters {
            flex-direction: column;
            align-items: stretch;
            width: 100%;
          }
        }

        .search-wrapper {
          position: relative;
          width: 100%;
          max-width: 320px;
        }

        @media (max-width: 640px) {
          .search-wrapper {
            max-width: none;
          }
        }

        .search-icon {
          position: absolute;
          top: 50%;
          left: 1rem;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.7);
          width: 18px;
          height: 18px;
        }

        .search-input, .select-input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 0.75rem;
          color: white;
          font-size: 1rem;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .search-input {
          padding-left: 3rem;
        }

        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }

        .select-input {
          min-width: 180px;
        }

        @media (max-width: 640px) {
          .select-input {
            min-width: auto;
          }
        }

        .add-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(45deg, #4f46e5, #7c3aed);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 0.75rem;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4);
          white-space: nowrap;
        }

        @media (max-width: 640px) {
          .add-btn {
            justify-content: center;
          }
        }

        .add-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(79, 70, 229, 0.6);
        }

        .icon-small {
          width: 18px;
          height: 18px;
        }

        .modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1.25rem;
        }

        .modal-content {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 1.25rem;
          padding: 2rem;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow: auto;
        }

        @media (max-width: 640px) {
          .modal-content {
            padding: 1.5rem;
          }
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: #1f2937;
          text-align: center;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.25rem;
          margin-bottom: 1.25rem;
        }

        @media (max-width: 640px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #374151;
        }

        .input, .textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.625rem;
          font-size: 1rem;
          transition: border-color 0.3s ease;
          background: white;
          box-sizing: border-box;
        }

        .input:focus, .textarea:focus {
          outline: none;
          border-color: #4f46e5;
        }

        .textarea {
          resize: vertical;
          min-height: 80px;
        }

        .modal-actions {
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
          margin-top: 2rem;
          flex-wrap: wrap;
        }

        @media (max-width: 480px) {
          .modal-actions {
            flex-direction: column;
          }
        }

        .cancel-btn, .save-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 0.625rem;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.3s ease;
          border: none;
        }

        .cancel-btn {
          background: #f3f4f6;
          color: #374151;
        }

        .cancel-btn:hover {
          background: #e5e7eb;
        }

        .save-btn {
          background: linear-gradient(45deg, #10b981, #059669);
          color: white;
          font-weight: 600;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
        }

        .save-btn:hover {
          transform: translateY(-2px);
        }

        .save-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        @media (max-width: 640px) {
          .products-grid {
            grid-template-columns: 1fr;
          }
        }

        .product-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 1.25rem;
          overflow: hidden;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.25rem 0;
        }

        .category-badge {
          padding: 0.375rem 0.75rem;
          border-radius: 1.25rem;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .card-actions {
          display: flex;
          gap: 0.5rem;
        }

        .edit-btn, .delete-btn {
          padding: 0.5rem;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .edit-btn {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }

        .edit-btn:hover {
          background: rgba(59, 130, 246, 0.2);
        }

        .delete-btn {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .delete-btn:hover {
          background: rgba(239, 68, 68, 0.2);
        }

        .icon-tiny {
          width: 14px;
          height: 14px;
        }

        .card-body {
          padding: 1.25rem;
        }

        .product-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .product-description {
          color: #6b7280;
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .product-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .price-section {
          display: flex;
          align-items: center;
        }

        .price {
          font-size: 1.5rem;
          font-weight: 800;
          color: #059669;
          text-shadow: 0 2px 4px rgba(5, 150, 105, 0.2);
        }

        .stock-section {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .stock-label {
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
        }

        .stock-value {
          font-size: 1rem;
          font-weight: 700;
        }

        .card-footer {
          padding-top: 1rem;
          border-top: 1px solid #f3f4f6;
        }

        .created-date {
          font-size: 0.75rem;
          color: #9ca3af;
          font-style: italic;
        }

        .empty-state {
          text-align: center;
          padding: 3.75rem 1.25rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 1.25rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .empty-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.5rem;
        }

        .empty-text {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1rem;
        }

        .loading-state {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          color: white;
          gap: 0.75rem;
        }

        .loader {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="container">
        <div className="background-pattern"></div>
        <div className="wrapper">
          {/* Header */}
          <div className="header">
            <h1 className="title">Product Manager</h1>
            <p className="subtitle">Manage your product inventory with full CRUD operations</p>
            <div className="stats-bar">
              <div className="stat-item">
                <span className="stat-number">{totalCount}</span>
                <span className="stat-label">Total Products</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{filteredProducts.length}</span>
                <span className="stat-label">Filtered Results</span>
              </div>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="error-box">
              <AlertCircle className="error-icon" />
              <div>
                <h3 className="error-title">Error</h3>
                <p className="error-text">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="error-close">×</button>
            </div>
          )}

          {/* Controls */}
          <div className="controls">
            <div className="filters">
              <div className="search-wrapper">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="select-input"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <button onClick={() => setShowAddForm(true)} className="add-btn">
              <Plus className="icon-small" />
              Add Product
            </button>
          </div>

          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="modal">
              <div className="modal-content">
                <h2 className="modal-title">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="label">Product Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="input"
                      placeholder="Enter product name"
                    />
                  </div>
                  <div className="form-group">
                    <label className="label">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="input"
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="label">Price ($)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                      className="input"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="form-group">
                    <label className="label">Stock</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                      className="input"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="label">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="textarea"
                    placeholder="Enter product description"
                    rows={3}
                  />
                </div>
                <div className="modal-actions">
                  <button onClick={handleCancel} className="cancel-btn">
                    Cancel
                  </button>
                  <button 
                    onClick={saveProduct} 
                    className="save-btn"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="icon-small loader" />
                        Saving...
                      </>
                    ) : (
                      editingProduct ? 'Update Product' : 'Create Product'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="loading-state">
              <Loader2 className="loader" />
              Loading products...
            </div>
          )}

          {/* Products Grid */}
          {!loading && (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="card-header">
                    <div 
                      className="category-badge"
                      style={{
                        backgroundColor: getCategoryColor(product.category) + '20',
                        color: getCategoryColor(product.category)
                      }}
                    >
                      {product.category}
                    </div>
                    <div className="card-actions">
                      <button
                        onClick={() => handleEdit(product)}
                        className="edit-btn"
                      >
                        <Edit className="icon-tiny" />
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="delete-btn"
                      >
                        <Trash2 className="icon-tiny" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="card-body">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    
                    <div className="product-meta">
                      <div className="price-section">
                        <span className="price">${product.price}</span>
                      </div>
                      <div className="stock-section">
                        <span className="stock-label">Stock:</span>
                        <span 
                          className="stock-value"
                          style={{
                            color: product.stock < 10 ? '#ef4444' : '#10b981'
                          }}
                        >
                          {product.stock}
                        </span>
                      </div>
                    </div>
                    
                    <div className="card-footer">
                      <span className="created-date">
                        Added {new Date(product.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3 className="empty-title">No products found</h3>
              <p className="empty-text">
                {searchTerm || categoryFilter 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by adding your first product'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}