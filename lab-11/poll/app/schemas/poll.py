from datetime import datetime

from pydantic import BaseModel, Field, field_validator


class PollCreate(BaseModel):
    """Datos necesarios para crear una encuesta."""

    pregunta: str = Field(min_length=1, max_length=500)
    opciones: list[str] = Field(min_length=2, max_length=20)

    @field_validator("opciones")
    @classmethod
    def opciones_validas(cls, opciones: list[str]) -> list[str]:
        opciones_limpias = [opcion.strip() for opcion in opciones]
        if any(not opcion for opcion in opciones_limpias):
            raise ValueError("Las opciones no pueden estar vacías")
        if len(set(opciones_limpias)) != len(opciones_limpias):
            raise ValueError("Las opciones deben ser únicas")
        return opciones_limpias


class PollResponse(BaseModel):
    """Representación pública de una encuesta."""

    id: int
    pregunta: str
    opciones: list[str]
    creada_en: datetime


class VoteCreate(BaseModel):
    """Opción elegida por el usuario."""

    opcion: str = Field(min_length=1, max_length=200)


class VoteResponse(BaseModel):
    """Confirmación de un voto registrado."""

    encuesta_id: int
    opcion: str
    mensaje: str


class PollResultsResponse(BaseModel):
    """Resultados agregados de una encuesta."""

    encuesta_id: int
    pregunta: str
    resultados: dict[str, int]
