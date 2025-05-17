import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert, Button, Breadcrumb } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaStar } from 'react-icons/fa';
import { getProductById } from '../services/productService';
import { useAuth } from '../contexts/AuthContext';
import { addToCartWithAuth } from '../utils/cartUtils';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  // Fetch product details when component mounts or id changes
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await getProductById(id);
        if (response.success) {
          setProduct(response.data);
        } else {
          throw new Error('Failed to fetch product details');
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchProductDetails();
    }
  }, [id]);
  
  const handleAddToCart = () => {
    if (product) {
      // Ensure product has both _id and id properties for compatibility
      const productWithId = {
        ...product,
        id: product._id || product.id
      };
      
      addToCartWithAuth(productWithId, quantity, currentUser, dispatch, navigate);
    }
  };
  
  const handleQuantityChange = (value) => {
    const newQuantity = quantity + value;
    if (newQuantity >= 1 && newQuantity <= (product.stock || 10)) {
      setQuantity(newQuantity);
    }
  };
  
  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setProduct(null);
  };
  
  // Helper function to render rating stars
  const renderRatingStars = (rating = 4) => {
    return (
      <div className="d-flex align-items-center">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            style={{ 
              color: index < Math.floor(rating) ? 'var(--color-primary)' : '#e0e0e0',
              marginRight: '2px',
              fontSize: '1rem'
            }}
          />
        ))}
        <span className="ms-2" style={{ opacity: 0.7 }}>
          ({rating})
        </span>
      </div>
    );
  };
  
  return (
    <Container className="py-5">
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
          <p className="mt-3">Loading product details...</p>
        </div>
      ) : error ? (
        <Alert variant="danger" className="text-center mb-4">
          <p className="mb-2">{error}</p>
          <Button variant="outline-danger" onClick={handleRetry}>Retry</Button>
        </Alert>
      ) : product ? (
        <>
          {/* Breadcrumb Navigation */}
          <Breadcrumb className="mb-4">
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>Home</Breadcrumb.Item>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/products' }}>Products</Breadcrumb.Item>
            <Breadcrumb.Item 
              linkAs={Link} 
              linkProps={{ to: `/products?category=${product.category}` }}
            >
              {product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : 'Category'}
            </Breadcrumb.Item>
            <Breadcrumb.Item active>{product.name}</Breadcrumb.Item>
          </Breadcrumb>
          
          <Row>
            {/* Product Image */}
            <Col md={6} className="mb-4">
              <div className="product-detail-img-container">
                <img 
                  src={product.image || 'https://via.placeholder.com/600x600?text=No+Image'} 
                  alt={product.name} 
                  className="img-fluid rounded" 
                />
              </div>
            </Col>
            
            {/* Product Details */}
            <Col md={6}>
              <div className="product-detail-content">
                <h1 className="mb-2">{product.name}</h1>
                
                <div className="d-flex align-items-center mb-3">
                  {renderRatingStars(product.rating)}
                </div>
                
                <div className="category small text-uppercase mb-3" style={{ opacity: 0.7 }}>
                  {product.category ? product.category.toUpperCase() : 'UNCATEGORIZED'}
                </div>
                
                <h2 className="price mb-4">${parseFloat(product.price).toFixed(2)}</h2>
                
                <p className="mb-4">{product.description}</p>
                
                {/* Product Features */}
                {product.features && (
                  <div className="mb-4">
                    <h5>Features</h5>
                    <ul className="ps-3">
                      {product.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* In Stock Status */}
                <div className="mb-4">
                  <span 
                    className={`badge ${product.inStock !== false ? 'bg-success' : 'bg-danger'}`}
                  >
                    {product.inStock !== false ? 'In Stock' : 'Out of Stock'}
                  </span>
                  
                  {product.stock && product.stock <= 5 && product.stock > 0 && (
                    <span className="ms-2 text-danger">Only {product.stock} left!</span>
                  )}
                </div>
                
                {/* Quantity Selector */}
                {product.inStock !== false && (
                  <div className="d-flex align-items-center mb-4">
                    <span className="me-3">Quantity:</span>
                    <div className="input-group" style={{ width: '120px' }}>
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                      >-</Button>
                      <div className="form-control text-center">{quantity}</div>
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= (product.stock || 10)}
                      >+</Button>
                    </div>
                  </div>
                )}
                
                {/* Add to Cart Button */}
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={handleAddToCart}
                  disabled={product.inStock === false}
                  className="mb-3 w-100"
                >
                  {product.inStock !== false ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                
                {/* Returns Policy */}
                <div className="mt-4 small">
                  <h6>Returns Policy</h6>
                  <p className="text-muted">
                    We offer a 30-day return policy on all our products. Please contact customer service for more information.
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </>
      ) : (
        <div className="text-center py-5">
          <h3>Product not found</h3>
          <p className="mb-3">The product you're looking for does not exist or has been removed.</p>
          <Button as={Link} to="/products" variant="primary">
            Browse Products
          </Button>
        </div>
      )}
    </Container>
  );
};

export default ProductDetailsPage;