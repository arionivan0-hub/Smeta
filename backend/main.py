import os
import logging
from pathlib import Path
from datetime import datetime

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel

from database import engine, Base
from routers.estimates import router as estimates_router
from routers.catalog import router as catalog_router
from routers.templates import router as templates_router
from routers.settings import router as settings_router
from routers.import_export import router as import_export_router

# ============================================
# Logging setup
# ============================================
LOGS_DIR = Path(__file__).parent.parent / "logs"
LOGS_DIR.mkdir(exist_ok=True)

# Main application log
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[
        logging.FileHandler(LOGS_DIR / "smeta.log", encoding="utf-8"),
        logging.StreamHandler(),
    ],
)

# Error-only log
error_handler = logging.FileHandler(LOGS_DIR / "errors.log", encoding="utf-8")
error_handler.setLevel(logging.ERROR)
error_handler.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] %(name)s:%(lineno)d - %(message)s"))

logger = logging.getLogger("smeta")
logger.addHandler(error_handler)

# Access log
access_logger = logging.getLogger("smeta.access")

logger.info("Smeta backend starting...")

# ============================================
# Database
# ============================================
Base.metadata.create_all(bind=engine)
logger.info("Database initialized")

# ============================================
# FastAPI app
# ============================================
app = FastAPI(title="Smeta - Herramienta de Presupuestos", version="2.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# Request logging middleware
# ============================================
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = datetime.now()
    response = await call_next(request)
    duration = (datetime.now() - start_time).total_seconds() * 1000

    # Log all requests
    access_logger.info(
        f"{request.method} {request.url.path} -> {response.status_code} ({duration:.0f}ms)"
    )

    # Log errors in detail
    if response.status_code >= 400:
        logger.warning(
            f"HTTP {response.status_code}: {request.method} {request.url.path} "
            f"from {request.client.host if request.client else 'unknown'}"
        )

    return response


# ============================================
# Global exception handler
# ============================================
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(
        f"Unhandled exception: {request.method} {request.url.path}",
        exc_info=True,
    )
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )


# ============================================
# API routers
# ============================================
app.include_router(estimates_router)
app.include_router(catalog_router)
app.include_router(templates_router)
app.include_router(settings_router)
app.include_router(import_export_router)

logger.info(f"Routes loaded: {len(app.routes)} total")


# ============================================
# Health check
# ============================================
@app.get("/api/health")
def health():
    return {"status": "ok"}


# ============================================
# Frontend error logging endpoint
# ============================================
class FrontendLogEntry(BaseModel):
    timestamp: str
    level: str
    message: str
    stack: str | None = None
    componentStack: str | None = None
    context: str | None = None
    url: str | None = None
    userAgent: str | None = None


@app.post("/api/log")
async def receive_log(entry: FrontendLogEntry):
    frontend_logger = logging.getLogger("smeta.frontend")

    log_msg = f"[{entry.context}] {entry.message}"
    if entry.url:
        log_msg += f" | url={entry.url}"

    if entry.level == "error":
        frontend_logger.error(log_msg)
        if entry.stack:
            frontend_logger.error(f"Stack: {entry.stack[:500]}")
        if entry.componentStack:
            frontend_logger.error(f"Component stack: {entry.componentStack[:500]}")
    elif entry.level == "warning":
        frontend_logger.warning(log_msg)
    else:
        frontend_logger.info(log_msg)

    return {"status": "ok"}


# ============================================
# Log viewer endpoint (admin)
# ============================================
@app.get("/api/logs")
async def get_logs(lines: int = 100):
    log_file = LOGS_DIR / "smeta.log"
    error_file = LOGS_DIR / "errors.log"

    result = {"app": [], "errors": []}

    if log_file.exists():
        with open(log_file, "r", encoding="utf-8", errors="replace") as f:
            all_lines = f.readlines()
            result["app"] = [l.rstrip() for l in all_lines[-lines:]]

    if error_file.exists():
        with open(error_file, "r", encoding="utf-8", errors="replace") as f:
            all_lines = f.readlines()
            result["errors"] = [l.rstrip() for l in all_lines[-lines:]]

    return result


# ============================================
# Frontend static files (production)
# ============================================
DIST_DIR = Path(__file__).parent.parent / "frontend" / "dist"

if DIST_DIR.exists():
    app.mount("/assets", StaticFiles(directory=DIST_DIR / "assets"), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(request: Request, full_path: str):
        file_path = DIST_DIR / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(DIST_DIR / "index.html")

    logger.info(f"Frontend served from {DIST_DIR}")
else:
    @app.get("/")
    def root():
        return {"message": "Smeta API - Run 'npm run build' in frontend/ to enable the UI"}

    logger.warning("Frontend dist not found - API-only mode")


# ============================================
# Startup/Shutdown events
# ============================================
@app.on_event("startup")
async def startup():
    logger.info("Smeta backend started successfully")
    logger.info(f"Logs: {LOGS_DIR}")

@app.on_event("shutdown")
async def shutdown():
    logger.info("Smeta backend shutting down")
