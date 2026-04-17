from fastapi import FastAPI
from routes.predict_routes import router as predict_router
from routes.shap_routes import router as shap_router

app = FastAPI()

app.include_router(predict_router)
app.include_router(shap_router)
