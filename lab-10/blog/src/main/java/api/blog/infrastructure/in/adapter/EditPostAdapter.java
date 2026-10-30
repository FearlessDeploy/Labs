package api.blog.infrastructure.in.adapter;

import api.blog.application.dto.command.EditPostCommand;
import api.blog.application.dto.result.PostResult;
import api.blog.application.service.EditPostService;
import org.springframework.stereotype.Service;

/* Adaptador para manejar la edición de posts.
 * EditPostAdapter
 */
@Service
public class EditPostAdapter {

    private final EditPostService editPostService;

    public EditPostAdapter(EditPostService editPostService){
        this.editPostService = editPostService;
    }

    /**
     * Edita un post utilizando el servicio de edición de posts.
     * @param command
     * @return PostResult
     */
    public PostResult edit(EditPostCommand command){
        return editPostService.edit(command);
    }
}
