/* eslint-disable */
import { useState, useEffect } from 'react';
import AuthContext from './AuthContext'
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    useEffect(() => {
    const us = localStorage.getItem('token');
 const currentUser = JSON.parse(us);
 setUser(currentUser);
 console.log(currentUser);
 }, [user]);
  
    return (
      <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
    );
  };