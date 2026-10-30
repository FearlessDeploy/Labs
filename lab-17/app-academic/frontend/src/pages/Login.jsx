import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';

export const Login = () => {
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('admin123');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const success = await login(username, password);
        setLoading(false);
        if (success) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-[128px]"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px]"></div>

            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 relative z-10 border border-slate-100">
                <div className="text-center space-y-2">
                    <div className="h-12 w-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-black text-2xl mx-auto shadow-lg shadow-emerald-200">
                        UIS
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Portal Académico UIS</h1>
                    <p className="text-xs text-slate-500 font-medium">Ingreso exclusivo para profesores y administradores</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">Usuario / Correo</label>
                        <div className="relative">
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-600 outline-none"
                                placeholder="admin"
                            />
                            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">Contraseña</label>
                        <div className="relative">
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-600 outline-none"
                                placeholder="••••••••"
                            />
                            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Credenciales por defecto: <strong>admin / admin123</strong></span>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {loading ? 'Iniciando Sesión...' : <> Acceder al Portal <ArrowRight className="w-4 h-4" /> </>}
                    </button>
                </form>

                <p className="text-[11px] text-slate-400 text-center">
                    Universidad Industrial de Santander © 2026 - Three-Tier Test App
                </p>
            </div>
        </div>
    );
};