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

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get user data from MongoDB database
          const token = await user.getIdToken();
          const response = await axios.get('http://localhost:7777/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (response.data.success) {
            setCurrentUser({ ...user, ...response.data.data });
          } else {
            setCurrentUser(user);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
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

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthContext; 