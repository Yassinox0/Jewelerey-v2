import React, { useState, useEffect } from 'react';
import { Container, Row, Spinner, Alert } from 'react-bootstrap';
import CategoryDisplay from '../components/CategoryDisplay';
import { getAllCategories } from '../services/productService';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await getAllCategories();
        if (response.success) {
          setCategories(response.data);
        } else {
          throw new Error('Failed to fetch categories');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setCategories([]);
  };

  return (
    <Container className="py-5">
      <h1 className="text-center mb-5">Shop by Category</h1>

      {error && (
        <Alert variant="danger" className="text-center mb-4">
          <p className="mb-2">{error}</p>
          <button className="btn btn-outline-danger" onClick={handleRetry}>Retry</button>
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
          <p className="mt-3">Loading categories...</p>
        </div>
      ) : (
        <Row className="g-4">
          {categories.map(category => (
            <CategoryDisplay key={category._id} category={category} layout="page" />
          ))}
        </Row>
      )}
    </Container>
  );
};

export default CategoriesPage; 