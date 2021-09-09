import jwt
import uuid
from bson.json_util import dumps
from datetime import datetime
from fastapi import APIRouter, Request, Response
from pydantic import BaseModel

from core import db
from core.config import settings

urls_router = APIRouter()
Urls = db.urls

class Urls(BaseModel):
    _id: str
    url: str
    createdAt: datetime
    userId: str

# create shortened url from original url
# get original url from shortened url
