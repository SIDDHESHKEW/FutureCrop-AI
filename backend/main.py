from fastapi import FastAPI
from routes.predict_routes import router as predict_router

app = FastAPI()

app.include_router(predict_router)
