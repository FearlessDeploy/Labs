package api.blog.application.service;

import api.blog.application.dto.command.CreatePostCommand;
import api.blog.application.dto.result.PostResult;
import api.blog.application.port.in.CreatePostUseCase;
import api.blog.application.port.out.PostRepositoryPort;
import api.blog.domain.enums.CategoryPost;
import api.blog.domain.model.Post;
import api.blog.domain.valueobject.Author;
import api.blog.domain.valueobject.Content;
import api.blog.domain.valueobject.Title;

/**
 * Servicio para crear un nuevo post.
 * CreatePostService
 */
public class CreatePostService implements CreatePostUseCase {

    private final PostRepositoryPort postRepositoryPort;

    public CreatePostService(PostRepositoryPort postRepositoryPort){
        this.postRepositoryPort = postRepositoryPort;
    }


    /**
     * Crea un nuevo post.
     * @param command
     * @return PostResult
     */
    @Override
    public PostResult create(CreatePostCommand command) {

        // Valida la categoria.
        CategoryPost category = CategoryPost.from(command.category());

        Post post = postRepositoryPort.save(
                Post.create(
                        new Title(command.title()),
                        new Author(command.author()),
                        new Content(command.content()),
                        category,
                        command.labels()
                )
        );

        return new PostResult(
                post.getId(),
                post.getTitle().value(),
                post.getAuthor().value(),
                post.getContent().value(),
                post.getCategory().name().toLowerCase()
        );

    }
}
