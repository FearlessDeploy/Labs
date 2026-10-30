import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api, getErrorMessage } from '../api/axios';
import { StudentModal } from '../components/StudentModal';
import { CourseManagement } from '../components/CourseManagement';
import { ConfirmModal } from '../components/ConfirmModal';
import { Navbar } from '../components/Navbar';
import { Users, Plus, Search, Trash2, Edit3, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';

export const Dashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('students');
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');
    const [showStudentModal, setShowStudentModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [deleteTargetStudent, setDeleteTargetStudent] = useState(null);

    useEffect(() => {
        fetchStudents();
    }, [search]);

    const fetchStudents = async () => {
        try {
            const res = await api.get(`/students?search=${search}`);
            setStudents(res.data.data.content || []);
        } catch (error) {
            toast.error('Error cargando lista de estudiantes');
        }
    };

    const handleSaveStudent = async (formData) => {
        try {
            if (selectedStudent) {
                await api.put(`/students/${selectedStudent.id}`, formData);
                toast.success('Estudiante actualizado exitosamente');
            } else {
                await api.post('/students', formData);
                toast.success('Estudiante registrado exitosamente');
            }
            setShowStudentModal(false);
            setSelectedStudent(null);
            fetchStudents();
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleDeleteStudent = async () => {
        if (!deleteTargetStudent) return;
        try {
            await api.delete(`/students/${deleteTargetStudent.id}`);
            toast.success('Estudiante eliminado');
            fetchStudents();
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
            <Navbar />

            {/* Subheader Pestañas */}
            <div className="bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 flex gap-4">
                    <button
                        onClick={() => setActiveTab('students')}
                        className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${activeTab === 'students' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                    >
                        <Users className="w-4 h-4" /> Directorio de Estudiantes
                    </button>
                    <button
                        onClick={() => setActiveTab('courses')}
                        className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${activeTab === 'courses' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                    >
                        <GraduationCap className="w-4 h-4" /> Asignaturas e Inscripciones
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full space-y-6">
                {activeTab === 'students' ? (
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="relative flex-1 max-w-md">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Buscar por código o nombre..."
                                    className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-600 outline-none"
                                />
                            </div>

                            <button
                                onClick={() => { setSelectedStudent(null); setShowStudentModal(true); }}
                                className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 rounded-xl shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-1.5"
                            >
                                <Plus className="w-4 h-4" /> Nuevo Estudiante
                            </button>
                        </div>

                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                                        <tr>
                                            <th className="p-4">Estudiante</th>
                                            <th className="p-4 text-center">Código</th>
                                            <th className="p-4 text-center">Semestre</th>
                                            <th className="p-4">Programa</th>
                                            <th className="p-4 text-center">PGA</th>
                                            <th className="p-4 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 font-semibold">
                                        {students.length === 0 ? (
                                            <tr><td colSpan="6" className="p-12 text-center text-slate-400 italic">No hay estudiantes registrados.</td></tr>
                                        ) : (
                                            students.map(st => (
                                                <tr key={st.id} className="hover:bg-slate-50">
                                                    <td className="p-4">
                                                        <span className="font-bold text-slate-900 block">{st.firstName} {st.lastName}</span>
                                                        <span className="font-mono text-[10px] text-slate-400">{st.email}</span>
                                                    </td>
                                                    <td className="p-4 text-center font-mono font-bold text-slate-700">{st.code}</td>
                                                    <td className="p-4 text-center">
                                                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold text-[10px] border border-slate-200">
                                                            Sem {st.semester}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-slate-600">{st.program}</td>
                                                    <td className="p-4 text-center font-mono font-bold text-emerald-600 text-sm">{st.pga}</td>
                                                    <td className="p-4 text-right">
                                                        <div className="flex justify-end gap-1">
                                                            <button
                                                                onClick={() => { setSelectedStudent(st); setShowStudentModal(true); }}
                                                                className="text-slate-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-slate-100"
                                                                title="Editar Estudiante"
                                                            >
                                                                <Edit3 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => setDeleteTargetStudent(st)}
                                                                className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50"
                                                                title="Eliminar Estudiante"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    <CourseManagement students={students} />
                )}
            </main>

            <StudentModal
                isOpen={showStudentModal}
                onClose={() => setShowStudentModal(false)}
                onSave={handleSaveStudent}
                student={selectedStudent}
            />

            <ConfirmModal
                isOpen={!!deleteTargetStudent}
                onClose={() => setDeleteTargetStudent(null)}
                onConfirm={handleDeleteStudent}
                title="Eliminar Estudiante"
                message={`¿Estás seguro de eliminar a ${deleteTargetStudent?.firstName} ${deleteTargetStudent?.lastName}?`}
            />

            <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-400 mt-auto">
                Portal Académico UIS v1.0.0 - Three-Tier Test App para Fearless Deploy © 2026
            </footer>
        </div>
    );
};