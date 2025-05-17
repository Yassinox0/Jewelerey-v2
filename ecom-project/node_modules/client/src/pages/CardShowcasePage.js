import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import ProductCardStyled from '../components/ProductCardStyled';
import { getAllProducts } from '../services/productService';

const CardShowcasePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await getAllProducts();
        if (response.success) {
          setProducts(response.data);
          setError(null);
        } else {
          throw new Error('Failed to fetch products');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Select a few products for demonstration
  const showcaseProducts = products.slice(0, 4);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Loading products...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          <p className="mb-0">{error}</p>
        </Alert>
      </Container>
    );
  }

  if (products.length === 0) {
    return (
      <Container className="py-5">
        <Alert variant="info" className="text-center">
          <p className="mb-0">No products available for showcase.</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="text-center mb-5">Product Card Style Showcase</h1>
      
      {/* Modern Luxury Style */}
      <section className="mb-5">
        <h2 className="text-center mb-4">Modern Luxury Style</h2>
        <p className="text-center text-muted mb-4">
          Elegant product cards with soft rounded corners, subtle shadows, and premium aesthetics.
        </p>
        <Row className="g-4">
          {showcaseProducts.map((product, index) => (
            <Col key={product.id} xs={12} sm={6} md={3}>
              <ProductCardStyled 
                product={product} 
                variant="luxury" 
                showSale={index === 0}
              />
            </Col>
          ))}
        </Row>
      </section>

      {/* Neon Glow Style */}
      <section className="mb-5">
        <h2 className="text-center mb-4">Neon Glow Style</h2>
        <p className="text-center text-muted mb-4">
          Futuristic cards with neon glow effects and vibrant gradient buttons.
        </p>
        <div className="p-5" style={{ background: '#121212' }}>
          <Row className="g-4">
            {showcaseProducts.map((product, index) => (
              <Col key={product.id} xs={12} sm={6} md={3}>
                <ProductCardStyled 
                  product={product} 
                  variant="neon" 
                  showSale={index === 1}
                />
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Glass Morphism Style */}
      <section className="mb-5">
        <h2 className="text-center mb-4">Glass Morphism Style</h2>
        <p className="text-center text-muted mb-4">
          Modern glass effect cards with blur backgrounds and subtle transparency.
        </p>
        <div className="p-5" style={{ 
          background: 'linear-gradient(45deg, #8a9b8e, #d4b96e)',
          borderRadius: '8px'
        }}>
          <Row className="g-4">
            {showcaseProducts.map((product, index) => (
              <Col key={product.id} xs={12} sm={6} md={3}>
                <ProductCardStyled 
                  product={product} 
                  variant="glass" 
                  showSale={index === 2}
                />
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Vintage Luxury Style */}
      <section className="mb-5">
        <h2 className="text-center mb-4">Vintage Luxury Style</h2>
        <p className="text-center text-muted mb-4">
          Classic design with serif fonts, gold accents, and parchment-textured backgrounds.
        </p>
        <div className="p-5" style={{ 
          background: 'var(--color-vintage-cream)',
          borderRadius: '8px',
          border: '1px solid var(--color-vintage-gold)'
        }}>
          <Row className="g-4">
            {showcaseProducts.map((product, index) => (
              <Col key={product.id} xs={12} sm={6} md={3}>
                <ProductCardStyled 
                  product={product} 
                  variant="vintage" 
                  showSale={index === 3}
                />
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Style Comparison */}
      <section>
        <h2 className="text-center mb-4">Style Comparison</h2>
        <p className="text-center text-muted mb-4">
          Compare all styles with the same product.
        </p>
        <Row className="g-4">
          <Col xs={12} sm={6} lg={3}>
            <ProductCardStyled 
              product={products[0]} 
              variant="luxury" 
              showSale={true}
            />
            <div className="text-center mt-3">
              <h5>Modern Luxury</h5>
            </div>
          </Col>
          <Col xs={12} sm={6} lg={3}>
            <div style={{ background: '#121212', padding: '1px' }}>
              <ProductCardStyled 
                product={products[0]} 
                variant="neon" 
                showSale={true}
              />
            </div>
            <div className="text-center mt-3">
              <h5>Neon Glow</h5>
            </div>
          </Col>
          <Col xs={12} sm={6} lg={3}>
            <div style={{ 
              background: 'linear-gradient(45deg, #8a9b8e, #d4b96e)',
              padding: '1px'
            }}>
              <ProductCardStyled 
                product={products[0]} 
                variant="glass" 
                showSale={true}
              />
            </div>
            <div className="text-center mt-3">
              <h5>Glass Morphism</h5>
            </div>
          </Col>
          <Col xs={12} sm={6} lg={3}>
            <div style={{ 
              background: 'var(--color-vintage-cream)',
              padding: '1px',
              border: '1px solid var(--color-vintage-gold)'
            }}>
              <ProductCardStyled 
                product={products[0]} 
                variant="vintage" 
                showSale={true}
              />
            </div>
            <div className="text-center mt-3">
              <h5>Vintage Luxury</h5>
            </div>
          </Col>
        </Row>
      </section>
    </Container>
  );
};

export default CardShowcasePage; 