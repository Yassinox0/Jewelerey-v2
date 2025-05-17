import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Spinner, Alert, InputGroup, Row, Col, Tab, Tabs } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { 
  getAllProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct 
} from '../../services/adminService';

// Predefined categories matching Firestore
const CATEGORY_OPTIONS = [
  { slug: 'bracelets', name: 'Bracelets' },
  { slug: 'earrings', name: 'Earrings' },
  { slug: 'necklaces', name: 'Necklaces' },
  { slug: 'rings', name: 'Rings' },
  { slug: 'watches', name: 'Watches' }
];

// Sample image suggestions by category for image search feature
const SAMPLE_IMAGES = {
  bracelets: [
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
  ],
  earrings: [
    'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1635767798638-3e7a22fe9748?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
  ],
  necklaces: [
    'https://images.unsplash.com/photo-1599459183200-59c7687a0c70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
  ],
  rings: [
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1598560917807-1bae44bd2be8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1515994697918-e5c7a8530bce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
  ],
  watches: [
    'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1623998021779-6780df980a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1587925358603-c2eea5305bbc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
  ]
};

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: 'rings', // Default category
    inStock: true,
    featured: false,
    stock: 10 // Default stock quantity
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [imageSearchTab, setImageSearchTab] = useState('url');
  const [previewImage, setPreviewImage] = useState('');
  const [suggestedImages, setSuggestedImages] = useState([]);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Update suggested images when category changes
  useEffect(() => {
    if (formData.category && SAMPLE_IMAGES[formData.category]) {
      setSuggestedImages(SAMPLE_IMAGES[formData.category]);
    } else {
      setSuggestedImages([]);
    }
  }, [formData.category]);

  // Update preview image when image URL changes
  useEffect(() => {
    if (formData.image) {
      setPreviewImage(formData.image);
    } else {
      setPreviewImage('');
    }
  }, [formData.image]);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let updatedValue = value;
    
    // Convert numeric strings to numbers
    if (name === 'price') {
      updatedValue = value; // Keep as string for form input, will convert when submitting
    } else if (name === 'stock') {
      updatedValue = value === '' ? '' : parseInt(value, 10);
    } else if (type === 'checkbox') {
      updatedValue = checked;
    }
    
    setFormData({
      ...formData,
      [name]: updatedValue
    });
  };

  // Select an image from suggestions
  const handleSelectImage = (imageUrl) => {
    setFormData({
      ...formData,
      image: imageUrl
    });
    setPreviewImage(imageUrl);
  };

  // Fetch all products
  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getAllProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again.');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Product name is required';
    }
    
    if (!formData.price) {
      errors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      errors.price = 'Price must be a positive number';
    }

    if (formData.stock === '' || isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      errors.stock = 'Stock must be a non-negative number';
    }
    
    if (!formData.category) {
      errors.category = 'Category is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Prepare data for submission (convert types to match Firestore)
  const prepareProductData = () => {
    return {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      image: formData.image,
      category: formData.category,
      inStock: formData.inStock,
      featured: formData.featured,
      stock: parseInt(formData.stock, 10)
    };
  };

  // Handle add product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    try {
      const productData = prepareProductData();
      await addProduct(productData);
      toast.success('Product added successfully');
      setShowAddModal(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit product
  const handleEditProduct = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    try {
      const productData = prepareProductData();
      await updateProduct(currentProduct.id, productData);
      toast.success('Product updated successfully');
      setShowEditModal(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete product
  const handleDeleteProduct = async () => {
    setSubmitting(true);
    try {
      await deleteProduct(currentProduct.id);
      toast.success('Product deleted successfully');
      setShowDeleteModal(false);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    } finally {
      setSubmitting(false);
    }
  };

  // Open edit modal with product data
  const openEditModal = (product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      image: product.image || '',
      category: product.category || 'rings',
      inStock: product.inStock !== false,
      featured: product.featured || false,
      stock: product.stock || 10
    });
    setPreviewImage(product.image || '');
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (product) => {
    setCurrentProduct(product);
    setShowDeleteModal(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      category: 'rings',
      inStock: true,
      featured: false,
      stock: 10
    });
    setFormErrors({});
    setPreviewImage('');
    setImageSearchTab('url');
  };

  // Render product form (shared between add and edit modals)
  const renderProductForm = (isEdit, handleSubmit) => (
    <Form onSubmit={handleSubmit}>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Product Name <span className="text-danger">*</span></Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            isInvalid={!!formErrors.name}
          />
          <Form.Control.Feedback type="invalid">
            {formErrors.name}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Price <span className="text-danger">*</span></Form.Label>
              <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <Form.Control
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0.01"
                  isInvalid={!!formErrors.price}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.price}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Stock Quantity</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                isInvalid={!!formErrors.stock}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.stock}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Category <span className="text-danger">*</span></Form.Label>
          <Form.Select
            name="category"
            value={formData.category}
            onChange={handleChange}
            isInvalid={!!formErrors.category}
          >
            {CATEGORY_OPTIONS.map(category => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {formErrors.category}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Product Image</Form.Label>
          <Tabs
            activeKey={imageSearchTab}
            onSelect={(key) => setImageSearchTab(key)}
            className="mb-3"
          >
            <Tab eventKey="url" title="Image URL">
              <Form.Control
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
              <Form.Text className="text-muted">
                Enter a valid URL for the product image
              </Form.Text>
            </Tab>
            <Tab eventKey="suggestions" title="Suggested Images">
              <div className="suggested-images mb-3">
                {suggestedImages.length > 0 ? (
                  <Row>
                    {suggestedImages.map((imageUrl, index) => (
                      <Col xs={4} key={index} className="mb-3">
                        <div 
                          className={`image-option p-1 ${formData.image === imageUrl ? 'border border-primary' : 'border'}`}
                          onClick={() => handleSelectImage(imageUrl)}
                          style={{ cursor: 'pointer' }}
                        >
                          <img 
                            src={imageUrl} 
                            alt={`Suggestion ${index + 1}`} 
                            className="img-fluid"
                            style={{ height: '100px', width: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <p className="text-center text-muted">
                    No suggested images available for this category
                  </p>
                )}
              </div>
            </Tab>
          </Tabs>

          {previewImage && (
            <div className="mt-3 text-center">
              <p className="mb-2">Image Preview:</p>
              <img 
                src={previewImage} 
                alt="Product preview" 
                style={{ 
                  maxHeight: '150px', 
                  maxWidth: '100%', 
                  objectFit: 'contain',
                  border: '1px solid #dee2e6',
                  borderRadius: '4px',
                  padding: '5px'
                }} 
              />
            </div>
          )}
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="inStock"
                label="In Stock"
                checked={formData.inStock}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="featured"
                label="Featured Product"
                checked={formData.featured}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => isEdit ? setShowEditModal(false) : setShowAddModal(false)}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <Spinner as="span" animation="border" size="sm" className="me-2" />
              {isEdit ? 'Updating...' : 'Adding...'}
            </>
          ) : isEdit ? 'Update Product' : 'Add Product'}
        </Button>
      </Modal.Footer>
    </Form>
  );

  return (
    <div className="product-management p-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Products Management</h4>
        <Button 
          variant="primary" 
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Add New Product
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          {products.length === 0 ? (
            <Alert variant="info">
              No products found. Add your first product to get started.
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table hover className="product-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            className="border rounded"
                          />
                        ) : (
                          <div 
                            className="bg-light d-flex align-items-center justify-content-center border rounded" 
                            style={{ width: '50px', height: '50px' }}
                          >
                            <i className="bi bi-image text-muted"></i>
                          </div>
                        )}
                      </td>
                      <td>{product.name}</td>
                      <td>${parseFloat(product.price).toFixed(2)}</td>
                      <td>{product.category || '-'}</td>
                      <td>{product.stock || 0}</td>
                      <td>
                        <span className={`badge ${product.inStock ? 'bg-success' : 'bg-danger'}`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                        {' '}
                        {product.featured && (
                          <span className="badge bg-info">Featured</span>
                        )}
                      </td>
                      <td>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="me-2"
                          onClick={() => openEditModal(product)}
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => openDeleteModal(product)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </>
      )}

      {/* Add Product Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} backdrop="static" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        {renderProductForm(false, handleAddProduct)}
      </Modal>

      {/* Edit Product Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} backdrop="static" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        {renderProductForm(true, handleEditProduct)}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{currentProduct?.name}</strong>? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteProduct}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                Deleting...
              </>
            ) : 'Delete Product'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductManagement; 