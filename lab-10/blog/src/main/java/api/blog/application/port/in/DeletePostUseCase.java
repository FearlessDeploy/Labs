package api.blog.application.port.in;

/**
 * Use case para eliminar un post.
 * DeletePostUseCase
 */
public interface DeletePostUseCase {

    /**
     * Elimina un post por su id.
     * @param id
     */
    void delete(String id);
}
