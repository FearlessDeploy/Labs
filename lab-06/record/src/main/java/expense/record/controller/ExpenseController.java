package expense.record.controller;

import expense.record.dto.request.ListarGastosRequest;
import expense.record.dto.request.RangoFechasRequest;
import expense.record.dto.request.CreateGastoRequest;
import expense.record.dto.response.ListarGastosResponse;
import expense.record.dto.response.CreateGastoResponse;
import expense.record.dto.response.PromedioGastosResponse;
import expense.record.dto.response.SumaGastosResponse;
import expense.record.service.CalcularPromedioGastosUseCase;
import expense.record.service.CalcularSumaGastosUseCase;
import expense.record.service.ListarGastosUseCase;
import expense.record.service.RegistrarGastoUseCase;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador REST para la gestión de gastos.
 */
@RestController
@RequestMapping("api/v1/expense")
public class ExpenseController {

    private final RegistrarGastoUseCase registrarGastoUseCase;
    private final ListarGastosUseCase listarGastosUseCase;
    private final CalcularSumaGastosUseCase calcularSumaGastosUseCase;
    private final CalcularPromedioGastosUseCase calcularPromedioGastosUseCase;

    public ExpenseController(RegistrarGastoUseCase registrarGastoUseCase,
                             ListarGastosUseCase listarGastosUseCase,
                             CalcularSumaGastosUseCase calcularSumaGastosUseCase,
                             CalcularPromedioGastosUseCase calcularPromedioGastosUseCase) {
        this.registrarGastoUseCase = registrarGastoUseCase;
        this.listarGastosUseCase = listarGastosUseCase;
        this.calcularSumaGastosUseCase = calcularSumaGastosUseCase;
        this.calcularPromedioGastosUseCase = calcularPromedioGastosUseCase;
    }

    /**
     * Registra un nuevo gasto.
     *
     * @param request datos del gasto a crear
     * @return gasto creado
     */
    @PostMapping("/create")
    public ResponseEntity<CreateGastoResponse> create(
            @Valid @RequestBody CreateGastoRequest request){
        CreateGastoResponse response = registrarGastoUseCase.save(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(response);
    }

    /**
     * Lista los gastos de forma paginada.
     *
     * @param request datos de paginación
     * @return página de gastos
     */
    @GetMapping
    public ResponseEntity<ListarGastosResponse> list(@Valid @ModelAttribute ListarGastosRequest request) {
        return ResponseEntity.ok(listarGastosUseCase.list(request));
    }

    /**
     * Calcula la suma total de gastos para un rango de fechas.
     *
     * @param request rango de fechas a consultar
     * @return suma total
     */
    @GetMapping("/sum")
    public ResponseEntity<SumaGastosResponse> sum(@Valid @ModelAttribute RangoFechasRequest request) {
        return ResponseEntity.ok(calcularSumaGastosUseCase.calculate(request));
    }

    /**
     * Calcula el promedio de gastos para un rango de fechas.
     *
     * @param request rango de fechas a consultar
     * @return promedio total
     */
    @GetMapping("/average")
    public ResponseEntity<PromedioGastosResponse> average(@Valid @ModelAttribute RangoFechasRequest request) {
        return ResponseEntity.ok(calcularPromedioGastosUseCase.calculate(request));
    }
}
