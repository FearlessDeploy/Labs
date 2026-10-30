package app.wired.application.service;

import app.wired.application.port.in.CreateShortLinkUseCase;
import app.wired.application.port.out.ShortLinkPersistentPort;
import app.wired.application.port.out.ShortCodeGeneratorPort;
import app.wired.domain.exception.DuplicateShortCodeException;
import app.wired.domain.model.ShortLink;
import app.wired.domain.valueobject.LifeShorLink;
import app.wired.domain.valueobject.OriginalUrl;

import java.time.Instant;
import java.util.Optional;

/**
 * Servicio para crear enlaces cortos.
 * CreateShortLinkService
 */
public class CreateShortLinkService implements CreateShortLinkUseCase {

    private final ShortLinkPersistentPort shorLinkPersistentPort;
    private final ShortCodeGeneratorPort shortCodeGeneratorPort;
    private final int maxAttempts = 10;

    public CreateShortLinkService(
            ShortLinkPersistentPort shorLinkPersistentPort,
            ShortCodeGeneratorPort shortCodeGeneratorPort
    ){
        this.shorLinkPersistentPort = shorLinkPersistentPort;
        this.shortCodeGeneratorPort = shortCodeGeneratorPort;
    }

    /**
     * Crea un enlace corto a partir de una URL original.
     * @param originalUrl La URL original.
     * @return El enlace corto generado.
     */
    @Override
    public String create(String originalUrl) {

        // Se valida la url.
        OriginalUrl url = new OriginalUrl(originalUrl);

        // Válida que no exista ya un registro con la url
        Optional<ShortLink> shortLinkOptional = shorLinkPersistentPort.findUrl(url.value());

        // Si existe retorna el codigo asociado
        if(shortLinkOptional.isPresent()){
            return shortLinkOptional.get().getShortCode();
        }

        // Si no crea un lifeshort
        LifeShorLink lifeShorLink = LifeShorLink.create(Instant.now());

        for (int i = 0; i < maxAttempts; i++) {
            String code = shortCodeGeneratorPort.generate(6);

            // Creea un shorLink
            ShortLink shortLink = ShortLink.create(
                    code,
                    url,
                    lifeShorLink
            );

            try {
                ShortLink save = shorLinkPersistentPort.save(shortLink);
                return save.getShortCode();
            } catch (DuplicateShortCodeException e) {
                // reintento
            }
        }

        throw new IllegalStateException("No se pudo generar un shortCode único");
    }
}
