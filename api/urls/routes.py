import jwt
import random
from bson.json_util import dumps
from datetime import datetime
from fastapi import APIRouter, Request, Response
from pydantic import BaseModel

from core import db
from core.config import settings

urls_router = APIRouter()
Urls = db.urls


class Url(BaseModel):
    url: str
    source: str


def int_to_base62(num):
    alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if num == 0:
        return alphabet[0]
    arr = []
    base = len(alphabet)
    while num:
        num, rem = divmod(num, base)
        arr.append(alphabet[rem])
    arr.reverse()
    return ''.join(arr)


# get urls by a user
@urls_router.get("/")
def get_user_urls(request: Request):
    session_id = request.cookies.get("__SESSION_ID")
    if session_id is not None:
        try:
            user_id = jwt.decode(session_id, settings.SECRET_KEY,
                                 algorithms=["HS256"])["id"]
            urls = list(Urls.find({"userId": user_id}))
            if urls is not None:
                return Response(content=dumps(urls), status_code=200)
            return Response(content=dumps([]), status_code=204)
        except:
            return Response(status_code=500)
    return Response(status_code=401)


# create shortened url from original url
@urls_router.post("/create/")
def create_url(request: Request, data: Url):
    session_id = request.cookies.get("__SESSION_ID")
    try:
        if session_id is not None:
            user_id = user_id = jwt.decode(session_id, settings.SECRET_KEY,
                                           algorithms=["HS256"])["id"]
        else:
            user_id = None
        if data.url:
            exists = Urls.find_one({"url": data.url})
            if exists:
                return Response(status_code=409)
            Urls.insert_one({"url": data.url, "source": data.source,
                                   "userId": user_id, "createdAt": datetime.now()})
            url = Urls.find_one({ "url": data.url })
            return Response(content=dumps(url), status_code=200)
        else:
            random_number = random.randint(0, settings.MAXINT)
            base62_id = int_to_base62(random_number)
            exists = Urls.find_one({"url": base62_id})
            while exists:
                random_number = random.randint(0, settings.MAXINT)
                base62_id = int_to_base62(random_number)
                exists = Urls.find_one({"url": base62_id})
            Urls.insert_one({"url": base62_id, "source": data.source,
                                   "userId": user_id, "createdAt": datetime.now()})
            url = Urls.find_one({ "url": base62_id }, { "_id": 0, "url": 1 })
            return Response(content=dumps(url), status_code=200)
    except:
        return Response(status_code=500)


# get original url from shortened url
@urls_router.get("/{url}/")
def get_source_url(url: str):
    try:
        source = Urls.find_one({"url": url}, { "_id": 0, "source": 1 })
        if source is not None:
            return Response(content=dumps(source), status_code=200)
        return Response(status_code=404)
    except:
        return Response(status_code=500)
