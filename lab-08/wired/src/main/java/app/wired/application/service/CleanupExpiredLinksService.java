package app.wired.application.service;

import app.wired.application.port.in.CleanupExpiredShortLinksUseCase;
import app.wired.application.port.out.ShortLinkPersistentPort;

import java.time.Instant;

/**
 * Servicio para limpiar enlaces cortos expirados.
 * CleanupExpiredLinksService
 */
public class CleanupExpiredLinksService  implements CleanupExpiredShortLinksUseCase {

    private final ShortLinkPersistentPort shorLinkPersistentPort;

    public CleanupExpiredLinksService(
            ShortLinkPersistentPort shorLinkPersistentPort
    ){
        this.shorLinkPersistentPort = shorLinkPersistentPort;
    }

    /**
     * Limpia los enlaces cortos expirados.
     * @param now La fecha y hora actual.
     */
    @Override
    public void execute(Instant now) {
        shorLinkPersistentPort.deleteExpired(now);
    }
}
