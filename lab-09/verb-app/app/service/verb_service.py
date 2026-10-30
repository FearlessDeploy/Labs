from app.schemas.verb_schema import VerbUpdateSchema, VerbResponseSchema
from app.repository.verb_repository import VerbRepository

class VerbService:

    """
    Servicio para gestionar los verbos en la base de datos.
    """
    def __init__(self, repository: VerbRepository):
        self.repository = repository

    def create_verb(self, verb_data: VerbUpdateSchema)-> VerbResponseSchema:
        # Logica para crear un nuevo verbo en la base de datos
        return self.repository.create_verb(verb_data)

    def update_verb(self, verb_id: int, verb_data: VerbUpdateSchema)-> VerbResponseSchema:
        # Logica para actualizar un verbo en la base de datos
        return self.repository.update_by_id(verb_id, verb_data)

    def delete_verb(self, verb_id: int):
        # Logic para eliminar un registro de un verbo en la base de datos
        return self.repository.delete_by_id(verb_id)

    def list_verbs(self, skip: int = 0, limit: int = 10)-> list[VerbResponseSchema]:
        # Logica para listar de forma paginada los verbos reginstrados en la base de datos
        return self.repository.get_list(skip, limit)

    def get_verb(self, verb_infinitive: str)-> VerbResponseSchema:
        # Logica para obtener un verbo en la base de datos a traves de su infinitivo
        return self.repository.get_by_infinitive(verb_infinitive)