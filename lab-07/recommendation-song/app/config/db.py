import sqlite3
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import StaticPool

# Ruta de la base de datos SQLite en memoria
DATABASE_URL = "sqlite+pysqlite:///:memory:"

# Crear el motor de la base de datos SQLite en memoria
engine = create_engine(DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool
)

# SessionLocal es una clase de sesión que se utilizará para interactuar con la base de datos
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative base para definir modelos de SQLAlchemy
Base = declarative_base()

# Función para obtener una sesión de base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()