package expense.record.service.impl;

import expense.record.dto.request.ListarGastosRequest;
import expense.record.dto.response.ListarGastosResponse;
import expense.record.mapper.GastoConsultaMapper;
import expense.record.repository.ExpenseRepository;
import expense.record.service.ListarGastosUseCase;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementación del caso de uso para listar gastos de forma paginada.
 */
@Service
public class ListarGastosService implements ListarGastosUseCase {

    private final ExpenseRepository expenseRepository;
    private final GastoConsultaMapper mapper;

    public ListarGastosService(ExpenseRepository expenseRepository,
                               GastoConsultaMapper mapper) {
        this.expenseRepository = expenseRepository;
        this.mapper = mapper;
    }

    @Override
    @Transactional(readOnly = true)
    public ListarGastosResponse list(ListarGastosRequest request) {
        return mapper.toListResponse(expenseRepository.findAll(mapper.toPageable(request)));
    }
}