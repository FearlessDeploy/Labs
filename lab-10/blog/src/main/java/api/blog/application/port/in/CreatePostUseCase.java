package api.blog.application.port.in;

import api.blog.application.dto.command.CreatePostCommand;
import api.blog.application.dto.result.PostResult;

/**
 * Use case para crear un nuevo post.
 * CreatePostUseCase
 */
public interface CreatePostUseCase {

    /**
     * Crea un nuevo post.
     * @param command
     * @return PostResult
     */
    PostResult create(CreatePostCommand command);
}
