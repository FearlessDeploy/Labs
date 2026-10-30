package app.wired.infrastructure.config;

import app.wired.application.port.out.ShortLinkPersistentPort;
import app.wired.application.port.out.ShortCodeGeneratorPort;
import app.wired.application.service.CleanupExpiredLinksService;
import app.wired.application.service.CreateShortLinkService;
import app.wired.application.service.ResolveShortLinkService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuración de la aplicación.
 * ApplicationConfig
 */
@Configuration
public class ApplicationConfig {

    /**
     * Crea el servicio para crear enlaces cortos.
     * @param shorLinkPersistentPort El adaptador de persistencia de enlaces cortos.
     * @param shortCodeGeneratorPort El generador de códigos cortos.
     * @return El servicio para crear enlaces cortos.
     */
    @Bean
    public CreateShortLinkService createShortLinkService(
            ShortLinkPersistentPort shorLinkPersistentPort,
            ShortCodeGeneratorPort shortCodeGeneratorPort
    ){
        return new CreateShortLinkService(shorLinkPersistentPort,shortCodeGeneratorPort);
    }

    /**
     * Crea el servicio para resolver enlaces cortos.
     * @param shortLinkPersistentPort El adaptador de persistencia de enlaces cortos.
     * @return El servicio para resolver enlaces cortos.
     */
    @Bean
    public ResolveShortLinkService resolveShortLinkService(
            ShortLinkPersistentPort shortLinkPersistentPort
    ){
        return new ResolveShortLinkService(shortLinkPersistentPort);
    }

    /**
     * Crea el servicio para limpiar enlaces cortos expirados.
     * @param shortLinkPersistentPort El adaptador de persistencia de enlaces cortos.
     * @return El servicio para limpiar enlaces cortos expirados.
     */
    @Bean
    public CleanupExpiredLinksService cleanupExpiredLinksService(
            ShortLinkPersistentPort shortLinkPersistentPort
    ){
        return new CleanupExpiredLinksService(shortLinkPersistentPort);
    }
}
