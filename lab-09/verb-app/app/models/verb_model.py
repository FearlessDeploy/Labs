
from sqlalchemy import Column, Integer, String
from app.config.db import Base

# Al heredado de la clase Base, que es la clase base para todos los modelos de SQLAlchemy,
# se define el modelo VerbModel que representa un verbo en la base de datos.
class VerbModel(Base):

    """
    Modelo de SQLAlchemy para representar un verbo en la base de datos.
    """

    __tablename__ = "verbs"

    id = Column(Integer, autoincrement=True, primary_key=True, index=True)
    spanish = Column(String(150), nullable=False)
    infinitive = Column(String(150), nullable=False)
    past_simple = Column(String(150), nullable=True)
    past_participle = Column(String(150), nullable=True)