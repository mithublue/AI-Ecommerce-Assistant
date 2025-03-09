import requests
from bs4 import BeautifulSoup
import random

def scrape_products(query):
    """
    Scrapes Amazon, eBay, and Walmart for product details based on user query.
    Returns a list of product details (name, price, rating, availability).
    """
    product_list = []

    # Simulating scraping from multiple e-commerce platforms
    sites = [
        {"name": "Amazon", "url": f"https://www.amazon.com/s?k={query.replace(' ', '+')}"},
        {"name": "eBay", "url": f"https://www.ebay.com/sch/i.html?_nkw={query.replace(' ', '+')}"},
        {"name": "Walmart", "url": f"https://www.walmart.com/search?q={query.replace(' ', '+')}"}
    ]

    user_agents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    ]

    headers["User-Agent"] = random.choice(user_agents)

    for site in sites:
        try:
            response = requests.get(site["url"], headers=headers)
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, "html.parser")

                # Amazon Example (Modify as per actual site structure)
                for item in soup.select(".s-result-item"):
                    name = item.select_one("h2").text if item.select_one("h2") else "Unknown Product"
                    price = item.select_one(".a-price-whole").text if item.select_one(".a-price-whole") else "N/A"
                    rating = item.select_one(".a-icon-alt").text if item.select_one(".a-icon-alt") else "No Rating"
                    image = item.select_one(".s-image")["src"] if item.select_one(".s-image") else "No Image"

                    product_list.append({
                        "site": site["name"],
                        "name": name,
                        "price": price,
                        "rating": rating,
                        "image": image,
                        "link": site["url"]
                    })
        except Exception as e:
            print(f"Error scraping {site['name']}: {e}")

    return product_list

if __name__ == "__main__":
    query = "laptop"  # Test input
    results = scrape_products(query)
    print("Scraped Results:", results)
