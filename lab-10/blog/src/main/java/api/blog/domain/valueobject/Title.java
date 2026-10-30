package api.blog.domain.valueobject;

import api.blog.domain.exception.DomainValidationException;

/**
 * Clase que representa el titulo de un post en el blog.
 * Title
 */
public record Title(String value) {

    public Title {
        if(value == null){
            throw new DomainValidationException("El titulo no puede ser nulo.");
        }
        if(value.isBlank()){
            throw new DomainValidationException("El titulo no puede ser vacio.");
        }
        if(value.length() <= 5){
            throw new DomainValidationException("El titulo debe tener minimo 5 caracteres.");
        }
        if( value.length() >= 255){
            throw new DomainValidationException("El titulo no puede tener mas de 255 caracteres.");
        }
    }
}
