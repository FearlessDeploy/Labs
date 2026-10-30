from pydantic import BaseModel, ConfigDict
from typing import Optional

class SongResponseSchema(BaseModel):

    """
    Clase que representa el esquema de respuesta para una canción.
    Hereda de la clase BaseModel de Pydantic y define los atributos que se incluirán en la respuesta de la API al obtener información de una canción.
    Contiene los atributos: id, title, artist, genre y year.
    """
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    artist: str
    genre: str
    year: str


class SongRequestSchema(BaseModel):
    """"
    Clase que representa el esquema de solicitud para agregar una nueva canción.
    Hereda de la clase BaseModel de Pydantic y define los atributos que se deben proporcionar al agregar una nueva canción a la base de datos.
    Contiene los atributos: title, artist, genre y year.
    """
    title: str
    artist: str
    genre: str
    year: str

class SongUpdateSchema(BaseModel):
    """
    Clase que representa el esquema de solicitud para actualizar una canción existente.
    Hereda de la clase BaseModel de Pydantic y define los atributos que se pueden actualizar al modificar una canción en la base de datos.
    Contiene los atributos: title, artist, genre y year, todos ellos opcionales.
    """
    title: Optional[str] = None
    artist: Optional[str] = None
    genre: Optional[str] = None
    year: Optional[str] = None


