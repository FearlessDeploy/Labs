from redis.asyncio import Redis

from app.config.settings import settings
from app.repository.poll import PollRepository
from app.service.poll import PollService


def create_poll_service(redis: Redis) -> PollService:
    """Construye el servicio con sus dependencias concretas."""
    return PollService(PollRepository(redis, settings.vote_ttl_seconds))
