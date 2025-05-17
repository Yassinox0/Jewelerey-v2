import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Spinner, Alert, Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCardStyled from '../components/ProductCardStyled';
import CategoryFilter from '../components/CategoryFilter';
import { getAllProducts, getAllCategories, getProductsByCategory } from '../services/productService';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract category from URL query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryParam = queryParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam.toLowerCase());
    }
  }, [location.search]);

  // Update URL when category changes
  useEffect(() => {
    if (selectedCategory) {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('category', selectedCategory);
      navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    } else if (location.search.includes('category=')) {
      // Remove category param if no category is selected
      const searchParams = new URLSearchParams(location.search);
      searchParams.delete('category');
      navigate(`${location.pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`, { replace: true });
    }
  }, [selectedCategory, navigate, location.pathname, location.search]);

  // Fetch categories first
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        if (response.success) {
          setCategories(response.data);
        } else {
          console.warn('Categories fetch returned unsuccessful response:', response);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        // Don't set error here as we can still show products without categories
      }
    };
    
    fetchCategories();
  }, []);

  // Fetch products based on selected category
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let response;
        
        if (selectedCategory) {
          // If a category is selected, fetch products by category
          response = await getProductsByCategory(selectedCategory);
          if (response.success && response.category) {
            setActiveCategory(response.category);
          }
        } else {
          // Otherwise fetch all products
          response = await getAllProducts();
          setActiveCategory(null);
        }
        
        if (response && response.success) {
          console.log('Products fetched successfully:', response.data);
          setProducts(response.data || []);
          setFilteredProducts(response.data || []);
        } else {
          console.error('Failed response from API:', response);
          throw new Error('Failed to fetch products');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
        // Set empty arrays to prevent undefined errors
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [selectedCategory]);

  // Handle category change
  const handleCategoryChange = (categorySlug) => {
    setSelectedCategory(categorySlug);
  };

  // Further filter products by search query and sort
  useEffect(() => {
    if (!products.length) return;
    
    let result = [...products];

    // Search filtering
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product =>
        (product.name && product.name.toLowerCase().includes(query)) ||
        (product.description && product.description.toLowerCase().includes(query))
      );
    }

    // Sorting
    if (sortBy) {
      switch (sortBy) {
        case 'price-asc':
          result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
          break;
        case 'price-desc':
          result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
          break;
        case 'featured':
          result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
          break;
        default:
          break;
      }
    }

    setFilteredProducts(result);
  }, [products, searchQuery, sortBy]);

  // Button to retry loading if there's an error
  const handleRetry = () => {
    // Reset the error and trigger a refetch
    setError(null);
    setLoading(true);
    
    // We set these to trigger useEffect fetches
    setProducts([]);
    setFilteredProducts([]);
  };

  return (
    <Container className="py-5">
      <h1 className="text-center mb-4">
        {activeCategory ? activeCategory.name : 'Our Products'}
      </h1>
      
      {activeCategory && activeCategory.description && (
        <p className="text-center mb-5">{activeCategory.description}</p>
      )}
      
      {error ? (
        <Alert variant="danger" className="text-center mb-4">
          <p className="mb-2">{error}</p>
          <Button variant="outline-danger" onClick={handleRetry}>Retry</Button>
        </Alert>
      ) : null}
      
      {/* Category Filter Component */}
      <CategoryFilter 
        categories={categories} 
        selectedCategory={selectedCategory} 
        onSelectCategory={handleCategoryChange}
      />
      
      {/* Search and Sort */}
      <Row className="mb-5 g-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label className="text-uppercase small fw-light letter-spacing-1">Search</Form.Label>
            <Form.Select
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0"
              disabled={loading}
            >
              <option value="">All Products</option>
              <option value="diamond">Diamond</option>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
              <option value="pearl">Pearl</option>
              <option value="sapphire">Sapphire</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label className="text-uppercase small fw-light letter-spacing-1">Sort By</Form.Label>
            <Form.Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border-0"
              disabled={loading}
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      
      {/* Products grid */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
          <p className="mt-3">Loading products...</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <Row>
          {filteredProducts.map(product => (
            <Col xs={12} sm={6} md={4} lg={3} className="mb-4" key={product._id || product.id}>
              <ProductCardStyled product={product} />
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="info" className="text-center">
          No products found for your filters. Try adjusting your search criteria.
        </Alert>
      )}
    </Container>
  );
};

export default ProductsPage; 