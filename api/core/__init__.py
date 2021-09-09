from pymongo import MongoClient

from core.config import settings

client = MongoClient(settings.MONGO_DATABASE_URL)
db = client.teenyurl
