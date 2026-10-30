from fastapi import APIRouter, Depends
from app.services.songs_services import SongsServices
from app.factory.songs_service_factory import get_songs_service
from app.schemas.songs_schemas import SongResponseSchema, SongRequestSchema, SongUpdateSchema
router = APIRouter()

@router.get("/get-by-id/{song_id}")
def get_song(song_id: int, service: SongsServices = Depends(get_songs_service))-> SongResponseSchema:
    """
    Endpoint para obtener una canción por su ID.
    Recibe el ID de la canción como parámetro de ruta y utiliza el servicio SongsServices para obtener la canción correspondiente de la base de datos.
    Devuelve un objeto SongResponseSchema con los datos de la canción.
    """
    return service.get_song_by_id(song_id)

@router.post("/create")
def add_song(song: SongRequestSchema, service: SongsServices = Depends(get_songs_service))-> SongResponseSchema:
    """
    Endpoint para agregar una nueva canción a la base de datos.
    Recibe un objeto SongRequestSchema con los datos de la canción a agregar y utiliza el servicio SongsServices para crear la canción en la base de datos.
    Devuelve un objeto SongResponseSchema con los datos de la canción recién creada.
    """
    return service.add_song(song)

@router.put("/update/{song_id}")
def update_song(song_id: int, updated_song: SongUpdateSchema, service: SongsServices = Depends(get_songs_service))-> SongResponseSchema:
    """
    Endpoint para actualizar una canción existente en la base de datos.
    Recibe el ID de la canción como parámetro de ruta y un objeto SongUpdateSchema con los datos actualizados.
    Utiliza el servicio SongsServices para actualizar la canción en la base de datos.
    Devuelve un objeto SongResponseSchema con los datos actualizados de la canción.
    """
    return service.update_song(song_id, updated_song)

@router.delete("/delete/{song_id}")
def delete_song(song_id: int, service: SongsServices = Depends(get_songs_service))-> bool:
    """
    Endpoint para eliminar una canción de la base de datos.
    Recibe el ID de la canción como parámetro de ruta y utiliza el servicio SongsServices para eliminar la canción de la base de datos.
    Devuelve un booleano indicando si la eliminación fue exitosa.
    """
    return service.delete_song(song_id)

@router.get("/random")
def random_song(service: SongsServices = Depends(get_songs_service))-> SongResponseSchema:
    """
    Endpoint para obtener una canción aleatoria de la base de datos.
    Utiliza el servicio SongsServices para obtener una canción aleatoria de la base de datos.
    Devuelve un objeto SongResponseSchema con los datos de la canción aleatoria.
    """
    return service.random_song()