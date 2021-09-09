import jwt
import uuid
from bson.json_util import dumps
from datetime import datetime
from fastapi import APIRouter, Request, Response
from pydantic import BaseModel

from core import db
from core.config import settings

users_router = APIRouter()
Users = db.users


class User(BaseModel):
    name: str
    email: str


@users_router.get("/")
def get_user(request: Request):
    session_id = request.cookies.get("__SESSION_ID")
    if session_id != None:
        try:
            user_id = jwt.decode(session_id, settings.SECRET_KEY,
                                 algorithms=["HS256"])["id"]
            user = Users.find_one({"_id": user_id})
            if user is not None:
                return Response(content=dumps(user), status_code=200)
            return Response(status_code=204)
        except:
            return Response(status_code=500)


@users_router.post("/signin/")
def signin(request: Request, data: User):
    session_id = request.cookies.get("__SESSION_ID")
    if session_id is None:
        user = Users.find_one({"email": data.email})
        if user is None:
            user_id = uuid.uuid4().hex
            while Users.find_one({"_id": user_id}) is not None:
                user_id = uuid.uuid4().hex
            Users.insert_one(
                {"_id": user_id, "name": data.name, "email": data.email})
            token = jwt.encode(
                {"id": user_id}, settings.SECRET_KEY, algorithm="HS256")
            resp = Response(status_code=200)
            resp.set_cookie("__SESSION_ID", token,
                            secure=True, httponly=True)
            return resp
        token = jwt.encode({"id": user["_id"]},
                           settings.SECRET_KEY, algorithm="HS256")
        resp = Response(200)
        resp.set_cookie("__SESSION_ID", token,
                        secure=True, httponly=True)
        return resp
    return Response(status_code=200)


@users_router.get("/update/")
def get_user(request: Request, data: User):
    session_id = request.cookies.get("__SESSION_ID")
    if session_id != None:
        try:
            user_id = jwt.decode(session_id, settings.SECRET_KEY,
                                 algorithms=["HS256"])["id"]
            user = Users.find_one({"_id": user_id})
            if user is not None:
                if user["email"] != data.email:
                    return Response(status_code=401)
                Users.update_one({
                    "_id": user_id
                }, {
                    "$set": {
                        "name": data.name
                    }
                })
                return Response(content=dumps(user), status_code=200)
            return Response(status_code=204)
        except:
            return Response(status_code=500)


@users_router.post("/signout/")
def signout(request: Request):
    session_id = request.cookies.get("__SESSION_ID")
    if session_id != None:
        try:
            user_id = jwt.decode(session_id, settings.SECRET_KEY,
                                 algorithms=["HS256"])["id"]
            user = Users.find_one({"_id": user_id})
            if user is not None:
                return Response(status_code=204)
            return Response(status_code=401)
        except:
            return Response(status_code=500)
