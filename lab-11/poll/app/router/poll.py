from fastapi import APIRouter, Depends, Header, status

from redis.asyncio import Redis

from app.config.redis import get_redis
from app.factory.poll import create_poll_service
from app.exception.handlers import AlreadyVotedError, InvalidOptionError, PollNotFoundError
from app.schemas.poll import PollCreate, PollResponse, PollResultsResponse, VoteCreate, VoteResponse
from app.service.poll import PollService

router = APIRouter()


def get_poll_service(redis: Redis = Depends(get_redis)) -> PollService:
    """Obtiene el servicio construido para la aplicación actual."""
    return create_poll_service(redis)


@router.post("/create", response_model=PollResponse, status_code=status.HTTP_201_CREATED)
async def create_poll(payload: PollCreate, service: PollService = Depends(get_poll_service)) -> PollResponse:
    poll = await service.create_poll(payload.pregunta, payload.opciones)
    return PollResponse.model_validate(poll, from_attributes=True)


@router.get("/{poll_id}", response_model=PollResponse)
async def get_poll(poll_id: int, service: PollService = Depends(get_poll_service)) -> PollResponse:
    try:
        poll = await service.get_poll(poll_id)
    except ValueError as exc:
        raise PollNotFoundError(str(exc)) from exc
    return PollResponse.model_validate(poll, from_attributes=True)


@router.post("/{poll_id}/votar", response_model=VoteResponse)
async def vote(
    poll_id: int,
    payload: VoteCreate,
    x_user_id: str = Header(..., min_length=1, max_length=200),
    service: PollService = Depends(get_poll_service),
) -> VoteResponse:
    try:
        await service.vote(poll_id, payload.opcion, x_user_id)
    except ValueError as exc:
        raise PollNotFoundError(str(exc)) from exc
    except KeyError as exc:
        raise InvalidOptionError(str(exc)) from exc
    except PermissionError as exc:
        raise AlreadyVotedError(str(exc)) from exc
    return VoteResponse(encuesta_id=poll_id, opcion=payload.opcion.strip(), mensaje="Voto registrado")


@router.get("/{poll_id}/resultados", response_model=PollResultsResponse)
async def get_results(poll_id: int, service: PollService = Depends(get_poll_service)) -> PollResultsResponse:
    try:
        poll, results = await service.results(poll_id)
    except ValueError as exc:
        raise PollNotFoundError(str(exc)) from exc
    return PollResultsResponse(encuesta_id=poll_id, pregunta=poll.pregunta, resultados=results)
