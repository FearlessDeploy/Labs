package app.wired.application.port.in;

/**
 * Caso de uso para resolver enlaces cortos.
 * ResolveShortLinkUseCase
 */
public interface ResolveShortLinkUseCase {

    /*
     * Resuelve un enlace corto y devuelve la URL original.
     * @param url La URL del enlace corto.
     * @return La URL original.
     */
    String resolve(String url);
}
