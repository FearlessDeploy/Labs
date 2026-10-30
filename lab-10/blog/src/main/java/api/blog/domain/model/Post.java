package api.blog.domain.model;

import api.blog.domain.enums.CategoryPost;
import api.blog.domain.enums.StatusPost;
import api.blog.domain.valueobject.Author;
import api.blog.domain.valueobject.Content;
import api.blog.domain.valueobject.Title;

import java.time.Instant;
import java.util.List;

/**
 * Clase que representa un post en el blog.
 * Post
 */
public class Post {

    private String id;
    private Title title;
    private Author author;
    private Content content;
    private CategoryPost category;
    private List<String> labels;
    private Instant createAt;
    private StatusPost status;

    private Post(
            String id,
            Title title,
            Author author,
            Content content,
            CategoryPost category,
            List<String> labels,
            Instant createAt,
            StatusPost status
    ){
        this.id = id;
        this.title = title;
        this.author = author;
        this.content = content;
        this.category = category;
        this.labels = labels;
        this.createAt = createAt;
        this.status = status;
    }

    public static Post create(
            Title title,
            Author author,
            Content content,
            CategoryPost category,
            List<String> labels
    ){
        return new Post(
                null,
                title,
                author,
                content,
                category,
                labels,
                Instant.now(),
                StatusPost.PUBLICADO
        );
    }

    public static Post mapper(
            String id,
            Title title,
            Author author,
            Content content,
            CategoryPost category,
            List<String> labels,
            Instant createAt,
            StatusPost status
    ){
        return new Post(
                id,
                title,
                author,
                content,
                category,
                labels,
                createAt,
                status
        );
    }


    public void update(
            Title title,
            Content content,
            List<String> labels
    ){
        this.title = title;
        this.content = content;
        this.labels = labels;
    }

    public void delete(){
        this.status = StatusPost.ELIMINADO;
    }

    // Getters
    public String getId(){return this.id;}
    public Title getTitle(){return this.title;}
    public Author getAuthor(){return this.author;}
    public Content getContent(){return this.content;}
    public CategoryPost getCategory(){return this.category;}
    public List<String> getLabels(){return this.labels;}
    public Instant getCreateAt(){return this.createAt;}
    public StatusPost getStatus(){return this.status;}
}
