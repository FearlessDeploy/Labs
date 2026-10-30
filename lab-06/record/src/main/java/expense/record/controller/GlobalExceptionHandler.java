package expense.record.controller;

import expense.record.dto.response.ApiErrorResponse;
import expense.record.exception.RangoFechasInvalidoException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Maneja errores de validación en los parámetros enlazados por Spring.
     *
     * @param exception excepción de enlace de parámetros
     * @return respuesta de error con estado 400
     */
    @org.springframework.web.bind.annotation.ExceptionHandler({BindException.class, MethodArgumentNotValidException.class})
    public ResponseEntity<ApiErrorResponse> handleValidationExceptions(Exception exception) {
	String message;

	if (exception instanceof BindException bindException) {
	    message = bindException.getBindingResult()
		    .getAllErrors()
		    .stream()
		    .map(error -> error.getDefaultMessage())
		    .collect(Collectors.joining(", "));
	} else {
	    MethodArgumentNotValidException validationException = (MethodArgumentNotValidException) exception;
	    message = validationException.getBindingResult()
		    .getAllErrors()
		    .stream()
		    .map(error -> error.getDefaultMessage())
		    .collect(Collectors.joining(", "));
	}

	return ResponseEntity.status(HttpStatus.BAD_REQUEST)
		.body(new ApiErrorResponse(Instant.now(),
			HttpStatus.BAD_REQUEST.value(),
			"VALIDACION",
			message));
    }

    /**
     * Maneja errores de negocio relacionados con el rango de fechas.
     *
     * @param exception excepción de negocio
     * @return respuesta de error con estado 400
     */
    @org.springframework.web.bind.annotation.ExceptionHandler(RangoFechasInvalidoException.class)
    public ResponseEntity<ApiErrorResponse> handleRangoFechasInvalido(RangoFechasInvalidoException exception) {
	return ResponseEntity.status(HttpStatus.BAD_REQUEST)
		.body(new ApiErrorResponse(Instant.now(),
			HttpStatus.BAD_REQUEST.value(),
			"RANGO_INVALIDO",
			exception.getMessage()));
    }

    /**
     * Maneja cualquier error no contemplado para evitar respuestas sin formato.
     *
     * @param exception error inesperado
     * @return respuesta de error con estado 500
     */
    @org.springframework.web.bind.annotation.ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGenericException(Exception exception) {
	return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
		.body(new ApiErrorResponse(Instant.now(),
			HttpStatus.INTERNAL_SERVER_ERROR.value(),
			"ERROR_INTERNO",
			exception.getMessage()));
    }
}
