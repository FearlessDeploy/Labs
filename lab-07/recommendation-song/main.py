from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.seeder import init_db, seed_db
from app.routes.songs_routes import router as songs_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    seed_db()
    yield

app = FastAPI(
    title="Recommendation Song API",
    description="This API provides song recommendations based on user preferences and listening history.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],    
    allow_headers=["*"],
)


app.include_router(songs_router, prefix="/api/v1/songs", tags=["Songs"])

