package expense.record.service.impl;

import expense.record.dto.request.RangoFechasRequest;
import expense.record.dto.response.PromedioGastosResponse;
import expense.record.exception.RangoFechasInvalidoException;
import expense.record.mapper.GastoConsultaMapper;
import expense.record.repository.ExpenseRepository;
import expense.record.service.CalcularPromedioGastosUseCase;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementación del caso de uso para calcular el promedio de gastos en un rango.
 */
@Service
public class CalcularPromedioGastosService implements CalcularPromedioGastosUseCase {

    private final ExpenseRepository expenseRepository;
    private final GastoConsultaMapper mapper;

    public CalcularPromedioGastosService(ExpenseRepository expenseRepository,
                                         GastoConsultaMapper mapper) {
        this.expenseRepository = expenseRepository;
        this.mapper = mapper;
    }

    @Override
    @Transactional(readOnly = true)
    public PromedioGastosResponse calculate(RangoFechasRequest request) {
        validarRango(request);
        Double promedio = expenseRepository.promedioCostosEntreFechas(request.fechaInicio(), request.fechaFin());

        return mapper.toAverageResponse(request, promedio);
    }

    private void validarRango(RangoFechasRequest request) {
        if (request.fechaInicio().isAfter(request.fechaFin())) {
            throw new RangoFechasInvalidoException("La fecha inicial no puede ser mayor que la fecha final.");
        }
    }
}