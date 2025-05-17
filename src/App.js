import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Home page placeholder component
const Home = () => (
  <div className="container py-5">
    <div className="jumbotron bg-light p-5 rounded mb-4">
      <h1 className="display-4">Welcome to MX E-Commerce</h1>
      <p className="lead">Discover amazing products at competitive prices.</p>
      <hr className="my-4" />
      <p>Browse our latest collection of products and find what you need.</p>
      <button className="btn btn-primary btn-lg">Shop Now</button>
    </div>
    
    <div className="row mt-5">
      <div className="col-md-4 mb-4">
        <div className="card">
          <img src="https://via.placeholder.com/300" className="card-img-top" alt="Product" />
          <div className="card-body">
            <h5 className="card-title">Laptop</h5>
            <p className="card-text">High-performance laptop for work and gaming.</p>
            <p className="text-primary fw-bold">$1299.99</p>
            <button className="btn btn-outline-primary">View Details</button>
          </div>
        </div>
      </div>
      
      <div className="col-md-4 mb-4">
        <div className="card">
          <img src="https://via.placeholder.com/300" className="card-img-top" alt="Product" />
          <div className="card-body">
            <h5 className="card-title">Smartphone</h5>
            <p className="card-text">Latest smartphone with amazing camera.</p>
            <p className="text-primary fw-bold">$899.99</p>
            <button className="btn btn-outline-primary">View Details</button>
          </div>
        </div>
      </div>
      
      <div className="col-md-4 mb-4">
        <div className="card">
          <img src="https://via.placeholder.com/300" className="card-img-top" alt="Product" />
          <div className="card-body">
            <h5 className="card-title">Headphones</h5>
            <p className="card-text">Wireless noise-cancelling headphones.</p>
            <p className="text-primary fw-bold">$249.99</p>
            <button className="btn btn-outline-primary">View Details</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Header component
const Header = () => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
    <div className="container">
      <a className="navbar-brand" href="/">MX E-Commerce</a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <a className="nav-link active" href="/">Home</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/products">Products</a>
          </li>
        </ul>
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" href="/cart">Cart</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/login">Login</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/register">Register</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

// Footer component
const Footer = () => (
  <footer className="bg-dark text-light py-4 mt-5">
    <div className="container">
      <div className="row">
        <div className="col-md-4">
          <h5>MX E-Commerce</h5>
          <p>Your one-stop shop for all your needs.</p>
        </div>
        <div className="col-md-4">
          <h5>Quick Links</h5>
          <ul className="list-unstyled">
            <li><a href="/" className="text-light">Home</a></li>
            <li><a href="/products" className="text-light">Products</a></li>
            <li><a href="/cart" className="text-light">Cart</a></li>
          </ul>
        </div>
        <div className="col-md-4">
          <h5>Contact Us</h5>
          <p>Email: support@mxecom.com</p>
          <p>Phone: +1 (123) 456-7890</p>
        </div>
      </div>
      <hr className="bg-light" />
      <div className="text-center">
        <p>&copy; {new Date().getFullYear()} MX E-Commerce. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

function App() {
  return (
    <Router>
      <div className="App d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <Routes>
            {/* Redirect to client application */}
            <Route path="/*" element={<Navigate to="/ecom-project/client" />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App; 