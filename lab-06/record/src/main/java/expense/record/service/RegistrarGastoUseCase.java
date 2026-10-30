package expense.record.service;


import expense.record.dto.request.CreateGastoRequest;
import expense.record.dto.response.CreateGastoResponse;

/**
 * Define el contrato para registrar un gasto.
 */
public interface RegistrarGastoUseCase {

    /**
     * Registra un nuevo gasto en el sistema.
     * @param request los datos del gasto a registrar
     * @return la respuesta con los detalles del gasto registrado
     */
    CreateGastoResponse save(CreateGastoRequest request);
}
