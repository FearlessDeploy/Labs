from app.models.verb_model import VerbModel
from app.schemas.verb_schema import VerbUpdateSchema, VerbCreateSchema, VerbResponseSchema
from app.exception.verb_exception import VerbNotFoundException
from sqlalchemy.orm import Session
from fastapi import Depends
from app.config.db import get_db

class VerbRepository:
    """
    Repositorio para gestionar los verbos en la base de datos.
    """

    def __init__(self, db: Session = Depends(get_db)):
        self.db = db

    def create_verb(self, verb_data: VerbCreateSchema)-> VerbResponseSchema:

        new_verb = VerbModel(
            spanish=verb_data.spanish,
            infinitive=verb_data.infinitive,
            past_simple=verb_data.past_simple,
            past_participle=verb_data.past_participle
        )

        self.db.add(new_verb)
        self.db.commit()
        self.db.refresh(new_verb)
        return VerbResponseSchema(
            id=new_verb.id,
            spanish=new_verb.spanish,
            infinitive=new_verb.infinitive,
            past_simple=new_verb.past_simple,
            past_participle=new_verb.past_participle
        )
    
    def update_by_id(self, verb_id: int, verb_data: VerbUpdateSchema)-> VerbResponseSchema:
        verb = self.db.get(VerbModel, verb_id)
        if verb is None:
            raise VerbNotFoundException(f"El verbo con id {verb_id} no fue encontrado.")

        update_data = verb_data.model_dump(exclude_unset=True)

        for key, value  in update_data.items():
            setattr(verb, key, value)

        self.db.commit()
        self.db.refresh(verb)
        return VerbResponseSchema(
            id=verb.id,
            spanish=verb.spanish,
            infinitive=verb.infinitive,
            past_simple=verb.past_simple,
            past_participle=verb.past_participle
        )

    def delete_by_id(self, verb_id: int):
    
            verb = self.db.get(VerbModel, verb_id)
            if verb is None:
                raise VerbNotFoundException(f"El verbo con id {verb_id} no fue encontrado.")
            self.db.delete(verb)
            self.db.commit()

    def get_by_infinitive(self, verb_infinitive: str)-> VerbResponseSchema:

        verb = self.db.query(VerbModel).filter(VerbModel.infinitive == verb_infinitive).first()
        if verb is None:
            raise VerbNotFoundException(f"El verbo con infinitivo '{verb_infinitive}' no fue encontrado.")
        return VerbResponseSchema(
            id=verb.id,
            spanish=verb.spanish,
            infinitive=verb.infinitive,
            past_simple=verb.past_simple,
            past_participle=verb.past_participle
        )

    def get_list(self, skip: int = 0, limit: int = 10)-> list[VerbResponseSchema]:
        verbs = self.db.query(VerbModel).offset(skip).limit(limit).all()
        return [VerbResponseSchema(
            id=verb.id,
            spanish=verb.spanish,
            infinitive=verb.infinitive,
            past_simple=verb.past_simple,
            past_participle=verb.past_participle
        ) for verb in verbs]