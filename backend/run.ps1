# Run FastAPI with the project virtual environment (no manual activate needed)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (-not (Test-Path "venv\Scripts\python.exe")) {
    Write-Host "Virtual environment not found. Run:" -ForegroundColor Yellow
    Write-Host "  python -m venv venv" -ForegroundColor Cyan
    Write-Host "  .\venv\Scripts\pip install -r requirements.txt" -ForegroundColor Cyan
    exit 1
}

& ".\venv\Scripts\python.exe" -m uvicorn app.main:app --reload @args
