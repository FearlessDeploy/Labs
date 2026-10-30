package api.blog.application.service;

import api.blog.application.dto.command.EditPostCommand;
import api.blog.application.dto.result.PostResult;
import api.blog.application.port.in.EditPostUseCase;
import api.blog.application.port.out.PostRepositoryPort;
import api.blog.domain.exception.PostNotFoundException;
import api.blog.domain.model.Post;
import api.blog.domain.valueobject.Content;
import api.blog.domain.valueobject.Title;

/**
 * Servicio para editar un post existente.
 * EditPostService
 */
public class EditPostService implements EditPostUseCase {

    private final PostRepositoryPort postRepositoryPort;

    public EditPostService(PostRepositoryPort postRepositoryPort){
        this.postRepositoryPort = postRepositoryPort;
    }

    /**
     * Edita un post existente.
     * @param command
     * @return PostResult
     */
    @Override
    public PostResult edit(EditPostCommand command) {

        Post post = postRepositoryPort.findById(command.id())
                .orElseThrow(() -> new PostNotFoundException("El post no fue encontrado."));

        post.update(
                new Title(command.title()),
                new Content(command.content()),
                command.labels()
        );

        Post update = postRepositoryPort.update(post);

        return new PostResult(
                update.getId(),
                update.getTitle().value(),
                update.getAuthor().value(),
                update.getContent().value(),
                update.getCategory().name().toLowerCase()
        );

    }
}
