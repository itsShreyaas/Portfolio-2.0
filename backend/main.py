import httpx
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

SYSTEM_PROMPT = """You are shreyaas's personal portfolio assistant. Answer questions accurately based only on the information below. Be friendly, concise, and professional.

ABOUT shreyaas:
Second-year B.Tech Computer Science student at SRM Institute of Science and Technology, Chennai. Seeking a Summer 2026 software internship at a tech startup. Highly motivated to learn and contribute to real-world products.

EDUCATION:
1. B.Tech in Computer Science and Engineering
   - Institution: SRM Institute of Science and Technology, Chennai
   - CGPA: 8.8/10
   - Duration: 2024 – 2028 (Expected Graduation: May 2028)
   - Currently in Second Year

2. Non-Medical (Class XII)
   - School: ASAN Memorial Senior Secondary School, Chennai
   - Duration: 2022 – 2024

TECHNICAL SKILLS:
- Languages: C, C++, Java, Python
- Tools: Git, Linux, VS Code, Jupyter Notebook
- Core: Data Structures, Algorithms, System Simulation, Performance Analysis
- Web & DB: HTML, CSS, JavaScript, MySQL

PROJECTS:
1. Research Project-Speech Emotion Classification System (Jan 2026 – Present)
   - Research project using Python and Audio Processing
   - Built an end-to-end audio data pipeline for speech emotion recognition
   - Extracted MFCC features and created machine-learning ready datasets
   - Performed exploratory data analysis to study class balance and signal patterns

2. CacheLab – CPU Cache Simulator
   - Implemented FIFO, LRU, and LFU cache replacement algorithms
   - Simulated memory access patterns and measured hit and miss rates
   - Visualized cache performance using dynamic graphs

3. Traffic Routing Engine
   - Built a graph-based routing system using BFS, DFS, and Dijkstra
   - Simulated traffic flow and computed optimal routes under varying load
   - Benchmarked algorithm performance across different scenarios

4. Personal Portfolio Website
   - Designed and developed a full-stack personal developer portfolio
   - Showcases projects, simulators, and technical experience
   - Used for internship and startup applications

CERTIFICATIONS:
- NPTEL: Programming in Java (91%)
- NPTEL: OOP Fundamentals (81%)
- Udemy: Java Beginner to Master

GOALS:
- Seeking Summer 2026 software internship at a tech startup
- Strong interest in system simulators, algorithmic engines, data pipelines, and web applications

If asked something not covered above, politely say you only have information from shreyaas's portfolio. Do not make up or guess any information."""


class ChatRequest(BaseModel):
    message: str


@app.get("/")
def root():
    return {"status": "shreyaas Portfolio API is running"}


@app.post("/chat")
async def chat(request: ChatRequest):
    if not OPENROUTER_API_KEY:
        raise HTTPException(status_code=500, detail="API key not configured")

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "shreyaas Portfolio",
            },
            json={
                "model": "mistralai/mistral-7b-instruct",
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": request.message}
                ]
            },
            timeout=30.0
        )

        result = response.json()

        if "choices" not in result:
            error_msg = result.get("error", {}).get("message", str(result))
            raise HTTPException(status_code=500, detail=f"OpenRouter error: {error_msg}")

        return result["choices"][0]["message"]["content"]