import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4 mb-md-0">
            <h5>MX E-Commerce</h5>
            <p>Your one-stop shop for all your needs.</p>
          </div>
          <div className="col-md-4 mb-4 mb-md-0">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-light">Home</Link></li>
              <li><Link to="/products" className="text-light">Products</Link></li>
              <li><Link to="/cart" className="text-light">Cart</Link></li>
              <li><Link to="/login" className="text-light">Login</Link></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Contact Us</h5>
            <address>
              <p>123 E-Commerce Street</p>
              <p>Email: support@mxecom.com</p>
              <p>Phone: +1 (123) 456-7890</p>
            </address>
          </div>
        </div>
        <hr className="bg-light" />
        <div className="row">
          <div className="col-12 text-center">
            <p className="mb-0">&copy; {new Date().getFullYear()} MX E-Commerce. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 