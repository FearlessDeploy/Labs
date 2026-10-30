from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.config.redis import create_redis_client
from app.exception.handlers import register_exception_handlers
from app.router.poll import router as poll_router


@asynccontextmanager
async def lifespan(app: FastAPI):
	"""Inicializa y libera el pool Redis compartido por la aplicación."""
	app.state.redis = create_redis_client()
	try:
		yield
	finally:
		await app.state.redis.aclose()


app = FastAPI(title="API de encuestas", version="1.0.0", lifespan=lifespan)
register_exception_handlers(app)

app.include_router(poll_router, prefix="/api/v1/encuestas", tags=["Encuestas"])
