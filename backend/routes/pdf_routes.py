from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

try:
    from backend.models.pdf_model import GeneratePdfRequest
    from backend.controllers.pdf_controller import generate_pdf_controller
except ModuleNotFoundError:
    from models.pdf_model import GeneratePdfRequest
    from controllers.pdf_controller import generate_pdf_controller

router = APIRouter()


@router.post("/generate-pdf")
def generate_pdf(request: GeneratePdfRequest):
    try:
        file_path, report_name = generate_pdf_controller(request)
        return FileResponse(
            path=file_path,
            media_type="application/pdf",
            filename=report_name,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Failed to generate PDF") from exc
