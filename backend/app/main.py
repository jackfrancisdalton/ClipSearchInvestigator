from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from app.routes import api_keys, transcript_search, general

app = FastAPI(
    title="Clip Search Investigator",
    description="Provides tooling for finding specific Youtube clips based on transcript data",
    version="1.0.0",
    root_path="/api" # This is the root path for the API when hosted behind our reverse proxy
)

app.include_router(api_keys.router)
app.include_router(transcript_search.router)
app.include_router(general.router)

# Configure hosted OpenAPI so people using the app can easily inspect the backend
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )

    openapi_schema["openapi"] = "3.1.0"
    openapi_schema["servers"] = [{"url": "/api"}]

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi