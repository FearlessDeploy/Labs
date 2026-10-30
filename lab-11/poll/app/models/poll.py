from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class Poll:
    """Modelo de una encuesta almacenada en Redis."""

    id: int
    pregunta: str
    opciones: list[str]
    creada_en: datetime
