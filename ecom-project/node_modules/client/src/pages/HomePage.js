import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Spinner, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProductCardStyled from '../components/ProductCardStyled';
import CategoryDisplay from '../components/CategoryDisplay';
import { getAllProducts, getAllCategories } from '../services/productService';
import ModestEleganceCarousel from '../components/ModestEleganceCarousel';
import '../styles/HomePage.css';
import '../styles/ModestEleganceCarousel.css';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch categories
        const categoriesResponse = await getAllCategories();
        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data);
        } else {
          console.warn('Failed to fetch categories:', categoriesResponse);
        }
        
        // Fetch products
        const productsResponse = await getAllProducts();
        if (productsResponse.success) {
          setProducts(productsResponse.data);
          setFilteredProducts(productsResponse.data);
        } else {
          console.error('Failed to fetch products:', productsResponse);
          throw new Error('Failed to load products');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter products based on category, search query, and sort option
  useEffect(() => {
    if (!products.length) return;
    
    let result = [...products];

    if (selectedCategory) {
      result = result.filter(product => product.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product =>
        (product.name && product.name.toLowerCase().includes(query)) ||
        (product.description && product.description.toLowerCase().includes(query))
      );
    }

    if (sortBy) {
      switch (sortBy) {
        case 'price-asc':
          result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
          break;
        case 'price-desc':
          result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
          break;
        case 'rating':
          // If products have ratings, sort by them
          if (result[0]?.rating) {
            result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          } else {
            // Otherwise sort by featured flag
            result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
          }
          break;
        default:
          break;
      }
    }

    setFilteredProducts(result);
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="home-page">
      <Container className="px-lg-3 px-sm-2">
        {/* Hero Section with Video Background - Compact with rounded corners */}
        <section className="fullscreen-video-hero">
          <video autoPlay muted loop className="fullscreen-video">
            <source src="/videos/vid1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="hero-content-wrapper">
            <div className="hero-text">
              <h1 className="elegant-title">Elegance Jewels</h1>
              <p className="elegant-subtitle">
                Discover our exquisite collection of handcrafted jewelry, designed to make every moment unforgettable
              </p>
              <Button variant="outline-light" size="lg" className="hero-button mt-4">
                Explore Collection
              </Button>
            </div>
          </div>
        </section>
      </Container>

      {/* Featured Collections */}
      <Container>
        <div className="section-heading">
          <p className="sub-heading">Our Designs</p>
          <h2 className="main-heading">Shop by Category</h2>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
            <p className="mt-3">Loading categories...</p>
          </div>
        ) : error ? (
          <Alert variant="danger" className="text-center mb-4">
            <p className="mb-0">{error}</p>
          </Alert>
        ) : (
          <Row className="g-4 mb-5">
            {categories.slice(0, 4).map(category => (
              <CategoryDisplay key={category._id} category={category} />
            ))}
          </Row>
        )}
      </Container>
      
      {/* UB Jewellers Style Carousel */}
      <ModestEleganceCarousel />

      {/* New Collection - Latest Products */}
      <Container>
        <div className="section-heading mt-5">
          <p className="sub-heading">New Collection</p>
          <h2 className="main-heading">Latest Products</h2>
        </div>
        
        {/* Filters */}
        <Row className="mb-5 g-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label className="text-uppercase small fw-light letter-spacing-1">Category</Form.Label>
              <Form.Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border-0"
                disabled={loading}
              >
                <option value="">All Collections</option>
                {categories.map(category => (
                  <option key={category._id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label className="text-uppercase small fw-light letter-spacing-1">Search</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search our collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0"
                disabled={loading}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label className="text-uppercase small fw-light letter-spacing-1">Sort By</Form.Label>
              <Form.Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border-0"
                disabled={loading}
              >
                <option value="">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Products Grid */}
        <div className="mb-5">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
              <p className="mt-3">Loading products...</p>
            </div>
          ) : error ? (
            <Alert variant="danger" className="text-center mb-4">
              <p className="mb-0">{error}</p>
            </Alert>
          ) : (
            <Row className="g-4">
              {filteredProducts.length > 0 ? (
                filteredProducts.slice(0, 8).map((product) => (
                  <Col key={product._id} xs={12} sm={6} md={4} lg={3}>
                    <ProductCardStyled 
                      product={product}
                      showSale={product.featured} 
                    />
                  </Col>
                ))
              ) : (
                <Col>
                  <div className="text-center p-5" style={{ 
                    backgroundColor: 'var(--color-background)',
                    borderRadius: '8px'
                  }}>
                    <h3 className="h4 mb-3">No products found</h3>
                    <p className="text-muted">
                      Try adjusting your filters or search query
                    </p>
                  </div>
                </Col>
              )}
            </Row>
          )}
        </div>

        {/* Newsletter Section */}
        <section className="mb-5 py-5">
          <Row className="justify-content-center">
            <Col md={8} className="text-center">
              <h2 className="mb-4">Join Our Newsletter</h2>
              <p className="text-muted mb-4">Subscribe to receive updates on new collections, special offers, and exclusive events.</p>
              <Form className="d-flex gap-3 justify-content-center">
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  className="border-0"
                  style={{ maxWidth: '400px' }}
                />
                <button type="submit" className="btn btn-primary px-4">
                  Subscribe
                </button>
              </Form>
            </Col>
          </Row>
        </section>
      </Container>
    </div>
  );
};

export default HomePage; 