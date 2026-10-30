package app.wired.application.port.in;

import java.time.Instant;

/**
 * Caso de uso para limpiar enlaces cortos expirados.
 * CleanupExpiredShortLinksUseCase
 */
public interface CleanupExpiredShortLinksUseCase {

    /**
     * Ejecuta la limpieza de enlaces cortos expirados.
     * @param now La fecha y hora actual.
     */
    void execute(Instant now);
}
