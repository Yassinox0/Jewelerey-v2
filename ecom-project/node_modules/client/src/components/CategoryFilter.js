import React from 'react';
import { Container, Row, Form } from 'react-bootstrap';

/**
 * CategoryFilter component for filtering products by category
 * @param {Object} props Component props
 * @param {Array} props.categories List of category objects
 * @param {String} props.selectedCategory Currently selected category slug
 * @param {Function} props.onSelectCategory Function to call when a category is selected
 */
const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <Container className="my-4">
      <h5 className="text-center mb-3">Filter by Category</h5>
      <Row className="justify-content-center">
        <Form.Group>
          <Form.Select
            value={selectedCategory || ''}
            onChange={(e) => onSelectCategory(e.target.value)}
            className="border-0"
          >
            <option value="">All Products</option>
            {categories.map(category => (
              <option 
                key={category._id || category.id} 
                value={category.slug}
              >
                {category.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Row>
    </Container>
  );
};

export default CategoryFilter; 