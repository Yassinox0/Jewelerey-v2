import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // In a real app, we'd fetch from the actual API
    // This is a placeholder for demonstration
    const fetchProducts = async () => {
      try {
        // Simulated products data (would come from API)
        const sampleProducts = [
          {
            id: 1,
            name: 'Wireless Headphones',
            price: 99.99,
            image: 'https://via.placeholder.com/300',
            description: 'High-quality wireless headphones with noise cancellation.'
          },
          {
            id: 2,
            name: 'Smartphone',
            price: 799.99,
            image: 'https://via.placeholder.com/300',
            description: 'Latest smartphone with amazing camera and performance.'
          },
          {
            id: 3,
            name: 'Laptop',
            price: 1299.99,
            image: 'https://via.placeholder.com/300',
            description: 'Powerful laptop for work and gaming.'
          },
          {
            id: 4,
            name: 'Smartwatch',
            price: 249.99,
            image: 'https://via.placeholder.com/300',
            description: 'Fitness tracker and smartwatch with many features.'
          },
          {
            id: 5,
            name: 'Wireless Earbuds',
            price: 149.99,
            image: 'https://via.placeholder.com/300',
            description: 'Comfortable wireless earbuds with great sound quality.'
          },
          {
            id: 6,
            name: 'Gaming Console',
            price: 499.99,
            image: 'https://via.placeholder.com/300',
            description: 'Next-gen gaming console for immersive gaming experience.'
          }
        ];
        
        setProducts(sampleProducts);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch products. Please try again.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger my-5" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="jumbotron bg-light p-5 rounded mb-4">
        <h1 className="display-4">Welcome to MX E-Commerce</h1>
        <p className="lead">Discover amazing products at competitive prices.</p>
        <hr className="my-4" />
        <p>Browse our latest collection of products and find what you need.</p>
        <Link to="/products" className="btn btn-primary btn-lg">
          Shop Now
        </Link>
      </div>

      {/* Featured Products */}
      <div className="my-5">
        <h2 className="text-center mb-4">Featured Products</h2>
        <div className="row">
          {products.map((product) => (
            <div key={product.id} className="col-md-4 mb-4">
              <div className="card h-100">
                <img src={product.image} className="card-img-top" alt={product.name} />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="card-text text-primary fw-bold">${product.price.toFixed(2)}</p>
                  <Link to={`/product/${product.id}`} className="btn btn-outline-primary">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Promotional Banners */}
      <div className="my-5">
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card bg-secondary text-white">
              <div className="card-body text-center p-4">
                <h3>Special Offers</h3>
                <p>Get up to 40% off on selected items. Limited time only!</p>
                <Link to="/products" className="btn btn-light">
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="card bg-info text-white">
              <div className="card-body text-center p-4">
                <h3>New Arrivals</h3>
                <p>Check out our latest products. Fresh and trending!</p>
                <Link to="/products" className="btn btn-light">
                  Explore
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 