import json
from datetime import datetime, timezone

from redis.asyncio import Redis

from app.models.poll import Poll


class PollRepository:
    """Centraliza la lectura y escritura de encuestas y votos en Redis."""

    def __init__(self, redis: Redis, vote_ttl_seconds: int = 86400) -> None:
        self.redis = redis
        self.vote_ttl_seconds = vote_ttl_seconds

    @staticmethod
    def _data_key(poll_id: int) -> str:
        return f"encuesta:{poll_id}:datos"

    @staticmethod
    def _votes_key(poll_id: int) -> str:
        return f"encuesta:{poll_id}:votos"

    @staticmethod
    def _vote_key(poll_id: int, user_id: str) -> str:
        return f"voto:encuesta:{poll_id}:usuario:{user_id}"

    async def create(self, question: str, options: list[str]) -> Poll:
        poll_id = await self.redis.incr("encuestas:ids")
        created_at = datetime.now(timezone.utc)
        await self.redis.hset(
            self._data_key(poll_id),
            mapping={
                "pregunta": question,
                "opciones": json.dumps(options, ensure_ascii=False),
                "creada_en": created_at.isoformat(),
            },
        )
        return Poll(poll_id, question, options, created_at)

    async def get(self, poll_id: int) -> Poll | None:
        data = await self.redis.hgetall(self._data_key(poll_id))
        if not data:
            return None
        return Poll(
            id=poll_id,
            pregunta=data["pregunta"],
            opciones=json.loads(data["opciones"]),
            creada_en=datetime.fromisoformat(data["creada_en"]),
        )

    async def get_results(self, poll_id: int) -> dict[str, int]:
        results = await self.redis.hgetall(self._votes_key(poll_id))
        return {option: int(count) for option, count in results.items()}

    async def register_vote(self, poll_id: int, option: str, user_id: str) -> bool:
        vote_key = self._vote_key(poll_id, user_id)
        registered = await self.redis.set(vote_key, "1", ex=self.vote_ttl_seconds, nx=True)
        if not registered:
            return False
        try:
            await self.redis.hincrby(self._votes_key(poll_id), option, 1)
        except Exception:
            await self.redis.delete(vote_key)
            raise
        return True
