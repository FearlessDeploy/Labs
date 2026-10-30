from fastapi import Depends
from app.repository.verb_repository import VerbRepository
from app.service.verb_service import VerbService

# Factory para crear una instancia de VerbService con su dependencia VerbRepository
def get_verb_service(repository: VerbRepository = Depends(VerbRepository)) -> VerbService:
    return VerbService(repository)