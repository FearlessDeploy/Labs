package api.blog.application.port.in;

import api.blog.application.dto.result.PostResult;

import java.util.List;

/**
 * Use case para listar los posts publicados.
 * ListPostPublishedUseCase
 */
public interface ListPostPublishedUseCase {

    /**
     * Lista los posts publicados.
     * @return List<PostResult>
     */
    List<PostResult> list();
}
