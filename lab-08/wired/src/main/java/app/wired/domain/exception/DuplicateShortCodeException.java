package app.wired.domain.exception;

/**
 * Excepción lanzada cuando ocurre un error de validación en el dominio.
 * DuplicateShortCodeException
 */
public class DuplicateShortCodeException extends RuntimeException {
    public DuplicateShortCodeException(String message) {
        super(message);
    }
}
