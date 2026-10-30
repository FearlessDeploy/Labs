package api.blog.application.dto.command;

import java.util.List;

/**
 * Comando para crear un nuevo post.
 * CreatePostCommand
 */
public record CreatePostCommand(
        String title,
        String author,
        String content,
        String category,
        List<String> labels
) {}
