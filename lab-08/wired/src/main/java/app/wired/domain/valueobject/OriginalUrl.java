package app.wired.domain.valueobject;

import app.wired.domain.exception.DomainValidationException;

/**
 * Clase que representa la URL original de un enlace corto.
 * OriginalUrl
 * @param value
 */
public record OriginalUrl(String value) {

    public OriginalUrl {
        if(value == null){
            throw new DomainValidationException("La url no puede ser nula.");
        }
        if(value.isBlank()){
            throw new DomainValidationException("La url no puede ser vacia.");
        }
        if(!value.startsWith("https://")){
            throw new  DomainValidationException("La url debe comenzar por https://");
        }
    }
}
