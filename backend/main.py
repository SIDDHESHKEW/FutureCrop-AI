from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

try:
	from backend.routes.predict_routes import router as predict_router
	from backend.routes.shap_routes import router as shap_router
except ModuleNotFoundError:
	from routes.predict_routes import router as predict_router
	from routes.shap_routes import router as shap_router

app = FastAPI(title="FutureCrop AI")

app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

app.include_router(predict_router)
app.include_router(shap_router)
