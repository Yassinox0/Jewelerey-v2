import React from 'react';
import { Link } from 'react-router-dom';
import { Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="py-5 mt-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-3 col-md-6">
            <h3 className="h5 mb-3">Elegance Jewels</h3>
            <p className="text-muted">Discover a world of beautiful hand crafted jewelry designs, created to celebrate life's most precious moments.</p>
            <div className="mt-4">
              <Link to="#" className="me-2 text-decoration-none">
                <i className="bi bi-facebook fs-5"></i>
              </Link>
              <Link to="#" className="me-2 text-decoration-none">
                <i className="bi bi-instagram fs-5"></i>
              </Link>
              <Link to="#" className="me-2 text-decoration-none">
                <i className="bi bi-twitter fs-5"></i>
              </Link>
              <Link to="#" className="me-2 text-decoration-none">
                <i className="bi bi-pinterest fs-5"></i>
              </Link>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <h3 className="h5 mb-3">Our Collections</h3>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/products?category=Rings" className="text-decoration-none">Rings</Link></li>
              <li className="mb-2"><Link to="/products?category=Necklaces" className="text-decoration-none">Necklaces</Link></li>
              <li className="mb-2"><Link to="/products?category=Earrings" className="text-decoration-none">Earrings</Link></li>
              <li className="mb-2"><Link to="/products?category=Pendants" className="text-decoration-none">Pendants</Link></li>
              <li className="mb-2"><Link to="/products?category=Bangles" className="text-decoration-none">Bangles</Link></li>
              <li className="mb-2"><Link to="/products?category=Bracelets" className="text-decoration-none">Bracelets</Link></li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6">
            <h3 className="h5 mb-3">Customer Service</h3>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/about" className="text-decoration-none">About Us</Link></li>
              <li className="mb-2"><Link to="/faq" className="text-decoration-none">FAQs</Link></li>
              <li className="mb-2"><Link to="/shipping" className="text-decoration-none">Shipping & Returns</Link></li>
              <li className="mb-2"><Link to="/privacy" className="text-decoration-none">Privacy Policy</Link></li>
              <li className="mb-2"><Link to="/terms" className="text-decoration-none">Terms & Conditions</Link></li>
              <li className="mb-2"><Link to="/contact" className="text-decoration-none">Contact Us</Link></li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6">
            <h3 className="h5 mb-3">Newsletter</h3>
            <p className="text-muted">Subscribe to receive updates on new collections and special offers.</p>
            <form className="mt-3">
              <div className="input-group mb-3">
                <input type="email" className="form-control" placeholder="Your Email" />
                <button className="btn btn-primary" type="submit">Subscribe</button>
              </div>
            </form>
            <div className="mt-3">
              <p className="text-muted mb-1">Payment Methods</p>
              <div className="d-flex gap-2">
                <i className="bi bi-credit-card fs-4"></i>
                <i className="bi bi-paypal fs-4"></i>
                <i className="bi bi-wallet2 fs-4"></i>
              </div>
            </div>
          </div>
        </div>
        <hr className="my-4" />
        <div className="row">
          <div className="col text-center">
            <p className="mb-0 text-muted">&copy; {new Date().getFullYear()} Elegance Jewels. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 