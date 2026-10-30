package api.blog.domain.exception;

/**
 * Excepción que se lanza cuando no se encuentra un post.
 * PostNotFoundException
 */
public class PostNotFoundException extends RuntimeException {
    public PostNotFoundException(String message) {
        super(message);
    }
}
