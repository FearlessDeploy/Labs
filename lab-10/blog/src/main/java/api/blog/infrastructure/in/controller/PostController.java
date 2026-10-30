package api.blog.infrastructure.in.controller;

import api.blog.application.dto.command.CreatePostCommand;
import api.blog.application.dto.command.EditPostCommand;
import api.blog.application.dto.result.PostResult;
import api.blog.infrastructure.in.adapter.CreatePostAdapter;
import api.blog.infrastructure.in.adapter.DeletePostAdapter;
import api.blog.infrastructure.in.adapter.EditPostAdapter;
import api.blog.infrastructure.in.adapter.ListPostPublishedAdapter;
import api.blog.infrastructure.in.dto.CreatePostRequest;
import api.blog.infrastructure.in.dto.EditPostRequest;
import api.blog.infrastructure.in.mapper.PostRequestMapper;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador para manejar las operaciones relacionadas con los posts.
 * PostController
 */
@RestController
@RequestMapping("/api/v1/post")
public class PostController {

    // Adapters
    private final CreatePostAdapter createPostAdapter;
    private final EditPostAdapter editPostAdapter;
    private final ListPostPublishedAdapter listPostPublishedAdapter;
    private final DeletePostAdapter deletePostAdapter;

    // Mapper
    private final PostRequestMapper postRequestMapper;

    public PostController(
            CreatePostAdapter createPostAdapter,
            EditPostAdapter editPostAdapter,
            ListPostPublishedAdapter listPostPublishedAdapter,
            DeletePostAdapter deletePostAdapter,
            PostRequestMapper postRequestMapper
    ){
        this.createPostAdapter = createPostAdapter;
        this.editPostAdapter = editPostAdapter;
        this.listPostPublishedAdapter = listPostPublishedAdapter;
        this.deletePostAdapter = deletePostAdapter;

        this.postRequestMapper = postRequestMapper;
    }

    /**
     * Crea un nuevo post.
     * @param request
     * @return ResponseEntity<PostResult>
     */
    @PostMapping("/create")
    public ResponseEntity<PostResult> create(
            @RequestBody
            @Valid
            CreatePostRequest request
    ){
        CreatePostCommand command = postRequestMapper.toCreateRequest(request);
        PostResult result = createPostAdapter.create(command);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(result);
    }

    /**
     * Edita un post existente.
     * @param request
     * @return ResponseEntity<PostResult>
     */
    @PostMapping("/edit")
    public ResponseEntity<PostResult> edit(
            @RequestBody
            @Valid
            EditPostRequest request
    ){
        EditPostCommand command = postRequestMapper.toEditRequest(request);
        PostResult result = editPostAdapter.edit(command);

        return ResponseEntity.status(HttpStatus.OK)
                .body(result);
    }

    /**
     * Lista los posts publicados.
     * @return ResponseEntity<List<PostResult>>
     */
    @GetMapping("/list")
    public ResponseEntity<List<PostResult>> list(){
       List<PostResult> results =  listPostPublishedAdapter.list();

       return ResponseEntity.status(HttpStatus.OK)
               .body(results);
    }

    /**
     * Elimina un post.
     * @param id
     * @return ResponseEntity<Void>
     */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable
            @Valid
            @NotNull(message = "El id del post no puede ser nulo.")
            @NotBlank(message = "El id del post no puede ser vacio.")
            String id
    ){
        deletePostAdapter.delete(id);

        return ResponseEntity.status(HttpStatus.OK)
                .body(null);
    }

}
