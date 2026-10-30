package api.blog.infrastructure.in.adapter;

import api.blog.application.dto.result.PostResult;
import api.blog.application.service.ListPostPublishedService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Adaptador para manejar la lista de posts publicados.
 * ListPostPublishedAdapter
 */
@Service
public class ListPostPublishedAdapter {

    private final ListPostPublishedService listPostPublishedService;

    public ListPostPublishedAdapter(ListPostPublishedService listPostPublishedService){
        this.listPostPublishedService = listPostPublishedService;
    }

    /**
     * Lista los posts publicados utilizando el servicio de lista de posts publicados.
     * @return List<PostResult>
     */
    public List<PostResult> list(){
        return listPostPublishedService.list();
    }
}
