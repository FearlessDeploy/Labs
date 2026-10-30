from app.models.poll import Poll
from app.repository.poll import PollRepository


class PollService:
    """Aplica las reglas de negocio de las encuestas."""

    def __init__(self, repository: PollRepository) -> None:
        self.repository = repository

    async def create_poll(self, question: str, options: list[str]) -> Poll:
        return await self.repository.create(question, options)

    async def get_poll(self, poll_id: int) -> Poll:
        poll = await self.repository.get(poll_id)
        if poll is None:
            raise ValueError("La encuesta no existe")
        return poll

    async def vote(self, poll_id: int, option: str, user_id: str) -> None:
        poll = await self.get_poll(poll_id)
        normalized_option = option.strip()
        if normalized_option not in poll.opciones:
            raise KeyError("La opción no pertenece a la encuesta")
        if not await self.repository.register_vote(poll_id, normalized_option, user_id):
            raise PermissionError("Ya has votado")

    async def results(self, poll_id: int) -> tuple[Poll, dict[str, int]]:
        poll = await self.get_poll(poll_id)
        return poll, await self.repository.get_results(poll_id)
