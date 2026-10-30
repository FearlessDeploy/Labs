package api.blog.domain.exception;

/**
 * Excepción que se lanza cuando ocurre una validación de dominio.
 * DomainValidationException
 */
public class DomainValidationException extends RuntimeException {
    public DomainValidationException(String message) {
        super(message);
    }
}
