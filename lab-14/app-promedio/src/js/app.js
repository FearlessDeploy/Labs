// Carga de datos desde localStorage con valores por defecto para primera sesión
let cuts = JSON.parse(localStorage.getItem('uis_cuts')) || [
    { id: 1, name: 'Parcial 1', weight: 30, grade: 2.5 },
    { id: 2, name: 'Parcial 2', weight: 30, grade: null },
    { id: 3, name: 'Proyecto Final', weight: 40, grade: null }
];

let semestralSubjects = JSON.parse(localStorage.getItem('uis_semestral')) || [
    { id: 1, name: 'Cálculo II', credits: 4, grade: 3.8 },
    { id: 2, name: 'Física II', credits: 4, grade: 4.2 }
];

let gpaChartInstance = null;
lucide.createIcons();

// Manejo de pestañas principales (Materia / Promedio Semestral)
const tabCourseBtn = document.getElementById('tab-course-btn');
const tabGpaBtn = document.getElementById('tab-gpa-btn');
const sectionCourse = document.getElementById('section-course');
const sectionGpa = document.getElementById('section-gpa');

tabCourseBtn.addEventListener('click', () => {
    sectionCourse.classList.remove('hidden');
    sectionGpa.classList.add('hidden');
    tabCourseBtn.className = 'px-4 py-1.5 rounded-lg bg-white text-slate-900 shadow-sm transition-all flex items-center gap-1.5 font-bold';
    tabGpaBtn.className = 'px-4 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 transition-all flex items-center gap-1.5 font-semibold';
});

tabGpaBtn.addEventListener('click', () => {
    sectionGpa.classList.remove('hidden');
    sectionCourse.classList.add('hidden');
    tabGpaBtn.className = 'px-4 py-1.5 rounded-lg bg-white text-slate-900 shadow-sm transition-all flex items-center gap-1.5 font-bold';
    tabCourseBtn.className = 'px-4 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 transition-all flex items-center gap-1.5 font-semibold';
    calculateGPA();
});

// Elementos DOM para la vista de cortes por materia
const cutForm = document.getElementById('cut-form');
const cutNameInput = document.getElementById('cut-name');
const cutWeightInput = document.getElementById('cut-weight');
const cutGradeInput = document.getElementById('cut-grade');
const targetGradeInput = document.getElementById('target-grade');
const cutsList = document.getElementById('cuts-list');
const totalWeightBadge = document.getElementById('total-weight-badge');

const neededGradeDisplay = document.getElementById('needed-grade');
const accumulatedGradeDisplay = document.getElementById('accumulated-grade');
const remainingWeightDisplay = document.getElementById('remaining-weight');
const courseStatusBadge = document.getElementById('course-status-badge');
const predictionMsg = document.getElementById('prediction-msg');

/**
 * Calcula los puntos acumulados y determina la nota promedio requerida
 * en el porcentaje faltante para alcanzar la nota objetivo.
 */
function calculateCoursePrediction() {
    const targetGrade = parseFloat(targetGradeInput.value) || 3.0;
    let accumulatedPoints = 0;
    let evaluatedWeight = 0;
    let totalWeight = 0;

    cuts.forEach(c => {
        totalWeight += c.weight;
        if (c.grade !== null && !isNaN(c.grade)) {
            accumulatedPoints += (c.grade * (c.weight / 100));
            evaluatedWeight += c.weight;
        }
    });

    const remainingWeight = 100 - evaluatedWeight;
    accumulatedGradeDisplay.textContent = accumulatedPoints.toFixed(2);
    remainingWeightDisplay.textContent = `${remainingWeight}%`;
    totalWeightBadge.textContent = `${totalWeight}% de 100%`;

    // Si ya se evaluó el 100% de la materia
    if (remainingWeight <= 0) {
        neededGradeDisplay.textContent = accumulatedPoints >= targetGrade ? '0.0' : 'N/A';
        if (accumulatedPoints >= targetGrade) {
            courseStatusBadge.textContent = 'Materia Aprobada';
            courseStatusBadge.className = 'px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
            predictionMsg.textContent = `¡Felicitaciones! Has finalizado la materia aprobando con ${accumulatedPoints.toFixed(2)}.`;
        } else {
            courseStatusBadge.textContent = 'Reprobada';
            courseStatusBadge.className = 'px-3 py-1 rounded-full text-xs font-extrabold bg-red-500/20 text-red-300 border border-red-500/30';
            predictionMsg.textContent = `La materia ha finalizado. La nota definitiva es ${accumulatedPoints.toFixed(2)}.`;
        }
        return;
    }

    const pointsNeeded = targetGrade - accumulatedPoints;
    const gradeNeeded = (pointsNeeded / (remainingWeight / 100));

    // Determina el estado del estudiante según la nota requerida
    if (pointsNeeded <= 0) {
        neededGradeDisplay.textContent = '0.0';
        courseStatusBadge.textContent = 'Ya Aprobaste';
        courseStatusBadge.className = 'px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
        predictionMsg.textContent = `Con tu acumulado actual de ${accumulatedPoints.toFixed(2)} ya aseguraste aprobar la materia con ${targetGrade}.`;
    } else if (gradeNeeded > 5.0) {
        neededGradeDisplay.textContent = gradeNeeded.toFixed(2);
        courseStatusBadge.textContent = 'Imposible Aprobar';
        courseStatusBadge.className = 'px-3 py-1 rounded-full text-xs font-extrabold bg-red-500/20 text-red-300 border border-red-500/30';
        predictionMsg.textContent = `Necesitas ${gradeNeeded.toFixed(2)} en el ${remainingWeight}% faltante. Supera el tope máximo de 5.0.`;
    } else {
        neededGradeDisplay.textContent = gradeNeeded.toFixed(2);
        courseStatusBadge.textContent = 'Alcanzable';
        courseStatusBadge.className = 'px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30';
        predictionMsg.textContent = `Necesitas sacar un promedio de ${gradeNeeded.toFixed(2)} en el ${remainingWeight}% faltante para lograr la meta de ${targetGrade}.`;
    }
}

// Renderiza la lista HTML de parciales agregados
function renderCuts() {
    cutsList.innerHTML = '';
    if (cuts.length === 0) {
        cutsList.innerHTML = `<tr><td colspan="4" class="p-6 text-center text-slate-400 italic">No hay evaluaciones registradas.</td></tr>`;
        return;
    }

    cuts.forEach(c => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50 transition-colors';
        const gradeText = c.grade !== null ? c.grade.toFixed(1) : '<span class="text-amber-500 italic">Pendiente</span>';
        tr.innerHTML = `
            <td class="p-3.5 font-bold text-slate-900">${c.name}</td>
            <td class="p-3.5 text-center font-mono font-semibold">${c.weight}%</td>
            <td class="p-3.5 text-center font-mono font-bold">${gradeText}</td>
            <td class="p-3.5 text-right">
                <button onclick="deleteCut(${c.id})" class="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50" title="Eliminar">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </td>
        `;
        cutsList.appendChild(tr);
    });
    lucide.createIcons();
}

cutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const weightVal = parseInt(cutWeightInput.value);
    const gradeVal = cutGradeInput.value !== '' ? parseFloat(cutGradeInput.value) : null;

    const newCut = {
        id: Date.now(),
        name: cutNameInput.value.trim(),
        weight: weightVal,
        grade: gradeVal
    };

    cuts.push(newCut);
    localStorage.setItem('uis_cuts', JSON.stringify(cuts));
    cutNameInput.value = '';
    cutWeightInput.value = '';
    cutGradeInput.value = '';

    renderCuts();
    calculateCoursePrediction();
});

targetGradeInput.addEventListener('input', calculateCoursePrediction);

// Se expone en el scope global para invocación desde los handlers onclick del HTML
window.deleteCut = function (id) {
    cuts = cuts.filter(c => c.id !== id);
    localStorage.setItem('uis_cuts', JSON.stringify(cuts));
    renderCuts();
    calculateCoursePrediction();
};

// Elementos DOM para la calculadora de promedio semestral
const gpaForm = document.getElementById('gpa-form');
const gpaSubjectInput = document.getElementById('gpa-subject-name');
const gpaCreditsInput = document.getElementById('gpa-credits');
const gpaGradeInput = document.getElementById('gpa-grade');
const gpaList = document.getElementById('gpa-list');
const gpaVal = document.getElementById('gpa-val');
const gpaCount = document.getElementById('gpa-count');
const gpaTotalCredits = document.getElementById('gpa-total-credits');
const gpaTotalSubjects = document.getElementById('gpa-total-subjects');

/**
 * Calcula el promedio ponderado del semestre: sum(nota * créditos) / sum(créditos).
 */
function calculateGPA() {
    if (semestralSubjects.length === 0) {
        gpaVal.textContent = '0.0';
        gpaTotalCredits.textContent = '0';
        gpaTotalSubjects.textContent = '0';
        gpaCount.textContent = '0 materias';
        renderGPAList();
        updateGPAChart();
        return;
    }

    let points = 0;
    let credits = 0;
    semestralSubjects.forEach(s => {
        points += s.grade * s.credits;
        credits += s.credits;
    });

    gpaVal.textContent = (points / credits).toFixed(2);
    gpaTotalCredits.textContent = credits;
    gpaTotalSubjects.textContent = semestralSubjects.length;
    gpaCount.textContent = `${semestralSubjects.length} materias`;

    renderGPAList();
    updateGPAChart();
}

function renderGPAList() {
    gpaList.innerHTML = '';
    semestralSubjects.forEach(s => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="p-3.5 font-bold text-slate-900">${s.name}</td>
            <td class="p-3.5 text-center font-mono">${s.credits}</td>
            <td class="p-3.5 text-center font-mono font-bold ${s.grade >= 3.0 ? 'text-emerald-600' : 'text-red-600'}">${s.grade.toFixed(1)}</td>
            <td class="p-3.5 text-right">
                <button onclick="deleteGPASubject(${s.id})" class="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </td>
        `;
        gpaList.appendChild(tr);
    });
    lucide.createIcons();
}

gpaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    semestralSubjects.push({
        id: Date.now(),
        name: gpaSubjectInput.value.trim(),
        credits: parseInt(gpaCreditsInput.value),
        grade: parseFloat(gpaGradeInput.value)
    });
    localStorage.setItem('uis_semestral', JSON.stringify(semestralSubjects));
    gpaSubjectInput.value = '';
    gpaGradeInput.value = '';
    calculateGPA();
});

// Se expone en el scope global para invocación desde los handlers onclick del HTML
window.deleteGPASubject = function (id) {
    semestralSubjects = semestralSubjects.filter(s => s.id !== id);
    localStorage.setItem('uis_semestral', JSON.stringify(semestralSubjects));
    calculateGPA();
};

/**
 * Renderiza el gráfico de barras del rendimiento semestral con Chart.js.
 * Destruye la instancia previa antes de crear una nueva para reutilizar el canvas sin fugas.
 */
function updateGPAChart() {
    const ctx = document.getElementById('gpa-chart').getContext('2d');
    if (gpaChartInstance) gpaChartInstance.destroy();

    gpaChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: semestralSubjects.map(s => s.name),
            datasets: [{
                data: semestralSubjects.map(s => s.grade),
                backgroundColor: semestralSubjects.map(s => s.grade >= 3.0 ? '#2563eb' : '#ef4444'),
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { min: 0, max: 5 } },
            plugins: { legend: { display: false } }
        }
    });
}

// Carga e inicialización inicial de datos
renderCuts();
calculateCoursePrediction();