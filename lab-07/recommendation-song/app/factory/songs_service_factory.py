from fastapi import Depends
from app.repository.songs_repository import SongsRepository
from app.services.songs_services import SongsServices

# Factory de la clase SongsServices, inyectando la dependencia del repositorio SongsRepository
def get_songs_service(repository: SongsServices = Depends(SongsRepository)) -> SongsServices:
    return SongsServices(repository)