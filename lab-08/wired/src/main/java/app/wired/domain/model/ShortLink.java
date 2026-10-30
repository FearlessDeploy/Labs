package app.wired.domain.model;

import app.wired.domain.valueobject.LifeShorLink;
import app.wired.domain.valueobject.OriginalUrl;

import java.util.UUID;

/**
 * Clase que representa un enlace corto.
 * ShortLink
 */
public class ShortLink {

    private UUID id;
    private String shortCode;
    private OriginalUrl originalUrl;
    private LifeShorLink lifeShorLink;

    private ShortLink(
            UUID id,
            String shortCode,
            OriginalUrl originalUrl,
            LifeShorLink lifeShorLink
    ){
        this.id = id;
        this.shortCode = shortCode;
        this.originalUrl = originalUrl;
        this.lifeShorLink = lifeShorLink;
    }


    public static ShortLink create(
            String shortCode,
            OriginalUrl originalUrl,
            LifeShorLink lifeShorLink
    ){
        return new ShortLink(
                null,
                shortCode,
                originalUrl,
                lifeShorLink
        );
    }

    public static ShortLink save(
            UUID id,
            String shortCode,
            OriginalUrl originalUrl,
            LifeShorLink lifeShorLink
    ){
        return new ShortLink(
                id,
                shortCode,
                originalUrl,
                lifeShorLink
        );
    }

    // Getters
    public UUID getId(){return this.id;}
    public String getShortCode(){return this.shortCode;}
    public OriginalUrl getOriginalUrl(){return this.originalUrl;}
    public LifeShorLink getLifeShorLink(){return this.lifeShorLink;}

}
