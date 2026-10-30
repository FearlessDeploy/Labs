package app.wired.domain.exception;

/**
 * Excepción lanzada cuando no se encuentra un enlace corto.
 * NotFoundLinkException
 */
public class NotFoundLinkException extends RuntimeException {
    public NotFoundLinkException(String message) {
        super(message);
    }
}
