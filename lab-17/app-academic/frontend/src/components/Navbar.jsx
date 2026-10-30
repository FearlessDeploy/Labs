import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

export const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-md shadow-emerald-600/30">
                        UIS
                    </div>
                    <div>
                        <h1 className="font-black text-white text-base leading-none tracking-tight">Portal Académico UIS</h1>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Sistemas de Información</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-white leading-none">{user?.name}</p>
                        <span className="text-[10px] font-mono text-emerald-400">{user?.role}</span>
                    </div>
                    <button
                        onClick={logout}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                        title="Cerrar Sesión"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>
    );
};