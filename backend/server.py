from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psutil
import os

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/server-stats")
def get_stats():
    return {
        "cpu": psutil.cpu_percent(),
        "memory": psutil.virtual_memory()._asdict(),
        "disk": psutil.disk_usage('/')._asdict()
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))  # Render provides PORT
    uvicorn.run(app, host="0.0.0.0", port=port)