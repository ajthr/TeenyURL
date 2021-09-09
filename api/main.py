from fastapi import FastAPI

from core.config import settings

from urls.routes import urls_router
from users.routes import users_router

api = FastAPI(title="TeenyURL API",
              version="0.0.1",
              description="Shorten Your URLs superfast 🚀")

api.include_router(urls_router, prefix="/urls", tags=["Urls API"])
api.include_router(users_router, prefix="/users", tags=["Users API"])
