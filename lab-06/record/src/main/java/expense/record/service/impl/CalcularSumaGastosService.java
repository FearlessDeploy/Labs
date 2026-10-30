package expense.record.service.impl;

import expense.record.dto.request.RangoFechasRequest;
import expense.record.dto.response.SumaGastosResponse;
import expense.record.exception.RangoFechasInvalidoException;
import expense.record.mapper.GastoConsultaMapper;
import expense.record.repository.ExpenseRepository;
import expense.record.service.CalcularSumaGastosUseCase;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementación del caso de uso para calcular la suma de gastos en un rango.
 */
@Service
public class CalcularSumaGastosService implements CalcularSumaGastosUseCase {

    private final ExpenseRepository expenseRepository;
    private final GastoConsultaMapper mapper;

    public CalcularSumaGastosService(ExpenseRepository expenseRepository,
                                     GastoConsultaMapper mapper) {
        this.expenseRepository = expenseRepository;
        this.mapper = mapper;
    }

    @Override
    @Transactional(readOnly = true)
    public SumaGastosResponse calculate(RangoFechasRequest request) {
        validarRango(request);
        Double total = expenseRepository.sumarCostosEntreFechas(request.fechaInicio(), request.fechaFin());

        return mapper.toSumResponse(request, total);
    }

    private void validarRango(RangoFechasRequest request) {
        if (request.fechaInicio().isAfter(request.fechaFin())) {
            throw new RangoFechasInvalidoException("La fecha inicial no puede ser mayor que la fecha final.");
        }
    }
}