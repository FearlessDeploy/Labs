import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('uis_user_info');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState(() => localStorage.getItem('uis_jwt_token') || null);

    const login = async (username, password) => {
        try {
            const res = await api.post('/auth/login', { username, password });
            const { token, name, role } = res.data.data;

            localStorage.setItem('uis_jwt_token', token);
            localStorage.setItem('uis_user_info', JSON.stringify({ username, name, role }));

            setToken(token);
            setUser({ username, name, role });

            toast.success(`¡Bienvenido Profesor, ${name}!`);
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Credenciales inválidas');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('uis_jwt_token');
        localStorage.removeItem('uis_user_info');
        setToken(null);
        setUser(null);
        toast.success('Sesión cerrada');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);