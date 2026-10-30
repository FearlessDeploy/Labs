package api.blog.application.port.in;

import api.blog.application.dto.command.EditPostCommand;
import api.blog.application.dto.result.PostResult;

/**
 * Use case para editar un post.
 * EditPostUseCase
 */
public interface EditPostUseCase {

    /**
     * Edita un post existente.
     * @param command
     * @return PostResult
     */
    PostResult edit(EditPostCommand command);
}
