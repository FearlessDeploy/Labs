import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { z } from 'zod';
import toast from 'react-hot-toast';

const studentSchema = z.object({
    firstName: z.string().regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Los nombres solo deben contener letras"),
    lastName: z.string().regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Los apellidos solo deben contener letras"),
    code: z.string().regex(/^\d{5,8}$/, "El código debe ser numérico de 5 a 8 dígitos"),
    email: z.string().regex(/^[a-zA-Z0-9._%+-]+@(correo\.uis\.edu\.co|uis\.edu\.co)$/, "Correo institucional inválido (@correo.uis.edu.co o @uis.edu.co)"),
    semester: z.number().min(1).max(10),
    program: z.string().min(3, "Ingresa un programa académico válido"),
    passedCredits: z.number().min(0),
    pga: z.number().min(0.0).max(5.0),
    completedCourses: z.string().optional()
});

export const StudentModal = ({ isOpen, onClose, onSave, student }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        code: '',
        email: '',
        semester: 1,
        program: 'Ingeniería de Sistemas',
        completedCourses: '',
        passedCredits: 0,
        pga: 3.5
    });

    useEffect(() => {
        if (student) {
            setFormData({
                ...student,
                semester: student.semester || 1,
                passedCredits: student.passedCredits || 0,
                pga: student.pga || 0.0
            });
        } else {
            setFormData({
                firstName: '',
                lastName: '',
                code: '',
                email: '',
                semester: 1,
                program: 'Ingeniería de Sistemas',
                completedCourses: '',
                passedCredits: 0,
                pga: 3.5
            });
        }
    }, [student]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const validation = studentSchema.safeParse(formData);
        if (!validation.success) {
            const issues = validation.error.issues || [];
            const errorMsg = issues.map(err => err.message).join(' | ') || 'Error de validación en los campos';
            toast.error(errorMsg);
            return;
        }

        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 font-bold">&times;</button>

                <h3 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3">
                    {student ? 'Editar Estudiante' : 'Registrar Nuevo Estudiante'}
                </h3>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Nombres</label>
                        <input
                            type="text"
                            required
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            placeholder="Ej. Ana Sofía"
                            className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-600 outline-none"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Apellidos</label>
                        <input
                            type="text"
                            required
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            placeholder="Ej. Morales"
                            className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-600 outline-none"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Código (5 a 8 dígitos)</label>
                        <input
                            type="text"
                            required
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            placeholder="2180032"
                            className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-semibold focus:ring-2 focus:ring-emerald-600 outline-none"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Correo Institucional</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="ana@correo.uis.edu.co"
                            className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-semibold focus:ring-2 focus:ring-emerald-600 outline-none"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Semestre (1-10)</label>
                        <input
                            type="number"
                            min="1"
                            max="10"
                            required
                            value={formData.semester || 1}
                            onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) || 1 })}
                            className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-center focus:ring-2 focus:ring-emerald-600 outline-none"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Programa Académico</label>
                        <input
                            type="text"
                            required
                            value={formData.program}
                            onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                            placeholder="Ingeniería de Sistemas"
                            className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-600 outline-none"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Créditos Aprobados</label>
                        <input
                            type="number"
                            min="0"
                            required
                            value={formData.passedCredits ?? 0}
                            onChange={(e) => setFormData({ ...formData, passedCredits: parseInt(e.target.value) || 0 })}
                            className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-center focus:ring-2 focus:ring-emerald-600 outline-none"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Promedio Acumulado PGA (0.0 - 5.0)</label>
                        <input
                            type="number"
                            min="0"
                            max="5"
                            step="0.1"
                            required
                            value={formData.pga ?? 0.0}
                            onChange={(e) => setFormData({ ...formData, pga: parseFloat(e.target.value) || 0.0 })}
                            className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-center focus:ring-2 focus:ring-emerald-600 outline-none"
                        />
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                        <label className="text-xs font-bold text-slate-700">Prerrequisitos / Materias Aprobadas</label>
                        <input
                            type="text"
                            value={formData.completedCourses || ''}
                            onChange={(e) => setFormData({ ...formData, completedCourses: e.target.value })}
                            placeholder="Ej. Fundamentos de programación, Cálculo I"
                            className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-600 outline-none"
                        />
                    </div>

                    <div className="sm:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800">Cancelar</button>
                        <button type="submit" className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1">
                            <Check className="w-4 h-4" /> Guardar Estudiante
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};