package app.wired.application.service;

import app.wired.application.port.in.ResolveShortLinkUseCase;
import app.wired.application.port.out.ShortLinkPersistentPort;
import app.wired.domain.exception.NotFoundLinkException;
import app.wired.domain.model.ShortLink;
import app.wired.domain.valueobject.OriginalUrl;

/**
 * Servicio para resolver enlaces cortos.
 * ResolveShortLinkService
 */
public class ResolveShortLinkService implements ResolveShortLinkUseCase {

    private final ShortLinkPersistentPort shorLinkPersistentPort;

    public ResolveShortLinkService(
            ShortLinkPersistentPort shorLinkPersistentPort
    ){
        this.shorLinkPersistentPort = shorLinkPersistentPort;
    }

    /**
     * Resuelve un enlace corto y devuelve la URL original.
     * @param code La URL del enlace corto.
     * @return La URL original.
     */
    @Override
    public String resolve(String code) {

        return shorLinkPersistentPort.findCode(code)
                .map(ShortLink::getOriginalUrl)
                .map(OriginalUrl::value)
                .orElseThrow(() -> new NotFoundLinkException("No se encontro la url asociada a l codigo."));
    }
}
