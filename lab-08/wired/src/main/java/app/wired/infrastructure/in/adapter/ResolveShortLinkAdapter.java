package app.wired.infrastructure.in.adapter;

import app.wired.application.service.ResolveShortLinkService;
import org.springframework.stereotype.Service;

/**
 * Adaptador para resolver enlaces cortos.
 * ResolveShortLinkAdapter
 */
@Service
public class ResolveShortLinkAdapter {

    private final ResolveShortLinkService resolveShortLinkService;

    public ResolveShortLinkAdapter(ResolveShortLinkService resolveShortLinkService){
        this.resolveShortLinkService = resolveShortLinkService;
    }

    /**
     * Resuelve un enlace corto a su URL original.
     * @param code El código corto del enlace.
     * @return La URL original correspondiente al código corto.
     */
    public String resolve(String code){
        return resolveShortLinkService.resolve(code);
    }
}
