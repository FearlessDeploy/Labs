package expense.record.service;

import expense.record.dto.request.RangoFechasRequest;
import expense.record.dto.response.PromedioGastosResponse;

/**
 * Define el contrato para calcular el promedio de gastos en un rango de fechas.
 */
public interface CalcularPromedioGastosUseCase {

	/**
	 * Calcula el promedio de los gastos dentro del rango indicado.
	 *
	 * @param request rango de fechas a consultar
	 * @return promedio de los costos encontrados
	 */
	PromedioGastosResponse calculate(RangoFechasRequest request);
}
