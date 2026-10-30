from app.repository.songs_repository import SongsRepository
from app.schemas.songs_schemas import SongResponseSchema, SongRequestSchema, SongUpdateSchema

class SongsServices:
    """
    Clase que representa los servicios relacionados con las canciones.
    Esta clase actúa como una capa intermedia entre el controlador y el repositorio de canciones.
    Proporciona métodos para obtener, agregar, actualizar y eliminar canciones, así como para obtener una canción aleatoria.
    """
    def __init__(self, repository: SongsRepository):
        self.repository = repository

    def get_song_by_id(self, song_id)-> SongResponseSchema:
        return self.repository.get_song_by_id(song_id)

    def add_song(self, song: SongRequestSchema)-> SongResponseSchema:
        return self.repository.add_song(song)

    def update_song(self, song_id, updated_song: SongUpdateSchema)-> SongResponseSchema:
        return self.repository.update_song(song_id, updated_song)

    def delete_song(self, song_id)-> bool:
        return self.repository.delete_song(song_id)

    def random_song(self)-> SongResponseSchema:
        return self.repository.random_song()