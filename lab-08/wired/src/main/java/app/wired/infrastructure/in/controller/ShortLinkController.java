package app.wired.infrastructure.in.controller;

import app.wired.infrastructure.in.adapter.CreateShortLinkAdapter;
import app.wired.infrastructure.in.adapter.ResolveShortLinkAdapter;
import app.wired.infrastructure.in.dto.request.CreateShortLinkRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador para gestionar las operaciones relacionadas con los enlaces cortos.
 * ShortLinkController
 */
@RestController
@RequestMapping("/api/v1/wired")
public class ShortLinkController {

    private final CreateShortLinkAdapter createUseCase;
    private final ResolveShortLinkAdapter resolveUseCase;

    public ShortLinkController(CreateShortLinkAdapter createUseCase,
                               ResolveShortLinkAdapter resolveUseCase) {
        this.createUseCase = createUseCase;
        this.resolveUseCase = resolveUseCase;
    }

    /**
     * Crea un enlace corto a partir de una URL original.
     * @param request
     * @return El código corto generado para la URL original.
     */
    @PostMapping("/create")
    public ResponseEntity<String> create(
            @Valid
            @RequestBody
            CreateShortLinkRequest request) {
        String result = createUseCase.create(request.originalUrl());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(result);
    }

    /**
     * Resuelve un enlace corto a su URL original.
     * @param shortCode El código corto del enlace.
     * @return La URL original correspondiente al código corto.
     */
    @GetMapping("/{shortCode}")
    public ResponseEntity<String> resolve(
            @PathVariable
            @Valid
            @NotNull(message = "El codigo no puede ser nulo.")
            @NotBlank(message = "El codigo no puede ser vacio")
            @Size(max = 6, message = "El codigo no puede tener mas de 6 caracteres.")
            String shortCode) {
        String url = resolveUseCase.resolve(shortCode);
        return ResponseEntity.status(HttpStatus.OK)
                .body(url);
    }
}
