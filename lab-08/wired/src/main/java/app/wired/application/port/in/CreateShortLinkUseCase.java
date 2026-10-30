package app.wired.application.port.in;

/**
 * Caso de uso para crear enlaces cortos.
 * CreateShortLinkUseCase
 */
public interface CreateShortLinkUseCase {

    /*
     * Crea un enlace corto a partir de una URL original.
     * @param originalUrl La URL original.
     * @return El enlace corto generado.
     */
    String create(String originalUrl);
}
