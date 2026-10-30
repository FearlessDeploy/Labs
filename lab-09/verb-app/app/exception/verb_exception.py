# Excepcion personalizada para cuando no se encuentra un verbo en la base de datos
class VerbNotFoundException(Exception):
    def __init__(self, verb: str):
        self.verb = verb
        super().__init__(self.verb)