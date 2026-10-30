from fastapi import Request
from redis.asyncio import Redis, from_url

from app.config.settings import settings


def create_redis_client() -> Redis:
    """Crea el cliente Redis compartido por las peticiones de la aplicación."""
    return from_url(settings.redis_url, decode_responses=True)


def get_redis(request: Request) -> Redis:
    """Expone Redis como dependencia de FastAPI y permite sustituirlo en tests."""
    return request.app.state.redis
