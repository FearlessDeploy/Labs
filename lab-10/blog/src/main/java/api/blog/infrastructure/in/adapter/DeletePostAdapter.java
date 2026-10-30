package api.blog.infrastructure.in.adapter;

import api.blog.application.service.DeletePostService;
import org.springframework.stereotype.Service;

/**
 * Adaptador para manejar la eliminación de posts.
 * DeletePostAdapter
 */
@Service
public class DeletePostAdapter {

    private final DeletePostService deletePostService;

    public DeletePostAdapter(DeletePostService deletePostService){
        this.deletePostService = deletePostService;
    }

    /**
     * Elimina un post utilizando el servicio de eliminación de posts.
     * @param id
     */
    public void delete(String id){

        deletePostService.delete(id);
    }
}
