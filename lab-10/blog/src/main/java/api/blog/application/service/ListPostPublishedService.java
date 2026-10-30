package api.blog.application.service;

import api.blog.application.dto.result.PostResult;
import api.blog.application.port.in.ListPostPublishedUseCase;
import api.blog.application.port.out.PostRepositoryPort;
import java.util.List;

/**
 * Servicio para listar los posts publicados.
 * ListPostPublishedService
 */
public class ListPostPublishedService implements ListPostPublishedUseCase {

    private final PostRepositoryPort postRepositoryPort;

    public ListPostPublishedService(PostRepositoryPort postRepositoryPort){
        this.postRepositoryPort = postRepositoryPort;
    }

    /**
     * Lista los posts publicados.
     * @return List<PostResult>
     */
    @Override
    public List<PostResult> list() {

        return postRepositoryPort.searchPost()
                .stream()
                .map( post ->
                    new PostResult(
                            post.getId(),
                            post.getTitle().value(),
                            post.getAuthor().value(),
                            post.getContent().value(),
                            post.getCategory().name().toLowerCase()
                    )
                )
                .toList();
    }
}
