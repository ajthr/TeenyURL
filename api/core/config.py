import os


class Settings:
    API_V1_URL = "/api/v1"
    MONGO_DATABASE_URL = os.environ.get("DB_URI")
    SECRET_KEY = os.environ.get("SECRET_KEY")
    MAXINT = 56800235583

settings = Settings()
