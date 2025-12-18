import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = '/api';
const token = document.querySelector('meta[name="csrf-token"]');
if (token) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token.getAttribute('content');
}

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/me');
            setUser(data.user);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = async (payload) => {
        setError('');
        await axios.post('/login', payload);
        await fetchUser();
    };

    const logout = async () => {
        setError('');
        try {
            await axios.post('/logout');
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, logout, refreshUser: fetchUser, setError }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
