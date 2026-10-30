package expense.record.service;

import expense.record.dto.request.RangoFechasRequest;
import expense.record.dto.response.SumaGastosResponse;

/**
 * Define el contrato para calcular la suma de gastos en un rango de fechas.
 */
public interface CalcularSumaGastosUseCase {

	/**
	 * Calcula la suma total de gastos dentro del rango indicado.
	 *
	 * @param request rango de fechas a consultar
	 * @return suma total de los costos encontrados
	 */
	SumaGastosResponse calculate(RangoFechasRequest request);
}
