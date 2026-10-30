package api.blog.application.dto.result;

/**
 * Resultado para devolver la información de un post.
 * PostResult
 */
public record PostResult(
        String id,
        String title,
        String author,
        String content,
        String category
) {}
