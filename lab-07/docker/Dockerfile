ARG PYTHON_VERSION=3.12

FROM ghcr.io/astral-sh/uv:python${PYTHON_VERSION}-bookworm-slim AS builder

ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Copiamos solo los metadatos del proyecto para optimizar la caché de dependencias
COPY recommendation-song/pyproject.toml recommendation-song/uv.lock* ./
RUN uv sync --frozen --no-install-project --no-dev

# Copiamos el código fuente del proyecto y sincronizamos dependencias finales
COPY recommendation-song/ .
RUN uv sync --frozen --no-dev

FROM ghcr.io/astral-sh/uv:python${PYTHON_VERSION}-bookworm-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY --from=builder /app /app
ENV PATH="/app/.venv/bin:$PATH"

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]