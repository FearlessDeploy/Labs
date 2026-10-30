package expense.record.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDate;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record CreateGastoResponse(
        String title,
        String Description,
        LocalDate date,
        Double cost
){}
