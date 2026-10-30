package api.blog.infrastructure.in.adapter;

import api.blog.application.dto.command.CreatePostCommand;
import api.blog.application.dto.result.PostResult;
import api.blog.application.service.CreatePostService;
import org.springframework.stereotype.Service;

/**
 * Adaptador para manejar la creación de posts.
 * CreatePostAdapter
 */
@Service
public class CreatePostAdapter {

    private final CreatePostService createPostService;

    public CreatePostAdapter(CreatePostService createPostService){
        this.createPostService = createPostService;
    }

    /**
     * Crea un nuevo post utilizando el servicio de creación de posts.
     * @param command
     * @return PostResult
     */
    public PostResult create(CreatePostCommand command){
        return createPostService.create(command);
    }
}
