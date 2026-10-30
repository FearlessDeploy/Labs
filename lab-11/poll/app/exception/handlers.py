import logging

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)


class PollNotFoundError(Exception):
    """Indica que la encuesta solicitada no existe."""


class InvalidOptionError(Exception):
    """Indica que el voto no corresponde a una opción de la encuesta."""


class AlreadyVotedError(Exception):
    """Indica que el usuario ya votó dentro del periodo permitido."""


def register_exception_handlers(app: FastAPI) -> None:
    """Registra respuestas JSON coherentes para errores de dominio y fallos inesperados."""

    @app.exception_handler(PollNotFoundError)
    async def poll_not_found_handler(request: Request, exc: PollNotFoundError) -> JSONResponse:
        return JSONResponse(status_code=404, content={"detail": str(exc)})

    @app.exception_handler(InvalidOptionError)
    async def invalid_option_handler(request: Request, exc: InvalidOptionError) -> JSONResponse:
        return JSONResponse(status_code=400, content={"detail": str(exc)})

    @app.exception_handler(AlreadyVotedError)
    async def already_voted_handler(request: Request, exc: AlreadyVotedError) -> JSONResponse:
        return JSONResponse(status_code=400, content={"detail": str(exc)})

    @app.exception_handler(Exception)
    async def unexpected_error_handler(request: Request, exc: Exception) -> JSONResponse:
        logger.exception("Error inesperado atendiendo %s", request.url.path, exc_info=exc)
        return JSONResponse(status_code=500, content={"detail": "Error interno del servidor"})
