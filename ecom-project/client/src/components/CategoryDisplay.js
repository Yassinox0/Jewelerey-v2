import React from 'react';
import { Link } from 'react-router-dom';
import { Col } from 'react-bootstrap';

/**
 * Component for displaying category cards with specific images
 * @param {Object} props Component props
 * @param {Object} props.category The category object to display
 * @param {string} props.layout Layout type: "home" for homepage (md={3}) or "page" for categories page (md={4})
 */
const CategoryDisplay = ({ category, layout = "home" }) => {
  // Map specific images for each category from static path
  const getCategoryImage = (slug) => {
    switch (slug) {
      case 'rings':
        return '/static/rings-standing.png';
      case 'necklaces':
        return '/static/necklaces-category-1.png';
      case 'earrings':
        return '/static/earrings-category.png';
      case 'bracelets':
        return '/static/bracelets-category.png';
      default:
        return `/static/${slug}-category.png`;
    }
  };

  const categoryImage = getCategoryImage(category.slug);
  
  // Column size based on layout
  const mdSize = layout === "home" ? 3 : 4;

  return (
    <Col xs={12} sm={6} md={mdSize} className="mb-4">
      <Link 
        to={`/products?category=${encodeURIComponent(category.slug)}`}
        className="text-decoration-none"
      >
        <div className="product-card-luxury shine-wrapper h-100">
          <div className="card-img-container">
            <img 
              src={categoryImage} 
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = `https://via.placeholder.com/300x300?text=${category.name}`;
              }}
              alt={category.name}
              className="card-img-top"
              style={{ height: '280px', objectFit: 'cover' }}
            />
            <div className="shine"></div>
          </div>
          <div className="card-body text-center p-4">
            <h3 className="product-title">{category.name}</h3>
            <p className="mb-0" style={{ color: 'var(--color-medium-grey)' }}>
              {category.description || `Explore our ${category.name.toLowerCase()} collection`}
            </p>
          </div>
        </div>
      </Link>
    </Col>
  );
};

export default CategoryDisplay; 