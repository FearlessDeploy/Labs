from dataclasses import dataclass
import os


@dataclass(frozen=True)
class Settings:
    """
    Clase de configuración para la aplicación.
    Esta clase obtiene la configuración de la aplicación desde variables de entorno."""
    redis_host: str = os.getenv("DB_HOST")
    redis_port: str = os.getenv("DB_PORT")
    redis_password: str = os.getenv("REDIS_PASSWORD")
    vote_ttl_seconds: int = int(
        os.getenv("VOTE_TTL_SECONDS", "86400")
    )

    @property
    def redis_url(self) -> str:
        if self.redis_password:
            return (
                f"redis://:{self.redis_password}"
                f"@{self.redis_host}:{self.redis_port}/0"
            )

        return f"redis://{self.redis_host}:{self.redis_port}/0"


settings = Settings()
