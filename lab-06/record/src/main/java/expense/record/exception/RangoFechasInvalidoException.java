package expense.record.exception;

/**
 * Se lanza cuando el rango de fechas recibido no es válido.
 */
public class RangoFechasInvalidoException extends RuntimeException {

    public RangoFechasInvalidoException(String message) {
        super(message);
    }
}