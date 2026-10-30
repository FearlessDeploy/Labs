package expense.record.mapper;

import expense.record.dto.request.CreateGastoRequest;
import expense.record.dto.response.CreateGastoResponse;
import expense.record.model.Expense;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class RegistrarGastoMapper {

    public Expense toDomain(CreateGastoRequest request){
        Expense expense = new Expense();
        expense.setTitle(request.title());
        if(request.description() != null && !request.description().isBlank()){
            expense.setDescription(request.description());
        }
        if(request.date() != null && !request.date().isBlank()){
            LocalDate fecha = LocalDate.parse(request.date());
            expense.setDate(fecha);
        }
        expense.setCost(request.cost());
        return expense;
    }

    public CreateGastoResponse toResponse(Expense expense){
        return new CreateGastoResponse(
                expense.getTitle(),
                expense.getDescription(),
                expense.getDate(),
                expense.getCost()
        );
    }
}
