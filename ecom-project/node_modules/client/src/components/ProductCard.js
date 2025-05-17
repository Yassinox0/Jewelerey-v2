import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { addToCartWithAuth } from '../utils/cartUtils';
import { FaStar } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleAddToCart = () => {
    const productWithId = {
      ...product,
      id: product._id || product.id
    };
    
    addToCartWithAuth(productWithId, 1, currentUser, dispatch, navigate);
  };

  return (
    <div className="product-card-luxury h-100">
      <div className="card-img-container">
        <img 
          src={product.image} 
          alt={product.name}
          className="card-img-top"
        />
        {product.stock < 10 && (
          <div className="sale-badge">
            Only {product.stock} left
          </div>
        )}
      </div>
      <div className="card-body">
        <div className="product-category">
          {product.category}
        </div>
        
        <h3 className="product-title">{product.name}</h3>
        
        <div className="d-flex mb-3">
          {[...Array(5)].map((_, index) => (
            <FaStar
              key={index}
              style={{ 
                color: index < Math.floor(product.rating) 
                  ? 'var(--color-gold)'
                  : '#e0e0e0',
                marginRight: '2px'
              }}
            />
          ))}
          <span className="ms-2" style={{ opacity: 0.7, fontSize: '0.9rem' }}>
            ({product.rating})
          </span>
        </div>

        {product.features && product.features.length > 0 && (
          <ul className="mb-3 ps-3" style={{ fontSize: '0.9rem', color: 'var(--color-medium-grey)' }}>
            {product.features.slice(0, 2).map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        )}

        <p className="product-price">
          ${product.price.toFixed(2)}
        </p>

        <button
          className="btn-add-to-cart"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard; 