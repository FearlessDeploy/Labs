from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# Configuración de la base de datos
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "3306")  
DB_NAME = os.getenv("DB_NAME", "verb_app")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "root")

# Construye la URL de conexión a la base de datos usando las variables de entorno
DATABASE_URL = os.getenv("DATABASE_URL", f"mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}")

# Crea el motor de la base de datos
# pool_pre_ping=True asegura que las conexiones inactivas se verifiquen antes de ser reutilizadas, evitando errores de conexión
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

# Crea una clase base para los modelos de SQLAlchemy 
# autocommit=False y autoflush=False son configuraciones que controlan el comportamiento de la sesión de la base de datos
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Crea una clase base para los modelos de SQLAlchemy
Base = declarative_base()

def get_db():
    """
    Generador de sesión de base de datos.
    Esta función se puede usar como una dependencia en las rutas de FastAPI para obtener una sesión de base de datos.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()