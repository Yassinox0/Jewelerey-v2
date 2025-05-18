import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { addToCartWithAuth } from '../utils/cartUtils';
import { FaStar, FaHeart } from 'react-icons/fa';

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
    e.stopPropagation(); // Stop event from bubbling up
    
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
      <div className="product-card elegant-product-card shine-wrapper">
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
          <div className="card-overlay"></div>
          <div className="card-quick-actions">
            <button className="quick-action-btn" title="Add to Wishlist" onClick={(e) => e.preventDefault()}>
              <FaHeart />
            </button>
            <button
              className="quick-action-btn add-cart-btn"
              onClick={handleAddToCart}
              disabled={productStock === 0}
              title={productStock === 0 ? 'Out of Stock' : 'Add to Cart'}
            >
              <span>+</span>
            </button>
          </div>
          <div className="shine"></div>
          {showSale && (
            <div className="sale-badge">
              Sale
            </div>
          )}
        </div>
        <div className="card-body">
          <div className="product-category">
            {productCategory}
          </div>
          
          <h3 className="product-title">{productName}</h3>
          
          <div className="product-rating">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                className={index < Math.floor(productRating) ? 'star active' : 'star'}
              />
            ))}
            <span className="rating-count">
              ({productRating})
            </span>
          </div>

          <div className="price-container">
            <p className="product-price">
              ${productPrice.toFixed(2)}
            </p>
          </div>

          <button 
            className="btn-add-to-cart"
            disabled={productStock === 0}
          >
            {productStock === 0 ? 'Out of Stock' : 'View Details'}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCardStyled; 