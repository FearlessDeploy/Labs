package api.blog.application.service;

import api.blog.application.port.in.DeletePostUseCase;
import api.blog.application.port.out.PostRepositoryPort;

/**
 * Servicio para eliminar un post.
 * DeletePostService
 */
public class DeletePostService implements DeletePostUseCase {

    private final PostRepositoryPort postRepositoryPort;

    /**
     * Constructor de DeletePostService.
     * @param postRepositoryPort
     */
    public DeletePostService(PostRepositoryPort postRepositoryPort){
        this.postRepositoryPort = postRepositoryPort;
    }
    @Override
    public void delete(String id) {

        postRepositoryPort.delete(id);
    }
}
