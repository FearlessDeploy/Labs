from fastapi import APIRouter, Depends
from app.schemas.verb_schema import VerbCreateSchema, VerbUpdateSchema, VerbResponseSchema
from app.factory.verb_service_factory import get_verb_service
from app.service.verb_service import VerbService

router = APIRouter()

@router.post("/create", response_model=VerbResponseSchema)
async def create_verb(verb_data: VerbCreateSchema, service: VerbService = Depends(get_verb_service)):
    """
    Endpoint para crear un nuevo verbo en la base de datos.
    """
    return service.create_verb(verb_data)

@router.put("/update/{verb_id}", response_model=VerbResponseSchema)
async def update_verb(verb_id: int, verb_data: VerbUpdateSchema, service: VerbService = Depends(get_verb_service)):
    """
    Endpoint para actualizar un verbo existente en la base de datos.
    """
    return service.update_verb(verb_id, verb_data)

@router.delete("/delete/{verb_id}")
async def delete_verb(verb_id: int, service: VerbService = Depends(get_verb_service)):
    """
    Endpoint para eliminar un verbo existente en la base de datos.
    """
    return service.delete_verb(verb_id)

@router.get("/search/{infinitive}", response_model=VerbResponseSchema)
async def get_verb(infinitive: str, service: VerbService = Depends(get_verb_service)):
    """
    Endpoint para obtener un verbo existente en la base de datos a través de su infinitivo.
    """
    return service.get_verb(infinitive)

@router.get("/list", response_model=list[VerbResponseSchema])
async def list_verbs(skip: int = 0, limit: int = 10, service: VerbService = Depends(get_verb_service)):
    """
    Endpoint para listar de forma paginada los verbos registrados en la base de datos.
    """
    return service.list_verbs(skip, limit)