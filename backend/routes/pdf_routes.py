import io

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

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
        pdf_bytes = generate_pdf_controller(request)
        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=blueprint.pdf"},
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF: {exc}") from exc
