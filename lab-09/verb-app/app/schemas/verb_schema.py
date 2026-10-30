from pydantic import BaseModel, ConfigDict
from typing import Optional

class VerbResponseSchema(BaseModel):
    """
    Esquema de respuesta para un verbo.
    Este esquema se utiliza para definir la estructura de los datos que se devolverán al cliente cuando se solicite información sobre un verbo.
    """

    model_config = ConfigDict(from_attributes=True)

    id: int
    spanish: str
    infinitive: str
    past_simple: str 
    past_participle: str 

class VerbCreateSchema(BaseModel):
    """
    Esquema para crear un nuevo verbo.
    Este esquema se utiliza para validar los datos proporcionados al crear un nuevo verbo.
    """

    spanish: str
    infinitive: str
    past_simple: str
    past_participle: str

class VerbUpdateSchema(BaseModel):
    """
    Esquema para actualizar un verbo existente.
    Este esquema se utiliza para validar los datos proporcionados al actualizar un verbo existente.
    """

    spanish: Optional[str] = None
    infinitive: Optional[str] = None
    past_simple: Optional[str] = None
    past_participle: Optional[str] = None