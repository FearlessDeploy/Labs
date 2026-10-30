package app.wired.infrastructure.in.adapter;

import org.springframework.stereotype.Service;

import app.wired.application.service.CreateShortLinkService;
import jakarta.transaction.Transactional;

/**
 * Adaptador para crear enlaces cortos.
 * CreateShortLinkAdapter
 */
@Service
public class CreateShortLinkAdapter {

    private final CreateShortLinkService createShortLinkService;

    public CreateShortLinkAdapter(CreateShortLinkService createShortLinkService){
        this.createShortLinkService = createShortLinkService;
    }

    /**
     * Crea un enlace corto a partir de una URL original.
     * @param originalUrl La URL original que se desea acortar.
     * @return El código corto generado para la URL original.
     */
    @Transactional
    public String create(String originalUrl){
        return createShortLinkService.create(originalUrl);
    }
}
