from sqlalchemy import Column, Integer, String
from app.config.db import Base

class Song(Base):
    """
    Clase que representa un modelo de canción en la base de datos.
    Hereda de la clase Base de SQLAlchemy para definir la estructura de la tabla "songs".
    Contiene los atributos: id, title, artist, genre y year.
    """

    __tablename__ = "songs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    artist = Column(String, nullable=False)
    genre = Column(String, nullable=False)
    year = Column(String, nullable=False)

