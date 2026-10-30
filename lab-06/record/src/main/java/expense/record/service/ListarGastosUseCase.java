package expense.record.service;

import expense.record.dto.request.ListarGastosRequest;
import expense.record.dto.response.ListarGastosResponse;

/**
 * Define el contrato para listar gastos de forma paginada.
 */
public interface ListarGastosUseCase {

	/**
	 * Obtiene una página de gastos según los parámetros recibidos.
	 *
	 * @param request datos de paginación solicitados
	 * @return página de gastos con su metadato
	 */
	ListarGastosResponse list(ListarGastosRequest request);
}
