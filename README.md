# FarmerCrop AI

FarmerCrop AI is a full-stack climate simulation and crop recommendation platform with PDF report generation.

## Crucial Information

- Backend: FastAPI (`backend/main.py`)
- Frontend: React + Vite + TypeScript (`frontend/src`)
- Local backend URL: `http://127.0.0.1:8000`
- Swagger docs: `http://127.0.0.1:8000/docs`
- Frontend backend base URL logic:
	- Localhost uses `http://127.0.0.1:8000`
	- Production fallback uses `https://farmercrop-backend.onrender.com`
	- Can be overridden with `VITE_API_BASE_URL`
- PDF generation depends on `wkhtmltopdf` via `pdfkit`

## Prerequisites

- Windows PowerShell
- Node.js + npm
- Python virtual environment at:
	- `e:/Desktop E-Drive/Projects/Hackthon projects/FarmerCrop AI/.venv`
- `wkhtmltopdf` installed and discoverable in PATH (or via `WKHTMLTOPDF_PATH`)

## Local Setup

From `Men-in-black_SKB-F11_SBK-P3`:

### 1) Install backend dependencies

```powershell
& "e:/Desktop E-Drive/Projects/Hackthon projects/FarmerCrop AI/.venv/Scripts/python.exe" -m pip install -r backend/requirements.txt
```

### 2) Install frontend dependencies

```powershell
Set-Location "frontend"
npm install
Set-Location ".."
```

### 3) Install wkhtmltopdf (if missing)

```powershell
winget install --id wkhtmltopdf.wkhtmltox --exact --accept-package-agreements --accept-source-agreements
Get-Command wkhtmltopdf
```

## Run the App

Use two terminals.

### Terminal A (Backend)

```powershell
Set-Location "e:/Desktop E-Drive/Projects/Hackthon projects/FarmerCrop AI/Men-in-black_SKB-F11_SBK-P3"
& "e:/Desktop E-Drive/Projects/Hackthon projects/FarmerCrop AI/.venv/Scripts/python.exe" -m uvicorn backend.main:app --reload
```

### Terminal B (Frontend)

```powershell
Set-Location "e:/Desktop E-Drive/Projects/Hackthon projects/FarmerCrop AI/Men-in-black_SKB-F11_SBK-P3/frontend"
npm run dev
```

Vite prints the actual local URL in terminal when it starts.

## API Endpoints

- `POST /predict`: crop simulation/prediction
- `POST /detect-crop`: image-based crop detection upload endpoint
- `GET /shap/{genotype_id}`: SHAP-style explanation output
- `POST /generate-pdf`: downloadable Breeding Blueprint PDF

Quick test for prediction:

```powershell
$body = @{ region = 'Punjab'; scenario = 'RCP_8.5'; soil = 'Black soil'; genotypes = @('G-101','G-102') } | ConvertTo-Json
Invoke-RestMethod -Uri 'http://127.0.0.1:8000/predict' -Method Post -ContentType 'application/json' -Body $body | ConvertTo-Json -Depth 6
```

## Deployment Notes (Render)

- Backend should be deployed using `backend/Dockerfile` (includes `wkhtmltopdf`)
- Frontend should set `VITE_API_BASE_URL` to backend Render URL
- For SPA routing on frontend static hosting, add rewrite:
	- Source: `/*`
	- Destination: `/index.html`
	- Action: `Rewrite`

## Troubleshooting

- PDF download fails:
	- Verify `wkhtmltopdf` is installed with `Get-Command wkhtmltopdf`
	- Check backend logs for PDF generation errors
- CORS/API issues:
	- Confirm frontend is targeting the expected backend via `VITE_API_BASE_URL`
- Port conflicts:
	- Backend default is `8000`
	- Frontend URL/port is shown by Vite at startup

## File Structure

```text
Men-in-black_SKB-F11_SBK-P3/
├── README.md
├── backend/
│   ├── __init__.py
│   ├── Dockerfile
│   ├── main.py
│   ├── readme-b.md
│   ├── requirements.txt
│   ├── controllers/
│   │   ├── __init__.py
│   │   ├── detect_crop_controller.py
│   │   ├── pdf_controller.py
│   │   ├── predict_controller.py
│   │   └── shap_controller.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── pdf_model.py
│   │   ├── predict_model.py
│   │   └── shap_model.py
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── detect_crop_routes.py
│   │   ├── pdf_routes.py
│   │   ├── predict_routes.py
│   │   └── shap_routes.py
│   └── services/
│       ├── __init__.py
│       ├── detect_crop_service.py
│       ├── pdf_service.py
│       ├── predict_service.py
│       └── shap_service.py
└── frontend/
    ├── bun.lockb
    ├── bunfig.toml
    ├── components.json
    ├── eslint.config.js
    ├── package.json
    ├── readme-f.md
    ├── README.md
    ├── tsconfig.json
    ├── vite.config.ts
    ├── wrangler.jsonc
    └── src/
        ├── router.tsx
        ├── routeTree.gen.ts
        ├── styles.css
        ├── components/
        │   ├── FeatureGrid.tsx
        │   ├── Hero.tsx
        │   ├── NeuralGrid.tsx
        │   ├── SiteFooter.tsx
        │   ├── SiteHeader.tsx
        │   ├── app/
        │   │   ├── AIAssistant.tsx
        │   │   ├── StepAnalysis.tsx
        │   │   ├── StepConfirm.tsx
        │   │   ├── StepCrop.tsx
        │   │   ├── Stepper.tsx
        │   │   ├── StepRegion.tsx
        │   │   ├── StepResults.tsx
        │   │   ├── StepScenario.tsx
        │   │   └── StepSimulate.tsx
        │   └── ui/
        │       └── ...
        ├── hooks/
        │   └── use-mobile.tsx
        ├── lib/
        │   ├── api.ts
        │   ├── futurecrop-data.ts
        │   └── utils.ts
        └── routes/
            ├── __root.tsx
            ├── app.tsx
            └── index.tsx
```

## Additional Docs

- Backend notes: `backend/readme-b.md`
- Frontend notes: `frontend/readme-f.md`
