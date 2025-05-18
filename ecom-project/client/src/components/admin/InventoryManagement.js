import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Spinner, Alert, Row, Col, Badge, Card, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getAllProducts, updateProductStock, getMaterialUsage } from '../../services/adminService';

const InventoryManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('stock');
  const [sortOrder, setSortOrder] = useState('asc');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [restockQuantity, setRestockQuantity] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);

  // Fetch inventory on component mount
  useEffect(() => {
    fetchInventory();
    fetchMaterials();
  }, []);

  // Fetch all products for inventory
  const fetchInventory = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getAllProducts();
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setError('Failed to load inventory data. Please try again.');
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  // Fetch material usage
  const fetchMaterials = async () => {
    setLoadingMaterials(true);
    try {
      const response = await getMaterialUsage();
      setMaterials(response.data || []);
    } catch (error) {
      console.error('Error fetching materials:', error);
      toast.error('Failed to load material data');
    } finally {
      setLoadingMaterials(false);
    }
  };

  // Open restock modal
  const openRestockModal = (product) => {
    setSelectedProduct(product);
    setRestockQuantity('');
    setShowRestockModal(true);
  };

  // Handle restock
  const handleRestock = async (e) => {
    e.preventDefault();
    
    if (!restockQuantity || isNaN(restockQuantity) || parseInt(restockQuantity) <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }
    
    setSubmitting(true);
    try {
      const newQuantity = parseInt(selectedProduct.stock) + parseInt(restockQuantity);
      
      await updateProductStock(selectedProduct.id, { stock: newQuantity });
      
      // Update product in state
      setProducts(products.map(product => 
        product.id === selectedProduct.id 
          ? { ...product, stock: newQuantity } 
          : product
      ));
      
      toast.success(`Successfully restocked ${selectedProduct.name}`);
      setShowRestockModal(false);
    } catch (error) {
      console.error('Error restocking product:', error);
      toast.error('Failed to restock product');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle sort change
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Get stock status class
  const getStockStatusClass = (stock) => {
    if (stock <= 0) return 'danger';
    if (stock <= 5) return 'warning';
    if (stock <= 15) return 'info';
    return 'success';
  };
  
  // Get stock status label
  const getStockStatusLabel = (stock) => {
    if (stock <= 0) return 'Out of Stock';
    if (stock <= 5) return 'Low Stock';
    if (stock <= 15) return 'Medium Stock';
    return 'In Stock';
  };

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category filter
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      
      // Stock filter
      let matchesStock = true;
      if (stockFilter === 'out') {
        matchesStock = product.stock <= 0;
      } else if (stockFilter === 'low') {
        matchesStock = product.stock > 0 && product.stock <= 5;
      } else if (stockFilter === 'medium') {
        matchesStock = product.stock > 5 && product.stock <= 15;
      } else if (stockFilter === 'high') {
        matchesStock = product.stock > 15;
      }
      
      return matchesSearch && matchesCategory && matchesStock;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'stock':
          comparison = a.stock - b.stock;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Format material name
  const formatMaterialName = (name) => {
    return name.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get unique categories
  const categories = [...new Set(products.map(product => product.category))];

  return (
    <div className="inventory-management p-3">
      <h4 className="mb-4">Inventory Management</h4>

      {/* Dashboard cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="bg-light h-100">
            <Card.Body className="text-center">
              <h6 className="text-muted">Total Products</h6>
              <h2>{products.length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-light h-100">
            <Card.Body className="text-center">
              <h6 className="text-muted">Out of Stock</h6>
              <h2>{products.filter(p => p.stock <= 0).length}</h2>
              <small className="text-danger">Needs attention</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-light h-100">
            <Card.Body className="text-center">
              <h6 className="text-muted">Low Stock</h6>
              <h2>{products.filter(p => p.stock > 0 && p.stock <= 5).length}</h2>
              <small className="text-warning">Consider restocking</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-light h-100">
            <Card.Body className="text-center">
              <h6 className="text-muted">Total Items in Stock</h6>
              <h2>
                {products.reduce((total, product) => total + (product.stock || 0), 0)}
              </h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Search and filters */}
      <Row className="mb-3">
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
              placeholder="Search product name or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={2}>
          <Form.Select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Select 
            value={stockFilter} 
            onChange={(e) => setStockFilter(e.target.value)}
          >
            <option value="all">All Stock Levels</option>
            <option value="out">Out of Stock</option>
            <option value="low">Low Stock</option>
            <option value="medium">Medium Stock</option>
            <option value="high">High Stock</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="stock">Sort by Stock</option>
            <option value="name">Sort by Name</option>
            <option value="category">Sort by Category</option>
          </Form.Select>
        </Col>
        <Col md={2} className="text-end">
          <Button variant="outline-primary" onClick={fetchInventory}>
            <i className="bi bi-arrow-clockwise me-1"></i>
            Refresh
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Inventory table */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Row className="mb-4">
          <Col md={8}>
            {filteredProducts.length === 0 ? (
              <Alert variant="info">No products found matching your filters.</Alert>
            ) : (
              <div className="table-responsive">
                <Table hover className="inventory-table">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('name')} className="sortable">
                        Product {sortBy === 'name' && <i className={`bi bi-caret-${sortOrder === 'asc' ? 'up' : 'down'}-fill ms-1`}></i>}
                      </th>
                      <th onClick={() => handleSort('category')} className="sortable">
                        Category {sortBy === 'category' && <i className={`bi bi-caret-${sortOrder === 'asc' ? 'up' : 'down'}-fill ms-1`}></i>}
                      </th>
                      <th onClick={() => handleSort('stock')} className="sortable text-center">
                        Stock {sortBy === 'stock' && <i className={`bi bi-caret-${sortOrder === 'asc' ? 'up' : 'down'}-fill ms-1`}></i>}
                      </th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(product => (
                      <tr key={product.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            {product.image && (
                              <img 
                                src={product.image} 
                                alt={product.name} 
                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                className="me-2 rounded"
                              />
                            )}
                            <span>{product.name}</span>
                          </div>
                        </td>
                        <td>
                          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                        </td>
                        <td className="text-center">
                          <strong>{product.stock || 0}</strong>
                        </td>
                        <td>
                          <Badge bg={getStockStatusClass(product.stock)}>
                            {getStockStatusLabel(product.stock)}
                          </Badge>
                        </td>
                        <td>
                          <Button 
                            variant="outline-success" 
                            size="sm"
                            onClick={() => openRestockModal(product)}
                          >
                            <i className="bi bi-plus-circle me-1"></i> Restock
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Col>

          {/* Material usage panel */}
          <Col md={4}>
            <Card>
              <Card.Header as="h5">Material Usage</Card.Header>
              <Card.Body>
                {loadingMaterials ? (
                  <div className="text-center py-3">
                    <Spinner animation="border" size="sm" />
                  </div>
                ) : (
                  <>
                    {materials.length === 0 ? (
                      <Alert variant="info">No material data available.</Alert>
                    ) : (
                      <div>
                        <Table>
                          <thead>
                            <tr>
                              <th>Material</th>
                              <th>Used</th>
                              <th>In Stock</th>
                            </tr>
                          </thead>
                          <tbody>
                            {materials.map((material, index) => (
                              <tr key={index}>
                                <td>{formatMaterialName(material.name)}</td>
                                <td>{material.used} {material.unit}</td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <div 
                                      className="me-2" 
                                      style={{
                                        width: '50px', 
                                        height: '10px', 
                                        background: `linear-gradient(to right, 
                                          ${material.stock < material.reorderLevel ? '#dc3545' : '#198754'} 
                                          ${Math.min(100, (material.stock / material.capacity) * 100)}%, 
                                          #e9ecef ${Math.min(100, (material.stock / material.capacity) * 100)}%)`
                                      }}
                                    ></div>
                                    <span>
                                      {material.stock} / {material.capacity} {material.unit}
                                    </span>
                                  </div>
                                  {material.stock < material.reorderLevel && (
                                    <Badge bg="danger" className="mt-1">Reorder needed</Badge>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="mt-2"
                          onClick={fetchMaterials}
                        >
                          <i className="bi bi-arrow-clockwise me-1"></i>
                          Refresh Materials
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Restock Modal */}
      <Modal show={showRestockModal} onHide={() => setShowRestockModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Restock Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <Form onSubmit={handleRestock}>
              <div className="mb-3 d-flex align-items-center">
                {selectedProduct.image && (
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name} 
                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    className="me-3 rounded"
                  />
                )}
                <div>
                  <h5>{selectedProduct.name}</h5>
                  <p className="mb-0">Current stock: <strong>{selectedProduct.stock || 0}</strong></p>
                </div>
              </div>

              <Form.Group className="mb-3">
                <Form.Label>Quantity to Add</Form.Label>
                <Form.Control 
                  type="number" 
                  min="1"
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(e.target.value)}
                  required
                  placeholder="Enter quantity to add to inventory"
                />
              </Form.Group>

              <div className="mb-3">
                <p className="mb-1">New stock will be:</p>
                <h4 className="text-success">
                  {selectedProduct.stock + (parseInt(restockQuantity) || 0)}
                </h4>
              </div>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRestockModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleRestock}
            disabled={submitting || !restockQuantity || isNaN(restockQuantity) || parseInt(restockQuantity) <= 0}
          >
            {submitting ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                Processing...
              </>
            ) : 'Confirm Restock'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default InventoryManagement; 