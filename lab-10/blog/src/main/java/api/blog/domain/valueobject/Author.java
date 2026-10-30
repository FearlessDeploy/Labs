package api.blog.domain.valueobject;

import api.blog.domain.exception.DomainValidationException;

/**
 * Clase que representa un autor en el blog.
 * Author
 */
public record Author(String value) {

    public Author {
        if(value == null){
            throw new DomainValidationException("El autor no puede ser nulo.");
        }
        if(value.isBlank()){
            throw new DomainValidationException("El autor no puede ser vacio.");
        }
        if(value.length() <= 4){
            throw new DomainValidationException("El autor debe tener minimo 4 caracteres.");
        }
        if( value.length() >= 255){
            throw new DomainValidationException("El author no puede tener mas de 255 caracteres.");
        }
    }
}
