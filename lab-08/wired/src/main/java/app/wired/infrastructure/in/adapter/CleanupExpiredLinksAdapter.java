package app.wired.infrastructure.in.adapter;

import app.wired.application.service.CleanupExpiredLinksService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;


import java.time.Instant;

/**
 * Adaptador para limpiar enlaces cortos expirados.
 * CleanupExpiredLinksAdapter
 */
@Service 
public class CleanupExpiredLinksAdapter {

    private final CleanupExpiredLinksService cleanupExpiredLinksService;

    public CleanupExpiredLinksAdapter(CleanupExpiredLinksService cleanupExpiredLinksService){
        this.cleanupExpiredLinksService = cleanupExpiredLinksService;
    }

    /**
     * Ejecuta la limpieza de enlaces cortos expirados.
     * @param now La fecha y hora actual.
     */
    @Transactional
    public void execute(Instant now){
        cleanupExpiredLinksService.execute(now);
    }
}
