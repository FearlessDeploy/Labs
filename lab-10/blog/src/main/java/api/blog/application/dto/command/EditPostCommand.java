package api.blog.application.dto.command;

import java.util.List;

/**
 * Comando para crear un nuevo post.
 * CreatePostCommand
 */
public record EditPostCommand(
        String id,
        String title,
        String content,
        List<String> labels
) {}
