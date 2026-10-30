package api.blog.domain.valueobject;

import api.blog.domain.exception.DomainValidationException;

/**
 * Clase que representa el contenido de un post en el blog.
 * Content
 */
public record Content(String value) {

    public Content {
        if(value == null){
            throw new DomainValidationException("El contenido no puede ser nulo.");
        }
        if(value.isBlank()){
            throw new DomainValidationException("El contenido no puede ser vacio.");
        }
        if(value.length() <= 20){
            throw new DomainValidationException("El contenido tener minimo 20 caracteres.");
        }
        if( value.length() >= 10000){
            throw new DomainValidationException("El contenido tener mas de 10000 caracteres.");
        }
    }
}
