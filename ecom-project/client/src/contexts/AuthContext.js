import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase/config';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminStatus, setAdminStatus] = useState(false);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get user data from MongoDB database
          const token = await user.getIdToken();
          console.log('Firebase user authenticated:', user.email);
          
          const response = await axios.get('http://localhost:7777/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (response.data.success) {
            const userData = { ...user, ...response.data.data };
            console.log('User data from server:', userData);
            setCurrentUser(userData);
            // Set admin status based on user roles from MongoDB
            const isUserAdmin = userData.role === 'admin';
            setAdminStatus(isUserAdmin);
            console.log('User has admin role:', isUserAdmin);
          } else {
            setCurrentUser(user);
            setAdminStatus(false);
            console.log('Failed to get user data from server');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setCurrentUser(user);
          setAdminStatus(false);
        }
      } else {
        setCurrentUser(null);
        setAdminStatus(false);
        console.log('No authenticated user');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      // Use Firebase authentication instead of direct API
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User logged in successfully:', user.email);
      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Login failed'
      };
    }
  };

  const register = async (userData) => {
    try {
      // Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );
      
      const user = userCredential.user;
      
      // Update profile with name
      await updateProfile(user, {
        displayName: userData.name
      });
      
      // Optional: Save additional user data to MongoDB
      try {
        const token = await user.getIdToken();
        await axios.post(
          'http://localhost:7777/api/users/create-profile',
          {
            name: userData.name,
            email: userData.email
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      } catch (profileError) {
        console.error('Error creating user profile:', profileError);
        // Continue even if profile creation fails
      }
      
      return { success: true, user };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.message || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message
      };
    }
  };

  // Function to check if user is admin
  const isAdmin = () => {
    if (!currentUser) {
      console.log('No current user, not admin');
      return false;
    }
    
    // Check for admin role in MongoDB user data
    if (currentUser.role === 'admin') {
      console.log('User has admin role in currentUser object:', currentUser.role);
      return true;
    }
    
    // Check admin status from state
    console.log('Using admin status from state:', adminStatus);
    return adminStatus;
  };

  // Function to refresh user claims/roles with direct MongoDB check
  const refreshClaims = async () => {
    if (!currentUser) {
      console.log('No current user to refresh claims for');
      return;
    }
    
    try {
      console.log('Refreshing user claims for:', currentUser.email);
      
      // Force a token refresh
      const token = await currentUser.getIdToken(true);
      
      // Attempt to get user data from MongoDB
      console.log('Making request to check admin status...');
      const response = await axios.get('http://localhost:7777/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        const userData = { ...currentUser, ...response.data.data };
        console.log('Refreshed user data:', userData);
        setCurrentUser(userData);
        
        // Check for admin role in the response
        const isUserAdmin = userData.role === 'admin';
        setAdminStatus(isUserAdmin);
        console.log('Admin status updated to:', isUserAdmin);
        
        // Also make a direct check to MongoDB for admin status
        try {
          const adminCheckResponse = await axios.get('http://localhost:7777/api/auth/check-admin', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (adminCheckResponse.data.isAdmin) {
            console.log('Direct admin check confirmed user is admin');
            setAdminStatus(true);
          } else {
            console.log('Direct admin check says user is NOT admin');
          }
        } catch (adminCheckError) {
          console.error('Error checking admin status directly:', adminCheckError);
        }
        
        return isUserAdmin;
      } else {
        console.log('Failed to refresh user data:', response.data);
        return false;
      }
    } catch (error) {
      console.error('Error refreshing claims:', error);
      return false;
    }
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading,
    isAdmin,
    refreshClaims
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthContext; 