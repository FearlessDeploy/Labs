package api.blog.infrastructure.in.mapper;

import api.blog.application.dto.command.CreatePostCommand;
import api.blog.application.dto.command.EditPostCommand;
import api.blog.infrastructure.in.dto.CreatePostRequest;
import api.blog.infrastructure.in.dto.EditPostRequest;
import org.springframework.stereotype.Component;

/**
 * Mapper para convertir las solicitudes de creación y edición de posts en comandos.
 * PostRequestMapper
 */
@Component
public class PostRequestMapper {

    /**
     * Convierte una solicitud de creación de post en un comando de creación.
     * @param request
     * @return CreatePostCommand
     */
    public CreatePostCommand toCreateRequest(CreatePostRequest request){
        return new CreatePostCommand(
                request.title(),
                request.author(),
                request.content(),
                request.category(),
                request.labels()
        );
    }

    /**
     * Convierte una solicitud de edición de post en un comando de edición.
     * @param request
     * @return EditPostCommand
     */
    public EditPostCommand toEditRequest(EditPostRequest request){
        return new EditPostCommand(
                request.id(),
                request.title(),
                request.content(),
                request.labels()
        );
    }
}
