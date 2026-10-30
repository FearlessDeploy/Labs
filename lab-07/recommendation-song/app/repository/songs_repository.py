from app.models.songs_model import Song
from app.config.db import get_db
from fastapi import Depends
from sqlalchemy.orm import Session
from app.schemas.songs_schemas import SongResponseSchema, SongRequestSchema, SongUpdateSchema
from sqlalchemy.sql.expression import func

class SongsRepository:
    
    """
    Clase que representa un repositorio para interactuar con la base de datos de canciones.
    Proporciona métodos para obtener, agregar, eliminar y actualizar canciones en la base de datos.
    Utiliza SQLAlchemy para realizar operaciones de base de datos y depende de una sesión de base de datos proporcionada por FastAPI a través de la función get_db.
    Contiene los métodos: get_song_by_id, add_song, delete_song, update_song y random_song.
    """

    def __init__(self, db: Session = Depends(get_db)):
        self.db = db

    def get_song_by_id(self, song_id)-> SongResponseSchema:
        song = self.db.get(Song, song_id)
        if song:
            return SongResponseSchema(
                id=song.id,
                title=song.title,
                artist=song.artist,
                genre=song.genre,
                year=song.year
            )
        raise ValueError(f"Song with id {song_id} not found")

    def add_song(self, song: SongRequestSchema) -> SongResponseSchema:
        new_song = Song(
            title=song.title,
            artist=song.artist,
            genre=song.genre,
            year=song.year
        )
        self.db.add(new_song)
        self.db.commit()
        self.db.refresh(new_song)
        return SongResponseSchema(
            id=new_song.id,
            title=new_song.title,
            artist=new_song.artist,
            genre=new_song.genre,
            year=new_song.year
        )

    def delete_song(self, song_id):
        song = self.db.get(Song, song_id)
        if song:
            self.db.delete(song)
            self.db.commit()
            return True
        raise ValueError(f"Song with id {song_id} not found")

    def update_song(self, song_id, song_update: SongUpdateSchema) -> SongResponseSchema:
        song = self.db.get(Song, song_id)
        if not song:
            raise ValueError(f"Song with id {song_id} not found")

        update_data = song_update.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(song, key, value)

        self.db.commit()
        self.db.refresh(song)
        return SongResponseSchema(
            id=song.id,
            title=song.title,
            artist=song.artist,
            genre=song.genre,
            year=song.year
        )

    def random_song(self) -> SongResponseSchema:
        song = self.db.query(Song).order_by(func.random()).first()
        if song:
            return SongResponseSchema(
                id=song.id,
                title=song.title,
                artist=song.artist,
                genre=song.genre,
                year=song.year
            )
        raise ValueError("No songs available in the database")