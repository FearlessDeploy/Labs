package app.wired.domain.exception;

/**
 * Excepción lanzada cuando ocurre un error de validación en el dominio.
 * DomainValidationException
 */
public class DomainValidationException extends RuntimeException {
    public DomainValidationException(String message) {
        super(message);
    }
}
