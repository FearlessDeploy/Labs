package app.wired.domain.valueobject;

import app.wired.domain.exception.DomainValidationException;

import java.time.Duration;
import java.time.Instant;

/**
 * Clase que representa la vida útil de un enlace corto.
 * LifeShorLink
 */
public class LifeShorLink {

    private final Instant createAt;
    private final Instant expiresAt;


    public LifeShorLink(
            Instant createAt,
            Instant expiresAt
    ){
        if(createAt == null){
            throw new DomainValidationException("La fecha de creacion no puede ser nula.");
        }
        if(expiresAt == null){
            throw new DomainValidationException("La fecha de expiracion no puede ser nula.");
        }
        if(expiresAt.isBefore(createAt)){
            throw new DomainValidationException("La fecha de expiracion tiene que ser despues de la de creacion.");
        }
        this.createAt = createAt;
        this.expiresAt = expiresAt;
    }

    public static LifeShorLink create(Instant createAt){
        Instant expiresAt  = createAt.plus(Duration.ofHours(6));
        return new LifeShorLink(createAt,expiresAt);
    }

    // Getter
    public Instant getCreateAt(){return this.createAt;}
    public Instant getExpiresAt(){return this.expiresAt;}
}
