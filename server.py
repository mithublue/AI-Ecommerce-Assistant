import uvicorn
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from phi.agent import Agent
from phi.model.groq import Groq
from dotenv import load_dotenv
from scraping import scrape_products  # Import the web scraping function

load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Enable CORS to allow frontend interaction
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI Agent
agent = Agent(
    model=Groq(id="llama-3.3-70b-versatile"),
    show_tool_calls=True,
    markdown=True,
    instructions=[
        "Retrieve relevant products based on the user's query.",
        "If products are unavailable, suggest alternatives."
    ],
)

@app.get("/search")
async def search_products(query: str = Query(..., title="Search Query")):
    """
    Handles user queries, scrapes e-commerce sites, and returns product details.
    """
    try:
        # Scrape e-commerce sites (Amazon, eBay, Walmart)
        products = scrape_products(query)

        if not products:
            return {"message": "No products found. Try a different query.", "products": []}

        # Use AI to refine results and suggest alternatives
        ai_response = agent.run(f"Here are some product listings for '{query}': {products}")

        return {"query": query, "products": products, "ai_recommendation": ai_response}

    except Exception as e:
        return {"error": str(e)}

# Run the FastAPI server
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
