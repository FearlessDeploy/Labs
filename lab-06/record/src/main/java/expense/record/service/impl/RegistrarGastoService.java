package expense.record.service.impl;

import expense.record.dto.request.CreateGastoRequest;
import expense.record.dto.response.CreateGastoResponse;
import expense.record.mapper.RegistrarGastoMapper;
import expense.record.model.Expense;
import expense.record.repository.ExpenseRepository;
import expense.record.service.RegistrarGastoUseCase;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementación del caso de uso para registrar gastos.
 */
@Service
public class RegistrarGastoService implements RegistrarGastoUseCase {

    private final ExpenseRepository expenseRepository;
    private final RegistrarGastoMapper mapper;

    public RegistrarGastoService(ExpenseRepository expenseRepository,
                                 RegistrarGastoMapper mapper) {
        this.expenseRepository = expenseRepository;
        this.mapper = mapper;
    }

    @Override
    @Transactional
    public CreateGastoResponse save(CreateGastoRequest request) {
        Expense expense = expenseRepository.save(mapper.toDomain(request));

        return mapper.toResponse(expense);
    }
}
