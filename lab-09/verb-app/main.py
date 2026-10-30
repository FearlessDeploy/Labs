from fastapi import FastAPI, Request
from app.routes.verb_routes import router as verb_router
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.exception.verb_exception import VerbNotFoundException

app = FastAPI(
    title="verb app",
    description="This is a simple FastAPI application that demonstrates the use of verbs in API endpoints.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],    
    allow_headers=["*"],
)

app.include_router(verb_router, prefix="/api/v1/verbs", tags=["verbs"])

@app.exception_handler(VerbNotFoundException)
async def verb_not_found_exception_handler(request: Request, exc: VerbNotFoundException):
    return JSONResponse(
        status_code=404,
        content={"message": str(exc)},
    )