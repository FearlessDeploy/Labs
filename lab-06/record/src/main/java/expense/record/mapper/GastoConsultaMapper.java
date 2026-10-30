package expense.record.mapper;

import expense.record.dto.request.ListarGastosRequest;
import expense.record.dto.request.RangoFechasRequest;
import expense.record.dto.response.GastoResponse;
import expense.record.dto.response.ListarGastosResponse;
import expense.record.dto.response.PromedioGastosResponse;
import expense.record.dto.response.SumaGastosResponse;
import expense.record.model.Expense;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Mapea solicitudes y respuestas para las consultas de gastos.
 */
@Component
public class GastoConsultaMapper {

    private static final int DEFAULT_PAGE = 0;
    private static final int DEFAULT_SIZE = 10;

    /**
     * Convierte la solicitud de listado en un objeto Pageable.
     *
     * @param request solicitud con datos de paginación
     * @return pageable configurado con orden descendente por fecha
     */
    public Pageable toPageable(ListarGastosRequest request) {
        int page = request.page() == null ? DEFAULT_PAGE : request.page();
        int size = request.size() == null ? DEFAULT_SIZE : request.size();

        return PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "date"));
    }

    /**
     * Convierte un gasto de dominio en su DTO de respuesta.
     *
     * @param expense gasto persistido
     * @return DTO con los datos expuestos
     */
    public GastoResponse toResponse(Expense expense) {
        return new GastoResponse(
                expense.getTitle(),
                expense.getDescription(),
                expense.getDate(),
                expense.getCost()
        );
    }

    /**
     * Convierte una página de gastos en la respuesta paginada.
     *
     * @param page página de gastos obtenida desde el repositorio
     * @return respuesta con contenido y metadatos de paginación
     */
    public ListarGastosResponse toListResponse(Page<Expense> page) {
        List<GastoResponse> gastos = page.getContent()
                .stream()
                .map(this::toResponse)
                .toList();

        return new ListarGastosResponse(
                gastos,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages()
        );
    }

    /**
     * Construye la respuesta de suma para un rango de fechas.
     *
     * @param request rango de fechas consultado
     * @param total suma calculada
     * @return respuesta con la suma total
     */
    public SumaGastosResponse toSumResponse(RangoFechasRequest request, Double total) {
        return new SumaGastosResponse(request.fechaInicio(), request.fechaFin(), total);
    }

    /**
     * Construye la respuesta de promedio para un rango de fechas.
     *
     * @param request rango de fechas consultado
     * @param promedio promedio calculado
     * @return respuesta con el promedio total
     */
    public PromedioGastosResponse toAverageResponse(RangoFechasRequest request, Double promedio) {
        return new PromedioGastosResponse(request.fechaInicio(), request.fechaFin(), promedio);
    }
}