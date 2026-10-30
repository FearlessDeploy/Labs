import { AlertTriangle } from 'lucide-react';

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center animate-in zoom-in-95">
                <div className="h-12 w-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-100">
                    <AlertTriangle className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900">{title || '¿Estás seguro?'}</h3>
                    <p className="text-xs text-slate-500">{message || 'Esta acción no se puede deshacer.'}</p>
                </div>

                <div className="flex justify-center gap-2 pt-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                    >
                        Sí, Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};