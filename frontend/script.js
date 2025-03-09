document.getElementById("searchForm").addEventListener("submit", async function (event) {
	event.preventDefault(); // Prevent page reload

	const query = document.getElementById("searchInput").value;
	if (!query) return alert("Please enter a product name!");

	document.getElementById("results").innerHTML = "<p>Loading...</p>";

	try {
		const response = await fetch(`http://127.0.0.1:8000/search?query=${encodeURIComponent(query)}`);
		const data = await response.json();
		console.log(data);

		let html = "";

		// Display AI Recommendation if available
		if (data.ai_recommendation) {
			// Create a recommendation section
			html += `
            <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h2 class="text-xl font-bold mb-4">AI Recommendation</h2>
              <div class="recommendation-content">`;

			// Parse the recommendation content
			const recommendationText = data.ai_recommendation.content;

			// Extract and display the laptop options
			if (recommendationText.includes("### Laptops")) {
				// Display the introduction text
				const introText = recommendationText.split("### Laptops")[0].trim();
				if (introText) {
					html += `<p class="mb-4">${introText}</p>`;
				}

				html += `<h3 class="text-lg font-semibold mb-2">Laptops</h3>`;

				// Create a grid for top recommended laptops (first 3-4)
				html += `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">`;

				// Extract individual laptop entries using regex pattern
				const laptopRegex = /\d+\.\s\*\*(.*?)\*\*\n\s*-\s\*\*Price\*\*:\s(.*?)\n\s*-\s\*\*Rating\*\*:\s(.*?)\n\s*-\s\*\*Features\*\*:\s(.*?)\n\s*-\s\*\*Image\*\*:\s\[(.*?)\]\((.*?)\)\n\s*-\s\*\*Link\*\*:\s\[(.*?)\]\((.*?)\)/g;

				let match;
				let count = 0;
				const maxDisplayed = 4; // Show top 4 recommendations in grid

				while ((match = laptopRegex.exec(recommendationText)) !== null && count < maxDisplayed) {
					const [_, name, price, rating, features, imageAlt, imageUrl, linkText, linkUrl] = match;

					html += `
                    <div class="border rounded-lg p-4 shadow-md bg-white">
                        <div class="h-40 flex items-center justify-center overflow-hidden mb-3 bg-gray-100 rounded">
                            <img src="${imageUrl}" alt="${imageAlt}" class="max-h-full max-w-full object-contain" />
                        </div>
                        <h4 class="font-bold text-blue-800">${name}</h4>
                        <p class="text-sm text-gray-700 font-semibold">Price: ${price}</p>
                        <p class="text-sm text-yellow-600">${rating}</p>
                        <p class="text-xs text-gray-600 my-2 line-clamp-2" title="${features}">${features}</p>
                        <a href="${linkUrl}" class="text-blue-600 hover:text-blue-800 underline text-sm" target="_blank">View Product</a>
                    </div>
                  `;
					count++;
				}

				html += `</div>`;

				// Add a "View More Recommendations" collapsible section if there are more than 4 laptops
				if (recommendationText.match(laptopRegex)?.length > maxDisplayed) {
					html += `
                    <div class="mt-2">
                        <button id="viewMoreBtn" class="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                            <span>View More Recommendations</span>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                        </button>
                        <div id="moreRecommendations" class="hidden mt-4">
                            <ul class="space-y-4">`;

					// Reset regex to get all matches again
					laptopRegex.lastIndex = 0;
					count = 0;

					while ((match = laptopRegex.exec(recommendationText)) !== null) {
						if (count >= maxDisplayed) { // Skip the ones we already displayed
							const [_, name, price, rating, features, imageAlt, imageUrl, linkText, linkUrl] = match;

							html += `
                            <li class="border-b pb-3">
                                <h4 class="font-bold">${name}</h4>
                                <div class="flex flex-wrap gap-4">
                                    <div class="text-sm">
                                        <p><span class="font-semibold">Price:</span> ${price}</p>
                                        <p><span class="font-semibold">Rating:</span> ${rating}</p>
                                    </div>
                                    <div class="text-sm flex-1">
                                        <p><span class="font-semibold">Features:</span> ${features}</p>
                                    </div>
                                </div>
                                <a href="${linkUrl}" class="text-blue-600 hover:text-blue-800 underline text-sm mt-1 inline-block" target="_blank">View Product</a>
                            </li>
                          `;
						}
						count++;
					}

					html += `
                            </ul>
                        </div>
                    </div>
                  `;
				}
			} else {
				// If there's no specific format, just display the raw text with basic formatting
				html += `<div class="markdown-content">${recommendationText.replace(/\n/g, '<br>')}</div>`;
			}

			html += `
              </div>
            </div>
          `;
		}

		// Display product results
		if (data.products.length === 0) {
			html += "<p>No products found.</p>";
		} else {
			html += "<h2 class='text-xl font-bold mb-4'>Search Results:</h2><div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>";

			data.products.forEach(product => {
				html += `
                   <div class="border rounded-lg p-4 shadow-md">
                       <img src="${product.image}" class="w-full h-48 object-cover rounded-lg mb-2" />
                       <h3 class="font-bold">${product.name}</h3>
                       <p class="text-sm text-gray-700">Price: ${product.price}</p>
                       <p class="text-sm text-yellow-500">Rating: ${product.rating}</p>
                       <a href="${product.link}" class="text-blue-500 underline" target="_blank">View Product</a>
                   </div>
               `;
			});
			html += "</div>";
		}

		document.getElementById("results").innerHTML = html;

		// Add event listener for the "View More" button if it exists
		const viewMoreBtn = document.getElementById("viewMoreBtn");
		if (viewMoreBtn) {
			viewMoreBtn.addEventListener("click", function() {
				const moreRecommendations = document.getElementById("moreRecommendations");
				if (moreRecommendations.classList.contains("hidden")) {
					moreRecommendations.classList.remove("hidden");
					this.innerHTML = `<span>Hide Additional Recommendations</span>
                       <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1 transform rotate-180" viewBox="0 0 20 20" fill="currentColor">
                           <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                       </svg>`;
				} else {
					moreRecommendations.classList.add("hidden");
					this.innerHTML = `<span>View More Recommendations</span>
                       <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                           <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                       </svg>`;
				}
			});
		}
	} catch (error) {
		console.error("Error fetching results:", error);
		document.getElementById("results").innerHTML = "<p>Error loading products.</p>";
	}
});
