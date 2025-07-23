import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = Cookies.get('token');
        const userData = Cookies.get('user');
        if (token && userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (error) {
                console.error("Failed to parse user data from cookies:", error);
                Cookies.remove('token');
                Cookies.remove('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        const { data } = await api.post('/auth/login', { username, password });
        Cookies.set('token', data.token, { expires: 1/3 });
        Cookies.set('user', JSON.stringify(data.user), { expires: 1/3 });
        setUser(data.user);
    };

    const logout = () => {
        Cookies.remove('token');
        Cookies.remove('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;