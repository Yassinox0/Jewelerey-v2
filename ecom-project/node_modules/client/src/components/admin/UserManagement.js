import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Spinner, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getAllUsers, deleteUser } from '../../services/adminService';
import { useAuth } from '../../contexts/AuthContext';

const UserManagement = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again.');
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Open delete modal
  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    setSubmitting(true);
    try {
      await deleteUser(selectedUser.id);
      toast.success('User deleted successfully');
      setShowDeleteModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    } finally {
      setSubmitting(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="user-management p-3">
      <h4 className="mb-4">Users Management</h4>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          {users.length === 0 ? (
            <Alert variant="info">No users found.</Alert>
          ) : (
            <div className="table-responsive">
              <Table hover className="user-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className={currentUser?.email === user.email ? 'table-active' : ''}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-info'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          disabled={currentUser?.email === user.email || user.role === 'admin'}
                          onClick={() => openDeleteModal(user)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                        {(currentUser?.email === user.email || user.role === 'admin') && (
                          <small className="d-block text-muted mt-1">
                            {currentUser?.email === user.email ? 'Current user' : 'Admin protected'}
                          </small>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the user "<strong>{selectedUser?.name}</strong>" with email "<strong>{selectedUser?.email}</strong>"?
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteUser}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                Deleting...
              </>
            ) : 'Delete User'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserManagement; 