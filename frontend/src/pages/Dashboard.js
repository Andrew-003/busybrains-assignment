import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import productService from '../services/productService';
import ProductDetailModal from '../components/ProductDetailModal';
import '../styles/App.css';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setIsEditMode(false);
  };

  const handleSaveProduct = async (formData) => {
    try {
      setError('');
      setSuccess('');
      if (selectedProduct?.id) {
        // Update
        const updatedProduct = await productService.updateProduct(selectedProduct.id, formData);
        setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        setSuccess('Product updated successfully!');
      } else {
        // Create
        const newProduct = await productService.createProduct(formData);
        setProducts([...products, newProduct]);
        setSuccess('Product created successfully!');
      }
      handleCloseModal();
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setError('');
        await productService.deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
        setSuccess('Product deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete product');
      }
    }
  };

  const isAdmin = user?.role === 'ADMIN';

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <div className="loading">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Product Dashboard</h1>
          <p>Browse our products</p>
        </div>
        <div className="user-info">
          <span className="badge">{user?.role}</span>
          <span>{user?.username}</span>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <div className="product-price">${product.price}</div>
            <div className="product-actions">
              <button
                className="btn btn-primary btn-small"
                onClick={() => handleViewProduct(product)}
              >
                View Details
              </button>
              {isAdmin && (
                <>
                  <button
                    className="btn btn-secondary btn-small"
                    onClick={() => handleEditProduct(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-small"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        {isAdmin && (
          <div className="product-card add-card" onClick={handleAddProduct}>
            <div className="add-card-icon">+</div>
            <span>Add New Product</span>
          </div>
        )}
      </div>

      {products.length === 0 && !isAdmin && (
        <div className="no-products">
          <h3>No products available</h3>
          <p>Check back later for new products.</p>
        </div>
      )}

      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProduct}
        isEdit={isEditMode}
      />
    </div>
  );
};

export default Dashboard;