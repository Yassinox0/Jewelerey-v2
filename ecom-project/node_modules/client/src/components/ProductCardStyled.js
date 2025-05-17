import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { addToCartWithAuth } from '../utils/cartUtils';
import { FaStar } from 'react-icons/fa';

/**
 * ProductCardStyled - A component for displaying product cards
 * @param {Object} props - Component props
 * @param {Object} props.product - Product data object
 * @param {boolean} props.showSale - Whether to show the sale badge
 */
const ProductCardStyled = ({ product, showSale = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation to product details
    
    // Ensure product has both _id and id properties for compatibility
    const productWithId = {
      ...product,
      id: product._id || product.id
    };
    
    addToCartWithAuth(productWithId, 1, currentUser, dispatch, navigate);
  };

  // Safe access to product properties with defaults
  const productName = product.name || 'Unnamed Product';
  const productPrice = parseFloat(product.price) || 0;
  const productImage = product.image || 'https://via.placeholder.com/300x300?text=No+Image';
  const productCategory = product.category_name || 'Uncategorized';
  const productRating = product.rating || 4; // Default rating
  const productStock = product.in_stock === false ? 0 : (product.quantity || 10);

  // Format the image URL to ensure it starts with a slash
  const formattedImage = productImage.startsWith('/') ? productImage : `/${productImage}`;

  return (
    <Link to={`/products/${product._id}`} className="text-decoration-none">
      <div className="product-card product-card-luxury shine-wrapper">
        <div className="card-img-container">
          <img 
            src={formattedImage} 
            alt={productName}
            className="card-img-top"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
            }}
          />
          <div className="shine"></div>
          {showSale && (
            <div className="sale-badge">
              Sale
            </div>
          )}
        </div>
        <div className="card-body p-3">
          <div className="product-category small text-uppercase mb-1" style={{ opacity: 0.7 }}>
            {productCategory}
          </div>
          
          <h3 className="card-title mb-2">{productName}</h3>
          
          <div className="d-flex mb-2">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                style={{ 
                  color: index < Math.floor(productRating) 
                    ? 'var(--color-primary)' 
                    : '#e0e0e0',
                  marginRight: '2px',
                  fontSize: '0.8rem'
                }}
              />
            ))}
            <span className="ms-1" style={{ opacity: 0.7, fontSize: '0.8rem' }}>
              ({productRating})
            </span>
          </div>

          <p className="card-price mb-3">
            ${productPrice.toFixed(2)}
          </p>

          <button 
            className="btn btn-primary w-100"
            onClick={handleAddToCart}
            disabled={productStock === 0}
          >
            {productStock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCardStyled; 