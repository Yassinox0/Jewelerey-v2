import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Dropdown, NavDropdown } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const Header = () => {
  const { totalQuantity } = useSelector(state => state.cart);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're in the admin area
  const isAdminPage = location.pathname.includes('/admin');
  
  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };
  
  // Check if user is admin
  const isAdmin = currentUser && currentUser.role === 'admin';
  
  return (
    <header>
      {/* Top Navigation Bar */}
      <div className="container">
        <div className="nav-top">
          <div className="d-flex align-items-center">
            <input type="text" className="input-placeholder" placeholder="Search" />
            <i className="bi bi-search"></i>
          </div>
          
          <Navbar.Brand as={Link} to="/" className="elegant-brand">
            Elegance Jewels
          </Navbar.Brand>
          
          <div className="icon-wrapper d-flex align-items-center">
            {!isAdminPage && (
              <>
                <Link to="/wishlist" className="me-3">
                  <i className="bi bi-heart heart-icon" style={{ fontSize: '1.5rem' }}></i>
                </Link>
                <Link to="/cart" className="position-relative me-3">
                  <i className="bi bi-bag bag-icon" style={{ fontSize: '1.5rem' }}></i>
                  {totalQuantity > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {totalQuantity}
                    </span>
                  )}
                </Link>
              </>
            )}
            {currentUser ? (
              <Dropdown align="end">
                <Dropdown.Toggle as="div" className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
                  <i className="bi bi-person-circle" style={{ fontSize: '1.5rem' }}></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.ItemText>
                    <strong>{currentUser.name}</strong>
                    <div className="small text-muted">{currentUser.email}</div>
                  </Dropdown.ItemText>
                  <Dropdown.Divider />
                  <Dropdown.Item as={Link} to="/profile">
                    <i className="bi bi-person me-2"></i>My Profile
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/orders">
                    <i className="bi bi-box me-2"></i>My Orders
                  </Dropdown.Item>
                  {isAdmin && (
                    <>
                      <Dropdown.Divider />
                      <Dropdown.Item as={Link} to="/admin">
                        <i className="bi bi-gear-fill me-2"></i>Admin Dashboard
                      </Dropdown.Item>
                    </>
                  )}
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Link to="/login" className="d-flex align-items-center">
                <i className="bi bi-box-arrow-in-right" style={{ fontSize: '1.5rem' }}></i>
              </Link>
            )}
          </div>
        </div>
      </div>
      
      <hr className="my-0" />
      
      {/* Main Navigation */}
      <Navbar expand="lg">
        <Container>
          <Navbar.Toggle aria-controls="navbarNav" />
          <Navbar.Collapse id="navbarNav">
            <Nav className="mx-auto">
              {isAdminPage ? (
                // Admin navigation - only Home link
                <>
                  <Nav.Link as={Link} to="/" className="mx-2">Home</Nav.Link>
                  {isAdmin && (
                    <Nav.Link as={Link} to="/admin" className="mx-2 text-danger">
                      <i className="bi bi-gear-fill me-1"></i>Admin
                    </Nav.Link>
                  )}
                </>
              ) : (
                // Regular store navigation
                <>
                  <Nav.Link as={Link} to="/" className="mx-2">Home</Nav.Link>
                  <Nav.Link as={Link} to="/products" className="mx-2">All Jewelry</Nav.Link>
                  
                  {/* Dropdown for jewelry categories */}
                  <NavDropdown title="Categories" id="jewelry-categories-dropdown" className="mx-2">
                    <NavDropdown.Item as={Link} to="/products?category=rings">
                      <i className="bi bi-circle me-2"></i>Rings
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/products?category=necklaces">
                      <i className="bi bi-gem me-2"></i>Necklaces
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/products?category=earrings">
                      <i className="bi bi-diamond me-2"></i>Earrings
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/products?category=bracelets">
                      <i className="bi bi-link me-2"></i>Bracelets
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/categories">
                      <i className="bi bi-grid me-2"></i>All Categories
                    </NavDropdown.Item>
                  </NavDropdown>
                  
                  {isAdmin && (
                    <Nav.Link as={Link} to="/admin" className="mx-2 text-danger">
                      <i className="bi bi-gear-fill me-1"></i>Admin
                    </Nav.Link>
                  )}
                  {!currentUser && (
                    <>
                      <Nav.Link as={Link} to="/login" className="mx-2">
                        <i className="bi bi-box-arrow-in-right me-1"></i>Login
                      </Nav.Link>
                      <Nav.Link as={Link} to="/register" className="mx-2">
                        <i className="bi bi-person-plus me-1"></i>Register
                      </Nav.Link>
                    </>
                  )}
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header; 