# FarmerCrop AI

FarmerCrop AI is a full-stack climate simulation and recommendation platform that helps evaluate crop behavior under climate scenarios and generates a downloadable Breeding Blueprint PDF report.

## Contents

1. Overview
2. Tech Stack
3. Repository Layout
4. Prerequisites
5. Local Setup
6. Running the Application
7. API Endpoints
8. PDF Generation Details
9. Troubleshooting
10. Development Notes

## 1) Overview

The application flow is:

1. Select region and climate scenario in the frontend.
2. Run simulation against backend prediction endpoint.
3. View recommendation and analysis.
4. Download a 2-page Breeding Blueprint PDF via backend `/generate-pdf`.

## 2) Tech Stack

- Frontend: React + Vite + TypeScript
- Backend: FastAPI (Python)
- ML/Simulation libs: NumPy, scikit-learn
- PDF engine: `pdfkit` + system `wkhtmltopdf`

## 3) Repository Layout

```text
Men-in-black_SKB-F11_SBK-P3/
	backend/
		main.py
		controllers/
		models/
		routes/
		services/
	frontend/
		src/
		package.json
```

Important backend modules:

- `backend/main.py`: FastAPI app entrypoint
- `backend/routes/predict_routes.py`: simulation endpoint
- `backend/routes/pdf_routes.py`: PDF generation endpoint
- `backend/services/predict_service.py`: scenario + soil-aware prediction logic
- `backend/services/pdf_service.py`: HTML-to-PDF pipeline

## 4) Prerequisites

- Windows PowerShell (commands below are written for PowerShell)
- Node.js + npm
- Python virtual environment already available at:
	- `e:/Desktop E-Drive/Projects/Hackthon projects/FarmerCrop AI/.venv`
- `wkhtmltopdf` installed (required for PDF generation)

## 5) Local Setup

From project root `Men-in-black_SKB-F11_SBK-P3`:

### 5.1 Backend dependencies

```powershell
& "e:/Desktop E-Drive/Projects/Hackthon projects/FarmerCrop AI/.venv/Scripts/python.exe" -m pip install fastapi uvicorn numpy scikit-learn reportlab pdfkit
```

### 5.2 Install wkhtmltopdf

```powershell
winget install --id wkhtmltopdf.wkhtmltox --exact --accept-package-agreements --accept-source-agreements
```

Verify installation:

```powershell
Get-Command wkhtmltopdf
```

If `wkhtmltopdf` is not in PATH, set `WKHTMLTOPDF_PATH` as an environment variable to the executable path.

### 5.3 Frontend dependencies

```powershell
Set-Location "frontend"
npm install
Set-Location ".."
```

## 6) Running the Application

Use two terminals.

### Terminal A: Start backend

```powershell
Set-Location "e:/Desktop E-Drive/Projects/Hackthon projects/FarmerCrop AI/Men-in-black_SKB-F11_SBK-P3"
& "e:/Desktop E-Drive/Projects/Hackthon projects/FarmerCrop AI/.venv/Scripts/python.exe" -m uvicorn backend.main:app --reload
```

Backend URLs:

- API base: `http://127.0.0.1:8000`
- Swagger docs: `http://127.0.0.1:8000/docs`

### Terminal B: Start frontend

```powershell
Set-Location "e:/Desktop E-Drive/Projects/Hackthon projects/FarmerCrop AI/Men-in-black_SKB-F11_SBK-P3/frontend"
npm run dev
```

Frontend URL is usually `http://localhost:8080`.
If 8080 is occupied, Vite will automatically choose the next available port.

## 7) API Endpoints

### POST `/predict`

Purpose: Run crop yield simulation.

Minimal request example:

```json
{
	"region": "Punjab",
	"scenario": "RCP_8.5",
	"soil": "Black soil",
	"genotypes": ["G-101", "G-102"]
}
```

Quick PowerShell test:

```powershell
$body = @{ region = 'Punjab'; scenario = 'RCP_8.5'; soil = 'Black soil'; genotypes = @('G-101','G-102') } | ConvertTo-Json
Invoke-RestMethod -Uri 'http://127.0.0.1:8000/predict' -Method Post -ContentType 'application/json' -Body $body | ConvertTo-Json -Depth 6
```

### POST `/generate-pdf`

Purpose: Create and download a 2-page Breeding Blueprint PDF.

Request example:

```json
{
	"region": "Punjab Plains",
	"scenario": "Moderate Climate Change",
	"crop": "Sugarcane",
	"yield": 7.66,
	"confidence": 0.89,
	"temperature": "+2.5C",
	"rainfall": "-10%",
	"co2": "520 ppm",
	"features": [
		{ "name": "Heat Tolerance", "impact": 0.18 },
		{ "name": "Drought Resistance", "impact": -0.12 },
		{ "name": "Soil Efficiency", "impact": 0.25 }
	],
	"hash": "0x0000abc123"
}
```

## 8) PDF Generation Details

PDF generation is implemented using `pdfkit` and `wkhtmltopdf`.

Pipeline:

1. Build HTML string in backend service.
2. Convert HTML to PDF bytes via `pdfkit.from_string(...)`.
3. Return bytes as a `StreamingResponse` from `/generate-pdf`.

Current implementation includes fallback resolution for `wkhtmltopdf` on Windows:

- `WKHTMLTOPDF_PATH` env var
- PATH lookup (`wkhtmltopdf`)
- common install paths under `Program Files`

## 9) Troubleshooting

### 9.1 "Failed to download PDF"

Check backend logs first. Most common cause is missing `wkhtmltopdf`.

Run:

```powershell
Get-Command wkhtmltopdf
```

If not found, install it with winget (see setup section), then restart backend.

### 9.2 Port already in use

- Backend: ensure nothing else is running on `8000`.
- Frontend: Vite will pick another port automatically.

### 9.3 Endpoint body parse errors

Confirm request `Content-Type` is `application/json` and field names match endpoint schema exactly.

## 10) Development Notes

- Backend and frontend are developed together from this repo root.
- For backend-only notes, see `backend/readme-b.md`.
- For frontend-specific notes, see `frontend/README.md`.
- Temporary local test artifacts (for example `tmp_blueprint.pdf`) should not be committed.
