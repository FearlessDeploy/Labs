import { useState, useEffect } from 'react';
import { api, getErrorMessage } from '../api/axios';
import { BookOpen, Plus, Trash2, UserPlus, UserMinus, Users, Check, Edit3 } from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';
import { z } from 'zod';
import toast from 'react-hot-toast';

// Esquema Zod de Asignatura
const courseSchema = z.object({
    code: z.string().regex(/^[A-Za-z]{2,4}\d{2,4}$/, { message: "Mínimo 2 letras máximo 4, mínimo 2 números máximo 4 (ej: SOFT301, BD401)" }),
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    credits: z.number().min(1, "Mínimo 1 crédito").max(10, "Máximo 10 créditos"),
    description: z.string().optional()
});

export const CourseManagement = ({ students }) => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);

    // Estados Modal Confirmación
    const [deleteTarget, setDeleteTarget] = useState(null);

    const [courseForm, setCourseForm] = useState({ code: '', name: '', credits: 4, description: '' });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await api.get('/courses');
            const list = res.data.data || [];
            setCourses(list);
            if (list.length > 0 && !selectedCourse) {
                selectCourse(list[0]);
            }
        } catch (error) {
            toast.error('Error cargando asignaturas');
        }
    };

    const selectCourse = async (course) => {
        setSelectedCourse(course);
        try {
            const res = await api.get(`/courses/${course.id}/students`);
            setEnrolledStudents(res.data.data || []);
        } catch (error) {
            toast.error('Error cargando lista de matriculados');
        }
    };

    const openModal = (course = null) => {
        if (course) {
            setEditingCourse(course);
            setCourseForm({
                code: course.code,
                name: course.name,
                credits: course.credits,
                description: course.description || ''
            });
        } else {
            setEditingCourse(null);
            setCourseForm({ code: '', name: '', credits: 4, description: '' });
        }
        setShowCourseModal(true);
    };

    const handleSaveCourse = async (e) => {
        e.preventDefault();

        // Validación Zod
        const validation = courseSchema.safeParse(courseForm);
        if (!validation.success) {
            const issues = validation.error.issues || [];
            const errorMsg = issues.map(err => err.message).join(' | ') || 'Error de validación';
            toast.error(errorMsg);
            return;
        }

        try {
            if (editingCourse) {
                const res = await api.put(`/courses/${editingCourse.id}`, courseForm);
                const updatedCourse = res.data.data;

                toast.success('Asignatura actualizada con éxito');
                if (selectedCourse?.id === editingCourse.id) {
                    setSelectedCourse(updatedCourse);
                }
            } else {
                const res = await api.post('/courses', courseForm);
                toast.success('Asignatura creada con éxito');

                if (!selectedCourse) {
                    setSelectedCourse(res.data.data);
                }
            }
            setShowCourseModal(false);
            fetchCourses();
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleDeleteCourse = async () => {
        if (!deleteTarget) return;
        try {
            await api.delete(`/courses/${deleteTarget.id}`);
            toast.success('Asignatura eliminada');
            setSelectedCourse(null);
            fetchCourses();
        } catch (error) {
            console.error("Error completo recibido:", error.response?.data);
            const backendMessage = getErrorMessage(error);
            if (backendMessage === 'Error en la petición al servidor') {
                toast.error('No puede eliminar la asignatura porque tiene estudiantes matriculados');
            } else {
                toast.error(backendMessage);
            }
        } finally {
            setDeleteTarget(null);
        }
    };

    const handleEnroll = async (studentId) => {
        if (!selectedCourse) return;
        try {
            await api.post(`/courses/${selectedCourse.id}/enroll/${studentId}`);
            toast.success('Estudiante matriculado');
            selectCourse(selectedCourse);
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleUnenroll = async (studentId) => {
        if (!selectedCourse) return;
        try {
            await api.delete(`/courses/${selectedCourse.id}/unenroll/${studentId}`);
            toast.success('Estudiante retirado de la materia');
            selectCourse(selectedCourse);
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Lista de Asignaturas (Izquierda) */}
            <div className="lg:col-span-4 space-y-4">
                <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-emerald-600" /> Plan de Estudios UIS
                    </h3>
                    <button
                        onClick={() => openModal(null)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1"
                    >
                        <Plus className="w-3.5 h-3.5" /> Nueva Materia
                    </button>
                </div>

                <div className="space-y-2">
                    {courses.map(course => (
                        <div
                            key={course.id}
                            onClick={() => selectCourse(course)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${selectedCourse?.id === course.id
                                ? 'bg-emerald-50/80 border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                                : 'bg-white border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            <div>
                                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                                    {course.code} ({course.credits} Cr)
                                </span>
                                <h4 className="font-extrabold text-slate-900 text-sm mt-1">{course.name}</h4>
                            </div>

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={(e) => { e.stopPropagation(); openModal(course); }}
                                    className="text-slate-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-slate-100"
                                    title="Editar Asignatura"
                                >
                                    <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setDeleteTarget(course); }}
                                    className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50"
                                    title="Eliminar Asignatura"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detalle y Matriculados (Derecha) */}
            <div className="lg:col-span-8 space-y-6">
                {selectedCourse ? (
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                            <div>
                                <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                                    {selectedCourse.code} • {selectedCourse.credits} Créditos
                                </span>
                                <h2 className="text-2xl font-black text-slate-900 mt-2">{selectedCourse.name}</h2>
                                <p className="text-xs text-slate-500 mt-1">{selectedCourse.description || 'Sin descripción asignada.'}</p>
                            </div>

                            <span className="bg-slate-100 text-slate-700 font-mono font-bold text-xs px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5">
                                <Users className="w-4 h-4 text-emerald-600" /> {enrolledStudents.length} Matriculados
                            </span>
                        </div>

                        {/* Tabla de Matriculados */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Estudiantes Inscritos en esta Asignatura</h4>

                            <div className="border border-slate-200 rounded-2xl overflow-hidden">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                                        <tr>
                                            <th className="p-3">Estudiante</th>
                                            <th className="p-3 text-center">Código</th>
                                            <th className="p-3 text-center">PGA</th>
                                            <th className="p-3 text-right">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 font-semibold">
                                        {enrolledStudents.length === 0 ? (
                                            <tr><td colSpan="4" className="p-6 text-center text-slate-400 italic">No hay estudiantes matriculados en esta materia.</td></tr>
                                        ) : (
                                            enrolledStudents.map(s => (
                                                <tr key={s.id} className="hover:bg-slate-50">
                                                    <td className="p-3 font-bold text-slate-900">{s.firstName} {s.lastName}</td>
                                                    <td className="p-3 text-center font-mono">{s.code}</td>
                                                    <td className="p-3 text-center font-mono font-bold text-emerald-600">{s.pga}</td>
                                                    <td className="p-3 text-right">
                                                        <button
                                                            onClick={() => handleUnenroll(s.id)}
                                                            className="text-red-600 hover:bg-red-50 px-2.5 py-1 rounded-lg border border-red-200 font-bold text-[10px] flex items-center gap-1 ml-auto"
                                                        >
                                                            <UserMinus className="w-3 h-3" /> Retirar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Inscribir Estudiantes Disponibles */}
                        <div className="pt-4 border-t border-slate-100 space-y-3">
                            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Matricular Estudiantes del Directorio</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {students.filter(st => !enrolledStudents.some(es => es.id === st.id)).map(st => (
                                    <div key={st.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                                        <div>
                                            <span className="font-bold text-slate-900 block">{st.firstName} {st.lastName}</span>
                                            <span className="font-mono text-[10px] text-slate-500">Cod: {st.code}</span>
                                        </div>
                                        <button
                                            onClick={() => handleEnroll(st.id)}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1"
                                        >
                                            <UserPlus className="w-3 h-3" /> Matricular
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400 italic">
                        Selecciona una asignatura a la izquierda para gestionar sus inscritos.
                    </div>
                )}
            </div>

            {/* Modal Crear / Editar Materia */}
            {showCourseModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-4">
                        <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
                            {editingCourse ? 'Editar Asignatura' : 'Nueva Asignatura'}
                        </h3>
                        <form onSubmit={handleSaveCourse} className="space-y-3">
                            <div>
                                <label className="text-xs font-bold text-slate-700">Código (ej: SOFT301)</label>
                                <input
                                    type="text"
                                    required
                                    value={courseForm.code}
                                    onChange={e => setCourseForm({ ...courseForm, code: e.target.value.toUpperCase() })}
                                    placeholder="SOFT301"
                                    className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-700">Nombre Asignatura</label>
                                <input
                                    type="text"
                                    required
                                    value={courseForm.name}
                                    onChange={e => setCourseForm({ ...courseForm, name: e.target.value })}
                                    placeholder="Software 1"
                                    className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-700">Créditos (1 a 10)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    required
                                    value={courseForm.credits || 1}
                                    onChange={e => setCourseForm({ ...courseForm, credits: parseInt(e.target.value) || 1 })}
                                    className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-center"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-700">Descripción (Opcional)</label>
                                <textarea
                                    value={courseForm.description}
                                    onChange={e => setCourseForm({ ...courseForm, description: e.target.value })}
                                    placeholder="Descripción de la materia..."
                                    className="w-full h-20 p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium resize-none"
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-3">
                                <button type="button" onClick={() => setShowCourseModal(false)} className="px-4 py-2 text-xs font-bold text-slate-500">Cancelar</button>
                                <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1">
                                    <Check className="w-4 h-4" /> Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Confirmación de Eliminación */}
            <ConfirmModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDeleteCourse}
                title="Eliminar Asignatura"
                message={`¿Estás seguro de eliminar la materia ${deleteTarget?.name}?`}
            />

        </div>
    );
};