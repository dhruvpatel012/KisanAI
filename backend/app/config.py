import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    mongodb_url: str
    database_name: str = "kisanai_db"
    secret_key: str
    environment: str = "development"
    upload_dir: str = os.path.join(
        os.path.dirname(
            os.path.dirname(
                os.path.abspath(__file__)
            )
        ),
        "uploads"
    )
    max_file_size: int = 5242880
    allowed_extensions: list[str] = ["jpg", "jpeg", "png", "webp"]

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8"
    }

settings = Settings()
