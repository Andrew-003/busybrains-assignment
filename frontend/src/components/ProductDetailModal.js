import React, { useState, useEffect } from 'react';
import '../styles/App.css';

const ProductDetailModal = ({ product, isOpen, onClose, onSave, isEdit = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: ''
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? (product?.id ? 'Edit Product' : 'Add New Product') : product?.name}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {isEdit ? (
              <div className="product-form">
                <div className="form-group">
                  <label htmlFor="name">Product Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter product name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    placeholder="Enter product description"
                    rows="4"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="price">Price ($)</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                </div>
              </div>
            ) : (
              <div className="product-detail-info">
                <div className="product-detail-text">
                  <h3>{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-price">${product.price}</div>
                  <div className="product-meta">
                    <span className="product-id">Product ID: #{product.id}</span>
                    <span className="product-status">In Stock</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              {isEdit ? 'Cancel' : 'Close'}
            </button>
            {isEdit && (
              <button type="submit" className="btn btn-primary">
                {product?.id ? 'Save Changes' : 'Create Product'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductDetailModal;
