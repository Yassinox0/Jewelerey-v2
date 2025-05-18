import React from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaCreditCard, FaPaypal, FaCcVisa, FaCcMastercard, FaCcAmex } from 'react-icons/fa';
import '../../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="elegant-footer">
      {/* Footer Top with Logo and Divider */}
      <div className="footer-top text-center">
        <div className="container">
          <h2 className="footer-logo">Elegance Jewels</h2>
          <div className="footer-separator">
            <span>♦</span>
          </div>
        </div>
      </div>
      
      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="container">
          <div className="row g-4">
            {/* About Column */}
            <div className="col-lg-4 col-md-6">
              <h3 className="footer-heading">Our Story</h3>
              <p className="footer-text">
                Elegance Jewels creates timeless pieces that celebrate life's most precious moments. 
                Our master craftsmen blend traditional techniques with modern design to create jewelry of exceptional quality and beauty.
              </p>
              <div className="footer-social mt-4">
                <Link to="#" aria-label="Facebook" className="social-icon">
                  <i className="bi bi-facebook"></i>
                </Link>
                <Link to="#" aria-label="Instagram" className="social-icon">
                  <i className="bi bi-instagram"></i>
                </Link>
                <Link to="#" aria-label="Pinterest" className="social-icon">
                  <i className="bi bi-pinterest"></i>
                </Link>
                <Link to="#" aria-label="YouTube" className="social-icon">
                  <i className="bi bi-youtube"></i>
                </Link>
              </div>
            </div>
            
            {/* Links Columns */}
            <div className="col-lg-2 col-md-6">
              <h3 className="footer-heading">Collections</h3>
              <ul className="footer-links">
                <li><Link to="/products?category=Rings">Rings</Link></li>
                <li><Link to="/products?category=Necklaces">Necklaces</Link></li>
                <li><Link to="/products?category=Earrings">Earrings</Link></li>
                <li><Link to="/products?category=Bracelets">Bracelets</Link></li>
                <li><Link to="/products?category=Pendants">Pendants</Link></li>
                <li><Link to="/products?category=Wedding">Wedding</Link></li>
              </ul>
            </div>
            
            <div className="col-lg-2 col-md-6">
              <h3 className="footer-heading">Information</h3>
              <ul className="footer-links">
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/blog">Blog</Link></li>
                <li><Link to="/careers">Careers</Link></li>
                <li><Link to="/stores">Our Stores</Link></li>
              </ul>
            </div>
            
            {/* Contact Column */}
            <div className="col-lg-4 col-md-6">
              <h3 className="footer-heading">Stay Connected</h3>
              <p className="footer-text mb-4">
                Subscribe to receive updates on new collections, exclusive offers and jewelry care tips.
              </p>
              <form className="footer-newsletter">
                <div className="input-group">
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="Your email address"
                    aria-label="Email address for newsletter"
                  />
                  <button className="btn btn-primary" type="submit">Subscribe</button>
                </div>
              </form>
              
              <div className="footer-contact mt-4">
                <div className="contact-item">
                  <FaMapMarkerAlt className="contact-icon" />
                  <span>123 Luxury Avenue, Fashion District</span>
                </div>
                <div className="contact-item">
                  <FaEnvelope className="contact-icon" />
                  <span>contact@elegancejewels.com</span>
                </div>
                <div className="contact-item">
                  <FaPhoneAlt className="contact-icon" />
                  <span>+1 (800) 123-4567</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="copyright mb-md-0">
                &copy; {new Date().getFullYear()} Elegance Jewels. All rights reserved.
              </p>
            </div>
            <div className="col-md-6">
              <div className="payment-methods text-md-end">
                <span className="payment-icon"><FaCreditCard /></span>
                <span className="payment-icon"><FaPaypal /></span>
                <span className="payment-icon"><FaCcVisa /></span>
                <span className="payment-icon"><FaCcMastercard /></span>
                <span className="payment-icon"><FaCcAmex /></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 