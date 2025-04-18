from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psutil
import time
from datetime import datetime

app = FastAPI()

# Allow CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (for development only)
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/server-stats")
def get_server_stats():
    # Get CPU usage
    cpu_percent = psutil.cpu_percent(interval=1)
    
    # Get memory usage
    memory = psutil.virtual_memory()
    
    # Get disk usage
    disk = psutil.disk_usage('/')
    
    # Get current timestamp
    timestamp = datetime.now().strftime("%H:%M:%S")
    
    return {
        "timestamp": timestamp,
        "cpu": cpu_percent,
        "memory": {
            "total": memory.total,
            "used": memory.used,
            "percent": memory.percent
        },
        "disk": {
            "total": disk.total,
            "used": disk.used,
            "percent": disk.percent
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)